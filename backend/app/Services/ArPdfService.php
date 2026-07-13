<?php

namespace App\Services;

use ArPHP\I18N\Arabic;

/**
 * ArPdfService — shapes Arabic text for correct rendering in DomPDF.
 *
 * DomPDF does not perform Arabic text shaping (connecting letters / RTL reorder),
 * so raw Unicode Arabic characters appear as disconnected, reversed glyphs.
 * This service uses the ar-php library to produce pre-shaped presentation forms
 * that DomPDF can render correctly with the bundled DejaVu Sans font.
 */
class ArPdfService
{
    protected Arabic $ar;

    public function __construct()
    {
        $this->ar = new Arabic();
    }

    /**
     * Shape a raw Arabic UTF-8 string for DomPDF rendering.
     *
     * @param  string|null  $text
     * @return string
     */
    public function shape(?string $text): string
    {
        if (empty($text)) {
            return '';
        }

        return $this->ar->utf8Glyphs($text);
    }

    /**
     * Shape all Arabic text nodes within an HTML document.
     *
     * Only text nodes that contain Arabic-range characters (U+0600–U+06FF) are
     * processed. HTML tags and attributes are preserved verbatim so DomPDF's
     * parser is not confused by modified attribute values.
     *
     * @param  string  $html
     * @return string
     */
    public function shapeHtml(string $html): string
    {
        if (empty($html)) {
            return '';
        }

        // Use DOMDocument to operate only on text nodes (not attributes or tags).
        $doc = new \DOMDocument('1.0', 'UTF-8');

        // Suppress errors from quirky HTML (DomPDF's Blade output is usually clean).
        libxml_use_internal_errors(true);

        // Wrap in a full HTML document so DOMDocument parses it correctly,
        // then we extract the body content after shaping.
        $wrapped = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' . $html . '</body></html>';
        $doc->loadHTML($wrapped, LIBXML_NOERROR | LIBXML_NOWARNING);
        libxml_clear_errors();

        $xpath = new \DOMXPath($doc);

        // Select all text nodes that contain Arabic characters (U+0600–U+06FF).
        $textNodes = $xpath->query(
            '//text()[string-length(normalize-space(.)) > 0]'
        );

        foreach ($textNodes as $node) {
            $original = $node->nodeValue;
            // Only process text that actually contains Arabic codepoints
            if (preg_match('/[\x{0600}-\x{06FF}]/u', $original)) {
                $shaped = $this->ar->utf8Glyphs($original);
                $node->nodeValue = $shaped;
            }
        }

        // Extract just the body content (our original HTML).
        $body = $doc->getElementsByTagName('body')->item(0);
        if ($body) {
            $result = '';
            foreach ($body->childNodes as $child) {
                $result .= $doc->saveHTML($child);
            }
            return $result;
        }

        return $doc->saveHTML();
    }
}
