<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Contrat de Location N°{{ $reservation->id }}</title>
<style>
    @page { margin: 15mm 12mm; size: A4; }
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'DejaVu Sans',sans-serif; font-size:8.5px; color:#1a1a1a; background:#fff; line-height:1.35; }
    table { border-collapse:collapse; width:100%; }
    td, th { vertical-align:top; }

    .page { page-break-before:always; }
    .page:first-child { page-break-before:auto; }

    .blue-bar { background:#0055B8; color:#fff; font-weight:bold; font-size:9px; padding:5px 8px; text-align:center; }
    .blue-bar-left { background:#0055B8; color:#fff; font-weight:bold; font-size:9px; padding:5px 8px; text-align:left; }
    .blue-bar-right { background:#0055B8; color:#fff; font-weight:bold; font-size:9px; padding:5px 8px; text-align:right; direction:rtl; }

    .info-tbl td { border:1px solid #ccc; padding:3px 6px; font-size:8px; }
    .info-tbl .lbl { background:#e8f0fe; font-weight:bold; width:18%; color:#333; }
    .info-tbl .val { width:32%; }
    .info-tbl .lbl-ar { background:#e8f0fe; font-weight:bold; width:18%; text-align:right; direction:rtl; color:#333; }
    .info-tbl .val-ar { width:32%; text-align:right; direction:rtl; }

    .chk { display:inline-block; width:11px; height:11px; border:1.5px solid #0055B8; border-radius:2px; vertical-align:middle; margin-right:2px; background:#fff; }
    .chk.on { background:#0055B8; position:relative; }
    .chk.on::after { content:''; position:absolute; left:2px; top:0px; width:4px; height:7px; border:solid #fff; border-width:0 1.5px 1.5px 0; transform:rotate(45deg); }

    .sig-box { border-bottom:1px solid #999; height:35px; width:100%; margin-top:4px; }
    .sig-label { font-size:7px; font-weight:bold; color:#555; text-align:center; }
    .field-line { border-bottom:1px solid #999; display:inline-block; min-width:80px; }

    .small { font-size:7px; color:#666; }
    .bold { font-weight:bold; }
    .center { text-align:center; }
    .art { margin-bottom:5px; font-size:7.5px; text-align:justify; }
    .art-title { font-weight:bold; color:#0055B8; margin-bottom:1px; }

    .diagram-label { font-size:7px; font-weight:bold; color:#333; margin-bottom:4px; }
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
    $agencyRC = $agencyRC ?? '160455';
    $agentName = $agentName ?? null;

    $startDate = \Carbon\Carbon::parse($reservation->start_date);
    $endDate = \Carbon\Carbon::parse($reservation->end_date);
    $days = max(1, $startDate->diffInDays($endDate));

    $contractNum = str_pad($reservation->id, 5, '0', STR_PAD_LEFT);
    $contractRef = date('y-m') . '-' . $contractNum;

    $nameParts = explode(' ', trim($client->name ?? ''));
    $prenom = array_shift($nameParts);
    $nom = implode(' ', $nameParts);
?>

{{-- ═══════════════════════════════════════════════════════════════════
     PAGE 1 — DÉCLARATION PRÉALABLE
     ═══════════════════════════════════════════════════════════════════ --}}
<div class="page">

    {{-- Government Header --}}
    <table style="width:100%; margin-bottom:6px;">
        <tr>
            <td style="width:40%; font-size:10px; font-weight:bold; color:#0055B8;">
                ROYAUME DU MAROC
                <div style="font-size:7px; font-weight:normal; color:#555;">Ministère de l'Équipement, du Transport<br>et de la Logistique</div>
            </td>
            <td style="width:20%; text-align:center;">
                @if($agencyLogo)
                    <img src="{{ $agencyLogo }}" style="max-height:35px;" />
                @endif
            </td>
            <td style="width:40%; font-size:10px; font-weight:bold; color:#0055B8; text-align:right; direction:rtl;">
                المملكة المغربية
                <div style="font-size:7px; font-weight:normal; color:#555;">وزارة التجهيز والنقل واللوجستيك</div>
            </td>
        </tr>
    </table>

    <div style="text-align:center; margin:6px 0; font-size:9px; font-weight:bold; direction:rtl; color:#0055B8;">
        &#x0625;&#x0639;&#x0644;&#x0627;&#x0646; &#x0627;&#x0644;&#x0627;&#x0633;&#x062A;&#x062E;&#x062F;&#x0627;&#x0645; &#x0644;&#x0644;&#x0623;&#x062E;&#x0630;&#x0627;&#x0631;
    </div>
    <div style="text-align:center; font-size:10px; font-weight:bold; color:#0055B8; text-decoration:underline; margin-bottom:4px;">
        Déclaration Préalable de location de Voiture Sans Chauffeur
    </div>
    <div style="text-align:center; font-size:7px; color:#666; margin-bottom:8px;">
        (à renseigner Par le Locataire résidant au Maroc)
    </div>

    {{-- Main Info Table --}}
    <table class="info-tbl" style="width:100%; margin-bottom:6px;">
        <tr>
            <td class="lbl">Je Soussigné (e)</td>
            <td class="val">{{ strtoupper($prenom) }} {{ strtoupper($nom) }}</td>
            <td class="lbl-ar">&#x0623;&#x0646;&#x0627; &#x0627;&#x0644;&#x0645;&#x0648;&#x0642;&#x0639;</td>
            <td class="val-ar">{{ strtoupper($prenom) }} {{ strtoupper($nom) }}</td>
        </tr>
        <tr>
            <td class="lbl">Nom</td>
            <td class="val">{{ strtoupper($nom) }}</td>
            <td class="lbl-ar">&#x0627;&#x0644;&#x0644;&#x0642;&#x0628;</td>
            <td class="val-ar">{{ strtoupper($nom) }}</td>
        </tr>
        <tr>
            <td class="lbl">Prénom (s)</td>
            <td class="val">{{ $prenom }}</td>
            <td class="lbl-ar">&#x0627;&#x0644;&#x0627;&#x0633;&#x0645; &#x0627;&#x0644;&#x0623;&#x0648;&#x0644;</td>
            <td class="val-ar">{{ $prenom }}</td>
        </tr>
        <tr>
            <td class="lbl">N° CIN / CNE ou carte de séjour</td>
            <td class="val">{{ $client->cin ?? '' }}</td>
            <td class="lbl-ar">&#x0631;&#x0642;&#x0645; &#x0627;&#x0644;&#x0647;&#x0648;&#x064A;&#x0629;<br>&#x0623;&#x0648; &#x0627;&#x0644;&#x0628;&#x0637;&#x0627;&#x0642;&#x0629; &#x0627;&#x0644;&#x0648;&#x0637;&#x0646;&#x064A;&#x0629;</td>
            <td class="val-ar">{{ $client->cin ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">N° du Permis de conduire</td>
            <td class="val">{{ $client->license_number ?? '' }}</td>
            <td class="lbl-ar">&#x0631;&#x0642;&#x0645; &#x0627;&#x0644;&#x0633;&#x064A;&#x0627;&#x0642;&#x0629;</td>
            <td class="val-ar">{{ $client->license_number ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">Permis Valable Jusqu'au</td>
            <td class="val">{{ $client->license_expiry ?? '' }}</td>
            <td class="lbl-ar">&#x0645;&#x0639;&#x062F; &#x0627;&#x0644;&#x0635;&#x0644;&#x0627;&#x062D;&#x064A;&#x0629;</td>
            <td class="val-ar">{{ $client->license_expiry ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">Adresse</td>
            <td class="val">{{ $client->address ?? '' }}</td>
            <td class="lbl-ar">&#x0627;&#x0644;&#x0639;&#x0646;&#x0648;&#x0627;&#x0646;</td>
            <td class="val-ar">{{ $client->address ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">Ville</td>
            <td class="val">{{ $client->city ?? '' }}</td>
            <td class="lbl-ar">&#x0627;&#x0644;&#x0645;&#x062F;&#x064A;&#x0646;&#x0629;</td>
            <td class="val-ar">{{ $client->city ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">Code Postal</td>
            <td class="val">{{ $client->postal_code ?? '' }}</td>
            <td class="lbl-ar">&#x0631;&#x0642;&#x0645; &#x0627;&#x0644;&#x0628;&#x0631;&#x064A;&#x062F;</td>
            <td class="val-ar">{{ $client->postal_code ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">N° de GSM</td>
            <td class="val">{{ $client->phone ?? '' }}</td>
            <td class="lbl-ar">&#x0627;&#x0644;&#x0647;&#x0627;&#x062A;&#x0641;</td>
            <td class="val-ar">{{ $client->phone ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">Adresse E-mail</td>
            <td class="val">{{ $client->email ?? '' }}</td>
            <td class="lbl-ar">&#x0627;&#x0644;&#x0628;&#x0631;&#x064A;&#x062F; &#x0627;&#x0644;&#x0625;&#x0644;&#x0643;&#x062A;&#x0631;&#x0648;&#x0646;&#x064A;</td>
            <td class="val-ar">{{ $client->email ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">Déclare avoir pris en location Véhicule<br>immatriculé sous numéro :</td>
            <td class="val bold">{{ $vehicle->plate ?? '' }}</td>
            <td class="lbl-ar">&#x0623;&#x0639;&#x0644;&#x0646; &#x0623;&#x0646;&#x0647; &#x062A;&#x0645; &#x0627;&#x0633;&#x062A;&#x0624;&#x062C;&#x0631; &#x0633;&#x064A;&#x0627;&#x0631;&#x0629; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629;<br>&#x0628;&#x0631;&#x0642;&#x0645;</td>
            <td class="val-ar bold">{{ $vehicle->plate ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">et appartenant à l'agence de location</td>
            <td class="val bold">{{ $agencyName }}</td>
            <td class="lbl-ar">&#x0648;&#x062A;&#x0627;&#x0628;&#x0639; &#x0644;&#x0645;&#x0648;&#x0636;&#x0639; &#x0627;&#x0644;&#x0625;&#x064A;&#x062C;&#x0627;&#x0631;</td>
            <td class="val-ar bold">{{ $agencyName }}</td>
        </tr>
        <tr>
            <td class="lbl">pour la période allant du :</td>
            <td class="val bold" colspan="2" style="text-align:center;">
                {{ $startDate->format('d/m/Y') }} au {{ $endDate->format('d/m/Y') }}
            </td>
            <td class="val-ar bold">{{ $startDate->format('d/m/Y') }} &#x0625;&#x0644;&#x0649; {{ $endDate->format('d/m/Y') }}</td>
        </tr>
    </table>

    {{-- Dates detail --}}
    <table class="info-tbl" style="width:100%; margin-bottom:6px;">
        <tr>
            <td class="lbl" style="width:40%;">- Jour d'emprunt (jj/mm/aaaa)</td>
            <td class="val" style="width:10%;">{{ $startDate->format('d/m/Y') }}</td>
            <td class="lbl" style="width:40%;">- Jour de restitution (jj/mm/aaaa)</td>
            <td class="val" style="width:10%;">{{ $endDate->format('d/m/Y') }}</td>
        </tr>
        <tr>
            <td class="lbl">- Heure d'emprunt (HH : MM)</td>
            <td class="val">{{ $startDate->format('H:i') }}</td>
            <td class="lbl">- Heure de restitution (HH: MM)</td>
            <td class="val">{{ $endDate->format('H:i') }}</td>
        </tr>
    </table>

    {{-- Fait à / Le --}}
    <table style="width:100%; margin-bottom:8px;">
        <tr>
            <td style="font-size:8px; width:50%; padding:4px 0;">
                <span class="bold">Fait à :</span> {{ $agencyAddress }}
                <br><span class="bold">Le :</span> {{ $startDate->format('d/m/Y') }}
            </td>
            <td style="font-size:8px; width:50%; text-align:right; direction:rtl; padding:4px 0;">
                <span class="bold">&#x0639;&#x0646;&#x0627;&#x0642; :</span> {{ $agencyAddress }}
                <br><span class="bold">&#x0627;&#x0644;&#x064A;&#x0648;&#x0645; :</span> {{ $startDate->format('d/m/Y') }}
            </td>
        </tr>
    </table>

    {{-- Signatures --}}
    <table style="width:100%; margin-top:12px;">
        <tr>
            <td style="width:50%; text-align:center; padding:0 10px;">
                <div style="font-size:8px; font-weight:bold; color:#0055B8;">
                    Signature, cachet de l'Agence de Location
                </div>
                <div style="font-size:7px; color:#666; direction:rtl;">
                    &#x0627;&#x0644;&#x062A;&#x0648;&#x0642;&#x064A;&#x0639; &#x0648;&#x0627;&#x0644;&#x062E;&#x0637; &#x0644;&#x0645;&#x0648;&#x0636;&#x0639; &#x0627;&#x0644;&#x0625;&#x064A;&#x062C;&#x0627;&#x0631;
                </div>
                <div class="sig-box"></div>
            </td>
            <td style="width:50%; text-align:center; padding:0 10px;">
                <div style="font-size:8px; font-weight:bold; color:#0055B8;">
                    Signature du Locataire
                </div>
                <div style="font-size:7px; color:#666; direction:rtl;">
                    &#x0627;&#x0644;&#x062A;&#x0648;&#x0642;&#x064A;&#x0639; &#x0644;&#x0644;&#x0645;&#x0633;&#x062A;&#x0623;&#x062C;&#x0631;
                </div>
                @if($reservation->contract && $reservation->contract->signature_data)
                    <img src="{{ $reservation->contract->signature_data }}" style="max-height:30px; margin-top:4px;" />
                @endif
                <div class="sig-box"></div>
            </td>
        </tr>
    </table>
</div>

{{-- ═══════════════════════════════════════════════════════════════════
     PAGE 2 — ÉTAT DU VÉHICULE
     ═══════════════════════════════════════════════════════════════════ --}}
<div class="page">

    <div class="blue-bar">État du Véhicule</div>
    <div style="text-align:center; font-size:7.5px; color:#555; padding:4px 0;">
        Veuillez indiquer tous les dommages existants sur le véhicule en marquant les zones concernées sur le diagramme ci-dessous.
    </div>

    {{-- PRISE EN CHARGE / RESTITUTION --}}
    <table style="width:100%; margin-bottom:8px;">
        <tr>
            <td style="width:14%; vertical-align:top;">
                <div style="font-size:8px; font-weight:bold; color:#0055B8; margin-bottom:2px;">PRISE EN CHARGE</div>
                <div style="font-size:7px;">Heure : {{ $startDate->format('H:i') }}</div>
                <div style="font-size:7px;">Km : ________</div>
                <div style="margin-top:6px;">
                    <div style="font-size:7px; font-weight:bold;">PROPRETÉ INTÉRIEURE</div>
                    <div style="font-size:7px;"><span class="chk on"></span> Propre  <span class="chk"></span> Usagé  <span class="chk"></span> Sale</div>
                </div>
                <div style="margin-top:4px;">
                    <div style="font-size:7px; font-weight:bold;">PROPRETÉ EXTÉRIEURE</div>
                    <div style="font-size:7px;"><span class="chk on"></span> Propre  <span class="chk"></span> Usagé  <span class="chk"></span> Sale</div>
                </div>
                <div style="margin-top:4px;">
                    <div style="font-size:7px; font-weight:bold;">AUTONOMIE</div>
                    <div style="font-size:7px;"><span class="chk on"></span> Plein  <span class="chk"></span> 3/4  <span class="chk"></span> 1/2  <span class="chk"></span> 1/4</div>
                </div>
            </td>
            <td style="width:72%; text-align:center;" rowspan="2">
                {{-- Vehicle diagrams --}}
                <table style="width:100%;">
                    <tr>
                        <td style="width:50%; text-align:center; padding:4px;">
                            <div class="diagram-label">Vue de face</div>
                            <div style="display:inline-block; position:relative; width:110px; height:80px;">
                                <div style="position:absolute; top:14px; left:12px; width:86px; height:44px; border:2px solid #444; background:#e8e8e8; border-radius:10px 10px 4px 4px;"></div>
                                <div style="position:absolute; top:4px; left:28px; width:54px; height:18px; border:2px solid #444; border-radius:7px 7px 0 0; background:#b8d0e8;"></div>
                                <div style="position:absolute; top:8px; left:32px; width:18px; height:12px; border:1px solid #666; border-radius:3px 3px 0 0; background:#c8ddf0;"></div>
                                <div style="position:absolute; top:8px; left:58px; width:18px; height:12px; border:1px solid #666; border-radius:3px 3px 0 0; background:#c8ddf0;"></div>
                                <div style="position:absolute; top:20px; left:15px; width:12px; height:7px; border:1px solid #888; border-radius:2px; background:#f0e060;"></div>
                                <div style="position:absolute; top:20px; right:15px; width:12px; height:7px; border:1px solid #888; border-radius:2px; background:#f0e060;"></div>
                                <div style="position:absolute; top:28px; left:30px; width:50px; height:12px; border:1px solid #888; border-radius:2px; background:#d0d0d0;"></div>
                                <div style="position:absolute; bottom:4px; left:8px; width:20px; height:20px; border:2.5px solid #333; border-radius:50%; background:#888;"></div>
                                <div style="position:absolute; bottom:4px; right:8px; width:20px; height:20px; border:2.5px solid #333; border-radius:50%; background:#888;"></div>
                            </div>
                        </td>
                        <td style="width:50%; text-align:center; padding:4px;">
                            <div class="diagram-label">Vue arrière</div>
                            <div style="display:inline-block; position:relative; width:110px; height:80px;">
                                <div style="position:absolute; top:14px; left:12px; width:86px; height:44px; border:2px solid #444; background:#e8e8e8; border-radius:4px 4px 10px 10px;"></div>
                                <div style="position:absolute; top:4px; left:28px; width:54px; height:18px; border:2px solid #444; border-radius:0 0 7px 7px; background:#b8d0e8;"></div>
                                <div style="position:absolute; top:8px; left:32px; width:46px; height:12px; border:1px solid #666; border-radius:0 0 3px 3px; background:#c8ddf0;"></div>
                                <div style="position:absolute; top:20px; left:15px; width:10px; height:7px; border:1px solid #888; border-radius:2px; background:#e04040;"></div>
                                <div style="position:absolute; top:20px; right:15px; width:10px; height:7px; border:1px solid #888; border-radius:2px; background:#e04040;"></div>
                                <div style="position:absolute; top:28px; left:30px; width:50px; height:14px; border:1px solid #888; border-radius:2px; background:#d0d0d0;"></div>
                                <div style="position:absolute; top:32px; left:44px; width:22px; height:6px; border-radius:2px; background:#888;"></div>
                                <div style="position:absolute; bottom:4px; left:8px; width:20px; height:20px; border:2.5px solid #333; border-radius:50%; background:#888;"></div>
                                <div style="position:absolute; bottom:4px; right:8px; width:20px; height:20px; border:2.5px solid #333; border-radius:50%; background:#888;"></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="width:50%; text-align:center; padding:4px;">
                            <div class="diagram-label">Côté gauche</div>
                            <div style="display:inline-block; position:relative; width:130px; height:72px;">
                                <div style="position:absolute; top:24px; left:6px; width:118px; height:28px; border:2px solid #444; background:#e8e8e8; border-radius:5px;"></div>
                                <div style="position:absolute; top:8px; left:46px; width:56px; height:20px; border:2px solid #444; border-radius:4px 10px 0 0; background:#b8d0e8;"></div>
                                <div style="position:absolute; top:12px; left:50px; width:20px; height:14px; border:1px solid #666; border-radius:3px 5px 0 0; background:#c8ddf0;"></div>
                                <div style="position:absolute; top:12px; left:76px; width:22px; height:14px; border:1px solid #666; border-radius:5px 3px 0 0; background:#c8ddf0;"></div>
                                <div style="position:absolute; top:30px; left:10px; width:10px; height:7px; border:1px solid #888; border-radius:2px; background:#f0e060;"></div>
                                <div style="position:absolute; top:30px; right:10px; width:8px; height:7px; border:1px solid #888; border-radius:2px; background:#e04040;"></div>
                                <div style="position:absolute; bottom:4px; left:16px; width:20px; height:20px; border:2.5px solid #333; border-radius:50%; background:#888;"></div>
                                <div style="position:absolute; bottom:4px; right:16px; width:20px; height:20px; border:2.5px solid #333; border-radius:50%; background:#888;"></div>
                            </div>
                        </td>
                        <td style="width:50%; text-align:center; padding:4px;">
                            <div class="diagram-label">Côté droit</div>
                            <div style="display:inline-block; position:relative; width:130px; height:72px;">
                                <div style="position:absolute; top:24px; left:6px; width:118px; height:28px; border:2px solid #444; background:#e8e8e8; border-radius:5px;"></div>
                                <div style="position:absolute; top:8px; left:28px; width:56px; height:20px; border:2px solid #444; border-radius:10px 4px 0 0; background:#b8d0e8;"></div>
                                <div style="position:absolute; top:12px; left:32px; width:22px; height:14px; border:1px solid #666; border-radius:5px 3px 0 0; background:#c8ddf0;"></div>
                                <div style="position:absolute; top:12px; left:60px; width:20px; height:14px; border:1px solid #666; border-radius:3px 5px 0 0; background:#c8ddf0;"></div>
                                <div style="position:absolute; top:30px; right:10px; width:10px; height:7px; border:1px solid #888; border-radius:2px; background:#f0e060;"></div>
                                <div style="position:absolute; top:30px; left:10px; width:8px; height:7px; border:1px solid #888; border-radius:2px; background:#e04040;"></div>
                                <div style="position:absolute; bottom:4px; left:16px; width:20px; height:20px; border:2.5px solid #333; border-radius:50%; background:#888;"></div>
                                <div style="position:absolute; bottom:4px; right:16px; width:20px; height:20px; border:2.5px solid #333; border-radius:50%; background:#888;"></div>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="width:14%; vertical-align:top;">
                <div style="font-size:8px; font-weight:bold; color:#0055B8; margin-bottom:2px;">RESTITUTION</div>
                <div style="font-size:7px;">Heure : ________</div>
                <div style="font-size:7px;">Km : ________</div>
                <div style="margin-top:6px;">
                    <div style="font-size:7px; font-weight:bold;">PROPRETÉ INTÉRIEURE</div>
                    <div style="font-size:7px;"><span class="chk"></span> Propre  <span class="chk"></span> Usagé  <span class="chk"></span> Sale</div>
                </div>
                <div style="margin-top:4px;">
                    <div style="font-size:7px; font-weight:bold;">PROPRETÉ EXTÉRIEURE</div>
                    <div style="font-size:7px;"><span class="chk"></span> Propre  <span class="chk"></span> Usagé  <span class="chk"></span> Sale</div>
                </div>
                <div style="margin-top:4px;">
                    <div style="font-size:7px; font-weight:bold;">AUTONOMIE</div>
                    <div style="font-size:7px;"><span class="chk"></span> Plein  <span class="chk"></span> 3/4  <span class="chk"></span> 1/2  <span class="chk"></span> 1/4</div>
                </div>
            </td>
        </tr>
    </table>

    {{-- Legend --}}
    <table style="width:100%; margin-bottom:8px; border:1px solid #ddd;">
        <tr>
            <td style="background:#e8f0fe; font-weight:bold; font-size:7px; padding:3px 6px; width:12%;">Légende :</td>
            <td style="font-size:7px; padding:3px 4px;">O Bosse</td>
            <td style="font-size:7px; padding:3px 4px;">X Rayure</td>
            <td style="font-size:7px; padding:3px 4px;">X Cassé</td>
            <td style="font-size:7px; padding:3px 4px;">■ Peinture</td>
            <td style="font-size:7px; padding:3px 4px;">▲ Rouille</td>
            <td style="font-size:7px; padding:3px 4px;">★ Autre</td>
        </tr>
    </table>

    {{-- Commentaires --}}
    <div class="blue-bar-left" style="margin-top:4px;">Commentaires :</div>
    <div style="border:1px solid #ddd; min-height:35px; padding:4px; font-size:8px; margin-bottom:6px;">
        Aucun commentaire
    </div>

    {{-- Pièces jointes --}}
    <div class="blue-bar" style="margin-top:4px;">Pièces jointes</div>
    <table style="width:100%; margin-top:4px; margin-bottom:6px;">
        <tr>
            <td style="width:50%; text-align:center; padding:6px; border:1px dashed #ccc;">
                <div style="font-size:7px; font-weight:bold; color:#0055B8; margin-bottom:4px;">CIN (Recto)</div>
                @if($client->cin_image_url)
                    <img src="{{ $client->cin_image_url }}" style="max-height:60px; max-width:100%;" />
                @else
                    <div style="height:50px; line-height:50px; color:#999; font-size:8px;">[Photo CIN]</div>
                @endif
            </td>
            <td style="width:50%; text-align:center; padding:6px; border:1px dashed #ccc;">
                <div style="font-size:7px; font-weight:bold; color:#0055B8; margin-bottom:4px;">Permis de Conduire</div>
                @if($client->license_image_url)
                    <img src="{{ $client->license_image_url }}" style="max-height:60px; max-width:100%;" />
                @else
                    <div style="height:50px; line-height:50px; color:#999; font-size:8px;">[Photo Permis]</div>
                @endif
            </td>
        </tr>
    </table>

    {{-- Signatures --}}
    <table style="width:100%; margin-top:6px;">
        <tr>
            <td style="width:25%; text-align:center; padding:0 4px;">
                <div class="sig-label">Le Locataire</div>
                @if($reservation->contract && $reservation->contract->signature_data)
                    <img src="{{ $reservation->contract->signature_data }}" style="max-height:25px;" />
                @endif
                <div class="sig-box"></div>
            </td>
            <td style="width:25%; text-align:center; padding:0 4px;">
                <div class="sig-label">2ème Conducteur</div>
                <div class="sig-box"></div>
            </td>
            <td style="width:25%; text-align:center; padding:0 4px;">
                <div class="sig-label">Le Loueur</div>
                @if($agencyLogo)
                    <img src="{{ $agencyLogo }}" style="max-height:25px;" />
                @endif
                <div class="sig-box"></div>
            </td>
            <td style="width:25%; text-align:center; padding:0 4px;">
                <div class="sig-label">Date et lieu de retour</div>
                <div style="font-size:6.5px; margin-top:2px;">
                    <div>Date et Heure : {{ $endDate->format('d/m/Y H:i') }}</div>
                    <div style="margin-top:2px;">Lieu de retour : {{ $agencyAddress }}</div>
                </div>
                <div class="sig-box"></div>
            </td>
        </tr>
    </table>
</div>

{{-- ═══════════════════════════════════════════════════════════════════
     PAGE 3 — CONDITIONS GÉNÉRALES
     ═══════════════════════════════════════════════════════════════════ --}}
<div class="page">

    <div class="blue-bar">Conditions Générales</div>

    <table style="width:100%; border:1px solid #ccc; margin-top:4px;">
        <tr>
            {{-- French --}}
            <td style="width:50%; vertical-align:top; padding:6px; border-right:1px solid #ccc; font-size:7.5px;">
                <div class="art">
                    <div class="art-title">ARTICLE 1 : But du véhicule - Usage - Interdiction</div>
                    Le Véhicule est loué pour être utilisé exclusivement par le Locataire pour des besoins personnels ou professionnels. Le Locataire s'interdit de :
                    <br><br>
                    a) Sous-louer le Véhicule ou le mettre à disposition d'un tiers non autorisé.<br>
                    b) Utiliser le Véhicule pour des compétitions, des rallies ou des courses.<br>
                    c) Transporter des marchandises ou des matières dangereuses.<br>
                    d) Quitter le territoire marocain sans autorisation écrite préalable.<br>
                    e) Utiliser le Véhicule sous l'influence de drogues, alcool ou tout autre substance altérant les facultés.
                </div>
                <div class="art">
                    <div class="art-title">ARTICLE 2 : Assurance - Accidents</div>
                    Le Véhicule est couvert par une assurance responsabilité civile. En cas d'accident, le Locataire doit :
                    <br><br>
                    a) Immédiatement prévenir la police et obtenir un procès-verbal.<br>
                    b) Avertir le Loueur dans les 24 heures.<br>
                    c) Fournir tous les documents nécessaires au règlement du sinistre.
                    <br><br>
                    <strong>La franchise est de 20% du montant total des dommages</strong> (minimum 2000 MAD).
                </div>
                <div class="art">
                    <div class="art-title">ARTICLE 3 : Location / Paiement / Pénalités</div>
                    Le montant de la location doit être payé intégralement avant la prise en charge du Véhicule.
                    <br><br>
                    a) Pénalité de retard de 2% par jour de retard.<br>
                    b) Le Loueur se réserve le droit de récupérer le Véhicule sans mise en demeure préalable.<br>
                    c) Le dépassement du kilomètre inclus est facturé au tarif de 1,50 MAD/km.
                </div>
                <div class="art">
                    <div class="art-title">ARTICLE 4 : Documents du Véhicule</div>
                    Les documents suivants se trouvent dans le Véhicule :<br>
                    a) Carte grise<br>
                    b) Carte d'assurance<br>
                    c) Attestation de passage au contrôle technique<br>
                    d) Vignette de circulation
                </div>
                <div class="art">
                    <div class="art-title">ARTICLE 5 : Remboursement</div>
                    Le remboursement éventuel sera effectué dans un délai de 10 jours ouvrables suivant la restitution du Véhicule.
                </div>
                <div class="art">
                    <div class="art-title">ARTICLE 6 : Répudiation du Véhicule par le Client</div>
                    En cas de refus de prendre en charge le Véhicule, le client s'engage à restituer le véhicule dans l'état où il a été remis.
                </div>
                <div class="art">
                    <div class="art-title">ARTICLE 7 : Autres Conditions Complémentaires</div>
                    Le non-respect des conditions entraîne la facturation des dommages au tarif du garage agréé le plus proche.
                </div>
                <div class="art">
                    <div class="art-title">ARTICLE 8 : Contraventions</div>
                    Les contraventions routières restent à la charge exclusive du Locataire.
                </div>
                <div class="art">
                    <div class="art-title">ARTICLE 9 : GPS</div>
                    Pour des raisons de sécurité, un GPS peut être installé pour localiser le véhicule en cas de vol.
                </div>

                <table style="width:100%; margin-top:10px;">
                    <tr>
                        <td style="width:50%; text-align:center; padding:0 6px;">
                            <div class="sig-label">Le Locataire</div>
                            @if($reservation->contract && $reservation->contract->signature_data)
                                <img src="{{ $reservation->contract->signature_data }}" style="max-height:25px;" />
                            @endif
                            <div class="sig-box"></div>
                        </td>
                        <td style="width:50%; text-align:center; padding:0 6px;">
                            <div class="sig-label">Le Loueur</div>
                            @if($agencyLogo)
                                <img src="{{ $agencyLogo }}" style="max-height:25px;" />
                            @endif
                            <div class="sig-box"></div>
                        </td>
                    </tr>
                </table>
            </td>

            {{-- Arabic --}}
            <td style="width:50%; vertical-align:top; padding:6px; direction:rtl; text-align:right; font-size:7.5px;">
                <div class="art">
                    <div class="art-title" style="color:#0055B8;">&#x0645;&#x0627;&#x062F;&#x0629; 1 : &#x0627;&#x0644;&#x063A;&#x0631;&#x0636; &#x0645;&#x0646; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629; - &#x0627;&#x0644;&#x0627;&#x0633;&#x062A;&#x062E;&#x062F;&#x0627;&#x0645; - &#x0627;&#x0644;&#x062D;&#x0638;&#x0631;</div>
                    &#x064A;&#x0624;&#x062C;&#x0631; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629; &#x0644;&#x0627;&#x0633;&#x062A;&#x062E;&#x062F;&#x0627;&#x0645;&#x0647;&#x0627; &#x062D;&#x0635;&#x0631;&#x064A;&#x0627;&#x064B; &#x0645;&#x0646; &#x0642;&#x0628;&#x0644; &#x0627;&#x0644;&#x0645;&#x0633;&#x062A;&#x0623;&#x062C;&#x0631; &#x0644;&#x0644;&#x0627;&#x062D;&#x062A;&#x064A;&#x0627;&#x062C;&#x0627;&#x062A; &#x0627;&#x0644;&#x0634;&#x062E;&#x0635;&#x064A;&#x0629; &#x0623;&#x0648; &#x0627;&#x0644;&#x0645;&#x0647;&#x0646;&#x064A;&#x0629;. &#x064A;&#x062A;&#x0645;&#x0646;&#x0639; &#x0627;&#x0644;&#x0645;&#x0633;&#x062A;&#x0623;&#x062C;&#x0631; &#x0645;&#x0646; :
                    <br><br>
                    &#x0623;) &#x0625;&#x0639;&#x0627;&#x062F;&#x0629; &#x062A;&#x0623;&#x062C;&#x064A;&#x0631; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629; &#x0623;&#x0648; &#x0639;&#x0631;&#x0636; &#x062A;&#x062D;&#x062A;&#x0648;&#x0637; &#x0637;&#x0631;&#x0641; &#x063A;&#x064A;&#x0631; &#x0645;&#x0635;&#x0631;&#x062D; &#x0644;&#x0647;.<br>
                    &#x0628;) &#x0627;&#x0633;&#x062A;&#x062E;&#x062F;&#x0627;&#x0645; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629; &#x0641;&#x064A; &#x0627;&#x0644;&#x0645;&#x0633;&#x0627;&#x0628;&#x0642;&#x0627;&#x062A; &#x0623;&#x0648; &#x0627;&#x0644;&#x062A;&#x0631;&#x0627;&#x0642;&#x064A;&#x0627;&#x062A; &#x0623;&#x0648; &#x0627;&#x0644;&#x0633;&#x0628;&#x0627;&#x0642;&#x0627;&#x062A;.<br>
                    &#x062C;) &#x0646;&#x0642;&#x0644; &#x0627;&#x0644;&#x0628;&#x0636;&#x0627;&#x0626;&#x0639; &#x0623;&#x0648; &#x0627;&#x0644;&#x0645;&#x0648;&#x0627;&#x062F; &#x0627;&#x0644;&#x062E;&#x0637;&#x0631;&#x0629;.<br>
                    &#x062F;) &#x0645;&#x063A;&#x0627;&#x062F;&#x0631;&#x0629; &#x0627;&#x0644;&#x062A;&#x0631;&#x0627;&#x0628; &#x0627;&#x0644;&#x0645;&#x063A;&#x0631;&#x0628;&#x064A; &#x062F;&#x0648;&#x0646; &#x062A;&#x0635;&#x0631;&#x064A;&#x062D; &#x0643;&#x062A;&#x0627;&#x0628;&#x064A; &#x0645;&#x0633;&#x0628;&#x0642;.<br>
                    &#x0647;&#x0640;) &#x0627;&#x0633;&#x062A;&#x062E;&#x062F;&#x0627;&#x0645; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629; &#x062A;&#x062D;&#x062A; &#x062A;&#x0623;&#x062B;&#x064A;&#x0631; &#x0627;&#x0644;&#x0645;&#x062E;&#x062F;&#x0631;&#x0627;&#x062A; &#x0623;&#x0648; &#x0627;&#x0644;&#x0643;&#x062D;&#x0648;&#x0644;.
                </div>
                <div class="art">
                    <div class="art-title" style="color:#0055B8;">&#x0645;&#x0627;&#x062F;&#x0629; 2 : &#x0627;&#x0644;&#x062A;&#x0623;&#x0645;&#x064A;&#x0646; - &#x0627;&#x0644;&#x062D;&#x0648;&#x0627;&#x062F;&#x062B;</div>
                    &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629; &#x0645;&#x0634;&#x0645;&#x0648;&#x0644;&#x0629; &#x0628;&#x062A;&#x0623;&#x0645;&#x064A;&#x0646; &#x0645;&#x0633;&#x0624;&#x0648;&#x0644;&#x064A;&#x0629; &#x0627;&#x0644;&#x0645;&#x0633;&#x0624;&#x0648;&#x0644;&#x064A;&#x0629; &#x0627;&#x0644;&#x0639;&#x0627;&#x0645;&#x0629;. &#x0641;&#x064A; &#x062D;&#x0627;&#x0644;&#x0629; &#x0627;&#x0644;&#x062D;&#x0627;&#x062F;&#x062B;:
                    <br><br>
                    &#x0623;) &#x0625;&#x0628;&#x0644;&#x0627;&#x063A; &#x0627;&#x0644;&#x0634;&#x0631;&#x0637;&#x0629; &#x0641;&#x0648;&#x0631;&#x0627;&#x064B; &#x0648;&#x0627;&#x0644;&#x062D;&#x0635;&#x0648;&#x0644; &#x0639;&#x0644;&#x0649; &#x062A;&#x0642;&#x0631;&#x064A;&#x0631;.<br>
                    &#x0628;) &#x0625;&#x062E;&#x0637;&#x0627;&#x0631; &#x0627;&#x0644;&#x0645;&#x0648;&#x0636;&#x0639; &#x062E;&#x0644;&#x0627;&#x0644; 24 &#x0633;&#x0627;&#x0639;&#x0629;.<br>
                    &#x062C;) &#x062A;&#x0642;&#x062F;&#x064A;&#x0645; &#x062C;&#x0645;&#x064A;&#x0639; &#x0627;&#x0644;&#x0648;&#x062B;&#x0627;&#x0626;&#x0642; &#x0627;&#x0644;&#x0636;&#x0631;&#x0648;&#x0631;&#x064A;&#x0629;.
                    <br><br>
                    <strong>&#x0627;&#x0644;&#x0646;&#x0633;&#x0628;&#x0629; &#x0627;&#x0644;&#x0645;&#x062E;&#x0635;&#x0648;&#x0635;&#x0629; &#x0647;&#x064A; 20% &#x0645;&#x0646; &#x0625;&#x062C;&#x0645;&#x0627;&#x0644;&#x064A; &#x0627;&#x0644;&#x0623;&#x0636;&#x0631;&#x0627;&#x0631;</strong> (&#x0627;&#x0644;&#x062D;&#x062F; &#x0627;&#x0644;&#x0623;&#x062F;&#x0646;&#x0649; 2000 &#x062F;&#x0631;&#x0647;&#x0645;).
                </div>
                <div class="art">
                    <div class="art-title" style="color:#0055B8;">&#x0645;&#x0627;&#x062F;&#x0629; 3 : &#x0627;&#x0644;&#x0625;&#x064A;&#x062C;&#x0627;&#x0631; / &#x0627;&#x0644;&#x062F;&#x0641;&#x0639; / &#x0627;&#x0644;&#x063A;&#x0631;&#x0627;&#x0645;&#x0627;&#x062A;</div>
                    &#x064A;&#x062C;&#x0628; &#x062F;&#x0641;&#x0639; &#x0645;&#x0628;&#x0644;&#x063A; &#x0627;&#x0644;&#x0625;&#x064A;&#x062C;&#x0627;&#x0631; &#x0628;&#x0627;&#x0644;&#x0643;&#x0627;&#x0645;&#x0644; &#x0642;&#x0628;&#x0644; &#x0627;&#x0633;&#x062A;&#x0644;&#x0627;&#x0645; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629;.
                    <br><br>
                    &#x0623;) &#x063A;&#x0631;&#x0627;&#x0645;&#x0629; &#x062A;&#x0623;&#x062E;&#x064A;&#x0631; 2% &#x0641;&#x064A; &#x0627;&#x0644;&#x064A;&#x0648;&#x0645;.<br>
                    &#x0628;) &#x064A;&#x062D;&#x062A;&#x0641;&#x0638; &#x0627;&#x0644;&#x0645;&#x0648;&#x0636;&#x0639; &#x0639;&#x0644;&#x0649; &#x0627;&#x0633;&#x062A;&#x0631;&#x062C;&#x0627;&#x0639; &#x0627;&#x0644;&#x0633;&#x064A;&#x0627;&#x0631;&#x0629; &#x0628;&#x062F;&#x0648;&#x0646; &#x0625;&#x0634;&#x0639;&#x0627;&#x0631; &#x0623;&#x0648; &#x0645;&#x0646;&#x0627;&#x0639;&#x0629;.<br>
                    &#x062C;) &#x0627;&#x0644;&#x062A;&#x062C;&#x0627;&#x0648;&#x0632; &#x0639;&#x0646; &#x0627;&#x0644;&#x0643;&#x064A;&#x0644;&#x0648;&#x0645;&#x062A;&#x0631; &#x064A;&#x0648;&#x062C;&#x0628; &#x0628;&#x0641;&#x0636;&#x0644; &#x0628;&#x0633;&#x0639;&#x0631; 1.50 &#x062F;&#x0631;&#x0647;&#x0645;/&#x0643;&#x0645;.
                </div>
                <div class="art">
                    <div class="art-title" style="color:#0055B8;">&#x0645;&#x0627;&#x062F;&#x0629; 4 : &#x0648;&#x062B;&#x0627;&#x0626;&#x0642; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629;</div>
                    &#x0627;&#x0644;&#x0648;&#x062B;&#x0627;&#x0626;&#x0642; &#x0627;&#x0644;&#x062A;&#x0627;&#x0644;&#x064A;&#x0629; &#x0645;&#x0648;&#x062C;&#x0648;&#x062F;&#x0629; &#x062F;&#x0627;&#x062E;&#x0644; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629; :<br>
                    &#x0623;) &#x0627;&#x0644;&#x0628;&#x0637;&#x0627;&#x0642;&#x0629; &#x0627;&#x0644;&#x0631;&#x0645;&#x0627;&#x062F;&#x064A;&#x0629;<br>
                    &#x0628;) &#x0628;&#x0637;&#x0627;&#x0642;&#x0629; &#x0627;&#x0644;&#x062A;&#x0623;&#x0645;&#x064A;&#x0646;<br>
                    &#x062C;) &#x0634;&#x0647;&#x0627;&#x062F;&#x0629; &#x0627;&#x062C;&#x062A;&#x064A;&#x0627;&#x0632; &#x0627;&#x0644;&#x0641;&#x062D;&#x0635; &#x0627;&#x0644;&#x0641;&#x0646;&#x064A;<br>
                    &#x062F;) &#x0645;&#x0644;&#x0635;&#x0642; &#x0627;&#x0644;&#x0633;&#x064A;&#x0631;
                </div>
                <div class="art">
                    <div class="art-title" style="color:#0055B8;">&#x0645;&#x0627;&#x062F;&#x0629; 5 : &#x0627;&#x0644;&#x0627;&#x0633;&#x062A;&#x0631;&#x062C;&#x0627;&#x0639;</div>
                    &#x064A;&#x062A;&#x0645; &#x0627;&#x0644;&#x0627;&#x0633;&#x062A;&#x0631;&#x062C;&#x0627;&#x0639; &#x0623;&#x064A; &#x0645;&#x0628;&#x0644;&#x063A; &#x062E;&#x0644;&#x0627;&#x0644; 10 &#x0623;&#x064A;&#x0627;&#x0645; &#x0639;&#x0645;&#x0644; &#x0645;&#x0646; &#x0625;&#x0639;&#x0627;&#x062F;&#x0629; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629;.
                </div>
                <div class="art">
                    <div class="art-title" style="color:#0055B8;">&#x0645;&#x0627;&#x062F;&#x0629; 6 : &#x0631;&#x0641;&#x0636; &#x0627;&#x0644;&#x0639;&#x0645;&#x064A;&#x0644; &#x0644;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629;</div>
                    &#x0641;&#x064A; &#x062D;&#x0627;&#x0644;&#x0629; &#x0631;&#x0641;&#x0636; &#x0627;&#x0633;&#x062A;&#x0644;&#x0627;&#x0645; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629; &#x062A;&#x0628;&#x0639;&#x0647;&#x062F; &#x0627;&#x0644;&#x0639;&#x0645;&#x064A;&#x0644; &#x0625;&#x0639;&#x0627;&#x062F;&#x0629; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629; &#x0641;&#x064A; &#x0627;&#x0644;&#x062D;&#x0627;&#x0644;&#x0629; &#x0627;&#x0644;&#x062A;&#x064A; &#x062A;&#x0645; &#x062A;&#x0633;&#x0644;&#x064A;&#x0645;&#x0647;&#x0627;.
                </div>
                <div class="art">
                    <div class="art-title" style="color:#0055B8;">&#x0645;&#x0627;&#x062F;&#x0629; 7 : &#x0634;&#x0631;&#x0648;&#x0637; &#x0625;&#x0636;&#x0627;&#x0641;&#x064A;&#x0629;</div>
                    &#x0639;&#x062F;&#x0645; &#x0627;&#x0644;&#x0627;&#x0644;&#x062A;&#x0632;&#x0627;&#x0645; &#x0628;&#x0627;&#x0644;&#x0634;&#x0631;&#x0648;&#x0637; &#x064A;&#x0624;&#x062F;&#x064A; &#x0625;&#x0644;&#x0649; &#x0641;&#x0636;&#x0644; &#x0627;&#x0644;&#x0623;&#x0636;&#x0631;&#x0627;&#x0631; &#x0628;&#x0633;&#x0639;&#x0631; &#x0648;&#x0631;&#x0634;&#x0629; &#x0627;&#x0644;&#x0635;&#x064A;&#x0627;&#x0646;&#x0629; &#x0627;&#x0644;&#x0645;&#x0648;&#x0627;&#x0641;&#x0642;.
                </div>
                <div class="art">
                    <div class="art-title" style="color:#0055B8;">&#x0645;&#x0627;&#x062F;&#x0629; 8 : &#x0627;&#x0644;&#x0645;&#x062E;&#x0627;&#x0644;&#x0641;&#x0627;&#x062A;</div>
                    &#x062A;&#x0628;&#x0642;&#x0649; &#x0627;&#x0644;&#x0645;&#x062E;&#x0627;&#x0644;&#x0641;&#x0627;&#x062A; &#x0627;&#x0644;&#x0645;&#x0631;&#x0648;&#x0631;&#x064A;&#x0629; &#x0639;&#x0644;&#x0649; &#x0639;&#x0627;&#x062A;&#x0642; &#x0627;&#x0644;&#x0645;&#x0633;&#x062A;&#x0623;&#x062C;&#x0631;.
                </div>
                <div class="art">
                    <div class="art-title" style="color:#0055B8;">&#x0645;&#x0627;&#x062F;&#x0629; 9 : &#x0627;&#x0644;&#x0645;&#x0639;&#x0631;&#x0636;</div>
                    &#x0644;&#x0623;&#x0633;&#x0628;&#x0627;&#x0628; &#x0623;&#x0645;&#x0646;&#x064A;&#x0629; &#x064A;&#x0645;&#x0643;&#x0646; &#x062A;&#x062B;&#x0628;&#x064A;&#x062A; &#x062C;&#x0647;&#x0627;&#x0632; GPS &#x0644;&#x0645;&#x0631;&#x0627;&#x0642;&#x0628;&#x0629; &#x0627;&#x0644;&#x0645;&#x0631;&#x0643;&#x0628;&#x0629; &#x0641;&#x064A; &#x062D;&#x0627;&#x0644;&#x0629; &#x0627;&#x0644;&#x0633;&#x0631;&#x0642;&#x0629;.
                </div>

                <table style="width:100%; margin-top:10px;">
                    <tr>
                        <td style="width:50%; text-align:center; padding:0 6px;">
                            <div class="sig-label">&#x0627;&#x0644;&#x0645;&#x0648;&#x0636;&#x0639;</div>
                            @if($agencyLogo)
                                <img src="{{ $agencyLogo }}" style="max-height:25px;" />
                            @endif
                            <div class="sig-box"></div>
                        </td>
                        <td style="width:50%; text-align:center; padding:0 6px;">
                            <div class="sig-label">&#x0627;&#x0644;&#x0639;&#x0645;&#x064A;&#x0644;</div>
                            @if($reservation->contract && $reservation->contract->signature_data)
                                <img src="{{ $reservation->contract->signature_data }}" style="max-height:25px;" />
                            @endif
                            <div class="sig-box"></div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <div style="text-align:center; font-size:6.5px; color:#888; margin-top:8px;">
        {{ $agencyName }} — {{ $agencyAddress }} — {{ $agencyPhone }}<br>
        Conditions Générales — N° {{ $contractRef }}
    </div>
</div>

{{-- ═══════════════════════════════════════════════════════════════════
     PAGE 4 — CONTRAT DE LOCATION
     ═══════════════════════════════════════════════════════════════════ --}}
<div class="page">

    {{-- Contract Header --}}
    <table style="width:100%; margin-bottom:8px;">
        <tr>
            <td style="width:25%; text-align:center;">
                @if($agencyLogo)
                    <img src="{{ $agencyLogo }}" style="max-height:40px;" />
                @endif
            </td>
            <td style="width:50%; text-align:center;">
                <div style="font-size:11px; font-weight:bold; color:#0055B8;">Contrat N° {{ $contractRef }}</div>
                <div style="font-size:8px; color:#555;">{{ $agencyName }}</div>
            </td>
            <td style="width:25%; text-align:right; font-size:8px;">
                <div class="bold">{{ $agencyName }}</div>
                <div>Tél : {{ $agencyPhone }}</div>
            </td>
        </tr>
    </table>

    {{-- Info Rows --}}
    <div class="blue-bar" style="text-align:left; font-size:8px;">Informations</div>
    <table class="info-tbl" style="width:100%; margin-bottom:6px;">
        <tr>
            <td class="lbl" style="width:20%;">Fait le :</td>
            <td class="val" style="width:30%;">{{ $startDate->format('d/m/Y à H:i') }}</td>
            <td class="lbl" style="width:20%;">Marque :</td>
            <td class="val" style="width:30%;">{{ $vehicle->brand ?? '' }} {{ $vehicle->model ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">Lieu de livraison :</td>
            <td class="val">{{ $agencyAddress }}</td>
            <td class="lbl">Immatriculation :</td>
            <td class="val">{{ $vehicle->plate ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">Lieu de reprise :</td>
            <td class="val">{{ $agencyAddress }}</td>
            <td class="lbl">Agent Commercial :</td>
            <td class="val">{{ $agentName ?? '' }}</td>
        </tr>
    </table>

    {{-- DURÉE DE LOCATION --}}
    <div class="blue-bar" style="text-align:left; font-size:8px;">Durée de Location</div>
    <table class="info-tbl" style="width:100%; margin-bottom:6px;">
        <tr>
            <td class="lbl" style="width:25%;">Date et Heure Départ</td>
            <td class="val" style="width:25%;">{{ $startDate->format('d/m/Y à H:i') }}</td>
            <td class="lbl" style="width:25%;">Date et Heure Retour</td>
            <td class="val" style="width:25%;">{{ $endDate->format('d/m/Y à H:i') }}</td>
        </tr>
        <tr>
            <td class="lbl">Durée de location</td>
            <td class="val bold">{{ $days }} jour(s)</td>
            <td class="lbl">Prolongation</td>
            <td class="val"><span class="field-line"></span> jours</td>
        </tr>
    </table>

    {{-- LE LOCATAIRE --}}
    <div class="blue-bar" style="text-align:left; font-size:8px;">Le Locataire</div>
    <table class="info-tbl" style="width:100%; margin-bottom:6px;">
        <tr>
            <td class="lbl" style="width:25%;">Nom</td>
            <td class="val" style="width:25%;">{{ strtoupper($nom) }}</td>
            <td class="lbl" style="width:25%;">Prénom</td>
            <td class="val" style="width:25%;">{{ $prenom }}</td>
        </tr>
        <tr>
            <td class="lbl">Date de naissance</td>
            <td class="val">{{ $client->birth_date ?? '__/__/____' }}</td>
            <td class="lbl">Adresse</td>
            <td class="val">{{ $client->address ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">Tél</td>
            <td class="val">{{ $client->phone ?? '' }}</td>
            <td class="lbl">Nationalité</td>
            <td class="val">{{ $client->nationality ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">Permis N°</td>
            <td class="val">{{ $client->license_number ?? '' }}</td>
            <td class="lbl">Permis Valable Jusqu'au</td>
            <td class="val">{{ $client->license_expiry ?? '' }}</td>
        </tr>
        <tr>
            <td class="lbl">CIN N°</td>
            <td class="val">{{ $client->cin ?? '' }}</td>
            <td class="lbl">Valable Jusqu'au</td>
            <td class="val">{{ $client->cin_expiry ?? '' }}</td>
        </tr>
    </table>

    {{-- 2ème CONDUCTEUR --}}
    <div class="blue-bar" style="text-align:left; font-size:8px;">2ème Conducteur (Facultatif)</div>
    <table class="info-tbl" style="width:100%; margin-bottom:6px;">
        <tr>
            <td class="lbl" style="width:25%;">Nom</td>
            <td class="val" style="width:25%;"><span class="field-line"></span></td>
            <td class="lbl" style="width:25%;">Prénom</td>
            <td class="val" style="width:25%;"><span class="field-line"></span></td>
        </tr>
        <tr>
            <td class="lbl">Date de naissance</td>
            <td class="val">__/__/____</td>
            <td class="lbl">Permis N°</td>
            <td class="val"><span class="field-line"></span></td>
        </tr>
        <tr>
            <td class="lbl">Permis Valable Jusqu'au</td>
            <td class="val">__/__/____</td>
            <td class="lbl">CIN N°</td>
            <td class="val"><span class="field-line"></span></td>
        </tr>
    </table>

    {{-- PAPIERS DE VÉHICULE --}}
    <div class="blue-bar" style="text-align:left; font-size:8px;">Papiers de Véhicule</div>
    <table class="info-tbl" style="width:100%; margin-bottom:6px;">
        <tr>
            <td style="padding:4px; width:50%;"><span class="chk on"></span> Carte grise</td>
            <td style="padding:4px; width:50%;"><span class="chk on"></span> Visite Technique</td>
        </tr>
        <tr>
            <td style="padding:4px;"><span class="chk on"></span> Assurance</td>
            <td style="padding:4px;"><span class="chk on"></span> Attestation de paiement de vignette</td>
        </tr>
        <tr>
            <td style="padding:4px;"><span class="chk on"></span> Autorisation de circulation</td>
            <td style="padding:4px;"></td>
        </tr>
    </table>

    {{-- FRANCHISE --}}
    <div class="blue-bar" style="text-align:left; font-size:8px;">Franchise</div>
    <table class="info-tbl" style="width:100%; margin-bottom:6px;">
        <tr>
            <td class="lbl" style="width:50%;">Assurance "Tous risques"</td>
            <td class="val" style="width:50%;"><span class="chk"></span> <span class="field-line" style="min-width:60px;"></span></td>
        </tr>
        <tr>
            <td class="lbl">Franchise</td>
            <td class="val bold">{{ number_format($reservation->deposit_amount ?? 0, 2) }} DH</td>
        </tr>
    </table>

    {{-- MONTANT --}}
    <div class="blue-bar" style="text-align:left; font-size:8px;">Montant</div>
    <table class="info-tbl" style="width:100%; margin-bottom:6px;">
        <tr>
            <td class="lbl" style="width:50%; font-weight:bold;">TOTAL GENERAL</td>
            <td class="val" style="width:50%; font-weight:bold;">{{ number_format($reservation->total_price, 2) }} DH</td>
        </tr>
        <tr>
            <td class="lbl">MONTANT PAYÉ</td>
            <td class="val">{{ number_format($reservation->deposit_amount ?? 0, 2) }} DH</td>
        </tr>
        <tr>
            <td class="lbl" style="font-weight:bold;">LE RESTE À PAYER</td>
            <td class="val bold">{{ number_format(($reservation->total_price ?? 0) - ($reservation->deposit_amount ?? 0), 2) }} DH</td>
        </tr>
    </table>

    {{-- MODE DE RÈGLEMENT --}}
    <div class="blue-bar" style="text-align:left; font-size:8px;">Mode de Règlement</div>
    <table class="info-tbl" style="width:100%; margin-bottom:8px;">
        <tr>
            <td style="padding:4px; width:25%;"><span class="chk {{ ($reservation->payment_method === 'cash' || $reservation->payment_method === 'on_site') ? 'on' : '' }}"></span> Espèce</td>
            <td style="padding:4px; width:25%;"><span class="chk {{ $reservation->payment_method === 'cheque' ? 'on' : '' }}"></span> Chèque</td>
            <td style="padding:4px; width:25%;"><span class="chk {{ ($reservation->payment_method === 'stripe' || $reservation->payment_method === 'cmi') ? 'on' : '' }}"></span> Carte bancaire</td>
            <td style="padding:4px; width:25%;"><span class="chk {{ $reservation->payment_method === 'transfer' ? 'on' : '' }}"></span> Virement</td>
        </tr>
    </table>

    {{-- Signatures --}}
    <table style="width:100%; margin-top:8px;">
        <tr>
            <td style="width:25%; text-align:center; padding:0 4px;">
                <div class="sig-label">Le Locataire</div>
                @if($reservation->contract && $reservation->contract->signature_data)
                    <img src="{{ $reservation->contract->signature_data }}" style="max-height:25px;" />
                @endif
                <div class="sig-box"></div>
            </td>
            <td style="width:25%; text-align:center; padding:0 4px;">
                <div class="sig-label">2ème Conducteur</div>
                <div class="sig-box"></div>
            </td>
            <td style="width:25%; text-align:center; padding:0 4px;">
                <div class="sig-label">Le Loueur</div>
                @if($agencyLogo)
                    <img src="{{ $agencyLogo }}" style="max-height:25px;" />
                @endif
                <div class="sig-box"></div>
            </td>
            <td style="width:25%; text-align:center; padding:0 4px;">
                <div class="sig-label">Date et lieu de retour</div>
                <div style="font-size:6.5px; margin-top:2px;">
                    <div>Date et Heure : {{ $endDate->format('d/m/Y H:i') }}</div>
                    <div style="margin-top:2px;">Lieu de retour : {{ $agencyAddress }}</div>
                </div>
                <div class="sig-box"></div>
            </td>
        </tr>
    </table>

    {{-- Footer --}}
    <div style="text-align:center; font-size:7px; color:#888; margin-top:10px; padding-top:4px; border-top:1px solid #ccc;">
        {{ $agencyName }} — {{ $agencyAddress }}<br>
        Tél : {{ $agencyPhone }} — {{ $agencyEmail }} — RC : {{ $agencyRC }}
    </div>
</div>

</body>
</html>
