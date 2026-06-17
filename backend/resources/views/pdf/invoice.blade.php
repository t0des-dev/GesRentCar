<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Facture {{ $invoice->invoice_number }} — Vectoria Rent Car</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Arial, sans-serif;
            font-size: 10px;
            color: #0f172a;
            background: #ffffff;
            line-height: 1.5;
        }
        .page { padding: 32px 40px; }

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
        .header-inner { position: relative; z-index: 1; display: table; width: 100%; }
        .header-left  { display: table-cell; vertical-align: middle; }
        .header-right { display: table-cell; vertical-align: middle; text-align: right; width: 220px; }
        .brand-name   { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #fff; }
        .brand-tag    { font-size: 9px; color: rgba(255,255,255,0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px; }
        .invoice-num  { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 600; }
        .invoice-badge {
            display: inline-block;
            background: {{ $invoice->status === 'paid' ? '#10b981' : '#f59e0b' }};
            color: #fff;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 6px;
        }

        .section { margin-bottom: 20px; }
        .section-title {
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #6366f1;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 2px solid #e5e7eb;
        }

        .info-grid { display: table; width: 100%; margin-bottom: 16px; }
        .info-col  { display: table-cell; width: 50%; vertical-align: top; padding-right: 16px; }
        .info-col:last-child { padding-right: 0; padding-left: 16px; }
        .info-label { font-size: 8px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .info-value { font-size: 11px; color: #0f172a; font-weight: 600; margin-top: 2px; }

        .table-header {
            background: #f8fafc;
            padding: 8px 12px;
            border-radius: 8px;
            margin-bottom: 8px;
        }
        .table-row {
            display: table;
            width: 100%;
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .table-row:last-child { border-bottom: none; }
        .col-desc   { display: table-cell; width: 50%; font-weight: 500; }
        .col-qty    { display: table-cell; width: 15%; text-align: center; color: #64748b; }
        .col-rate   { display: table-cell; width: 17%; text-align: right; color: #64748b; }
        .col-amount { display: table-cell; width: 18%; text-align: right; font-weight: 700; }
        .col-header { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }

        .totals { margin-top: 16px; }
        .total-row {
            display: table;
            width: 100%;
            padding: 4px 0;
        }
        .total-label { display: table-cell; width: 65%; text-align: right; color: #64748b; font-size: 10px; }
        .total-value { display: table-cell; width: 35%; text-align: right; font-weight: 600; font-size: 10px; }
        .total-row.grand {
            border-top: 2px solid #0f172a;
            padding-top: 8px;
            margin-top: 4px;
        }
        .total-row.grand .total-label { color: #0f172a; font-size: 12px; font-weight: 700; }
        .total-row.grand .total-value { color: #0f172a; font-size: 14px; font-weight: 900; }

        .footer {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 8px;
            color: #94a3b8;
        }
        .footer-brand { font-weight: 700; color: #6366f1; }

        .legal {
            margin-top: 20px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            font-size: 8px;
            color: #64748b;
            line-height: 1.6;
        }
    </style>
</head>
<body>
<div class="page">

    {{-- Header --}}
    <div class="header">
        <div class="header-accent"></div>
        <div class="header-inner">
            <div class="header-left">
                <div class="brand-name">Vectoria Rent Car</div>
                <div class="brand-tag">Location Premium de Véhicules</div>
            </div>
            <div class="header-right">
                <div class="invoice-num">FACTURE N°{{ $invoice->invoice_number }}</div>
                <div class="invoice-badge">{{ $invoice->status === 'paid' ? 'Payée' : 'À payer' }}</div>
            </div>
        </div>
    </div>

    {{-- Client & Invoice Info --}}
    <div class="info-grid">
        <div class="info-col">
            <div class="section-title">Client</div>
            <div class="info-label">Nom</div>
            <div class="info-value">{{ $client->name }}</div>
            <div class="info-label" style="margin-top: 6px;">CIN</div>
            <div class="info-value">{{ $client->cin }}</div>
            <div class="info-label" style="margin-top: 6px;">Téléphone</div>
            <div class="info-value">{{ $client->phone }}</div>
        </div>
        <div class="info-col">
            <div class="section-title">Détails Facture</div>
            <div class="info-label">Date d'émission</div>
            <div class="info-value">{{ $invoice->issued_at->format('d/m/Y') }}</div>
            <div class="info-label" style="margin-top: 6px;">Échéance</div>
            <div class="info-value">{{ $invoice->due_at ? $invoice->due_at->format('d/m/Y') : '—' }}</div>
            <div class="info-label" style="margin-top: 6px;">Réservation</div>
            <div class="info-value">VRC-{{ str_pad($reservation->id, 5, '0', STR_PAD_LEFT) }}</div>
        </div>
    </div>

    {{-- Vehicle Info --}}
    <div class="section">
        <div class="section-title">Véhicule</div>
        <div class="info-grid" style="margin-bottom: 0;">
            <div class="info-col">
                <div class="info-value">{{ $vehicle->brand }} {{ $vehicle->model }}</div>
                <div class="info-label" style="margin-top: 2px;">Immatriculation : {{ $vehicle->plate }}</div>
            </div>
            <div class="info-col">
                <div class="info-label">Période</div>
                <div class="info-value">
                    {{ $reservation->start_date->format('d/m/Y') }} — {{ $reservation->end_date->format('d/m/Y') }}
                </div>
                <div class="info-label" style="margin-top: 2px;">
                    {{ $reservation->start_date->diffInDays($reservation->end_date) }} jour(s)
                </div>
            </div>
        </div>
    </div>

    {{-- Line Items --}}
    <div class="section">
        <div class="section-title">Détail</div>
        <div class="table-header">
            <div class="table-row">
                <div class="col-desc col-header">Description</div>
                <div class="col-qty col-header">Qté</div>
                <div class="col-rate col-header">Tarif/jour</div>
                <div class="col-amount col-header">Montant</div>
            </div>
        </div>

        @php
            $days = $reservation->start_date->diffInDays($reservation->end_date);
            $dailyRate = $days > 0 ? $reservation->total_price / $days : $reservation->total_price;
        @endphp

        <div class="table-row">
            <div class="col-desc">Location {{ $vehicle->brand }} {{ $vehicle->model }}</div>
            <div class="col-qty">{{ $days }} j</div>
            <div class="col-rate">{{ number_format($dailyRate, 2, ',', ' ') }} MAD</div>
            <div class="col-amount">{{ number_format($reservation->total_price, 2, ',', ' ') }} MAD</div>
        </div>

        @if($reservation->deposit_amount > 0)
        <div class="table-row">
            <div class="col-desc">Caution</div>
            <div class="col-qty">1</div>
            <div class="col-rate">{{ number_format($reservation->deposit_amount, 2, ',', ' ') }} MAD</div>
            <div class="col-amount">{{ number_format($reservation->deposit_amount, 2, ',', ' ') }} MAD</div>
        </div>
        @endif
    </div>

    {{-- Totals --}}
    <div class="totals">
        <div class="total-row">
            <div class="total-label">Sous-total HT</div>
            <div class="total-value">{{ number_format($invoice->subtotal_ht, 2, ',', ' ') }} MAD</div>
        </div>
        <div class="total-row">
            <div class="total-label">TVA ({{ number_format($invoice->vat_rate, 0) }}%)</div>
            <div class="total-value">{{ number_format($invoice->vat_amount, 2, ',', ' ') }} MAD</div>
        </div>
        @if($invoice->deposit_amount > 0)
        <div class="total-row">
            <div class="total-label">Caution</div>
            <div class="total-value">+ {{ number_format($invoice->deposit_amount, 2, ',', ' ') }} MAD</div>
        </div>
        @endif
        <div class="total-row grand">
            <div class="total-label">Total TTC</div>
            <div class="total-value">{{ number_format($invoice->total_ttc, 2, ',', ' ') }} MAD</div>
        </div>
        @if($invoice->remaining_amount > 0)
        <div class="total-row">
            <div class="total-label" style="color: #f59e0b;">Reste à payer</div>
            <div class="total-value" style="color: #f59e0b;">{{ number_format($invoice->remaining_amount, 2, ',', ' ') }} MAD</div>
        </div>
        @endif
    </div>

    {{-- Legal --}}
    <div class="legal">
        <strong>Conditions de paiement :</strong> Le paiement est dû à réception de la facture.
        En cas de retard de paiement, une pénalité de 3% par mois sera appliquée sur le montant restant dû.
        Conformément à la législation marocaine, cette facture fait office de titre de perception.
    </div>

    {{-- Footer --}}
    <div class="footer">
        <span class="footer-brand">Vectoria Rent Car</span> — Casablanca, Maroc<br>
        Tél : +212 6 00 00 00 00 — Email : contact@vectoria-rent.com<br>
        RC : 12345 — IF : 67890 — CNSS : 11223
    </div>

</div>
</body>
</html>
