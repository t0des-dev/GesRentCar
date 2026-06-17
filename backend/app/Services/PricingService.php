<?php

namespace App\Services;

use App\Models\Vehicle;
use Carbon\Carbon;

class PricingService
{
    // ─── Options pricing (source de vérité unique) ────────────────────────────
    public const OPTION_FLEXIBILITY_PER_DAY = 60;   // MAD/jour — annulation flexible

    public const OPTION_UNLIMITED_MILEAGE_PER_DAY = 140; // MAD/jour — kilométrage illimité

    // ─── Seasonal multipliers ─────────────────────────────────────────────────
    /** Mois de haute saison au Maroc (juillet, août, décembre) */
    private const HIGH_SEASON_MONTHS = [7, 8, 12];

    // ─── Long-stay discounts ──────────────────────────────────────────────────
    private const LONG_STAY_TIERS = [
        ['days' => 14, 'multiplier' => 0.85, 'label' => 'Tarif 2 semaines'],
        ['days' => 7,  'multiplier' => 0.90, 'label' => 'Tarif semaine'],
    ];

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC API
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Calcule le prix total d'une réservation (source de vérité unique).
     *
     * @param  int  $days  Nombre de jours de location (min 1)
     * @param  array  $options  Tableau d'options (flexibility, mileage…)
     * @param  float|null  $occupancyRate  Taux d'occupation global (0–1), calculé si null
     * @param  Carbon|null  $startDate  Date de début pour détecter la saison
     * @return array{
     *   total_price: float,
     *   base_price: float,
     *   daily_rate: float,
     *   options_price: float,
     *   dynamic_reason: string|null,
     *   breakdown: array
     * }
     */
    public function calculateTotal(
        Vehicle $vehicle,
        int $days,
        array $options = [],
        ?float $occupancyRate = null,
        ?Carbon $startDate = null
    ): array {
        $days = max(1, $days);
        $startDate = $startDate ?? Carbon::now();

        // 1. Tarif journalier dynamique
        $dynamic = $this->getDynamicRate($vehicle, $occupancyRate, $startDate, $days);
        $dailyRate = $dynamic['price'];
        $dynamicReason = $dynamic['reason'];

        // 2. Prix de base (jours × tarif journalier)
        $basePrice = round($dailyRate * $days, 2);

        // 3. Majoration des options
        $optionsPrice = $this->calculateOptionsPrice($options, $days);

        // 4. Breakdown détaillé
        $breakdown = $this->buildBreakdown($vehicle, $days, $dailyRate, $options, $dynamic);

        $total = round($basePrice + $optionsPrice, 2);

        return [
            'total_price' => $total,
            'base_price' => $basePrice,
            'daily_rate' => $dailyRate,
            'options_price' => $optionsPrice,
            'dynamic_reason' => $dynamicReason,
            'breakdown' => $breakdown,
        ];
    }

    /**
     * Calcule uniquement le supplément pour les options sélectionnées.
     */
    public function calculateOptionsPrice(array $options, int $days): float
    {
        $extra = 0.0;
        $days = max(1, $days);

        if (($options['flexibility'] ?? null) === 'flexible') {
            $extra += self::OPTION_FLEXIBILITY_PER_DAY * $days;
        }
        if (($options['mileage'] ?? null) === 'unlimited') {
            $extra += self::OPTION_UNLIMITED_MILEAGE_PER_DAY * $days;
        }

        return round($extra, 2);
    }

    /**
     * Calcule le tarif journalier dynamique basé sur l'occupation,
     * la saisonnalité marocaine, les week-ends et les tarifs longue durée.
     */
    public function getDynamicRate(
        Vehicle $vehicle,
        ?float $occupancyRate = null,
        ?Carbon $startDate = null,
        int $days = 1
    ): array {
        $basePrice = (float) $vehicle->price_per_day;
        $startDate = $startDate ?? Carbon::now();
        $reason = null;
        $multiplier = 1.0;

        // ── 1. Taux d'occupation ─────────────────────────────────────────────
        if ($occupancyRate === null) {
            $totalVehicles = Vehicle::count();
            $rentedVehicles = Vehicle::where('status', 'rented')->count();
            $occupancyRate = $totalVehicles > 0 ? ($rentedVehicles / $totalVehicles) : 0;
        }

        if ($occupancyRate > 0.8) {
            $multiplier = 1.20;
            $reason = 'Forte demande';
        } elseif ($occupancyRate < 0.3) {
            $multiplier = 0.90;
            $reason = 'Offre spéciale';
        }

        // ── 2. Haute saison marocaine (Juillet, Août, Décembre) ───────────────
        $month = (int) $startDate->format('n');
        if (! $reason && in_array($month, self::HIGH_SEASON_MONTHS)) {
            $multiplier = 1.30;
            $reason = 'Haute saison';
        }

        // ── 3. Week-end (vendredi, samedi, dimanche) ─────────────────────────
        $dayOfWeek = (int) $startDate->format('N'); // 1=Mon … 7=Sun
        if (! $reason && in_array($dayOfWeek, [5, 6, 7])) {
            $multiplier = 1.10;
            $reason = 'Tarif weekend';
        }

        // ── 4. Tarifs longue durée (appliqués EN PLUS si aucune autre raison) ─
        //    Les réductions longue durée sont prioritaires sur les majorations
        //    uniquement quand il n'y a pas de forte demande / haute saison.
        if (! $reason && $days >= 1) {
            foreach (self::LONG_STAY_TIERS as $tier) {
                if ($days >= $tier['days']) {
                    $multiplier = $tier['multiplier'];
                    $reason = $tier['label'];
                    break;
                }
            }
        }

        return [
            'price' => round($basePrice * $multiplier, 2),
            'reason' => $reason,
            'multiplier' => $multiplier,
        ];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS PRIVÉS
    // ─────────────────────────────────────────────────────────────────────────

    private function buildBreakdown(
        Vehicle $vehicle,
        int $days,
        float $dailyRate,
        array $options,
        array $dynamic
    ): array {
        $lines = [];

        // Ligne tarifaire de base
        $lines[] = [
            'label' => "{$vehicle->brand} {$vehicle->model} × {$days} jour(s)",
            'amount' => round($dailyRate * $days, 2),
        ];

        if ($dynamic['reason']) {
            $pct = round(($dynamic['multiplier'] - 1) * 100);
            $sign = $pct >= 0 ? "+{$pct}" : "{$pct}";
            $lines[] = [
                'label' => $dynamic['reason']." ({$sign}%)",
                'amount' => 0, // déjà inclus dans le daily rate
                'note' => true,
            ];
        }

        // Options
        if (($options['flexibility'] ?? null) === 'flexible') {
            $lines[] = [
                'label' => 'Annulation flexible',
                'amount' => self::OPTION_FLEXIBILITY_PER_DAY * $days,
            ];
        }
        if (($options['mileage'] ?? null) === 'unlimited') {
            $lines[] = [
                'label' => 'Kilométrage illimité',
                'amount' => self::OPTION_UNLIMITED_MILEAGE_PER_DAY * $days,
            ];
        }

        return $lines;
    }
}
