<?php

namespace App\Traits;

use App\Models\Translation;

trait HasTranslations
{
    public function translations()
    {
        return $this->morphMany(Translation::class, 'translatable');
    }

    public function translate(string $key, ?string $locale = null): ?string
    {
        $locale = $locale ?? app()->getLocale();

        $translation = $this->translations()
            ->where('key', $key)
            ->where('locale', $locale)
            ->first();

        return $translation?->value;
    }

    public function setTranslation(string $key, string $value, ?string $locale = null): Translation
    {
        $locale = $locale ?? app()->getLocale();

        return Translation::updateOrCreate(
            [
                'translatable_id' => $this->id,
                'translatable_type' => get_class($this),
                'locale' => $locale,
                'key' => $key,
            ],
            ['value' => $value]
        );
    }

    public function getTranslations(string $key): array
    {
        return $this->translations()
            ->where('key', $key)
            ->get()
            ->pluck('value', 'locale')
            ->toArray();
    }
}
