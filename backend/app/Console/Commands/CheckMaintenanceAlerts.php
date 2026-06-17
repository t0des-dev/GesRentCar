<?php

namespace App\Console\Commands;

use App\Models\Maintenance;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckMaintenanceAlerts extends Command
{
    protected $signature = 'maintenance:check-alerts';

    protected $description = 'Check for upcoming maintenance due by date or mileage';

    public function handle(NotificationService $notifier)
    {
        $this->info('Checking maintenance alerts...');

        // 1. Check Date based (Insurance, Tech Visit) due within 30 days
        $upcomingByDate = Maintenance::with('vehicle')
            ->where('status', 'pending')
            ->whereNotNull('next_due')
            ->whereDate('next_due', '<=', Carbon::now()->addDays(30))
            ->get();

        foreach ($upcomingByDate as $m) {
            $isUrgent = Carbon::now()->gte($m->next_due);
            $notifier->notifyMaintenanceDue($m, $isUrgent);
            $this->line("Processed date-based alert for {$m->vehicle->plate}");
        }

        // 2. Check Mileage based (Oil, Tires) due within 1000 km
        $upcomingByMileage = Maintenance::with('vehicle')
            ->where('status', 'pending')
            ->whereNotNull('next_due_km')
            ->get();

        foreach ($upcomingByMileage as $m) {
            if ($m->vehicle) {
                $kmRemaining = $m->next_due_km - $m->vehicle->mileage;

                if ($kmRemaining <= 1000) {
                    $isUrgent = $kmRemaining <= 0;
                    $notifier->notifyMaintenanceDue($m, $isUrgent);
                    $this->line("Processed mileage-based alert for {$m->vehicle->plate}");
                }
            }
        }

        $this->info('Maintenance checks completed.');
    }
}
