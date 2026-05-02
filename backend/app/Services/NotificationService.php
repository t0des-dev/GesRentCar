<?php

namespace App\Services;

use App\Models\Reservation;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Notifications\ReservationConfirmed;
use App\Notifications\ContractReady;

class NotificationService
{
    // ─────────────────────────────────────────────────────────────────────────
    // CORE CHANNELS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Send a WhatsApp text message via Meta Graph API.
     * Falls back to log-only if credentials are not set.
     */
    public function sendWhatsApp(string $to, string $message, string $template = null, array $components = []): bool
    {
        // Normalize phone: remove spaces, ensure +212 format
        $to = $this->normalizePhone($to);

        Log::info("[WhatsApp] → {$to}: " . substr($message, 0, 80) . '…');

        $token   = config('services.whatsapp.token');
        $phoneId = config('services.whatsapp.phone_number_id');
        $version = config('services.whatsapp.version', 'v17.0');

        if (!$token || !$phoneId) {
            Log::debug('[WhatsApp] Credentials not set — message logged only.');
            return true;
        }

        try {
            $payload = ['messaging_product' => 'whatsapp', 'to' => $to];

            if ($template) {
                $payload['type']     = 'template';
                $payload['template'] = [
                    'name'       => $template,
                    'language'   => ['code' => 'fr'],
                    'components' => $components,
                ];
            } else {
                $payload['type'] = 'text';
                $payload['text'] = ['body' => $message, 'preview_url' => false];
            }

            $response = Http::withToken($token)
                ->timeout(10)
                ->post("https://graph.facebook.com/{$version}/{$phoneId}/messages", $payload);

            if (!$response->successful()) {
                Log::warning('[WhatsApp] API responded with error: ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('[WhatsApp] Exception: ' . $e->getMessage());
        }

        return true;
    }

    /**
     * Send an SMS via Twilio.
     */
    public function sendSms(string $to, string $message): bool
    {
        $to = $this->normalizePhone($to);

        Log::info("[SMS] → {$to}: " . substr($message, 0, 80) . '…');

        $sid   = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $from  = config('services.twilio.from');

        if (!$sid || !$token || !$from) {
            Log::debug('[SMS] Twilio credentials not set — message logged only.');
            return true;
        }

        try {
            Http::withBasicAuth($sid, $token)
                ->timeout(10)
                ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                    'To'   => $to,
                    'From' => $from,
                    'Body' => $message,
                ]);
        } catch (\Exception $e) {
            Log::error('[SMS] Exception: ' . $e->getMessage());
        }

        return true;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HIGH-LEVEL EVENTS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * 🎉 After Stripe payment: reservation confirmed + contract download link.
     * Called automatically by StripeController@confirm.
     */
    public function notifyDepositPaid(Reservation $reservation): void
    {
        $client      = $reservation->client;
        $vehicle     = $reservation->vehicle;
        $deposit     = number_format($reservation->deposit_amount ?? ($reservation->total_price * 0.1), 2);
        $total       = number_format($reservation->total_price, 2);
        $contractUrl = url("/api/public/reservations/{$reservation->id}/contract");
        $refNum      = 'VRC-' . str_pad($reservation->id, 5, '0', STR_PAD_LEFT);
        $startDate   = $reservation->start_date?->format('d/m/Y') ?? '—';
        $endDate     = $reservation->end_date?->format('d/m/Y') ?? '—';

        $message = <<<MSG
🚗 *Vectoria Rent Car — Réservation Confirmée*

Bonjour *{$client->name}* ! 🎉

Votre acompte a bien été reçu. Votre véhicule est maintenant *bloqué* pour vous.

━━━━━━━━━━━━━━━━━━━━━
📋 Référence : *{$refNum}*
🚘 Véhicule   : *{$vehicle->brand} {$vehicle->model}*
📅 Départ     : *{$startDate}*
📅 Retour     : *{$endDate}*
━━━━━━━━━━━━━━━━━━━━━
💳 Acompte payé : *{$deposit} MAD*
💰 Solde restant : *{$total} MAD* (à régler au retrait)
━━━━━━━━━━━━━━━━━━━━━

📄 *Téléchargez votre contrat :*
{$contractUrl}

Merci de votre confiance. À très bientôt ! 🙏

_Vectoria Rent Car | Casablanca, Maroc_
MSG;

        if ($client->phone) {
            $this->sendWhatsApp($client->phone, $message);
            // Also send a lighter SMS for compatibility
            $sms = "VRC-{$reservation->id} | {$vehicle->brand} {$vehicle->model} confirmé du {$startDate} au {$endDate}. Acompte: {$deposit} MAD reçu. Contrat: {$contractUrl}";
            $this->sendSms($client->phone, $sms);
        }

        // Email notification
        if ($client->email) {
            try { $client->notify(new ReservationConfirmed($reservation)); } catch (\Exception $e) {
                Log::warning('[Email] ReservationConfirmed failed: ' . $e->getMessage());
            }
        }

        // Notify admin
        $this->notifyAdmin(
            "💳 Acompte reçu pour {$refNum} — {$client->name} | {$vehicle->brand} {$vehicle->model} ({$startDate} → {$endDate}) — {$deposit} MAD"
        );

        Log::info("[NotificationService] Deposit paid notification sent for reservation #{$reservation->id}");
    }

    /**
     * ✅ Simple confirmation (for non-Stripe reservations or admin-created).
     */
    public function notifyReservationConfirmed(Reservation $reservation): void
    {
        $client  = $reservation->client;
        $vehicle = $reservation->vehicle;
        $refNum  = 'VRC-' . str_pad($reservation->id, 5, '0', STR_PAD_LEFT);
        $start   = $reservation->start_date?->format('d/m/Y') ?? '—';
        $end     = $reservation->end_date?->format('d/m/Y') ?? '—';
        $total   = number_format($reservation->total_price, 2);

        $message = <<<MSG
✅ *Vectoria Rent Car — Confirmation*

Bonjour *{$client->name}*,

Votre réservation *{$refNum}* pour la *{$vehicle->brand} {$vehicle->model}* est confirmée.

📅 Du *{$start}* au *{$end}*
💰 Total : *{$total} MAD*

À très bientôt ! — _Vectoria Rent Car_
MSG;

        if ($client->phone) {
            $this->sendWhatsApp($client->phone, $message);
            $this->sendSms($client->phone, strip_tags($message));
        }

        if ($client->email) {
            try { $client->notify(new ReservationConfirmed($reservation)); } catch (\Exception $e) {
                Log::warning('[Email] failed: ' . $e->getMessage());
            }
        }
    }

    /**
     * 📄 Send contract link to client.
     */
    public function sendContractLink(Reservation $reservation): void
    {
        $client      = $reservation->client;
        // Point to the frontend public signature page instead of the API download endpoint
        $frontendUrl = rtrim(config('app.frontend_url', 'http://localhost:3000'), '/');
        $contractUrl = "{$frontendUrl}/c/{$reservation->id}/sign";
        $refNum      = 'VRC-' . str_pad($reservation->id, 5, '0', STR_PAD_LEFT);

        $message = <<<MSG
📄 *Vectoria Rent Car — Votre Contrat est Prêt*

Bonjour *{$client->name}*,

Votre contrat de location *{$refNum}* est disponible. Veuillez le consulter et le signer directement sur votre smartphone avant votre prise en charge.

👉 *Signer mon contrat :*
{$contractUrl}

Merci de votre confiance ! — _Vectoria Rent Car_
MSG;

        if ($client->phone) {
            $this->sendWhatsApp($client->phone, $message);
            $this->sendSms($client->phone, "VectoriaRentCar: Votre contrat {$refNum} est prêt. Signez ici: {$contractUrl}");
        }

        if ($client->email) {
            try { $client->notify(new ContractReady($reservation)); } catch (\Exception $e) {
                Log::warning('[Email] ContractReady failed: ' . $e->getMessage());
            }
        }
    }

    /**
     * ✍️ Contract signed successfully.
     */
    public function notifyContractSigned(Reservation $reservation): void
    {
        $client      = $reservation->client;
        $contractUrl = $reservation->contract
            ? asset('storage/' . $reservation->contract->file_path)
            : url("/api/public/reservations/{$reservation->id}/contract");
        $refNum = 'VRC-' . str_pad($reservation->id, 5, '0', STR_PAD_LEFT);

        $message = <<<MSG
✍️ *Vectoria Rent Car — Contrat Signé*

Merci *{$client->name}* !

Votre contrat *{$refNum}* a été signé avec succès et archivé. Vous pouvez télécharger votre copie certifiée :

📎 {$contractUrl}

Bonne route ! 🚗💨 — _Vectoria Rent Car_
MSG;

        if ($client->phone) {
            $this->sendWhatsApp($client->phone, $message);
            $this->sendSms($client->phone, "VectoriaRentCar: Contrat {$refNum} signé. Copie: {$contractUrl}");
        }

        if ($client->email) {
            try { $client->notify(new \App\Notifications\ContractSigned($reservation)); } catch (\Exception $e) {
                Log::warning('[Email] ContractSigned attachment failed: ' . $e->getMessage());
            }
        }

        Log::info("[NotificationService] Contract signed notification sent for reservation #{$reservation->id}");
    }

    /**
     * 🛡️ Proactive Maintenance & Document Expiry Audit
     * Can be called daily via task scheduler.
     */
    public function checkMaintenanceAlerts(): void
    {
        $today = now();
        $warningLimit = $today->copy()->addDays(15);

        // 1. Check Document Expiries
        $expiring = \App\Models\Vehicle::where(function($q) use ($today, $warningLimit) {
            $q->whereBetween('insurance_date', [$today, $warningLimit])
              ->orWhereBetween('tech_inspection_date', [$today, $warningLimit]);
        })->get();

        foreach ($expiring as $vehicle) {
            $this->notifyAdmin("🟡 ALERTE DOCUMENT : Le véhicule {$vehicle->brand} {$vehicle->plate} arrive à échéance prochainement.");
        }

        // 2. Check Maintenance (based on km)
        // This usually happens during vehicle return, but we can do a general check
        $dueMaintenances = \App\Models\Maintenance::where('status', 'scheduled')
            ->where('next_due_date', '<=', $warningLimit)
            ->get();

        foreach ($dueMaintenances as $m) {
            $this->notifyMaintenanceDue($m);
        }
    }

    /**
     * 🔧 Maintenance alert to admin.
     */
    public function notifyMaintenanceDue($maintenance, bool $isUrgent = false): bool
    {
        $vehicle = $maintenance->vehicle;
        $level   = $isUrgent ? '🔴 URGENTE' : '🟡 RAPPEL';
        $due     = $maintenance->next_due
            ? $maintenance->next_due->format('d/m/Y')
            : "{$maintenance->next_due_km} km";

        $message = <<<MSG
{$level} — *Maintenance Vectoria*

Véhicule : *{$vehicle->brand} {$vehicle->model}* ({$vehicle->plate})
Type      : *{$maintenance->type}*
Échéance  : *{$due}*

Merci de planifier l'intervention. — _Système VRC_
MSG;

        Log::info("[NotificationService] Maintenance alert: {$message}");
        $adminPhone = config('services.admin_phone', '+212600000000');
        $this->sendWhatsApp($adminPhone, $message);
        $this->sendSms($adminPhone, strip_tags($message));

        return true;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Quick admin alert (text only).
     */
    public function notifyAdmin(string $message): void
    {
        $adminPhone = config('services.admin_phone', '+212600000000');
        $this->sendWhatsApp($adminPhone, $message);
        Log::info("[NotificationService] Admin alert: {$message}");
    }

    /**
     * Normalize phone number to E.164 format (e.g. 0612345678 → +212612345678).
     */
    private function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/\s+/', '', $phone);
        // Moroccan local format
        if (str_starts_with($phone, '0') && !str_starts_with($phone, '00')) {
            $phone = '+212' . substr($phone, 1);
        }
        // Already international without +
        if (str_starts_with($phone, '212') && !str_starts_with($phone, '+')) {
            $phone = '+' . $phone;
        }
        return $phone;
    }
}
