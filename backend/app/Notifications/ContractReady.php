<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContractReady extends Notification
{
    use Queueable;

    protected $reservation;

    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Votre contrat de location est prêt - #'.$this->reservation->id)
            ->line('Votre contrat de location pour la réservation #'.$this->reservation->id.' a été généré.')
            ->line('Vous pouvez le consulter et le signer numériquement depuis votre espace client.')
            ->action('Signer le contrat', config('app.frontend_url').'/dashboard/contracts/'.$this->reservation->id)
            ->line('Si vous avez des questions, n\'hésitez pas à nous contacter.');
    }
}
