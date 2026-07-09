<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 40px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #1a365d 0%, #0f172a 100%); padding: 40px; text-align: center; }
        .header h1 { color: #D4AF37; font-size: 28px; margin: 0 0 8px; }
        .header p { color: rgba(255,255,255,0.7); font-size: 14px; margin: 0; }
        .body { padding: 40px; }
        .greeting { font-size: 18px; color: #0f172a; margin: 0 0 20px; }
        .message { color: #475569; line-height: 1.6; margin: 0 0 24px; }
        .vehicle-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0; }
        .vehicle-card h3 { margin: 0 0 12px; color: #0f172a; font-size: 16px; }
        .detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .detail:last-child { border-bottom: none; }
        .detail-label { color: #94a3b8; font-size: 13px; }
        .detail-value { color: #0f172a; font-weight: 600; font-size: 13px; }
        .btn { display: inline-block; background: #D4AF37; color: #0f172a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 14px; margin: 24px 0; }
        .footer { padding: 24px 40px; background: #f8fafc; text-align: center; color: #94a3b8; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Vectoria</h1>
            <p>Premium Car Rental</p>
        </div>
        <div class="body">
            <p class="greeting">Bonjour {{ $reservation->client_name }},</p>
            <p class="message">
                Nous vous rappelons que votre réservation commence <strong>demain</strong>. 
                Veuillez trouver les détails ci-dessous :
            </p>
            <div class="vehicle-card">
                <h3>{{ $reservation->vehicle->brand }} {{ $reservation->vehicle->model }}</h3>
                <div class="detail">
                    <span class="detail-label">Date de retrait</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($reservation->start_date)->format('d/m/Y') }}</span>
                </div>
                <div class="detail">
                    <span class="detail-label">Date de retour</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($reservation->end_date)->format('d/m/Y') }}</span>
                </div>
                <div class="detail">
                    <span class="detail-label">Lieu</span>
                    <span class="detail-value">{{ $reservation->location ?? 'Agence Vectoria' }}</span>
                </div>
                <div class="detail">
                    <span class="detail-label">Référence</span>
                    <span class="detail-value">VC-{{ str_pad($reservation->id, 4, '0', STR_PAD_LEFT) }}</span>
                </div>
            </div>
            <p class="message">
                N'oubliez pas d'apporter votre pièce d'identité et votre permis de conduire.
            </p>
            <div style="text-align: center;">
                <a href="{{ config('app.url') }}/dashboard" class="btn">Voir ma réservation</a>
            </div>
        </div>
        <div class="footer">
            <p>Vectoria Rent Car — Location de véhicules premium au Maroc</p>
            <p>Pour toute question, contactez-nous au +212 6 00 00 00 00</p>
        </div>
    </div>
</body>
</html>
