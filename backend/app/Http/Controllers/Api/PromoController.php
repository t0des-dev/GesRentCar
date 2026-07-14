<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PromoCode;
use Illuminate\Http\Request;

class PromoController extends Controller
{
    public function validateCode(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $promo = PromoCode::where('code', strtoupper($request->code))->first();

        if (! $promo || ! $promo->isValid()) {
            return response()->json(['valid' => false, 'message' => 'Code promo invalide ou expiré.'], 422);
        }

        $discount = $promo->type === 'percent' ? 0 : $promo->value;
        $discountType = $promo->type;
        $discountValue = $promo->value;

        return response()->json([
            'valid' => true,
            'discount' => $discount,
            'type' => $discountType,
            'value' => $discountValue,
            'message' => $promo->type === 'fixed'
                ? "Réduction de {$promo->value} DH appliquée !"
                : "Réduction de {$promo->value}% appliquée !",
        ]);
    }
}
