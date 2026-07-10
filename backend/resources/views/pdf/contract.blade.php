<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Contrat de Location — {{ $cr }}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'DejaVu Sans',sans-serif; font-size:9pt; color:#1a1a1a; line-height:1.4; }
  .page { page-break-before:always; }
  .page:first-child { page-break-before:auto; }
  table { border-collapse:collapse; width:100%; }
  td, th { vertical-align:top; }
  .hdr { text-align:center; margin-bottom:8px; }
  .hdr h1 { font-size:14pt; font-weight:bold; text-transform:uppercase; letter-spacing:1px; }
  .hdr h2 { font-size:11pt; font-weight:normal; }
  .section-title { font-size:11pt; font-weight:bold; text-transform:uppercase; padding:5px 0; border-bottom:2px solid #003366; margin:10px 0 6px 0; color:#003366; }
  .small { font-size:8pt; color:#555; }
  .tbl-bordered td, .tbl-bordered th { border:1px solid #999; padding:4px 6px; }
  .ar-cell { direction:rtl; text-align:right; }
  .center { text-align:center; }
  .bold { font-weight:bold; }
  .underline { text-decoration:underline; }
  .mb2 { margin-bottom:2px; }
  .mt4 { margin-top:4px; }
  .mt8 { margin-top:8px; }
  .sig-box { border-bottom:1px solid #333; width:100%; height:40px; }
  .checkbox { display:inline-block; width:10px; height:10px; border:1.5px solid #333; vertical-align:middle; margin-right:3px; }
  .checkbox.checked { background:#003366; }
  .field-line { border-bottom:1px solid #333; display:inline-block; min-width:150px; height:14px; }
  .art-title { font-weight:bold; margin-bottom:2px; }
  .art { margin-bottom:6px; font-size:8pt; text-align:justify; }
  .rounded-box { border:1px solid #333; border-radius:6px; }
  .wheel { border:2px solid #333; border-radius:50%; background:#ccc; display:inline-block; }
  .car-body { border:1.5px solid #333; background:#f5f5f5; display:inline-block; }
</style>
</head>
<body>

{{-- ============================================================ --}}
{{-- PAGE 1 — DÉCLARATION PRÉALABLE --}}
{{-- ============================================================ --}}
<div class="page">

  {{-- Header --}}
  <div class="hdr">
    <h1>ROYAUME DU MAROC</h1>
    <div style="font-size:8pt;">Ministère du Tourisme, de l'Artisanat, de l'Économie Sociale et de l'Économie Collaborative</div>
    <div style="font-size:8pt;">Direction Générale de l'Artisanat</div>
    <div style="margin:6px 0; font-size:13pt; font-weight:bold; direction:rtl; text-align:center;">&#x0633;&#x0644;&#x0641; &#x0631;&#x064A;&#x0646;&#x062A; &#x0627;&#x0644;&#x0643;&#x0627;&#x0631;</div>
    <div style="font-size:8pt;">(à renseigner par le Locataire résidant au Maroc)</div>
    <div style="margin-top:4px; font-size:12pt; font-weight:bold;">Déclaration Préalable de location de Voiture Sans Chauffeur</div>
  </div>

  {{-- Main info table --}}
  <table class="tbl-bordered" style="margin-top:8px;">
    <thead>
      <tr style="background:#e8eef5;">
        <th style="width:22%;" class="bold">Libellé</th>
        <th style="width:28%;">Renseignement</th>
        <th style="width:22%;" class="bold ar-cell">Label</th>
        <th style="width:28%;" class="ar-cell">Indication</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="bold">Je Soussigné(e)</td>
        <td>Mme / M.</td>
        <td class="bold ar-cell">&#x0623;&#x0646;&#x0627; &#x0627;&#x0644;&#x0645;&#x0648;&#x0642;&#x0639;</td>
        <td class="ar-cell">&#x0627;&#x0644;&#x0633;&#x064A;&#x062F; / &#x0627;&#x0644;&#x0633;&#x064A;&#x062F;&#x0629;</td>
      </tr>
      <tr>
        <td class="bold">Nom</td>
        <td>{{ $nom ?? '' }}</td>
        <td class="bold ar-cell">&#x0627;&#x0644;&#x0644;&#x0642;&#x0628;</td>
        <td class="ar-cell">{{ $nom ?? '' }}</td>
      </tr>
      <tr>
        <td class="bold">Prénom</td>
        <td>{{ $prenom ?? '' }}</td>
        <td class="bold ar-cell">&#x0627;&#x0644;&#x0627;&#x0633;&#x0645; &#x0627;&#x0644;&#x0623;&#x0648;&#x0644;</td>
        <td class="ar-cell">{{ $prenom ?? '' }}</td>
      </tr>
      <tr>
        <td class="bold">N° CIN</td>
        <td>{{ $client->cin ?? '' }}</td>
        <td class="bold ar-cell">&#x0631;&#x0642;&#x0645; &#x0627;&#x0644;&#x0647;&#x0648;&#x064A;&#x0629;</td>
        <td class="ar-cell">{{ $client->cin ?? '' }}</td>
      </tr>
      <tr>
        <td class="bold">N° Permis</td>
        <td>{{ $client->driver_license ?? '' }}</td>
        <td class="bold ar-cell">&#x0631;&#x0642;&#x0645; &#x0627;&#x0644;&#x0633;&#x064A;&#x0627;&#x0642;&#x0629;</td>
        <td class="ar-cell">{{ $client->driver_license ?? '' }}</td>
      </tr>
      <tr>
        <td class="bold">Validité</td>
        <td>{{ $client->license_expiry ? \Carbon\Carbon::parse($client->license_expiry)->format('d/m/Y') : '' }}</td>
        <td class="bold ar-cell">&#x0627;&#x0644;&#x0635;&#x0644;&#x0627;&#x062D;&#x064A;&#x0629;</td>
        <td class="ar-cell">{{ $client->license_expiry ? \Carbon\Carbon::parse($client->license_expiry)->format('d/m/Y') : '' }}</td>
      </tr>
      <tr>
        <td class="bold">Adresse</td>
        <td>{{ $client->address ?? '' }}</td>
        <td class="bold ar-cell">&#x0627;&#x0644;&#x0639;&#x0646;&#x0648;&#x0627;&#x0646;</td>
        <td class="ar-cell">{{ $client->address ?? '' }}</td>
      </tr>
      <tr>
        <td class="bold">Ville</td>
        <td>{{ $client->city ?? '' }}</td>
        <td class="bold ar-cell">&#x0627;&#x0644;&#x0645;&#x062F;&#x064A;&#x0646;&#x0629;</td>
        <td class="ar-cell">{{ $client->city ?? '' }}</td>
      </tr>
      <tr>
        <td class="bold">Code Postal</td>
        <td>{{ $client->postal_code ?? '' }}</td>
        <td class="bold ar-cell">&#x0631;&#x0642;&#x0645; &#x0627;&#x0644;&#x0628;&#x0631;&#x064A;&#x062F;</td>
        <td class="ar-cell">{{ $client->postal_code ?? '' }}</td>
      </tr>
      <tr>
        <td class="bold">GSM</td>
        <td>{{ $client->phone ?? '' }}</td>
        <td class="bold ar-cell">&#x0627;&#x0644;&#x0647;&#x0627;&#x062A;&#x0641;</td>
        <td class="ar-cell">{{ $client->phone ?? '' }}</td>
      </tr>
      <tr>
        <td class="bold">Email</td>
        <td>{{ $client->email ?? '' }}</td>
        <td class="bold ar-cell">&#x0627;&#x0644;&#x0628;&#x0631;&#x064A;&#x062F; &#x0627;&#x0644;&#x0625;&#x0644;&#x0643;&#x062A;&#x0631;&#x0648;&#x0646;&#x064A;</td>
        <td class="ar-cell">{{ $client->email ?? '' }}</td>
      </tr>
    </tbody>
  </table>

  {{-- Véhicule déclaré --}}
  <div class="section-title mt8">Véhicule Déclaré</div>
  <table class="tbl-bordered">
    <tr>
      <td class="bold" style="width:25%;">Immatriculation</td>
      <td style="width:25%;">{{ $vehicle->registration ?? '' }}</td>
      <td class="bold ar-cell" style="width:25%;">&#x0631;&#x0642;&#x0645; &#x0627;&#x0644;&#x062A;&#x0633;&#x062C;&#x064A;&#x0644;</td>
      <td class="ar-cell" style="width:25%;">{{ $vehicle->registration ?? '' }}</td>
    </tr>
    <tr>
      <td class="bold">Agence</td>
      <td>{{ $aName }}</td>
      <td class="bold ar-cell">&#x0627;&#x0644;&#x0645;&#x0648;&#x0636;&#x0639;</td>
      <td class="ar-cell">{{ $aName }}</td>
    </tr>
  </table>

  {{-- Période de location --}}
  <div class="section-title mt8">Période de Location</div>
  <table class="tbl-bordered">
    <thead>
      <tr style="background:#e8eef5;">
        <th class="bold" style="width:25%;">Période</th>
        <th class="bold" style="width:25%;">Date &amp; Heure</th>
        <th class="bold ar-cell" style="width:25%;">&#x0627;&#x0644;&#x0641;&#x062A;&#x0631;&#x0629;</th>
        <th class="bold ar-cell" style="width:25%;">&#x0627;&#x0644;&#x062A;&#x0627;&#x0631;&#x064A;&#x062E; &#x0648;&#x0627;&#x0644;&#x0648;&#x0642;&#x062A;</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="bold">Prise en charge</td>
        <td>{{ $sd->format('d/m/Y') }} à {{ $sd->format('H:i') }}</td>
        <td class="bold ar-cell">&#x0627;&#x0644;&#x062A;&#x0633;&#x0644;&#x064A;&#x0645;</td>
        <td class="ar-cell">{{ $sd->format('d/m/Y') }} &#x0639;&#x0646;&#x062F; {{ $sd->format('H:i') }}</td>
      </tr>
      <tr>
        <td class="bold">Restitution</td>
        <td>{{ $ed->format('d/m/Y') }} à {{ $ed->format('H:i') }}</td>
        <td class="bold ar-cell">&#x0627;&#x0644;&#x0625;&#x0639;&#x0627;&#x062F;&#x0629;</td>
        <td class="ar-cell">{{ $ed->format('d/m/Y') }} &#x0639;&#x0646;&#x062F; {{ $ed->format('H:i') }}</td>
      </tr>
      <tr>
        <td class="bold">Durée</td>
        <td>{{ $days }} jour(s)</td>
        <td class="bold ar-cell">&#x0627;&#x0644;&#x0645;&#x062F;&#x0629;</td>
        <td class="ar-cell">{{ $days }} &#x064A;&#x0648;&#x0645;</td>
      </tr>
    </tbody>
  </table>

  {{-- Fait à / Le --}}
  <table style="margin-top:14px;">
    <tr>
      <td style="width:60%;">Fait à <span class="field-line" style="min-width:120px;">{{ $client->city ?? '_______________' }}</span></td>
      <td style="width:40%; text-align:right;">Le <span class="field-line" style="min-width:100px;">{{ $sd->format('d/m/Y') }}</span></td>
    </tr>
  </table>

  {{-- Signatures --}}
  <table style="margin-top:20px;">
    <tr>
      <td style="width:33%; text-align:center;">
        <div class="bold mb2">L'Agence</div>
        <div style="text-align:center; margin-bottom:4px;">
          @if($aLogo)
            <img src="{{ $aLogo }}" style="max-height:30px;" />
          @endif
        </div>
        <div class="sig-box"></div>
        <div class="small center mt4">Signature &amp; Cachet</div>
      </td>
      <td style="width:34%; text-align:center;">
        <div class="bold mb2">&nbsp;</div>
        <div class="sig-box" style="margin-top:34px;"></div>
      </td>
      <td style="width:33%; text-align:center;">
        <div class="bold mb2">Le Client</div>
        @if(!empty($client->signature))
          <img src="{{ $client->signature }}" style="max-height:30px;" />
        @endif
        <div class="sig-box"></div>
        <div class="small center mt4">Signature précédée de la mention « Lu et approuvé »</div>
      </td>
    </tr>
  </table>

</div>

{{-- ============================================================ --}}
{{-- PAGE 2 — ÉTAT DU VÉHICULE --}}
{{-- ============================================================ --}}
<div class="page">

  <div class="hdr">
    <div style="font-size:12pt; font-weight:bold; direction:rtl; text-align:center;">&#x0627;&#x0644;&#x062D;&#x0627;&#x0644;&#x0629; &#x0627;&#x0644;&#x0648;&#x0636;&#x0627;&#x0621;&#x064A;&#x0629;</div>
    <div style="font-size:14pt; font-weight:bold;">État du Véhicule</div>
    <div style="font-size:8pt; color:#555; margin-top:2px;">
      Constat contradictoire lors de la prise en charge et restitution du véhicule loué.
    </div>
  </div>

  {{-- PRISE EN CHARGE / RESTITUTION columns --}}
  <table class="tbl-bordered" style="margin-top:8px;">
    <thead>
      <tr style="background:#003366; color:#fff;">
        <th style="width:50%; text-align:center;">PRISE EN CHARGE</th>
        <th style="width:50%; text-align:center;">RESTITUTION</th>
      </tr>
    </thead>
    <tbody>
      {{-- Heure / Km --}}
      <tr>
        <td style="padding:4px;">
          <table style="width:100%;">
            <tr>
              <td style="width:50%;">Heure :</td>
              <td style="width:50%;"><span class="field-line" style="min-width:60px;">{{ $sd->format('H:i') }}</span></td>
            </tr>
            <tr>
              <td>Km :</td>
              <td><span class="field-line" style="min-width:60px;">{{ $reservation->start_km ?? '________' }}</span></td>
            </tr>
          </table>
        </td>
        <td style="padding:4px;">
          <table style="width:100%;">
            <tr>
              <td style="width:50%;">Heure :</td>
              <td style="width:50%;"><span class="field-line" style="min-width:60px;">{{ $ed->format('H:i') }}</span></td>
            </tr>
            <tr>
              <td>Km :</td>
              <td><span class="field-line" style="min-width:60px;">{{ $reservation->end_km ?? '________' }}</span></td>
            </tr>
          </table>
        </td>
      </tr>
      {{-- Propreté intérieure --}}
      <tr>
        <td style="padding:4px;">
          <div class="bold">PROPRETÉ INTÉRIEURE</div>
          <div style="margin-top:3px;">
            <span class="checkbox checked"></span> Propre &nbsp;&nbsp;
            <span class="checkbox"></span> Usagé &nbsp;&nbsp;
            <span class="checkbox"></span> Sale
          </div>
        </td>
        <td style="padding:4px;">
          <div class="bold">PROPRETÉ INTÉRIEURE</div>
          <div style="margin-top:3px;">
            <span class="checkbox"></span> Propre &nbsp;&nbsp;
            <span class="checkbox"></span> Usagé &nbsp;&nbsp;
            <span class="checkbox"></span> Sale
          </div>
        </td>
      </tr>
      {{-- Propreté extérieure --}}
      <tr>
        <td style="padding:4px;">
          <div class="bold">PROPRETÉ EXTÉRIEURE</div>
          <div style="margin-top:3px;">
            <span class="checkbox checked"></span> Propre &nbsp;&nbsp;
            <span class="checkbox"></span> Usagé &nbsp;&nbsp;
            <span class="checkbox"></span> Sale
          </div>
        </td>
        <td style="padding:4px;">
          <div class="bold">PROPRETÉ EXTÉRIEURE</div>
          <div style="margin-top:3px;">
            <span class="checkbox"></span> Propre &nbsp;&nbsp;
            <span class="checkbox"></span> Usagé &nbsp;&nbsp;
            <span class="checkbox"></span> Sale
          </div>
        </td>
      </tr>
      {{-- Autonomie --}}
      <tr>
        <td style="padding:4px;">
          <div class="bold">AUTONOMIE</div>
          <div style="margin-top:3px;">
            <span class="checkbox checked"></span> Plein &nbsp;&nbsp;
            <span class="checkbox"></span> 3/4 &nbsp;&nbsp;
            <span class="checkbox"></span> 1/2 &nbsp;&nbsp;
            <span class="checkbox"></span> 1/4
          </div>
        </td>
        <td style="padding:4px;">
          <div class="bold">AUTONOMIE</div>
          <div style="margin-top:3px;">
            <span class="checkbox"></span> Plein &nbsp;&nbsp;
            <span class="checkbox"></span> 3/4 &nbsp;&nbsp;
            <span class="checkbox"></span> 1/2 &nbsp;&nbsp;
            <span class="checkbox"></span> 1/4
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  {{-- VEHICLE DIAGRAMS --}}
  <div class="section-title mt8">Schéma du Véhicule</div>
  <table style="width:100%; margin-top:4px;">
    <tr>
      {{-- Vue de face --}}
      <td style="width:25%; text-align:center; padding:6px;">
        <div class="bold small mb2">Vue de face</div>
        <div style="display:inline-block; position:relative; width:100px; height:80px;">
          <div class="car-body" style="width:80px; height:40px; position:absolute; top:12px; left:10px; border-radius:8px 8px 2px 2px;"></div>
          <div style="position:absolute; top:18px; left:18px; width:64px; height:22px; border:1px solid #999; border-radius:4px 4px 0 0; background:#d0e0f0;"></div>
          <div class="wheel" style="width:18px; height:18px; position:absolute; bottom:2px; left:6px;"></div>
          <div class="wheel" style="width:18px; height:18px; position:absolute; bottom:2px; right:6px;"></div>
        </div>
      </td>
      {{-- Vue arrière --}}
      <td style="width:25%; text-align:center; padding:6px;">
        <div class="bold small mb2">Vue arrière</div>
        <div style="display:inline-block; position:relative; width:100px; height:80px;">
          <div class="car-body" style="width:80px; height:40px; position:absolute; top:12px; left:10px; border-radius:2px 2px 8px 8px;"></div>
          <div style="position:absolute; top:18px; left:18px; width:64px; height:22px; border:1px solid #999; border-radius:0 0 4px 4px; background:#d0e0f0;"></div>
          <div class="wheel" style="width:18px; height:18px; position:absolute; bottom:2px; left:6px;"></div>
          <div class="wheel" style="width:18px; height:18px; position:absolute; bottom:2px; right:6px;"></div>
        </div>
      </td>
      {{-- Côté gauche --}}
      <td style="width:25%; text-align:center; padding:6px;">
        <div class="bold small mb2">Côté gauche</div>
        <div style="display:inline-block; position:relative; width:110px; height:70px;">
          <div class="car-body" style="width:100px; height:30px; position:absolute; top:22px; left:5px; border-radius:4px;"></div>
          <div style="position:absolute; top:8px; left:40px; width:50px; height:20px; border:1px solid #999; border-radius:2px 8px 0 0; background:#d0e0f0; transform:skewX(-15deg);"></div>
          <div class="wheel" style="width:16px; height:16px; position:absolute; bottom:4px; left:14px;"></div>
          <div class="wheel" style="width:16px; height:16px; position:absolute; bottom:4px; right:14px;"></div>
        </div>
      </td>
      {{-- Côté droit --}}
      <td style="width:25%; text-align:center; padding:6px;">
        <div class="bold small mb2">Côté droit</div>
        <div style="display:inline-block; position:relative; width:110px; height:70px;">
          <div class="car-body" style="width:100px; height:30px; position:absolute; top:22px; left:5px; border-radius:4px;"></div>
          <div style="position:absolute; top:8px; left:20px; width:50px; height:20px; border:1px solid #999; border-radius:8px 2px 0 0; background:#d0e0f0; transform:skewX(15deg);"></div>
          <div class="wheel" style="width:16px; height:16px; position:absolute; bottom:4px; left:14px;"></div>
          <div class="wheel" style="width:16px; height:16px; position:absolute; bottom:4px; right:14px;"></div>
        </div>
      </td>
    </tr>
  </table>

  {{-- Legend --}}
  <table style="margin-top:4px; width:100%;">
    <tr>
      <td style="text-align:center; font-size:7.5pt;">
        <span style="font-size:12pt; vertical-align:middle;">&#x2661;</span> Bosse &nbsp;&nbsp;
        <span style="font-size:9pt; vertical-align:middle;">&#x2500;</span> Rayure &nbsp;&nbsp;
        <span style="font-size:9pt; vertical-align:middle;">&#x2717;</span> Cassé &nbsp;&nbsp;
        <span style="font-size:9pt; vertical-align:middle;">&#x25CF;</span> Peinture &nbsp;&nbsp;
        <span style="font-size:9pt; vertical-align:middle;">&#x2736;</span> Rouille &nbsp;&nbsp;
        <span style="font-size:9pt; vertical-align:middle;">&#x270E;</span> Autre
      </td>
    </tr>
  </table>

  {{-- Comments --}}
  <div class="section-title mt8">Observations</div>
  <div style="border:1px solid #999; min-height:50px; padding:4px;">
    &nbsp;
  </div>

  {{-- Pièces jointes --}}
  <div class="section-title mt8">Pièces Jointes</div>
  <table style="width:100%;">
    <tr>
      <td style="width:50%; text-align:center; padding:6px;">
        <div class="small bold mb2">CIN (Recto)</div>
        <div style="border:1px dashed #999; height:60px; text-align:center; line-height:60px; color:#999;">
          [Photo CIN]
        </div>
      </td>
      <td style="width:50%; text-align:center; padding:6px;">
        <div class="small bold mb2">Permis de Conduire</div>
        <div style="border:1px dashed #999; height:60px; text-align:center; line-height:60px; color:#999;">
          [Photo Permis]
        </div>
      </td>
    </tr>
  </table>

  {{-- Signatures --}}
  <table style="margin-top:14px; width:100%;">
    <tr>
      <td style="width:25%; text-align:center;">
        <div class="bold small mb2">Locataire</div>
        <div class="sig-box"></div>
      </td>
      <td style="width:25%; text-align:center;">
        <div class="bold small mb2">2ème Conducteur</div>
        <div class="sig-box"></div>
      </td>
      <td style="width:25%; text-align:center;">
        <div class="bold small mb2">Loueur</div>
        <div class="sig-box"></div>
      </td>
      <td style="width:25%; text-align:center;">
        <div class="bold small mb2">Date / Lieu retour</div>
        <div class="sig-box"></div>
        <div class="small center">Le : ___/___/______ à ________</div>
      </td>
    </tr>
  </table>

</div>

{{-- ============================================================ --}}
{{-- PAGE 3 — CONDITIONS GÉNÉRALES --}}
{{-- ============================================================ --}}
<div class="page">

  <div class="section-title">Conditions Générales</div>

  <table style="width:100%; border:1px solid #999;">
    <tr>
      {{-- French column --}}
      <td style="width:50%; vertical-align:top; padding:8px; border-right:1px solid #999; font-size:8pt;">

        <div class="art">
          <span class="art-title">ARTICLE 1 — USAGE</span><br/>
          Le véhicule loué ne peut être utilisé que par le Locataire ou le 2ème Conducteur désigné. Il est strictement interdit de le mettre à disposition d'un tiers non déclaré, de l'utiliser pour des courses de taxi, le transport de marchandises, ou toute activité illicite.
        </div>

        <div class="art">
          <span class="art-title">ARTICLE 2 — ASSURANCE</span><br/>
          Le véhicule est couvert par une assurance Responsabilité Civile. Toute détérioration non couverte par l'assurance est intégralement à la charge du Locataire. Le Locataire doit signaler tout sinistre dans les 24 heures à l'agence et fournir un constat amiable.
        </div>

        <div class="art">
          <span class="art-title">ARTICLE 3 — PAIEMENT</span><br/>
          Le montant total de la location doit être réglé avant la prise en charge du véhicule. Les paiements partiels ne sont acceptés qu'avec accord préalable écrit. Les retards de paiement entraînent des pénalités de 2% par jour de retard.
        </div>

        <div class="art">
          <span class="art-title">ARTICLE 4 — DOCUMENTS</span><br/>
          Le Locataire doit présenter lors de la prise en charge : CIN en cours de validité, permis de conduire valide depuis plus de 2 ans, justificatif de domicile de moins de 3 mois, et caution exigée.
        </div>

        <div class="art">
          <span class="art-title">ARTICLE 5 — REMBOURSEMENT</span><br/>
          En cas d'annulation anticipée de plus de 72 heures, 50% du montant total sera remboursé. Pour une annulation de moins de 72 heures, aucun remboursement ne sera effectué. Le non-respect des conditions entraîne la perte de la caution.
        </div>

        <div class="art">
          <span class="art-title">ARTICLE 6 — RÉPUDIATION</span><br/>
          L'agence se réserve le droit de récupérer le véhicule sans préavis en cas de manquement grave aux présentes conditions, d'utilisation dangereuse, ou de non-paiement.
        </div>

        <div class="art">
          <span class="art-title">ARTICLE 7 — AUTRES</span><br/>
          Tout dommage causé par un événement de force majeure reste à la charge du Locataire, sauf assurance spécifique souscrite. Le kilométrage excessif (plus de 250 km/jour) fait l'objet de frais supplémentaires.
        </div>

        <div class="art">
          <span class="art-title">ARTICLE 8 — CONTRAVENTIONS</span><br/>
          Les contraventions et amendes de stationnement restent à la charge du Locataire. Le Locataire s'engage à respecter le Code de la Route marocain.
        </div>

        <div class="art">
          <span class="art-title">ARTICLE 9 — GPS</span><br/>
          Si le véhicule est équipé d'un GPS, le Locataire s'engage à ne pas déconnecter ni altérer l'appareil. Le non-respect de cette clause entraîne une pénalité de 500 MAD.
        </div>

        <div style="margin-top:14px; text-align:center;">
          <table style="width:100%;">
            <tr>
              <td style="width:50%; text-align:center;">
                <div class="bold small mb2">L'Agence</div>
                <div class="sig-box"></div>
              </td>
              <td style="width:50%; text-align:center;">
                <div class="bold small mb2">Le Client</div>
                <div class="sig-box"></div>
              </td>
            </tr>
          </table>
        </div>

      </td>

      {{-- Arabic column --}}
      <td style="width:50%; vertical-align:top; padding:8px; direction:rtl; text-align:right; font-size:8pt;">

        <div class="art">
          <span class="art-title">&#x0645;&#x0627;&#x062F;&#x0629; 1 — &#x0627;&#x0644;&#x0627;&#x0633;&#x062A;&#x062E;&#x062F;&#x0627;&#x0645;</span><br/>
          &#x064A;&#x062C;&#x0628; &#x0623;&#x0644;&#x0627; &#x064A;&#x0633;&#x062A;&#x062E;&#x062F;&#x0645; &#x0627;&#x0644;&#x0633;&#x064A;&#x0627;&#x0631;&#x0629; &#x0627;&#x0644;&#x0645;&#x0643;&#x0627;&#x0631;&#x064A;&#x0629; &#x0625;&#x0644;&#x0627; &#x0645;&#x0646; &#x0642;&#x0628;&#x0644; &#x0627;&#x0644;&#x0645;&#x0633;&#x062A;&#x0623;&#x062C;&#x0631; &#x0623;&#x0648; &#x0627;&#x0644;&#x0645;&#x0633;&#x0627;&#x0641;&#x0631; &#x0627;&#x0644;&#x062B;&#x0627;&#x0646;&#x064A; &#x0627;&#x0644;&#x0645;&#x062D;&#x062F;&#x062F; &#x0641;&#x0642;&#x0637;.
        </div>

        <div class="art">
          <span class="art-title">&#x0645;&#x0627;&#x062F;&#x0629; 2 — &#x0627;&#x0644;&#x062A;&#x0623;&#x0645;&#x064A;&#x0646;</span><br/>
          &#x064A;&#x062A;&#x0645; &#x062A;&#x063A;&#x0637;&#x064A;&#x0627; &#x0627;&#x0644;&#x0633;&#x064A;&#x0627;&#x0631;&#x0629; &#x0628;&#x062A;&#x0623;&#x0645;&#x064A;&#x0646; &#x0645;&#x0633;&#x0624;&#x0648;&#x0644;&#x064A;&#x0629; &#x0627;&#x0644;&#x0645;&#x0633;&#x0624;&#x0648;&#x0644;&#x064A;&#x0629; &#x0627;&#x0644;&#x0639;&#x0627;&#x0645;&#x0629;. &#x0643;&#x0644; &#x0636;&#x0631;&#x0631; &#x063A;&#x064A;&#x0631; &#x0645;&#x063A;&#x0637;&#x0649; &#x0628;&#x0647; &#x0627;&#x0644;&#x062A;&#x0623;&#x0645;&#x064A;&#x0646; &#x0639;&#x0644;&#x0649; &#x062D;&#x0633;&#x0627;&#x0628; &#x0627;&#x0644;&#x0645;&#x0633;&#x062A;&#x0623;&#x062C;&#x0631;.
        </div>

        <div class="art">
          <span class="art-title">&#x0645;&#x0627;&#x062F;&#x0629; 3 — &#x0627;&#x0644;&#x062F;&#x0641;&#x0639;</span><br/>
          &#x064A;&#x062C;&#x0628; &#x062A;&#x0631;&#x0627;&#x062D;&#x0645; &#x0645;&#x0628;&#x0644;&#x063A; &#x0627;&#x0644;&#x0625;&#x062C;&#x0627;&#x0631;&#x0629; &#x0642;&#x0628;&#x0644; &#x062A;&#x0633;&#x0644;&#x064A;&#x0645; &#x0627;&#x0644;&#x0633;&#x064A;&#x0627;&#x0631;&#x0629;. &#x0627;&#x0644;&#x0645;&#x062F;&#x0641;&#x0648;&#x0639;&#x0627;&#x062A; &#x0627;&#x0644;&#x062C;&#x0632;&#x0626;&#x064A;&#x0629; 2% &#x0644;&#x0643;&#x0644; &#x064A;&#x0648;&#x0645; &#x062A;&#x0623;&#x062E;&#x064A;&#x0631;.
        </div>

        <div class="art">
          <span class="art-title">&#x0645;&#x0627;&#x062F;&#x0629; 4 — &#x0627;&#x0644;&#x0648;&#x062B;&#x0627;&#x0626;&#x0642;</span><br/>
          &#x064A;&#x062C;&#x0628; &#x0639;&#x0631;&#x0636; &#x0628;&#x0637;&#x0627;&#x0642;&#x0629; &#x0627;&#x0644;&#x0647;&#x0648;&#x064A;&#x0629; &#x0627;&#x0644;&#x0648;&#x0637;&#x0646;&#x064A;&#x0629; &#x0641;&#x064A; &#x0627;&#x0644;&#x0645;&#x0635;&#x0644;&#x062D;&#x064A;&#x0629;: &#x0631;&#x0642;&#x0645; &#x0627;&#x0644;&#x0647;&#x0648;&#x064A;&#x0629; &#x0648;&#x0627;&#x0644;&#x0633;&#x064A;&#x0627;&#x0642;&#x0629; &#x0627;&#x0644;&#x0635;&#x0627;&#x0644;&#x062D;&#x0629; &#x0645;&#x0646;&#x0630; &#x0633;&#x0646;&#x0648;&#x064A;&#x0646;.
        </div>

        <div class="art">
          <span class="art-title">&#x0645;&#x0627;&#x062F;&#x0629; 5 — &#x0627;&#x0644;&#x0633;&#x062D;&#x0628;</span><br/>
          &#x0641;&#x064A; &#x062D;&#x0627;&#x0644;&#x0629; &#x0625;&#x0644;&#x063A;&#x0627;&#x0621; &#x0645;&#x0628;&#x0643;&#x0631; &#x0645;&#x0646; 72 &#x0633;&#x0627;&#x0639;&#x0629;: &#x064A;&#x0639;&#x0648;&#x062F; 50% &#x0645;&#x0646; &#x0627;&#x0644;&#x0645;&#x0628;&#x0644;&#x063A;. &#x0625;&#x0630;&#x0627; &#x0643;&#x0627;&#x0646;&#x062A; &#x0623;&#x0642;&#x0644; &#x0645;&#x0646; 72 &#x0633;&#x0627;&#x0639;&#x0629;: &#x0644;&#x0627; &#x064A;&#x062A;&#x0645; &#x0627;&#x0644;&#x0631;&#x062F;.
        </div>

        <div class="art">
          <span class="art-title">&#x0645;&#x0627;&#x062F;&#x0629; 6 — &#x0627;&#x0644;&#x0631;&#x0641;&#x0636;</span><br/>
          &#x062A;&#x062D;&#x062A;&#x0641;&#x0638; &#x0627;&#x0644;&#x0645;&#x0648;&#x0636;&#x0639; &#x0639;&#x0644;&#x0649; &#x0627;&#x0633;&#x062A;&#x0631;&#x062C;&#x0627;&#x0639; &#x0627;&#x0644;&#x0633;&#x064A;&#x0627;&#x0631;&#x0629; &#x0628;&#x062F;&#x0648;&#x0646; &#x0625;&#x0634;&#x0639;&#x0627;&#x0631; &#x0623;&#x0648; &#x0645;&#x0646;&#x0627;&#x0639;&#x0629; &#x062C;&#x0627;&#x0648;&#x0632;.
        </div>

        <div class="art">
          <span class="art-title">&#x0645;&#x0627;&#x062F;&#x0629; 7 — &#x0623;&#x062E;&#x0631;&#x0649;</span><br/>
          &#x0643;&#x0644; &#x0636;&#x0631;&#x0631; &#x064A;&#x0633;&#x0628;&#x0628; &#x0645;&#x0646; &#x0648;&#x0642;&#x0648;&#x0629; &#x0642;&#x0633;&#x0631;&#x0629; &#x062A;&#x0628;&#x0642;&#x0649; &#x0639;&#x0644;&#x0649; &#x0627;&#x0644;&#x0645;&#x0633;&#x062A;&#x0623;&#x062C;&#x0631;. &#x0627;&#x0644;&#x0643;&#x064A;&#x0644;&#x0648;&#x0645;&#x062A;&#x0631; &#x0627;&#x0644;&#x0632;&#x0627;&#x0626;&#x062F; (&#x0623;&#x0643;&#x062B;&#x0631; &#x0645;&#x0646; 250 &#x0643;&#x0645;/&#x064A;&#x0648;&#x0645;) &#x064A;&#x062E;&#x0636;&#x0639; &#x0623;&#x0631;&#x0635;&#x0627;&#x0641;.
        </div>

        <div class="art">
          <span class="art-title">&#x0645;&#x0627;&#x062F;&#x0629; 8 — &#x0627;&#x0644;&#x0645;&#x063a;&#x0627;&#x0631;&#x0645;&#x0627;&#x062A;</span><br/>
          &#x0627;&#x0644;&#x0645;&#x063a;&#x0627;&#x0631;&#x0645;&#x0627;&#x062A; &#x0648;&#x0627;&#x0644;&#x063A;&#x0631;&#x0627;&#x0645;&#x0627;&#x062A; &#x062A;&#x0628;&#x0642;&#x0649; &#x0639;&#x0644;&#x0649; &#x0627;&#x0644;&#x0645;&#x0633;&#x062A;&#x0623;&#x062C;&#x0631;. &#x064A;&#x062A;&#x0632;&#x0645;&#x0646; &#x0627;&#x0644;&#x0639;&#x062A;&#x0645;&#x0627;&#x0644; &#x0628;&#x0627;&#x0644;&#x0625;&#x0637;&#x0644;&#x0627;&#x0645; &#x0627;&#x0644;&#x0645;&#x063A;&#x0631;&#x0637;&#x064A;
        </div>

        <div class="art">
          <span class="art-title">&#x0645;&#x0627;&#x062F;&#x0629; 9 — &#x0627;&#x0644;&#x0645;&#x0639;&#x0631;&#x0636;</span><br/>
          &#x0625;&#x0630;&#x0627; &#x0643;&#x0627;&#x0646;&#x0629; &#x0627;&#x0644;&#x0633;&#x064A;&#x0627;&#x0631;&#x0629; &#x0645;&#x0639;&#x062F;&#x0629; &#x0628;&#x062C;&#x0647;&#x0627;&#x0632; GPS &#x064A;&#x062C;&#x0628; &#x0639;&#x0644;&#x0649; &#x0627;&#x0644;&#x0645;&#x0633;&#x062A;&#x0623;&#x062C;&#x0631; &#x0627;&#x0644;&#x0645;&#x0646;&#x0639; &#x0623;&#x0648; &#x062A;&#x063A;&#x064A;&#x064A;&#x0631; &#x0627;&#x0644;&#x062C;&#x0647;&#x0627;&#x0632;. &#x0639;&#x0646;&#x0637;&#x0627; 500 &#x062F;&#x0631;&#x0647;&#x0645;.
        </div>

        <div style="margin-top:14px; text-align:center;">
          <table style="width:100%;">
            <tr>
              <td style="width:50%; text-align:center;">
                <div class="bold small mb2">&#x0627;&#x0644;&#x0645;&#x0648;&#x0636;&#x0639;</div>
                <div class="sig-box"></div>
              </td>
              <td style="width:50%; text-align:center;">
                <div class="bold small mb2">&#x0627;&#x0644;&#x0639;&#x0645;&#x064A;&#x0644;</div>
                <div class="sig-box"></div>
              </td>
            </tr>
          </table>
        </div>

      </td>
    </tr>
  </table>

</div>

{{-- ============================================================ --}}
{{-- PAGE 4 — CONTRAT DE LOCATION --}}
{{-- ============================================================ --}}
<div class="page">

  {{-- Contract header --}}
  <table style="width:100%; margin-bottom:8px;">
    <tr>
      <td style="width:20%; text-align:center;">
        @if($aLogo)
          <img src="{{ $aLogo }}" style="max-height:45px;" />
        @endif
      </td>
      <td style="width:55%;">
        <div style="font-size:10pt; font-weight:bold; color:#003366;">CONTRAT DE LOCATION DE VÉHICULE SANS CHAUFFEUR</div>
        <div style="font-size:8pt; color:#555; margin-top:2px;">
          N° {{ $cr }} &nbsp;&bull;&nbsp; {{ $aName }} &nbsp;&bull;&nbsp; {{ $aPhone }}
        </div>
      </td>
      <td style="width:25%; text-align:right; font-size:8pt;">
        <div><span class="bold">N° Contrat :</span> {{ $cr }}</div>
        <div><span class="bold">Réf :</span> {{ $cn }}</div>
      </td>
    </tr>
  </table>

  {{-- Info rows --}}
  <table class="tbl-bordered" style="margin-top:4px;">
    <tr>
      <td style="width:33%;"><span class="bold">Date :</span> {{ $sd->format('d/m/Y') }}</td>
      <td style="width:33%;"><span class="bold">Lieu :</span> {{ $aAddr }}</td>
      <td style="width:34%;"><span class="bold">Agent :</span> <span class="field-line"></span></td>
    </tr>
    <tr>
      <td><span class="bold">Marque :</span> {{ $vehicle->brand ?? '' }} {{ $vehicle->model ?? '' }}</td>
      <td><span class="bold">Immatriculation :</span> {{ $vehicle->registration ?? '' }}</td>
      <td><span class="bold">Type :</span> {{ $vehicle->category ?? '' }}</td>
    </tr>
  </table>

  {{-- DURÉE DE LOCATION --}}
  <div class="section-title mt8">DURÉE DE LOCATION</div>
  <table class="tbl-bordered">
    <tr>
      <td style="width:50%;">
        <table style="width:100%;">
          <tr>
            <td class="bold" style="width:50%;">Date de départ :</td>
            <td>{{ $sd->format('d/m/Y') }} à {{ $sd->format('H:i') }}</td>
          </tr>
          <tr>
            <td class="bold">Date de retour :</td>
            <td>{{ $ed->format('d/m/Y') }} à {{ $ed->format('H:i') }}</td>
          </tr>
        </table>
      </td>
      <td style="width:50%;">
        <table style="width:100%;">
          <tr>
            <td class="bold" style="width:50%;">Durée :</td>
            <td>{{ $days }} jour(s)</td>
          </tr>
          <tr>
            <td class="bold">Prolongation :</td>
            <td><span class="field-line" style="min-width:80px;"></span> jours</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  {{-- LE LOCATAIRE --}}
  <div class="section-title mt8">LE LOCATAIRE</div>
  <table class="tbl-bordered">
    <tr>
      <td style="width:50%;">
        <table style="width:100%;">
          <tr>
            <td class="bold" style="width:40%;">Nom &amp; Prénom :</td>
            <td>{{ $client->name ?? '' }}</td>
          </tr>
          <tr>
            <td class="bold">Date de naissance :</td>
            <td>{{ $client->birth_date ? \Carbon\Carbon::parse($client->birth_date)->format('d/m/Y') : '' }}</td>
          </tr>
          <tr>
            <td class="bold">Adresse :</td>
            <td>{{ $client->address ?? '' }}</td>
          </tr>
          <tr>
            <td class="bold">Téléphone :</td>
            <td>{{ $client->phone ?? '' }}</td>
          </tr>
        </table>
      </td>
      <td style="width:50%;">
        <table style="width:100%;">
          <tr>
            <td class="bold" style="width:40%;">Nationalité :</td>
            <td>{{ $client->nationality ?? 'Marocaine' }}</td>
          </tr>
          <tr>
            <td class="bold">Permis N° :</td>
            <td>{{ $client->driver_license ?? '' }}</td>
          </tr>
          <tr>
            <td class="bold">CIN N° :</td>
            <td>{{ $client->cin ?? '' }}</td>
          </tr>
          <tr>
            <td class="bold">Lieu de naissance :</td>
            <td>{{ $client->birth_place ?? '' }}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  {{-- 2ème CONDUCTEUR --}}
  <div class="section-title mt8">2ème CONDUCTEUR (Facultatif)</div>
  <table class="tbl-bordered">
    <tr>
      <td style="width:50%;">
        <table style="width:100%;">
          <tr><td class="bold" style="width:40%;">Nom &amp; Prénom :</td><td><span class="field-line"></span></td></tr>
          <tr><td class="bold">Date de naissance :</td><td><span class="field-line"></span></td></tr>
        </table>
      </td>
      <td style="width:50%;">
        <table style="width:100%;">
          <tr><td class="bold" style="width:40%;">CIN N° :</td><td><span class="field-line"></span></td></tr>
          <tr><td class="bold">Permis N° :</td><td><span class="field-line"></span></td></tr>
        </table>
      </td>
    </tr>
  </table>

  {{-- PAPIERS DE VÉHICULE --}}
  <div class="section-title mt8">PAPIERS DE VÉHICULE</div>
  <table class="tbl-bordered">
    <tr>
      <td colspan="5">
        <span class="checkbox checked"></span> Carte grise &nbsp;&nbsp;&nbsp;
        <span class="checkbox checked"></span> Visite technique &nbsp;&nbsp;&nbsp;
        <span class="checkbox checked"></span> Assurance &nbsp;&nbsp;&nbsp;
        <span class="checkbox checked"></span> Vignette &nbsp;&nbsp;&nbsp;
        <span class="checkbox"></span> Autorisation spéciale
      </td>
    </tr>
  </table>

  {{-- FRANCHISE --}}
  <div class="section-title mt8">FRANCHISE</div>
  <table class="tbl-bordered">
    <tr>
      <td style="width:50%;"><span class="bold">Assurance :</span> <span class="field-line" style="min-width:100px;"></span></td>
      <td style="width:50%;"><span class="bold">Franchise :</span> <span class="field-line" style="min-width:100px;"></span> MAD</td>
    </tr>
  </table>

  {{-- Payment --}}
  <div class="section-title mt8">MONTANT</div>
  <table class="tbl-bordered">
    <tr>
      <td class="bold" style="width:33%;">TOTAL GÉNÉRAL</td>
      <td style="width:33%; text-align:right;">{{ number_format($reservation->total_price ?? 0, 2, ',', ' ') }} MAD</td>
      <td class="bold ar-cell" style="width:34%; direction:rtl; text-align:right;">&#x0627;&#x0644;&#x0645;&#x0628;&#x0644;&#x063A; &#x0627;&#x0644;&#x0639;&#x0627;&#x0645; : {{ number_format($reservation->total_price ?? 0, 2, ',', ' ') }} &#x062F;&#x0631;&#x0647;&#x0645;</td>
    </tr>
    <tr>
      <td class="bold">MONTANT PAYÉ</td>
      <td style="text-align:right;">{{ number_format($reservation->deposit_amount ?? 0, 2, ',', ' ') }} MAD</td>
      <td class="bold ar-cell" style="direction:rtl; text-align:right;">&#x0627;&#x0644;&#x0645;&#x0628;&#x0644;&#x063A; &#x0627;&#x0644;&#x0645;&#x062F;&#x0641;&#x0648;&#x0639; : {{ number_format($reservation->deposit_amount ?? 0, 2, ',', ' ') }} &#x062F;&#x0631;&#x0647;&#x0645;</td>
    </tr>
    <tr style="background:#e8eef5;">
      <td class="bold">LE RESTE À PAYER</td>
      <td style="text-align:right; font-weight:bold;">{{ number_format(($reservation->total_price ?? 0) - ($reservation->deposit_amount ?? 0), 2, ',', ' ') }} MAD</td>
      <td class="bold ar-cell" style="direction:rtl; text-align:right;">&#x0627;&#x0644;&#x0645;&#x0628;&#x0644;&#x063A; &#x0627;&#x0644;&#x0645;&#x062A;&#x0628;&#x0642;&#x064A; : {{ number_format(($reservation->total_price ?? 0) - ($reservation->deposit_amount ?? 0), 2, ',', ' ') }} &#x062F;&#x0631;&#x0647;&#x0645;</td>
    </tr>
  </table>

  {{-- Mode de Règlement --}}
  <div class="section-title mt8">Mode de Règlement</div>
  <table class="tbl-bordered">
    <tr>
      <td colspan="4">
        <span class="checkbox"></span> Espèce &nbsp;&nbsp;&nbsp;
        <span class="checkbox"></span> Chèque &nbsp;&nbsp;&nbsp;
        <span class="checkbox"></span> Carte bancaire &nbsp;&nbsp;&nbsp;
        <span class="checkbox"></span> Virement
      </td>
    </tr>
  </table>

  {{-- Signatures --}}
  <table style="margin-top:16px; width:100%;">
    <tr>
      <td style="width:25%; text-align:center;">
        <div class="bold small mb2">Le Locataire</div>
        <div class="sig-box"></div>
      </td>
      <td style="width:25%; text-align:center;">
        <div class="bold small mb2">2ème Conducteur</div>
        <div class="sig-box"></div>
      </td>
      <td style="width:25%; text-align:center;">
        <div class="bold small mb2">Le Loueur</div>
        <div class="sig-box"></div>
      </td>
      <td style="width:25%; text-align:center;">
        <div class="bold small mb2">Date &amp; Lieu</div>
        <div class="sig-box"></div>
        <div class="small center">Le : ___/___/______</div>
      </td>
    </tr>
  </table>

  {{-- Footer --}}
  <table style="margin-top:12px; width:100%; border-top:1px solid #ccc; padding-top:4px;">
    <tr>
      <td style="text-align:center; font-size:7.5pt; color:#777;">
        {{ $aName }} &bull; {{ $aAddr }} &bull; {{ $aPhone }} &bull; {{ $aEmail }}<br/>
        Ce contrat est établi en deux (2) exemplaires originaux, un pour chaque partie.
      </td>
    </tr>
  </table>

</div>

</body>
</html>
