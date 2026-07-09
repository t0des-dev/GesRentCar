<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture - Vectoria</title>
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
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
                                <tr>
                                    <td>
                                        <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;">Facture</h2>
                                        <p style="margin:0;font-size:13px;color:#64748b;">Réservation #{{ $reservation->id }}</p>
                                    </td>
                                    <td align="right" style="vertical-align:top;">
                                        @if($reservation->payment_status === 'paid')
                                            <span style="display:inline-block;padding:6px 16px;background-color:#d1fae5;color:#065f46;font-size:12px;font-weight:600;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">Payé</span>
                                        @else
                                            <span style="display:inline-block;padding:6px 16px;background-color:#fef3c7;color:#92400e;font-size:12px;font-weight:600;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">En attente</span>
                                        @endif
                                    </td>
                                </tr>
                            </table>

                            <!-- Invoice Table -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                                <thead>
                                    <tr style="background-color:#0f172a;">
                                        <th style="padding:12px 20px;text-align:left;font-size:12px;color:#D4AF37;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Détail</th>
                                        <th style="padding:12px 20px;text-align:right;font-size:12px;color:#D4AF37;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Montant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">
                                            {{ $reservation->vehicle->brand }} {{ $reservation->vehicle->model }}
                                        </td>
                                        <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;text-align:right;">—</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b;">
                                            Du {{ \Carbon\Carbon::parse($reservation->start_date)->format('d/m/Y') }} au {{ \Carbon\Carbon::parse($reservation->end_date)->format('d/m/Y') }}
                                        </td>
                                        <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b;text-align:right;">
                                            {{ $reservation->days ?? \Carbon\Carbon::parse($reservation->start_date)->diffInDays(\Carbon\Carbon::parse($reservation->end_date)) }} jour(s)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b;">Tarif journalier</td>
                                        <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b;text-align:right;">{{ number_format($reservation->vehicle->price_per_day, 2, ',', ' ') }} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;font-size:15px;color:#0f172a;font-weight:600;">Total</td>
                                        <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;font-size:15px;color:#0f172a;font-weight:600;text-align:right;">{{ number_format($reservation->total_price, 2, ',', ' ') }} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b;">Caution</td>
                                        <td style="padding:14px 20px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b;text-align:right;">{{ number_format($reservation->deposit ?? 0, 2, ',', ' ') }} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:16px 20px;font-size:15px;color:#0f172a;font-weight:700;">Montant payé</td>
                                        <td style="padding:16px 20px;font-size:16px;color:#D4AF37;font-weight:700;text-align:right;">{{ number_format($reservation->paid_amount ?? $reservation->total_price, 2, ',', ' ') }} €</td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- CTA -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 30px;">
                                <tr>
                                    <td style="border-radius:6px;background-color:#D4AF37;">
                                        <a href="{{ url('/reservations/' . $reservation->id . '/invoice') }}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#0f172a;text-decoration:none;letter-spacing:0.5px;">Télécharger la facture</a>
                                    </td>
                                </tr>
                            </table>
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
