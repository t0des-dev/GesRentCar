<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContractSigned extends Notification
{
    use Queueable;

    protected $reservation;

    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $contract = $this->reservation->contract;
        $message = (new MailMessage)
            ->subject('Votre Contrat Signé - Vectoria Rent Car')
            ->greeting('Bonjour '.$notifiable->name.',')
            ->line('Nous vous confirmons que votre contrat de location #'.$this->reservation->id.' a été signé avec succès.')
            ->line('Vous trouverez ci-joint votre copie certifiée au format PDF.')
            ->line('Merci de votre confiance.');

        if ($contract && !empty($contract->file_path)) {
            $filePath = storage_path('app/public/'.$contract->file_path);
            if (file_exists($filePath)) {
                $message->attach($filePath, [
                    'as' => 'Contrat_Vectoria_'.$this->reservation->id.'.pdf',
                    'mime' => 'application/pdf',
                ]);
            }
        }

        return $message;
    }
}
