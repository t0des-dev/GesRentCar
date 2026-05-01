<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'twilio' => [
        'sid'   => env('TWILIO_SID'),
        'token' => env('TWILIO_TOKEN'),
        'from'  => env('TWILIO_FROM'),
    ],

    'whatsapp' => [
        'token'           => env('WHATSAPP_TOKEN'),
        'phone_number_id' => env('WHATSAPP_PHONE_NUMBER_ID'),
        'version'         => env('WHATSAPP_API_VERSION', 'v17.0'),
    ],

    'admin_phone' => env('ADMIN_PHONE', '+212600000000'),

    // ─── Stripe ────────────────────────────────────────────────────────────────
    'stripe' => [
        'key'            => env('STRIPE_PUBLISHABLE_KEY'),
        'secret'         => env('STRIPE_SECRET_KEY'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'cmi' => [
        'client_id'    => env('CMI_CLIENT_ID'),
        'store_key'    => env('CMI_STORE_KEY'),
        'base_url'     => env('CMI_BASE_URL', 'https://test.cmi.co.ma/fim/est3Dgate'),
        'redirect_url' => env('CMI_REDIRECT_URL'),
        'fail_url'     => env('CMI_FAIL_URL'),
    ],

];
