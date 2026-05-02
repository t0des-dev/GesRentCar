<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationConfirmed extends Notification
{
    use Queueable;

    protected $reservation;

    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $vehicle = $this->reservation->vehicle;
        
        $mail = (new MailMessage)
            ->subject('Confirmation de votre réservation #' . $this->reservation->id)
            ->greeting('Bonjour ' . $notifiable->name)
            ->line('Nous avons le plaisir de vous confirmer votre réservation pour le véhicule ' . $vehicle->brand . ' ' . $vehicle->model . '.')
            ->line('Dates : du ' . $this->reservation->start_date . ' au ' . $this->reservation->end_date)
            ->line('Montant total : ' . $this->reservation->total_price . ' MAD')
            ->action('Voir ma réservation', url('/dashboard'))
            ->line('Merci d\'avoir choisi Vectoria Rent Car !');

        if ($this->reservation->contract && $this->reservation->contract->file_path) {
            $mail->attach(storage_path('app/public/' . $this->reservation->contract->file_path), [
                'as' => 'Contrat_Location_Vectoria.pdf',
                'mime' => 'application/pdf',
            ]);
        }

        return $mail;
    }

    public function toArray(object $notifiable): array
    {
        return [
            'reservation_id' => $this->reservation->id,
            'message' => 'Votre réservation #' . $this->reservation->id . ' est confirmée.',
            'amount' => $this->reservation->total_price
        ];
    }
}
