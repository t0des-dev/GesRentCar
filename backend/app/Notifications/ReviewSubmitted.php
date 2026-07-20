<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReviewSubmitted extends Notification
{
    use Queueable;

    public function __construct(public Review $review) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $vehicle = $this->review->vehicle;

        return (new MailMessage)
            ->subject('Nouvel avis reçu - Vectoria')
            ->line("Un nouvel avis a été soumis pour le véhicule {$vehicle->brand} {$vehicle->model}.")
            ->line("Note globale : {$this->review->rating}/5")
            ->action('Voir l\'avis', config('app.url').'/admin')
            ->line('Merci de modérer cet avis dans le panneau admin.');
    }
}
