<?php

namespace App\Notifications;

use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingReminder extends Notification
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
            ->subject('Rappel : Votre réservation Vectoria commence demain')
            ->greeting('Bonjour '.$this->reservation->client->name.' !')
            ->line('Nous vous rappelons que votre réservation pour le '.$vehicle->brand.' '.$vehicle->model.' commence demain.')
            ->line('Date de retrait : '.Carbon::parse($this->reservation->start_date)->format('d/m/Y'))
            ->line('Date de retour : '.Carbon::parse($this->reservation->end_date)->format('d/m/Y'))
            ->line('Référence : VC-'.str_pad($this->reservation->id, 4, '0', STR_PAD_LEFT))
            ->action('Voir ma réservation', config('app.url').'/dashboard')
            ->line('N\'oubliez pas d\'apporter votre pièce d\'identité et votre permis de conduire.');
    }
}
