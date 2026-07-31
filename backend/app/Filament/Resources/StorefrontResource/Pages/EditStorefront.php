<?php

namespace App\Filament\Resources\StorefrontResource\Pages;

use App\Filament\Resources\StorefrontResource;
use App\Models\Setting;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditStorefront extends EditRecord
{
    protected static string $resource = StorefrontResource::class;

    protected static ?string $title = 'Configuration Storefront';

    protected static ?string $navigationLabel = 'Storefront';

    protected function getHeaderActions(): array
    {
        return [];
    }

    public function getRecord(): mixed
    {
        return Setting::firstOrCreate(
            ['key' => 'agency_config'],
            ['key' => 'agency_config']
        );
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $setting = Setting::firstOrCreate(
            ['key' => 'agency_config'],
            ['key' => 'agency_config']
        );

        $data['id'] = $setting->id;

        return $data;
    }

    protected function handleRecordCreation(array $data): Setting
    {
        return Setting::updateOrCreate(
            ['key' => 'agency_config'],
            $data
        );
    }

    protected function afterSave(): void
    {
        // Clear config cache after saving
        \Illuminate\Support\Facades\Artisan::call('config:clear');
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
    }
}
