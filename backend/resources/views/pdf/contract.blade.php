<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Contrat de Location N°{{ $reservation->id }} — {{ $agencyName }}</title>
    <style>
        @page { margin: 20mm 15mm; size: A4; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Arial, sans-serif;
            font-size: 9px;
            color: #1a1a1a;
            background: #fff;
            line-height: 1.4;
        }

        /* ── Tables ──────────────────────────────────────────────────────── */
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid #333; padding: 4px 6px; vertical-align: top; font-size: 8.5px; }
        th { background: #e8e8e8; font-weight: bold; font-size: 8px; }

        /* ── Page breaks ─────────────────────────────────────────────────── */
        .page { page-break-before: always; }
        .page:first-child { page-break-before: auto; }

        /* ── Government Header (Page 1) ──────────────────────────────────── */
        .gov-header {
            text-align: center;
            border-bottom: 2px solid #003366;
            padding-bottom: 8px;
            margin-bottom: 12px;
        }
        .gov-header .kingdom {
            font-size: 11px;
            font-weight: bold;
            color: #003366;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .gov-header .ministry {
            font-size: 8px;
            color: #555;
            margin-top: 2px;
        }
        .gov-header .ministry-ar {
            font-size: 9px;
            color: #003366;
            margin-top: 4px;
            font-weight: bold;
        }
        .gov-header .subtitle {
            font-size: 8px;
            color: #666;
            margin-top: 6px;
            font-style: italic;
        }
        .gov-header .doc-title {
            font-size: 13px;
            font-weight: bold;
            color: #003366;
            margin-top: 10px;
            text-decoration: underline;
        }
        .gov-header .doc-subtitle {
            font-size: 8px;
            color: #555;
            margin-top: 4px;
            font-style: italic;
        }

        /* ── Info Table ──────────────────────────────────────────────────── */
        .info-table td { padding: 3px 8px; font-size: 8.5px; }
        .info-table .label { width: 28%; font-weight: bold; background: #f5f5f5; color: #333; }
        .info-table .value { width: 22%; color: #111; }
        .info-table .label-ar { width: 28%; font-weight: bold; background: #f5f5f5; color: #333; text-align: right; direction: rtl; }
        .info-table .value-ar { width: 22%; color: #111; text-align: right; direction: rtl; }
        .info-table .section-header { background: #003366; color: #fff; font-weight: bold; font-size: 9px; text-align: center; }
        .info-table .section-header-ar { background: #003366; color: #fff; font-weight: bold; font-size: 9px; text-align: right; direction: rtl; }

        /* ── Vehicle State (Page 2) ──────────────────────────────────────── */
        .state-header {
            background: #003366;
            color: #fff;
            text-align: center;
            padding: 8px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .state-subtitle {
            text-align: center;
            font-size: 8px;
            color: #555;
            margin-bottom: 10px;
        }
        .checkbox-table td { text-align: center; width: 33%; font-size: 8px; }
        .checkbox { display: inline-block; width: 10px; height: 10px; border: 1.5px solid #333; margin-right: 3px; vertical-align: middle; }
        .checkbox.checked { background: #003366; }
        .legend-table td { font-size: 7.5px; padding: 2px 6px; }
        .comments-box {
            border: 1.5px solid #333;
            padding: 10px;
            min-height: 80px;
            margin: 10px 0;
            font-size: 8.5px;
        }
        .pieces-box {
            border: 1.5px solid #333;
            padding: 8px;
            margin: 10px 0;
        }
        .pieces-box .title { font-weight: bold; font-size: 9px; margin-bottom: 6px; background: #003366; color: #fff; padding: 4px 8px; }
        .vehicle-diagram { text-align: center; padding: 10px; }
        .diagram-label { font-size: 7.5px; font-weight: bold; color: #555; margin-bottom: 4px; }
        .car-silhouette { font-size: 40px; color: #ccc; }

        /* ── Conditions (Page 3) ─────────────────────────────────────────── */
        .conditions-header {
            background: #003366;
            color: #fff;
            text-align: center;
            padding: 8px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .article { margin-bottom: 10px; }
        .article-title { font-weight: bold; font-size: 9px; color: #003366; margin-bottom: 3px; }
        .article-text { font-size: 8px; color: #333; line-height: 1.5; text-align: justify; }
        .conditions-bilingual { display: table; width: 100%; }
        .conditions-fr { display: table-cell; width: 48%; vertical-align: top; padding-right: 10px; }
        .conditions-ar { display: table-cell; width: 48%; vertical-align: top; padding-left: 10px; border-left: 1px solid #ddd; text-align: right; direction: rtl; }
        .article-ar { font-size: 8px; color: #333; line-height: 1.6; margin-bottom: 10px; text-align: right; direction: rtl; }
        .article-title-ar { font-weight: bold; font-size: 9px; color: #003366; margin-bottom: 3px; text-align: right; direction: rtl; }

        /* ── Contract Page (Page 4) ──────────────────────────────────────── */
        .contract-header {
            border: 2px solid #003366;
            padding: 10px 15px;
            margin-bottom: 12px;
        }
        .contract-header table { border: none; }
        .contract-header td { border: none; padding: 2px 6px; font-size: 8.5px; }
        .contract-number { font-size: 14px; font-weight: bold; color: #003366; }
        .agency-logo { text-align: center; }
        .agency-logo img { max-height: 50px; }
        .section-title {
            background: #003366;
            color: #fff;
            font-weight: bold;
            font-size: 9px;
            padding: 4px 8px;
            margin: 8px 0 4px 0;
        }
        .detail-table td { padding: 3px 6px; font-size: 8.5px; }
        .detail-table .lbl { font-weight: bold; background: #f5f5f5; width: 25%; }
        .detail-table .val { width: 25%; }
        .checkbox-row td { padding: 2px 6px; font-size: 8px; }

        /* ── Signatures (all pages) ───────────────────────────────────────── */
        .sig-table td { border: none; padding: 8px 12px; text-align: center; vertical-align: top; width: 25%; }
        .sig-label { font-size: 7.5px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #555; margin-bottom: 6px; }
        .sig-box {
            border: 1.5px dashed #999;
            min-height: 60px;
            margin: 4px 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sig-box img { max-width: 120px; max-height: 45px; }
        .sig-name { font-size: 7.5px; color: #555; margin-top: 4px; }
        .sig-date { font-size: 7px; color: #999; }

        /* ── Footer (all pages) ──────────────────────────────────────────── */
        .page-footer {
            margin-top: 10px;
            padding-top: 6px;
            border-top: 1px solid #ddd;
            font-size: 7px;
            color: #999;
        }
        .page-footer table td { border: none; padding: 1px 6px; font-size: 7px; color: #999; }

        /* ── Helpers ──────────────────────────────────────────────────────── */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-bold { font-weight: bold; }
        .text-small { font-size: 7.5px; }
        .mt-8 { margin-top: 8px; }
        .mb-8 { margin-bottom: 8px; }
        .blue-text { color: #003366; }
        .no-border td, .no-border th { border: none; }
        .green-check { color: #006600; font-weight: bold; }
        .red-cross { color: #cc0000; font-weight: bold; }
    </style>
</head>
<body>

<?php
    $client = $reservation->client;
    $vehicle = $reservation->vehicle;
    $agencyName = $agencyName ?? 'Vectoria Rent Car';
    $agencyAddress = $agencyAddress ?? 'Casablanca, Maroc';
    $agencyPhone = $agencyPhone ?? '+212 5 22 XX XX XX';
    $agencyEmail = $agencyEmail ?? 'contact@vectoria.ma';
    $agencyLogo = $agencyLogo ?? null;
    $agentName = $agentName ?? null;

    $startDate = $reservation->start_date;
    $endDate = $reservation->end_date;
    $days = max(1, $startDate->diffInDays($endDate));

    $contractNum = str_pad($reservation->id, 5, '0', STR_PAD_LEFT);
    $contractRef = date('y-m') . '-' . $contractNum;

    // Split client name into nom/prénom
    $nameParts = explode(' ', trim($client->name ?? ''));
    $prenom = array_shift($nameParts);
    $nom = implode(' ', $nameParts);
?>

{{-- ═══════════════════════════════════════════════════════════════════════
     PAGE 1: DÉCLARATION PRÉALABLE DE LOCATION DE VOITURE SANS CHAUFFEUR
     ═══════════════════════════════════════════════════════════════════════ --}}
<div class="page">

    {{-- Government Header --}}
    <div class="gov-header">
        <div class="kingdom">ROYAUME DU MAROC</div>
        <div class="ministry">Ministère de l'Équipement, du Transport et de la Logistique</div>
        <div class="ministry-ar"> SELF RENT A CAR</div>
        <div class="subtitle">(à renseigner par le Locataire résidant au Maroc)</div>
        <div class="doc-title">Déclaration Préalable de location de Voiture Sans Chauffeur</div>
        <div class="doc-subtitle">(à renseigner par le Locataire résidant au Maroc)</div>
    </div>

    {{-- Client & Vehicle Info --}}
    <table class="info-table" style="margin-bottom: 12px;">
        <tr>
            <td class="label" rowspan="2">Je Soussigné (e)</td>
            <td class="value" rowspan="2">{{ $client->name ?? '—' }}</td>
            <td class="label-ar" rowspan="2">المستأجر</td>
            <td class="value-ar" rowspan="2">{{ $client->name ?? '—' }}</td>
        </tr>
        <tr></tr>
        <tr>
            <td class="label">Nom</td>
            <td class="value">{{ strtoupper($nom) ?: '—' }}</td>
            <td class="label-ar">اللقب</td>
            <td class="value-ar">{{ strtoupper($nom) ?: '—' }}</td>
        </tr>
        <tr>
            <td class="label">Prénom (s)</td>
            <td class="value">{{ $prenom ?: '—' }}</td>
            <td class="label-ar">الاسم الشخصي</td>
            <td class="value-ar">{{ $prenom ?: '—' }}</td>
        </tr>
        <tr>
            <td class="label">N° CIN ou carte de séjour</td>
            <td class="value">{{ $client->cin ?? '—' }}</td>
            <td class="label-ar">رقم البطاقة الوطنية</td>
            <td class="value-ar">{{ $client->cin ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">N° de Permis de conduire</td>
            <td class="value">{{ $client->license_number ?? '—' }}</td>
            <td class="label-ar">رقم رخصة السياقة</td>
            <td class="value-ar">{{ $client->license_number ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Permis Valable Jusqu'au</td>
            <td class="value">16/10/2038</td>
            <td class="label-ar">صلاحية الرخصة حتى</td>
            <td class="value-ar">16/10/2038</td>
        </tr>
        <tr>
            <td class="label">Adresse</td>
            <td class="value">{{ $client->address ?? '—' }}</td>
            <td class="label-ar">العنوان</td>
            <td class="value-ar">{{ $client->address ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Ville</td>
            <td class="value">{{ $client->city ?? '—' }}</td>
            <td class="label-ar">المدينة</td>
            <td class="value-ar">{{ $client->city ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Code Postal</td>
            <td class="value">{{ $client->postal_code ?? '—' }}</td>
            <td class="label-ar">الرمز البريدي</td>
            <td class="value-ar">{{ $client->postal_code ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">N° de GSM</td>
            <td class="value">{{ $client->phone ?? '—' }}</td>
            <td class="label-ar">رقم الهاتف</td>
            <td class="value-ar">{{ $client->phone ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Adresse E-mail</td>
            <td class="value">{{ $client->email ?? '—' }}</td>
            <td class="label-ar">البريد الإلكتروني</td>
            <td class="value-ar">{{ $client->email ?? '—' }}</td>
        </tr>
    </table>

    {{-- Vehicle Declaration --}}
    <table class="info-table" style="margin-bottom: 12px;">
        <tr>
            <td class="label" style="width: 40%;">Déclaré avoir pris en location Véhicule<br>immatriculé sous numéro :</td>
            <td class="value" style="width: 20%; font-weight: bold; font-size: 11px;">{{ $vehicle->plate ?? '—' }}</td>
            <td class="label-ar" style="width: 40%;">يصرح بأنه أخذ استئجار سيارة<br>مسجلة بالرقم</td>
            <td class="value-ar" style="width: 20%; font-weight: bold; font-size: 11px;">{{ $vehicle->plate ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">et appartenant à l'agence de location</td>
            <td class="value" style="font-weight: bold;">{{ $agencyName }}</td>
            <td class="label-ar">والمملوكة لوكالة التأجير</td>
            <td class="value-ar" style="font-weight: bold;">{{ $agencyName }}</td>
        </tr>
    </table>

    {{-- Rental Period --}}
    <table class="info-table" style="margin-bottom: 12px;">
        <tr>
            <td class="section-header" colspan="2">pour la période allant du :</td>
            <td class="section-header-ar" colspan="2">للفترة من</td>
        </tr>
        <tr>
            <td class="label" style="width: 28%;">Jour d'emprunt (jj/mm/aaaa)</td>
            <td class="value" style="width: 22%;">{{ $startDate->format('d/m/Y') }}</td>
            <td class="label-ar" style="width: 28%;">تاريخ الاستلام</td>
            <td class="value-ar" style="width: 22%;">{{ $startDate->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <td class="label">Heure d'emprunt (HH:MM)</td>
            <td class="value">{{ $startDate->format('H:i') }}</td>
            <td class="label-ar">وقت الاستلام</td>
            <td class="value-ar">{{ $startDate->format('H:i') }}</td>
        </tr>
        <tr>
            <td class="label">au :</td>
            <td class="value">{{ $endDate->format('d/m/Y') }}</td>
            <td class="label-ar">إلى:</td>
            <td class="value-ar">{{ $endDate->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <td class="label">Jour de restitution (jj/mm/aaaa)</td>
            <td class="value">{{ $endDate->format('d/m/Y') }}</td>
            <td class="label-ar">تاريخ الإرجاع</td>
            <td class="value-ar">{{ $endDate->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <td class="label">Heure de restitution (HH:MM)</td>
            <td class="value">{{ $endDate->format('H:i') }}</td>
            <td class="label-ar">وقت الإرجاع</td>
            <td class="value-ar">{{ $endDate->format('H:i') }}</td>
        </tr>
    </table>

    {{-- Location & Date --}}
    <table class="no-border" style="margin-bottom: 12px;">
        <tr>
            <td style="width: 30%; font-weight: bold;">Fait à :</td>
            <td style="width: 30%;">{{ $agencyAddress }}</td>
            <td style="width: 20%; font-weight: bold; text-align: right; direction: rtl;">وقع بـ:</td>
            <td style="width: 20%; text-align: right; direction: rtl;">{{ $agencyAddress }}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Le :</td>
            <td>{{ $startDate->format('d/m/Y') }}</td>
            <td style="font-weight: bold; text-align: right; direction: rtl;">بتاريخ:</td>
            <td style="text-align: right; direction: rtl;">{{ $startDate->format('d/m/Y') }}</td>
        </tr>
    </table>

    {{-- Signatures --}}
    <table class="sig-table">
        <tr>
            <td>
                <div class="sig-label">Signature et Cachet de l'Agence de Location</div>
                <div class="sig-box">
                    @if($agencyLogo)
                        <img src="{{ $agencyLogo }}" alt="Logo Agence">
                    @endif
                </div>
                <div class="sig-name">{{ $agencyName }}</div>
            </td>
            <td></td>
            <td>
                <div class="sig-label">Signature du Locataire</div>
                <div class="sig-box">
                    @if($reservation->contract && $reservation->contract->signature_data)
                        <img src="{{ $reservation->contract->signature_data }}" alt="Signature">
                    @endif
                </div>
                <div class="sig-name">{{ $client->name ?? '' }}</div>
            </td>
        </tr>
    </table>

    <div class="page-footer">
        <table>
            <tr>
                <td>{{ $agencyName }} — {{ $agencyAddress }}</td>
                <td class="text-right">Déclaration Préalable — N° {{ $contractRef }}</td>
            </tr>
        </table>
    </div>
</div>

{{-- ═══════════════════════════════════════════════════════════════════════
     PAGE 2: ÉTAT DU VÉHICULE
     ═══════════════════════════════════════════════════════════════════════ --}}
<div class="page">
    <div class="state-header">État du Véhicule</div>
    <div class="state-subtitle">Veuillez indiquer tous les dommages existants sur le véhicule en marquant les zones concernées sur le diagramme ci-dessous.</div>

    {{-- Pick-up & Return Info --}}
    <table style="width: 100%; margin-bottom: 10px;">
        <tr>
            <td style="width: 50%; border: 1.5px solid #333; padding: 8px; vertical-align: top;">
                <div class="text-center text-bold" style="background: #003366; color: #fff; padding: 4px; font-size: 10px;">PRISE EN CHARGE</div>
                <table class="no-border" style="margin-top: 6px;">
                    <tr>
                        <td style="font-size: 8px; width: 40%;">Heure</td>
                        <td style="font-size: 8px; font-weight: bold;">{{ $startDate->format('H:i') }}</td>
                    </tr>
                    <tr>
                        <td style="font-size: 8px;">Km</td>
                        <td style="font-size: 8px;">________</td>
                    </tr>
                </table>
                <div class="text-bold" style="margin-top: 8px; font-size: 8px;">PROPRETÉ INTÉRIEURE</div>
                <table class="checkbox-table no-border" style="margin-top: 4px;">
                    <tr>
                        <td><span class="checkbox"></span> Propre</td>
                        <td><span class="checkbox"></span> Usagé</td>
                        <td><span class="checkbox"></span> Sale</td>
                    </tr>
                </table>
                <div class="text-bold" style="margin-top: 6px; font-size: 8px;">PROPRETÉ EXTÉRIEURE</div>
                <table class="checkbox-table no-border" style="margin-top: 4px;">
                    <tr>
                        <td><span class="checkbox"></span> Propre</td>
                        <td><span class="checkbox"></span> Usagé</td>
                        <td><span class="checkbox"></span> Sale</td>
                    </tr>
                </table>
                <div style="margin-top: 6px; font-size: 8px;">AUTONOMIE : 100 km</div>
            </td>
            <td style="width: 50%; border: 1.5px solid #333; padding: 8px; vertical-align: top;">
                <div class="text-center text-bold" style="background: #003366; color: #fff; padding: 4px; font-size: 10px;">RESTITUTION</div>
                <table class="no-border" style="margin-top: 6px;">
                    <tr>
                        <td style="font-size: 8px; width: 40%;">Heure</td>
                        <td style="font-size: 8px; font-weight: bold;">{{ $endDate->format('H:i') }}</td>
                    </tr>
                    <tr>
                        <td style="font-size: 8px;">Km</td>
                        <td style="font-size: 8px;">________</td>
                    </tr>
                </table>
                <div class="text-bold" style="margin-top: 8px; font-size: 8px;">PROPRETÉ INTÉRIEURE</div>
                <table class="checkbox-table no-border" style="margin-top: 4px;">
                    <tr>
                        <td><span class="checkbox"></span> Propre</td>
                        <td><span class="checkbox"></span> Usagé</td>
                        <td><span class="checkbox"></span> Sale</td>
                    </tr>
                </table>
                <div class="text-bold" style="margin-top: 6px; font-size: 8px;">PROPRETÉ EXTÉRIEURE</div>
                <table class="checkbox-table no-border" style="margin-top: 4px;">
                    <tr>
                        <td><span class="checkbox"></span> Propre</td>
                        <td><span class="checkbox"></span> Usagé</td>
                        <td><span class="checkbox"></span> Sale</td>
                    </tr>
                </table>
                <div style="margin-top: 6px; font-size: 8px;">AUTONOMIE : ________ km</div>
            </td>
        </tr>
    </table>

    {{-- Vehicle Diagrams --}}
    <table style="width: 100%; margin-bottom: 10px;">
        <tr>
            <td style="width: 50%; text-align: center; border: 1px solid #ddd; padding: 10px;">
                <div class="diagram-label">Vue de face</div>
                <div style="font-size: 36px; color: #ccc;">&#x1F697;</div>
            </td>
            <td style="width: 50%; text-align: center; border: 1px solid #ddd; padding: 10px;">
                <div class="diagram-label">Vue arrière</div>
                <div style="font-size: 36px; color: #ccc;">&#x1F697;</div>
            </td>
        </tr>
    </table>
    <table style="width: 100%; margin-bottom: 10px;">
        <tr>
            <td style="width: 50%; text-align: center; border: 1px solid #ddd; padding: 10px;">
                <div class="diagram-label">Côté gauche</div>
                <div style="font-size: 36px; color: #ccc;">&#x1F697;</div>
            </td>
            <td style="width: 50%; text-align: center; border: 1px solid #ddd; padding: 10px;">
                <div class="diagram-label">Côté droit</div>
                <div style="font-size: 36px; color: #ccc;">&#x1F697;</div>
            </td>
        </tr>
    </table>

    {{-- Legend --}}
    <table class="legend-table" style="width: 100%; margin-bottom: 10px; border: 1px solid #ddd;">
        <tr>
            <td style="background: #f5f5f5; font-weight: bold;">Légende :</td>
            <td>&#9675; Bosse</td>
            <td>&#10005; Rayure</td>
            <td>&#10005; Cassé</td>
            <td>&#9632; Peinture</td>
            <td>&#9650; Rouille</td>
            <td>&#9733; Autre</td>
        </tr>
    </table>

    {{-- Comments --}}
    <div class="text-bold" style="margin-bottom: 4px;">Commentaires :</div>
    <div class="comments-box">
        @if($reservation->options && isset($reservation->options['comments']))
            {{ $reservation->options['comments'] }}
        @else
            Aucun commentaire
        @endif
    </div>

    {{-- Pièces jointes --}}
    <div class="pieces-box">
        <div class="title">Pièces jointes</div>
        <table style="width: 100%;">
            <tr>
                <td style="width: 50%; border: 1px solid #ddd; padding: 6px; text-align: center;">
                    @if($client->cin_image_url)
                        <img src="{{ $client->cin_image_url }}" style="max-height: 60px;" alt="CIN">
                    @else
                        <div style="height: 60px; background: #f5f5f5; line-height: 60px; color: #999; font-size: 8px;">CIN — Recto</div>
                    @endif
                </td>
                <td style="width: 50%; border: 1px solid #ddd; padding: 6px; text-align: center;">
                    @if($client->license_image_url)
                        <img src="{{ $client->license_image_url }}" style="max-height: 60px;" alt="Permis">
                    @else
                        <div style="height: 60px; background: #f5f5f5; line-height: 60px; color: #999; font-size: 8px;">Permis de conduire</div>
                    @endif
                </td>
            </tr>
        </table>
    </div>

    {{-- Signatures --}}
    <table class="sig-table" style="margin-top: 10px;">
        <tr>
            <td>
                <div class="sig-label">Le Locataire</div>
                <div class="sig-box">
                    @if($reservation->contract && $reservation->contract->signature_data)
                        <img src="{{ $reservation->contract->signature_data }}" alt="Signature">
                    @endif
                </div>
            </td>
            <td>
                <div class="sig-label">2ème Conducteur</div>
                <div class="sig-box"></div>
            </td>
            <td>
                <div class="sig-label">Le Loueur</div>
                <div class="sig-box">
                    @if($agencyLogo)
                        <img src="{{ $agencyLogo }}" alt="Cachet">
                    @endif
                </div>
            </td>
            <td>
                <div class="sig-label">Date et lieu de retour</div>
                <div style="font-size: 8px; margin-top: 4px;">
                    <div>Date et Heure : {{ $endDate->format('d/m/Y H:i') }}</div>
                    <div style="margin-top: 4px;">Lieu de retour : {{ $agencyAddress }}</div>
                </div>
            </td>
        </tr>
    </table>

    <div class="page-footer">
        <table>
            <tr>
                <td>{{ $agencyName }} — {{ $agencyAddress }}</td>
                <td class="text-right">État du Véhicule — N° {{ $contractRef }}</td>
            </tr>
        </table>
    </div>
</div>

{{-- ═══════════════════════════════════════════════════════════════════════
     PAGE 3: CONDITIONS GÉNÉRALES
     ═══════════════════════════════════════════════════════════════════════ --}}
<div class="page">
    <div class="conditions-header">Conditions Générales</div>

    <div class="conditions-bilingual">
        {{-- French --}}
        <div class="conditions-fr">
            <div class="article">
                <div class="article-title">ARTICLE 1 : But du véhicule - Usage - Interdiction</div>
                <div class="article-text">
                    Le Véhicule est loué pour être utilisé exclusivement par le Locataire pour des besoins personnels ou professionnels. Le Locataire s'interdit de :
                    <br><br>
                    <strong>a)</strong> Sous-louer le Véhicule ou le mettre à disposition d'un tiers non autorisé.<br>
                    <strong>b)</strong> Utiliser le Véhicule pour des compétitions, des rallies ou des courses.<br>
                    <strong>c)</strong> Transporter des marchandises ou des matières dangereuses.<br>
                    <strong>d)</strong> Quitter le territoire marocain sans autorisation écrite préalable.<br>
                    <strong>e)</strong> Utiliser le Véhicule sous l'influence de drogues, alcool ou tout autre substance altérant les facultés.
                </div>
            </div>

            <div class="article">
                <div class="article-title">ARTICLE 2 : Assurance - Accidents</div>
                <div class="article-text">
                    Le Véhicule est couvert par une assurance responsabilité civile. En cas d'accident, le Locataire doit :
                    <br><br>
                    <strong>a)</strong> Immédiatement prévenir la police et obtenir un procès-verbal.<br>
                    <strong>b)</strong> Avertir le Loueur dans les 24 heures.<br>
                    <strong>c)</strong> Fournir tous les documents nécessaires au règlement du sinistre.
                    <br><br>
                    <strong> franchise est de 20% du montant total des dommages</strong> (minimum 2000 MAD).
                </div>
            </div>

            <div class="article">
                <div class="article-title">ARTICLE 3 : Location / Paiement / Pénalités</div>
                <div class="article-text">
                    Le montant de la location doit être payé intégralement avant la prise en charge du Véhicule. En cas de retard de paiement :
                    <br><br>
                    <strong>a)</strong> Pénalité de retard de 2% par jour de retard.<br>
                    <strong>b)</strong> Le Loueur se réserve le droit de récupérer le Véhicule sans mise en demeure préalable.<br>
                    <strong>c)</strong> Le dépassement du kilomètre inclus est facturé au tarif de 1,50 MAD/km.
                </div>
            </div>

            <div class="article">
                <div class="article-title">ARTICLE 4 : Documents du Véhicule / CN</div>
                <div class="article-text">
                    Les documents suivants se trouvent dans le Véhicule :
                    <br><br>
                    <strong>a)</strong> Carte grise<br>
                    <strong>b)</strong> Carte d'assurance<br>
                    <strong>c)</strong> Attestation de passage au contrôle technique<br>
                    <strong>d)</strong> Vignette de circulation
                </div>
            </div>

            <div class="article">
                <div class="article-title">ARTICLE 5 : Remboursement</div>
                <div class="article-text">
                    Le remboursement éventuel sera effectué dans un délai de 10 jours ouvrables suivant la restitution du Véhicule.
                </div>
            </div>

            <div class="article">
                <div class="article-title">ARTICLE 6 : Répudiation du Véhicule par le Client</div>
                <div class="article-text">
                    En cas de refus de prendre en charge le Véhicule, le client s'engage à restituer le véhicule dans l'état où il a été remis.
                </div>
            </div>

            <div class="article">
                <div class="article-title">ARTICLE 7 : Autres Conditions Complémentaires</div>
                <div class="article-text">
                    Le non-respect des conditions entraîne la facturation des dommages au tarif du garage agréé le plus proche.
                </div>
            </div>

            <div class="article">
                <div class="article-title">ARTICLE 8 : Contraventions</div>
                <div class="article-text">
                    Les contraventions routières restent à la charge exclusive du Locataire.
                </div>
            </div>

            <div class="article">
                <div class="article-title">ARTICLE 9 : GPS</div>
                <div class="article-text">
                    Pour des raisons de sécurité, un GPS peut être installé pour localiser le véhicule en cas de vol.
                </div>
            </div>
        </div>

        {{-- Arabic --}}
        <div class="conditions-ar">
            <div class="article-ar">
                <div class="article-title-ar">المادة 1: الغرض من المركبة - الاستخدام - الحظر</div>
                <div class="article-text" style="text-align: right; direction: rtl;">
                    يؤجر المركبة لاستخدامها حصرياً من المستأجر للاحتياجات الشخصية أو المهنية. يُمنع المستأجر من:
                    <br><br>
                    أ) إعادة تأجير المركبة أو وضعها تحت تصرف طرف ثالث غير مصرح له.<br>
                    ب) استخدام المركبة في المسابقات أو التجمعات أو السباقات.<br>
                    ج) نقل البضائع أو المواد الخطرة.<br>
                    د) مغادرة التراب المغربي دون تصريح كتابي مسبق.<br>
                    هـ) استخدام المركبة تحت تأثير المخدرات أو الكحول أو أي مادة أخرى تُضعف القدرات.
                </div>
            </div>

            <div class="article-ar">
                <div class="article-title-ar">المادة 2: التأمين - الحوادث</div>
                <div class="article-text" style="text-align: right; direction: rtl;">
                    المركبة مشمولة بتأمين المسؤولية المدنية. في حالة الحادث، يجب على المستأجر:
                    <br><br>
                    أ) إبلاغ الشرطة فوراً والحصول على تقرير.<br>
                    ب) إخطار المؤجر خلال 24 ساعة.<br>
                    ج) تقديم جميع الوثائق اللازمة لتسوية الحادث.
                    <br><br>
                    <strong>النسبة المخصومة هي 20% من إجمالي الأضرار</strong> (الحد الأدنى 2000 درهم).
                </div>
            </div>

            <div class="article-ar">
                <div class="article-title-ar">المادة 3: الإيجار / الدفع / الغرامات</div>
                <div class="article-text" style="text-align: right; direction: rtl;">
                    يجب دفع مبلغ الإيجار بالكامل قبل استلام المركبة. في حالة تأخر الدفع:
                    <br><br>
                    أ) غرامة تأخير بنسبة 2% في اليوم.<br>
                    ب) يحتفظ المؤجر بالحق في استرداد المركبة دون إنذار مسبق.<br>
                    ج) تجاوز الكيلومترات المدروسة يُحتسب بسعر 1.50 درهم/كم.
                </div>
            </div>

            <div class="article-ar">
                <div class="article-title-ar">المادة 4: وثائق المركبة / البطاقة الوطنية</div>
                <div class="article-text" style="text-align: right; direction: rtl;">
                    الوثائق التالية موجودة داخل المركبة:
                    <br><br>
                    أ) البطاقة الرمادية<br>
                    ب) بطاقة التأمين<br>
                    ج) شهادة اجتياز الفحص الفني<br>
                    د) ملصق السير
                </div>
            </div>

            <div class="article-ar">
                <div class="article-title-ar">المادة 5: استرداد المبلغ</div>
                <div class="article-text" style="text-align: right; direction: rtl;">
                    يتم استرداد أي مبلغ خلال 10 أيام عمل من تاريخ إعادة المركبة.
                </div>
            </div>

            <div class="article-ar">
                <div class="article-title-ar">المادة 6: رفض العميل للمركبة</div>
                <div class="article-text" style="text-align: right; direction: rtl;">
                    في حالة رفض استلام المركبة، يتعهد العميل بإعادة المركبة بنفس الحالة التي تم تسليمها بها.
                </div>
            </div>

            <div class="article-ar">
                <div class="article-title-ar">المادة 7: شروط إضافية</div>
                <div class="article-text" style="text-align: right; direction: rtl;">
                    عدم الالتزام بالشروط يؤدي إلى فرض أضرار وفقاً لسعر ورشة المعتمدة الأقرب.
                </div>
            </div>

            <div class="article-ar">
                <div class="article-title-ar">المادة 8: المخالفات</div>
                <div class="article-text" style="text-align: right; direction: rtl;">
                    تبقى المخالفات المرورية على عاتق المستأجر حصرياً.
                </div>
            </div>

            <div class="article-ar">
                <div class="article-title-ar">المادة 9: نظام تحديد الموقع</div>
                <div class="article-text" style="text-align: right; direction: rtl;">
                    لأسباب أمنية، يمكن تثبيت جهاز تحديد الموقع لمراقبة المركبة في حالة السرقة.
                </div>
            </div>
        </div>
    </div>

    {{-- Signatures --}}
    <table class="sig-table" style="margin-top: 16px;">
        <tr>
            <td>
                <div class="sig-label">Le Locataire</div>
                <div class="sig-box">
                    @if($reservation->contract && $reservation->contract->signature_data)
                        <img src="{{ $reservation->contract->signature_data }}" alt="Signature">
                    @endif
                </div>
            </td>
            <td>
                <div class="sig-label">2ème Conducteur</div>
                <div class="sig-box"></div>
            </td>
            <td>
                <div class="sig-label">Le Loueur</div>
                <div class="sig-box">
                    @if($agencyLogo)
                        <img src="{{ $agencyLogo }}" alt="Cachet">
                    @endif
                </div>
            </td>
            <td>
                <div class="sig-label">Date et lieu de retour</div>
                <div style="font-size: 8px; margin-top: 4px;">
                    <div>Date et Heure : {{ $endDate->format('d/m/Y H:i') }}</div>
                    <div style="margin-top: 4px;">Lieu de retour : {{ $agencyAddress }}</div>
                </div>
            </td>
        </tr>
    </table>

    <div class="page-footer">
        <table>
            <tr>
                <td>{{ $agencyName }} — {{ $agencyAddress }}</td>
                <td class="text-right">Conditions Générales — N° {{ $contractRef }}</td>
            </tr>
        </table>
    </div>
</div>

{{-- ═══════════════════════════════════════════════════════════════════════
     PAGE 4: CONTRAT DE LOCATION
     ═══════════════════════════════════════════════════════════════════════ --}}
<div class="page">
    {{-- Contract Header --}}
    <div class="contract-header">
        <table>
            <tr>
                <td style="width: 30%;" class="agency-logo">
                    @if($agencyLogo)
                        <img src="{{ $agencyLogo }}" style="max-height: 45px;" alt="Logo">
                    @endif
                </td>
                <td style="width: 40%; text-align: center;">
                    <div class="text-bold" style="font-size: 10px;">Contrat N°</div>
                    <div class="contract-number">{{ $contractRef }}</div>
                </td>
                <td style="width: 30%; text-align: right;">
                    <div class="text-bold" style="font-size: 10px;">{{ $agencyName }}</div>
                    <div style="font-size: 8px;">Tél : {{ $agencyPhone }}</div>
                </td>
            </tr>
        </table>
    </div>

    {{-- Basic Info --}}
    <table class="no-border" style="margin-bottom: 8px;">
        <tr>
            <td style="width: 30%; font-weight: bold;">Fait le :</td>
            <td style="width: 30%;">{{ $startDate->format('d/m/Y à H:i') }}</td>
            <td style="width: 20%; font-weight: bold;">Marque :</td>
            <td style="width: 20%;">{{ $vehicle->brand ?? '—' }} {{ $vehicle->model ?? '' }}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Lieu de livraison :</td>
            <td>{{ $agencyAddress }}@if(isset($vehicle->latitude)) ({{ $vehicle->latitude }}, {{ $vehicle->longitude }})@endif</td>
            <td style="font-weight: bold;">Immatriculation :</td>
            <td>{{ $vehicle->plate ?? '—' }}</td>
        </tr>
        <tr>
            <td style="font-weight: bold;">Lieu de reprise :</td>
            <td>{{ $agencyAddress }}</td>
            <td style="font-weight: bold;">Agent Commercial :</td>
            <td>{{ $agentName ?? '—' }}</td>
        </tr>
    </table>

    {{-- Duration --}}
    <div class="section-title">DURÉE DE LOCATION</div>
    <table class="detail-table" style="margin-bottom: 8px;">
        <tr>
            <td class="lbl">Date et Heure Départ</td>
            <td class="val">{{ $startDate->format('d/m/Y à H:i') }}</td>
            <td class="lbl">PROLONGATION DE LOCATION</td>
            <td class="val">Du : ________</td>
        </tr>
        <tr>
            <td class="lbl">Date et Heure Retour</td>
            <td class="val">{{ $endDate->format('d/m/Y à H:i') }}</td>
            <td class="lbl"></td>
            <td class="val">Au : ________</td>
        </tr>
        <tr>
            <td class="lbl">Durée de location</td>
            <td class="val text-bold">{{ $days }} jour(s)</td>
            <td class="lbl"></td>
            <td class="val">Durée : ________</td>
        </tr>
    </table>

    {{-- Client Info --}}
    <div class="section-title">LE LOCATAIRE</div>
    <table class="detail-table" style="margin-bottom: 8px;">
        <tr>
            <td class="lbl">Nom</td>
            <td class="val">{{ strtoupper($nom) ?: '—' }}</td>
            <td class="lbl">Prénom</td>
            <td class="val">{{ $prenom ?: '—' }}</td>
        </tr>
        <tr>
            <td class="lbl">Date de naissance</td>
            <td class="val">{{ $client->birth_date ?? '__/__/____' }}</td>
            <td class="lbl">Adresse</td>
            <td class="val">{{ $client->address ?? '—' }}</td>
        </tr>
        <tr>
            <td class="lbl">Tél</td>
            <td class="val">{{ $client->phone ?? '—' }}</td>
            <td class="lbl">Nationalité</td>
            <td class="val">{{ $client->nationality ?? 'MAR' }}</td>
        </tr>
        <tr>
            <td class="lbl">Permis N°</td>
            <td class="val">{{ $client->license_number ?? '—' }}</td>
            <td class="lbl">Permis Valable Jusqu'au</td>
            <td class="val">{{ $client->license_expiry ?? '16/10/2038' }}</td>
        </tr>
        <tr>
            <td class="lbl">CIN N°</td>
            <td class="val">{{ $client->cin ?? '—' }}</td>
            <td class="lbl">Valable Jusqu'au</td>
            <td class="val">{{ $client->cin_expiry ?? '22/07/2025' }}</td>
        </tr>
    </table>

    {{-- 2nd Driver --}}
    <div class="section-title">2ème CONDUCTEUR</div>
    <table class="detail-table" style="margin-bottom: 8px;">
        <tr>
            <td class="lbl">Nom</td>
            <td class="val">________</td>
            <td class="lbl">Prénom</td>
            <td class="val">________</td>
        </tr>
        <tr>
            <td class="lbl">Date de naissance</td>
            <td class="val">__/__/____</td>
            <td class="lbl">Permis N°</td>
            <td class="val">________</td>
        </tr>
        <tr>
            <td class="lbl">Permis Valable Jusqu'au</td>
            <td class="val">__/__/____</td>
            <td class="lbl">CIN N°</td>
            <td class="val">________</td>
        </tr>
    </table>

    {{-- Vehicle Papers --}}
    <div class="section-title">PAPIERS DE VÉHICULE</div>
    <table class="checkbox-row" style="margin-bottom: 8px;">
        <tr>
            <td style="width: 50%;"><span class="checkbox checked"></span> Carte grise</td>
            <td style="width: 50%;"><span class="checkbox"></span> Visite Technique</td>
        </tr>
        <tr>
            <td><span class="checkbox checked"></span> Assurance</td>
            <td><span class="checkbox checked"></span> Attestation de paiement de vignette</td>
        </tr>
        <tr>
            <td><span class="checkbox checked"></span> Autorisation de circulation</td>
            <td></td>
        </tr>
    </table>

    {{-- Franchise & Payment --}}
    <table class="detail-table" style="margin-bottom: 8px;">
        <tr>
            <td style="width: 50%; vertical-align: top;">
                <div class="section-title" style="margin-bottom: 4px;">FRANCHISE</div>
                <table class="no-border">
                    <tr>
                        <td style="border: none; font-size: 8px;">Assurance "Tous risques"</td>
                        <td style="border: none; font-size: 8px;"><span class="checkbox"></span></td>
                    </tr>
                    <tr>
                        <td style="border: none; font-size: 8px; font-weight: bold;">Franchise</td>
                        <td style="border: none; font-size: 8px; font-weight: bold;">{{ number_format($reservation->deposit_amount ?? 0, 2) }} DH</td>
                    </tr>
                </table>
            </td>
            <td style="width: 50%; vertical-align: top;">
                <table class="detail-table" style="width: 100%;">
                    <tr>
                        <td class="lbl" style="font-weight: bold;">TOTAL GENERAL:</td>
                        <td class="val text-bold">{{ number_format($reservation->total_price, 2) }} DH</td>
                    </tr>
                    <tr>
                        <td class="lbl">MONTANT PAYÉ:</td>
                        <td class="val text-bold">{{ number_format($reservation->deposit_amount ?? ($reservation->total_price * 0.1), 2) }} DH</td>
                    </tr>
                    <tr>
                        <td class="lbl" style="font-weight: bold;">LE RESTE À PAYER:</td>
                        <td class="val text-bold">{{ number_format($reservation->total_price - ($reservation->deposit_amount ?? ($reservation->total_price * 0.1)), 2) }} DH</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- Payment Method --}}
    <div class="section-title">Mode de Règlement</div>
    <table class="checkbox-row" style="margin-bottom: 10px;">
        <tr>
            <td style="width: 25%;"><span class="checkbox {{ ($reservation->payment_method === 'cash' || $reservation->payment_method === 'on_site') ? 'checked' : '' }}"></span> Espèce</td>
            <td style="width: 25%;"><span class="checkbox {{ $reservation->payment_method === 'cheque' ? 'checked' : '' }}"></span> Chèque</td>
            <td style="width: 25%;"><span class="checkbox {{ ($reservation->payment_method === 'stripe' || $reservation->payment_method === 'cmi') ? 'checked' : '' }}"></span> Carte bancaire</td>
            <td style="width: 25%;"><span class="checkbox {{ $reservation->payment_method === 'transfer' ? 'checked' : '' }}"></span> Virement</td>
        </tr>
    </table>

    {{-- Signatures --}}
    <table class="sig-table">
        <tr>
            <td>
                <div class="sig-label">Le Locataire</div>
                <div class="sig-box">
                    @if($reservation->contract && $reservation->contract->signature_data)
                        <img src="{{ $reservation->contract->signature_data }}" alt="Signature">
                    @endif
                </div>
            </td>
            <td>
                <div class="sig-label">2ème Conducteur</div>
                <div class="sig-box"></div>
            </td>
            <td>
                <div class="sig-label">Le Loueur</div>
                <div class="sig-box">
                    @if($agencyLogo)
                        <img src="{{ $agencyLogo }}" alt="Cachet">
                    @endif
                </div>
            </td>
            <td>
                <div class="sig-label">Date et lieu de retour</div>
                <div style="font-size: 8px; margin-top: 4px;">
                    <div>Date et Heure : {{ $endDate->format('d/m/Y H:i') }}</div>
                    <div style="margin-top: 4px;">Lieu de retour : {{ $agencyAddress }}</div>
                </div>
            </td>
        </tr>
    </table>

    <div class="page-footer">
        <table>
            <tr>
                <td>{{ $agencyName }}<br>{{ $agencyAddress }}</td>
                <td class="text-right">
                    {{ $agencyPhone }}<br>
                    Tél : {{ $agencyPhone }} | {{ $agencyEmail }}<br>
                    RC : {{ $agencyRC ?? '160455' }}
                </td>
            </tr>
        </table>
    </div>
</div>

</body>
</html>
