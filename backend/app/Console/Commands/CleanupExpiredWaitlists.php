<?php

namespace App\Console\Commands;

use App\Models\Waitlist;
use Illuminate\Console\Command;

class CleanupExpiredWaitlists extends Command
{
    protected $signature = 'waitlist:cleanup';

    protected $description = 'Mark waitlist entries older than 30 days as expired';

    public function handle(): int
    {
        $expired = Waitlist::where('status', 'waiting')
            ->where('created_at', '<', now()->subDays(30))
            ->update(['status' => 'expired']);

        $this->info("Marked {$expired} waitlist entries as expired.");

        return Command::SUCCESS;
    }
}
