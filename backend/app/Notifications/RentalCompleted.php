<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RentalCompleted extends Notification
{
    use Queueable;

    public function __construct(public Reservation $reservation) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $vehicle = $this->reservation->vehicle;

        return (new MailMessage)
            ->subject('Merci pour votre location - Vectoria')
            ->line("Votre location du {$vehicle->brand} {$vehicle->model} est terminée.")
            ->line('Nous espérons que vous avez apprécié votre expérience chez Vectoria Rent Car.')
            ->action('Laisser un avis', config('app.url')."/fleet/{$vehicle->id}")
            ->line('À bientôt chez Vectoria Rent Car !');
    }
}
