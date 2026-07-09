<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez Vectoria</title>
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
                            <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Bienvenue, {{ $user->name }} !</h2>
                            <p style="margin:0 0 28px;font-size:15px;color:#64748b;line-height:1.6;">
                                Votre compte a été créé avec succès. Découvrez ce que Vectoria a à vous offrir.
                            </p>

                            <!-- Benefits -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:30px;">
                                <tr>
                                    <td style="padding:20px 24px;background-color:#f8f9fb;border-radius:8px;border-left:4px solid #D4AF37;margin-bottom:12px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="vertical-align:top;padding-right:14px;">
                                                    <div style="width:36px;height:36px;background-color:#D4AF37;border-radius:50%;text-align:center;line-height:36px;font-size:18px;color:#0f172a;">★</div>
                                                </td>
                                                <td style="vertical-align:top;">
                                                    <h3 style="margin:0 0 4px;font-size:15px;color:#0f172a;">Flotte exclusive</h3>
                                                    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Accédez à notre sélection de véhicules premium : Mercedes, BMW, Porsche et plus encore.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr><td style="height:12px;"></td></tr>
                                <tr>
                                    <td style="padding:20px 24px;background-color:#f8f9fb;border-radius:8px;border-left:4px solid #D4AF37;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="vertical-align:top;padding-right:14px;">
                                                    <div style="width:36px;height:36px;background-color:#D4AF37;border-radius:50%;text-align:center;line-height:36px;font-size:18px;color:#0f172a;">✦</div>
                                                </td>
                                                <td style="vertical-align:top;">
                                                    <h3 style="margin:0 0 4px;font-size:15px;color:#0f172a;">Conciergerie 24/7</h3>
                                                    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Notre équipe est disponible à tout moment pour répondre à vos besoins.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr><td style="height:12px;"></td></tr>
                                <tr>
                                    <td style="padding:20px 24px;background-color:#f8f9fb;border-radius:8px;border-left:4px solid #D4AF37;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td style="vertical-align:top;padding-right:14px;">
                                                    <div style="width:36px;height:36px;background-color:#D4AF37;border-radius:50%;text-align:center;line-height:36px;font-size:18px;color:#0f172a;">♦</div>
                                                </td>
                                                <td style="vertical-align:top;">
                                                    <h3 style="margin:0 0 4px;font-size:15px;color:#0f172a;">Programme de fidélité</h3>
                                                    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Cumulez des points à chaque location et profitez d'avantages exclusifs.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 30px;">
                                <tr>
                                    <td style="border-radius:6px;background-color:#D4AF37;">
                                        <a href="{{ url('/vehicles') }}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#0f172a;text-decoration:none;letter-spacing:0.5px;">Découvrir la flotte</a>
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
