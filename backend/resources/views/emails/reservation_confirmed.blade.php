<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de réservation - Vectoria</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f4f7;">
        <tr>
            <td align="center" style="padding:40px 10px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                        <td style="background-color:#D4AF37;padding:30px 40px;text-align:center;">
                            <h1 style="margin:0;font-size:28px;font-weight:700;color:#0f172a;letter-spacing:2px;">VECTORIA</h1>
                            <p style="margin:6px 0 0;font-size:13px;color:#0f172a;letter-spacing:4px;text-transform:uppercase;">Location de prestige</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:40px 40px 20px;">
                            <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Réservation confirmée</h2>
                            <p style="margin:0 0 24px;font-size:15px;color:#64748b;">Merci pour votre confiance. Votre réservation a bien été enregistrée.</p>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8f9fb;border-radius:8px;margin-bottom:24px;">
                                <tr>
                                    <td style="padding:24px 28px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="padding-bottom:14px;border-bottom:1px solid #e2e8f0;">
                                                    <span style="font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">N° de réservation</span>
                                                    <br>
                                                    <span style="font-size:16px;color:#0f172a;font-weight:600;">#{{ $reservation->id }}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:14px 0;border-bottom:1px solid #e2e8f0;">
                                                    <span style="font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Véhicule</span>
                                                    <br>
                                                    <span style="font-size:16px;color:#0f172a;font-weight:600;">{{ $reservation->vehicle->brand }} {{ $reservation->vehicle->model }}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:14px 0;border-bottom:1px solid #e2e8f0;">
                                                    <span style="font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Date de début</span>
                                                    <br>
                                                    <span style="font-size:16px;color:#0f172a;font-weight:600;">{{ \Carbon\Carbon::parse($reservation->start_date)->format('d/m/Y') }}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:14px 0;border-bottom:1px solid #e2e8f0;">
                                                    <span style="font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Date de fin</span>
                                                    <br>
                                                    <span style="font-size:16px;color:#0f172a;font-weight:600;">{{ \Carbon\Carbon::parse($reservation->end_date)->format('d/m/Y') }}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:14px 0;">
                                                    <span style="font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Montant total</span>
                                                    <br>
                                                    <span style="font-size:20px;color:#D4AF37;font-weight:700;">{{ number_format($reservation->total_price, 2, ',', ' ') }} €</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 30px;">
                                <tr>
                                    <td style="border-radius:6px;background-color:#D4AF37;">
                                        <a href="{{ url('/reservations/' . $reservation->id) }}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#0f172a;text-decoration:none;letter-spacing:0.5px;">Confirmer ma réservation</a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0;font-size:14px;color:#64748b;text-align:center;">En cas de question, n'hésitez pas à nous contacter.</p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#0f172a;padding:30px 40px;text-align:center;">
                            <p style="margin:0 0 10px;font-size:16px;color:#D4AF37;font-weight:700;letter-spacing:2px;">VECTORIA</p>
                            <p style="margin:0 0 6px;font-size:13px;color:#94a3b8;">contact@vectoria-rentcar.fr</p>
                            <p style="margin:0 0 6px;font-size:13px;color:#94a3b8;">+33 1 23 45 67 89</p>
                            <p style="margin:0 0 16px;font-size:13px;color:#94a3b8;">123 Avenue des Champs-Élysées, 75008 Paris</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                <tr>
                                    <td style="padding:0 8px;"><a href="#" style="font-size:12px;color:#94a3b8;text-decoration:none;">Facebook</a></td>
                                    <td style="color:#94a3b8;">·</td>
                                    <td style="padding:0 8px;"><a href="#" style="font-size:12px;color:#94a3b8;text-decoration:none;">Instagram</a></td>
                                    <td style="color:#94a3b8;">·</td>
                                    <td style="padding:0 8px;"><a href="#" style="font-size:12px;color:#94a3b8;text-decoration:none;">LinkedIn</a></td>
                                </tr>
                            </table>
                            <p style="margin:18px 0 0;font-size:11px;color:#475569;">© {{ date('Y') }} Vectoria Rent Car. Tous droits réservés.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
