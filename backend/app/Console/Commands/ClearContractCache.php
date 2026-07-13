<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

/**
 * Clears all cached contract PDF files from storage so they are
 * re-generated on next download (with correct Arabic shaping).
 */
class ClearContractCache extends Command
{
    protected $signature = 'contracts:clear-cache {--dry-run : List files without deleting them}';

    protected $description = 'Clear cached contract PDF files to force regeneration with correct Arabic rendering';

    public function handle(): int
    {
        $disk = Storage::disk('public');
        $files = $disk->files('contracts');

        $pdfs = array_filter($files, fn ($f) => str_ends_with($f, '.pdf'));

        if (empty($pdfs)) {
            $this->info('No cached contract PDFs found.');

            return self::SUCCESS;
        }

        $isDryRun = $this->option('dry-run');

        $this->line(sprintf(
            '  Found <comment>%d</comment> cached contract PDF(s).',
            count($pdfs)
        ));

        foreach ($pdfs as $file) {
            if ($isDryRun) {
                $this->line("  [dry-run] Would delete: {$file}");
            } else {
                $disk->delete($file);
                $this->line("  Deleted: {$file}");
            }
        }

        if (! $isDryRun) {
            $this->info('✓ Contract cache cleared. PDFs will be regenerated with correct Arabic text on next download.');
        } else {
            $this->warn('Dry-run complete. No files were deleted. Run without --dry-run to actually delete them.');
        }

        return self::SUCCESS;
    }
}
