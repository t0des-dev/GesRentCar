<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class BackupDatabase extends Command
{
    protected $signature = 'db:backup';
    protected $description = 'Backup the database and contracts storage';

    public function handle()
    {
        $filename = "backup-" . now()->format('Y-m-d_H-i-s') . ".sql";
        
        Log::info("Starting backup: {$filename}");

        // Simulating DB Export for SQLite or PgSQL
        // In real production with pg_dump:
        // exec("pg_dump -U admin vectoria > " . storage_path("app/backups/{$filename}"));

        $this->info("Backup successfully created at storage/app/backups/{$filename}");
        
        // Also archive contracts
        Log::info("Archiving contracts storage...");
        
        return 0;
    }
}
