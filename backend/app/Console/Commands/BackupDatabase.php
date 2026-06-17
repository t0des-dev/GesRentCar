<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class BackupDatabase extends Command
{
    protected $signature = 'db:backup
        {--retention=30 : Number of daily backups to keep}
        {--upload : Upload to S3/MinIO after backup}
        {--compress : Compress the backup file (gzip)}';

    protected $description = 'Backup PostgreSQL database with optional compression and S3 upload';

    public function handle(): int
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $backupDir = storage_path('app/backups');

        // Ensure backup directory exists
        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        $filename = "vectoria-{$timestamp}.sql";
        $filepath = "{$backupDir}/{$filename}";

        $this->info("Starting database backup...");

        // Database connection details from env
        $host = config('database.connections.pgsql.host', 'db');
        $port = config('database.connections.pgsql.port', '5432');
        $database = config('database.connections.pgsql.database', 'vectoria');
        $username = config('database.connections.pgsql.username', 'admin');
        $password = config('database.connections.pgsql.password', 'secret');

        // Build pg_dump command
        $env = ['PGPASSWORD' => $password];
        $cmd = sprintf(
            'pg_dump -h %s -p %s -U %s -d %s --no-owner --no-acl -F p > %s 2>&1',
            escapeshellarg($host),
            escapeshellarg($port),
            escapeshellarg($username),
            escapeshellarg($database),
            escapeshellarg($filepath)
        );

        Log::info("Running pg_dump for database: {$database}");

        $result = Process::env($env)->run($cmd);

        if ($result->failed()) {
            $this->error("pg_dump failed: {$result->errorOutput()}");
            Log::error("Backup failed: {$result->errorOutput()}");
            return 1;
        }

        $filesize = filesize($filepath);
        $this->info("Database dump created: {$filename} (" . $this->formatBytes($filesize) . ")");

        // Compress if requested
        if ($this->option('compress')) {
            $gzFile = "{$filepath}.gz";
            $compressResult = Process::run("gzip -c " . escapeshellarg($filepath) . " > " . escapeshellarg($gzFile));

            if ($compressResult->failed()) {
                $this->error("Compression failed: {$compressResult->errorOutput()}");
                Log::error("Compression failed: {$compressResult->errorOutput()}");
                return 1;
            }

            // Remove uncompressed file
            unlink($filepath);
            $filepath = $gzFile;
            $filename = basename($gzFile);
            $filesize = filesize($gzFile);
            $this->info("Compressed: {$filename} (" . $this->formatBytes($filesize) . ")");
        }

        // Upload to S3/MinIO if requested
        if ($this->option('upload')) {
            $this->uploadToS3($filepath, $filename);
        }

        // Clean old backups
        $this->cleanupOldBackups($backupDir, $this->option('retention'));

        Log::info("Backup completed: {$filename} (" . $this->formatBytes($filesize) . ")");
        $this->info("Backup completed successfully.");

        return 0;
    }

    private function uploadToS3(string $filepath, string $filename): void
    {
        $bucket = config('filesystems.disks.s3.bucket');
        $prefix = 'backups/' . now()->format('Y/m/d');

        $this->info("Uploading to S3: s3://{$bucket}/{$prefix}/{$filename}");

        try {
            $s3Disk = \Illuminate\Support\Facades\Storage::disk('s3');
            $content = file_get_contents($filepath);
            $s3Disk->put("{$prefix}/{$filename}", $content);

            $this->info("Upload completed: s3://{$bucket}/{$prefix}/{$filename}");
            Log::info("S3 upload completed: {$prefix}/{$filename}");
        } catch (\Exception $e) {
            $this->error("S3 upload failed: {$e->getMessage()}");
            Log::error("S3 upload failed: {$e->getMessage()}");
        }
    }

    private function cleanupOldBackups(string $backupDir, int $retentionDays): void
    {
        $this->info("Cleaning backups older than {$retentionDays} days...");

        $files = glob("{$backupDir}/vectoria-*.sql*");
        $cutoff = now()->subDays($retentionDays);
        $deleted = 0;

        foreach ($files as $file) {
            $mtime = filemtime($file);
            if ($mtime < $cutoff->timestamp) {
                unlink($file);
                $deleted++;
                $this->line("  Deleted: " . basename($file));
            }
        }

        $this->info("Cleanup done: {$deleted} old backup(s) removed.");
    }

    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $factor = floor((strlen((string) $bytes) - 1) / 3);
        return sprintf("%.{$precision}f", $bytes / pow(1024, $factor)) . ' ' . ($units[$factor] ?? 'TB');
    }
}
