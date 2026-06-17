<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class SendNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;

    public $backoff = 60;

    protected $type; // 'whatsapp' or 'sms'

    protected $to;

    protected $message;

    protected $payload;

    public function __construct(string $type, string $to, string $message, array $payload = [])
    {
        $this->type = $type;
        $this->to = $to;
        $this->message = $message;
        $this->payload = $payload;
    }

    public function handle(): void
    {
        if ($this->type === 'whatsapp') {
            $this->sendWhatsApp();
        } else {
            $this->sendSms();
        }
    }

    protected function sendWhatsApp()
    {
        $token = config('services.whatsapp.token');
        $phoneId = config('services.whatsapp.phone_number_id');
        $version = config('services.whatsapp.version', 'v17.0');

        if (! $token || ! $phoneId) {
            return;
        }

        Http::withToken($token)
            ->timeout(20)
            ->post("https://graph.facebook.com/{$version}/{$phoneId}/messages", $this->payload);
    }

    protected function sendSms()
    {
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $from = config('services.twilio.from');

        if (! $sid || ! $token || ! $from) {
            return;
        }

        Http::withBasicAuth($sid, $token)
            ->timeout(20)
            ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                'To' => $this->to,
                'From' => $from,
                'Body' => $this->message,
            ]);
    }
}
