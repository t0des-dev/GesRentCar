<?php

use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    App\Providers\Filament\AdminPanelProvider::class,
    Filament\FilamentServiceProvider::class,
    Filament\Support\SupportServiceProvider::class,
    Filament\Actions\ActionsServiceProvider::class,
    Filament\Forms\FormsServiceProvider::class,
    Filament\Notifications\NotificationsServiceProvider::class,
    Filament\Schemas\SchemasServiceProvider::class,
    Filament\Tables\TablesServiceProvider::class,
    Filament\Widgets\WidgetsServiceProvider::class,
    Livewire\LivewireServiceProvider::class,
    BladeUI\Icons\BladeIconsServiceProvider::class,
    BladeUI\Heroicons\BladeHeroiconsServiceProvider::class,
    Laravel\Sanctum\SanctumServiceProvider::class,
];
