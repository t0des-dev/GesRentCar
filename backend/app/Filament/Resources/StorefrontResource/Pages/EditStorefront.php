<?php

namespace App\Filament\Resources\StorefrontResource\Pages;

use App\Filament\Resources\StorefrontResource;
use App\Models\Setting;
use Filament\Resources\Pages\EditRecord;

class EditStorefront extends EditRecord
{
    protected static string $resource = StorefrontResource::class;

    protected static ?string $title = 'Configuration Storefront';

    protected function getHeaderActions(): array
    {
        return [];
    }

    public function getRecord(bool $cached = true): Setting
    {
        return Setting::firstOrCreate(
            ['key' => 'agency_config'],
            ['key' => 'agency_config']
        );
    }

    protected function resolveRecordRouteBinding($id): Setting
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

    protected function handleRecordUpdate(\Illuminate\Database\Eloquent\Model $record, array $data): Setting
    {
        $record->fill($data)->save();

        return $record;
    }

    protected function afterSave(): void
    {
        \Illuminate\Support\Facades\Artisan::call('config:clear');
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
    }
}
