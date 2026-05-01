<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Contrat de Location N°{{ $reservation->id }} — Vectoria Rent Car</title>
    <style>
        /* ── Reset & Base ─────────────────────────────────────────────────── */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Arial, sans-serif;
            font-size: 10px;
            color: #0f172a;
            background: #ffffff;
            line-height: 1.5;
        }

        /* ── Layout ───────────────────────────────────────────────────────── */
        .page { padding: 32px 40px; }

        /* ── Header ───────────────────────────────────────────────────────── */
        .header {
            background: #0f172a;
            color: #ffffff;
            padding: 24px 32px;
            border-radius: 12px;
            margin-bottom: 24px;
            position: relative;
            overflow: hidden;
        }
        .header-accent {
            position: absolute;
            top: -40px; right: -40px;
            width: 160px; height: 160px;
            background: rgba(99,102,241,0.3);
            border-radius: 50%;
        }
        .header-accent2 {
            position: absolute;
            bottom: -30px; left: 120px;
            width: 100px; height: 100px;
            background: rgba(99,102,241,0.15);
            border-radius: 50%;
        }
        .header-inner { position: relative; z-index: 1; display: table; width: 100%; }
        .header-left  { display: table-cell; vertical-align: middle; }
        .header-right { display: table-cell; vertical-align: middle; text-align: right; width: 220px; }
        .brand-name   { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #fff; }
        .brand-tag    { font-size: 9px; color: rgba(255,255,255,0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px; }
        .contract-num { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 600; }
        .contract-badge {
            display: inline-block;
            background: #6366f1;
            color: #fff;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 4px 12px;
            border-radius: 100px;
            margin-top: 6px;
        }
        .contract-date { font-size: 9px; color: rgba(255,255,255,0.5); margin-top: 4px; }

        /* ── Status Badge ─────────────────────────────────────────────────── */
        .status-bar {
            background: #f0fdf4;
            border: 1.5px solid #86efac;
            border-radius: 8px;
            padding: 8px 16px;
            margin-bottom: 20px;
            display: table;
            width: 100%;
        }
        .status-bar-inner { display: table-cell; vertical-align: middle; }
        .status-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; margin-right: 6px; }
        .status-text { font-size: 9px; font-weight: 800; color: #15803d; text-transform: uppercase; letter-spacing: 1px; }

        /* ── Section Cards ────────────────────────────────────────────────── */
        .grid-2 { display: table; width: 100%; margin-bottom: 20px; border-spacing: 12px; }
        .col { display: table-cell; vertical-align: top; width: 50%; }
        .card {
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-radius: 10px;
            padding: 16px 18px;
        }
        .card-title {
            font-size: 8px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #6366f1;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1.5px solid #e2e8f0;
        }
        .card-row { display: table; width: 100%; margin-bottom: 6px; }
        .card-label { display: table-cell; font-size: 9px; font-weight: 700; color: #94a3b8; width: 110px; }
        .card-value { display: table-cell; font-size: 9px; font-weight: 700; color: #0f172a; }

        /* ── Pricing Table ────────────────────────────────────────────────── */
        .pricing-card {
            background: #0f172a;
            color: #fff;
            border-radius: 10px;
            padding: 20px 22px;
            margin-bottom: 20px;
        }
        .pricing-title { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #6366f1; margin-bottom: 14px; }
        .pricing-row { display: table; width: 100%; margin-bottom: 8px; }
        .pricing-key { display: table-cell; font-size: 9px; color: #94a3b8; font-weight: 600; }
        .pricing-val { display: table-cell; font-size: 9px; color: #fff; font-weight: 700; text-align: right; }
        .pricing-divider { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 10px 0; }
        .pricing-total-row { display: table; width: 100%; margin-top: 10px; }
        .pricing-total-key { display: table-cell; font-size: 12px; font-weight: 900; color: #fff; }
        .pricing-total-val { display: table-cell; font-size: 16px; font-weight: 900; color: #6366f1; text-align: right; }
        .pricing-deposit-row { display: table; width: 100%; margin-top: 8px; }
        .pricing-deposit-bg {
            background: rgba(99,102,241,0.15);
            border: 1px solid rgba(99,102,241,0.3);
            border-radius: 8px;
            padding: 8px 12px;
            display: table;
            width: 100%;
        }
        .pricing-deposit-key { display: table-cell; font-size: 9px; color: #a5b4fc; font-weight: 700; }
        .pricing-deposit-val { display: table-cell; font-size: 13px; font-weight: 900; color: #fff; text-align: right; }

        /* ── Clauses ──────────────────────────────────────────────────────── */
        .clauses {
            border: 1.5px solid #e2e8f0;
            border-radius: 10px;
            padding: 16px 18px;
            margin-bottom: 20px;
        }
        .clauses-title {
            font-size: 8px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #64748b;
            margin-bottom: 12px;
        }
        .clause { margin-bottom: 8px; }
        .clause-num { font-size: 8px; font-weight: 900; color: #6366f1; }
        .clause-text { font-size: 8px; color: #475569; line-height: 1.6; }

        /* ── Signatures ───────────────────────────────────────────────────── */
        .sig-grid { display: table; width: 100%; margin-bottom: 20px; }
        .sig-col { display: table-cell; vertical-align: top; width: 50%; }
        .sig-box {
            border: 1.5px dashed #cbd5e1;
            border-radius: 10px;
            padding: 16px;
            text-align: center;
            min-height: 80px;
            position: relative;
        }
        .sig-label { font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 8px; }
        .sig-name { font-size: 9px; font-weight: 700; color: #0f172a; margin-top: 8px; }
        .sig-date { font-size: 8px; color: #94a3b8; }
        img.signature-img { max-width: 180px; max-height: 60px; }

        /* ── Footer ───────────────────────────────────────────────────────── */
        .footer {
            border-top: 1.5px solid #e2e8f0;
            padding-top: 12px;
            display: table;
            width: 100%;
        }
        .footer-left  { display: table-cell; font-size: 8px; color: #94a3b8; }
        .footer-right { display: table-cell; font-size: 8px; color: #94a3b8; text-align: right; }

        /* ── Divider ──────────────────────────────────────────────────────── */
        .divider { border: none; border-top: 1.5px solid #e2e8f0; margin: 16px 0; }

        /* ── Spacing helper ───────────────────────────────────────────────── */
        .mt-12 { margin-top: 12px; }
        .mr-12 { margin-right: 12px; }
    </style>
</head>
<body>
<div class="page">

    {{-- ── HEADER ──────────────────────────────────────────────────────────── --}}
    <div class="header">
        <div class="header-accent"></div>
        <div class="header-accent2"></div>
        <div class="header-inner">
            <div class="header-left">
                <div class="brand-name">Vectoria Rent Car</div>
                <div class="brand-tag">Premium Car Rental — Maroc</div>
            </div>
            <div class="header-right">
                <div class="contract-num">Contrat N° <strong>VRC-{{ str_pad($reservation->id, 5, '0', STR_PAD_LEFT) }}</strong></div>
                <div class="contract-badge">Contrat de Location</div>
                <div class="contract-date">Émis le {{ now()->format('d/m/Y à H:i') }}</div>
            </div>
        </div>
    </div>

    {{-- ── STATUS ───────────────────────────────────────────────────────────── --}}
    <div class="status-bar">
        <div class="status-bar-inner">
            <span class="status-dot"></span>
            <span class="status-text">
                @if($reservation->status === 'confirmed')
                    ✓ Réservation Confirmée — Acompte reçu
                @elseif($reservation->status === 'pending_payment')
                    En attente de paiement
                @else
                    Statut : {{ ucfirst($reservation->status) }}
                @endif
            </span>
        </div>
    </div>

    {{-- ── CLIENT & VEHICLE GRID ────────────────────────────────────────────── --}}
    <div class="grid-2">
        <div class="col mr-12">
            <div class="card">
                <div class="card-title">Informations Client</div>
                <div class="card-row">
                    <div class="card-label">Nom complet</div>
                    <div class="card-value">{{ $client->name }}</div>
                </div>
                <div class="card-row">
                    <div class="card-label">CIN / Passeport</div>
                    <div class="card-value">{{ $client->cin }}</div>
                </div>
                <div class="card-row">
                    <div class="card-label">Téléphone</div>
                    <div class="card-value">{{ $client->phone }}</div>
                </div>
                <div class="card-row">
                    <div class="card-label">Email</div>
                    <div class="card-value">{{ $client->email }}</div>
                </div>
                @if($client->license_number)
                <div class="card-row">
                    <div class="card-label">Permis N°</div>
                    <div class="card-value">{{ $client->license_number }}</div>
                </div>
                @endif
            </div>
        </div>
        <div class="col">
            <div class="card">
                <div class="card-title">Véhicule Loué</div>
                <div class="card-row">
                    <div class="card-label">Marque / Modèle</div>
                    <div class="card-value">{{ $vehicle->brand }} {{ $vehicle->model }}</div>
                </div>
                <div class="card-row">
                    <div class="card-label">Immatriculation</div>
                    <div class="card-value">{{ $vehicle->plate }}</div>
                </div>
                <div class="card-row">
                    <div class="card-label">Date de départ</div>
                    <div class="card-value">{{ $reservation->start_date->format('d/m/Y') }}</div>
                </div>
                <div class="card-row">
                    <div class="card-label">Date de retour</div>
                    <div class="card-value">{{ $reservation->end_date->format('d/m/Y') }}</div>
                </div>
                <div class="card-row">
                    <div class="card-label">Durée totale</div>
                    @php
                        $days = $reservation->start_date->diffInDays($reservation->end_date);
                        if ($days == 0) $days = 1;
                    @endphp
                    <div class="card-value">{{ $days }} jour(s)</div>
                </div>
                <div class="card-row">
                    <div class="card-label">Tarif journalier</div>
                    <div class="card-value">{{ number_format($vehicle->price_per_day, 2) }} MAD</div>
                </div>
            </div>
        </div>
    </div>

    {{-- ── PRICING ──────────────────────────────────────────────────────────── --}}
    <div class="pricing-card">
        <div class="pricing-title">Récapitulatif Financier</div>

        <div class="pricing-row">
            <div class="pricing-key">Sous-total location ({{ $days }}j × {{ number_format($vehicle->price_per_day, 2) }} MAD)</div>
            <div class="pricing-val">{{ number_format($days * $vehicle->price_per_day, 2) }} MAD</div>
        </div>
        @php $base = $days * $vehicle->price_per_day; $surcharge = $reservation->total_price - $base; @endphp
        @if($surcharge > 0)
        <div class="pricing-row">
            <div class="pricing-key">Surcharge / Options concièrgerie</div>
            <div class="pricing-val">+ {{ number_format($surcharge, 2) }} MAD</div>
        </div>
        @endif

        <hr class="pricing-divider">

        <div class="pricing-total-row">
            <div class="pricing-total-key">Montant Total TTC</div>
            <div class="pricing-total-val">{{ number_format($reservation->total_price, 2) }} MAD</div>
        </div>

        <div class="mt-12">
            <div class="pricing-deposit-bg">
                <div class="pricing-deposit-row">
                    <div class="pricing-deposit-key">Acompte versé (10% — "Hold my Car")</div>
                    <div class="pricing-deposit-val">{{ number_format($reservation->deposit_amount ?? ($reservation->total_price * 0.1), 2) }} MAD</div>
                </div>
            </div>
        </div>
    </div>

    {{-- ── LEGAL CLAUSES ────────────────────────────────────────────────────── --}}
    <div class="clauses">
        <div class="clauses-title">Conditions Générales de Location</div>
        <div class="clause">
            <span class="clause-num">Art. 1 — Responsabilité : </span>
            <span class="clause-text">Le locataire est entièrement responsable du véhicule pendant toute la durée de la location. Tout dommage sera évalué à la restitution du véhicule et facturé au locataire.</span>
        </div>
        <div class="clause">
            <span class="clause-num">Art. 2 — Carburant : </span>
            <span class="clause-text">Le véhicule est remis avec un plein de carburant et doit être restitué dans les mêmes conditions. Tout manque sera facturé au tarif en vigueur.</span>
        </div>
        <div class="clause">
            <span class="clause-num">Art. 3 — Kilométrage : </span>
            <span class="clause-text">Kilométrage inclus selon formule choisie. Tout dépassement sera facturé 1,50 MAD/km supplémentaire.</span>
        </div>
        <div class="clause">
            <span class="clause-num">Art. 4 — Annulation : </span>
            <span class="clause-text">L'acompte de 10% est non remboursable en cas d'annulation moins de 48h avant la date de prise en charge. Au-delà, remboursement intégral sous 5 jours ouvrés.</span>
        </div>
        <div class="clause">
            <span class="clause-num">Art. 5 — Juridiction : </span>
            <span class="clause-text">En cas de litige, le Tribunal de Commerce de Casablanca sera seul compétent. Le présent contrat est soumis au droit marocain.</span>
        </div>
    </div>

    {{-- ── SIGNATURES ───────────────────────────────────────────────────────── --}}
    <div class="sig-grid">
        <div class="sig-col mr-12">
            <div class="sig-box">
                <div class="sig-label">Signature Vectoria Rent Car</div>
                <br>
                <div class="sig-name">Vectoria Rent Car</div>
                <div class="sig-date">Casablanca, Maroc</div>
            </div>
        </div>
        <div class="sig-col">
            <div class="sig-box">
                <div class="sig-label">Signature du Locataire</div>
                @if($reservation->contract && $reservation->contract->signature_data)
                    <img src="{{ $reservation->contract->signature_data }}" class="signature-img" alt="Signature">
                    <div class="sig-name">{{ $client->name }}</div>
                    <div class="sig-date">Signé le {{ $reservation->contract->signed_at?->format('d/m/Y H:i') }}</div>
                @else
                    <br><br>
                    <div class="sig-date">En attente de signature</div>
                @endif
            </div>
        </div>
    </div>

    {{-- ── FOOTER ───────────────────────────────────────────────────────────── --}}
    <div class="footer">
        <div class="footer-left">
            Vectoria Rent Car — Casablanca, Maroc | contact@vectoria.ma | +212 5 22 XX XX XX
        </div>
        <div class="footer-right">
            Document officiel — Contrat N° VRC-{{ str_pad($reservation->id, 5, '0', STR_PAD_LEFT) }} | Généré le {{ now()->format('d/m/Y') }}
        </div>
    </div>

</div>
</body>
</html>
