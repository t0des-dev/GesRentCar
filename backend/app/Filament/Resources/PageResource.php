<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PageResource\Pages;
use App\Models\Page;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class PageResource extends Resource
{
    protected static ?string $model = Page::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-document-text';

    protected static string|\UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Forms\Components\Tabs::make('Page')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('Général')
                            ->icon('heroicon-o-information-circle')
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                                Forms\Components\TextInput::make('slug')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255),
                                Forms\Components\Select::make('status')
                                    ->options([
                                        'draft' => 'Brouillon',
                                        'published' => 'Publié',
                                    ])
                                    ->required(),
                                Forms\Components\Select::make('template')
                                    ->options([
                                        'default' => 'Par défaut',
                                        'full-width' => 'Pleine largeur',
                                        'landing' => 'Landing Page',
                                    ]),
                                Forms\Components\TextInput::make('sort_order')
                                    ->numeric()
                                    ->default(0),
                            ])->columns(2),

                        Forms\Components\Tabs\Tab::make('Contenu')
                            ->icon('heroicon-o-photo')
                            ->schema([
                                Forms\Components\Builder::make('content')
                                    ->label('Blocs de contenu')
                                    ->addActionLabel('Ajouter un bloc')
                                    ->reorderable()
                                    ->collapsible()
                                    ->blocks([
                                        Forms\Components\Builder\Block::make('text')
                                            ->icon('heroicon-m-document-text')
                                            ->label('Texte')
                                            ->schema([
                                                Forms\Components\TextInput::make('title')
                                                    ->label('Titre'),
                                                Forms\Components\RichEditor::make('body')
                                                    ->label('Corps')
                                                    ->columnSpanFull(),
                                                Forms\Components\Select::make('alignment')
                                                    ->options([
                                                        'left' => 'Gauche',
                                                        'center' => 'Centré',
                                                        'right' => 'Droite',
                                                    ])
                                                    ->default('left'),
                                            ])->columns(2),

                                        Forms\Components\Builder\Block::make('image')
                                            ->icon('heroicon-m-photo')
                                            ->label('Image')
                                            ->schema([
                                                Forms\Components\FileUpload::make('image_url')
                                                    ->image()
                                                    ->directory('pages')
                                                    ->label('Image'),
                                                Forms\Components\TextInput::make('alt')
                                                    ->label('Texte alternatif'),
                                                Forms\Components\TextInput::make('caption')
                                                    ->label('Légende'),
                                            ]),

                                        Forms\Components\Builder\Block::make('gallery')
                                            ->icon('heroicon-m-camera')
                                            ->label('Galerie')
                                            ->schema([
                                                Forms\Components\FileUpload::make('images')
                                                    ->multiple()
                                                    ->image()
                                                    ->directory('pages/gallery')
                                                    ->panelLayout('grid')
                                                    ->label('Images'),
                                            ]),

                                        Forms\Components\Builder\Block::make('cards')
                                            ->icon('heroicon-m-squares-2x2')
                                            ->label('Cartes')
                                            ->schema([
                                                Forms\Components\Repeater::make('items')
                                                    ->label('Éléments')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('title')
                                                            ->label('Titre'),
                                                        Forms\Components\Textarea::make('desc')
                                                            ->label('Description'),
                                                        Forms\Components\FileUpload::make('image')
                                                            ->image()
                                                            ->directory('pages/cards'),
                                                    ])->columns(2),
                                            ]),

                                        Forms\Components\Builder\Block::make('cta')
                                            ->icon('heroicon-m-arrow-right-circle')
                                            ->label('Appel à action')
                                            ->schema([
                                                Forms\Components\TextInput::make('title')
                                                    ->label('Titre'),
                                                Forms\Components\Textarea::make('subtitle')
                                                    ->label('Sous-titre'),
                                                Forms\Components\TextInput::make('button_text')
                                                    ->label('Texte du bouton'),
                                                Forms\Components\TextInput::make('button_link')
                                                    ->label('Lien du bouton'),
                                                Forms\Components\ColorPicker::make('background_color')
                                                    ->label('Couleur de fond'),
                                            ])->columns(2),

                                        Forms\Components\Builder\Block::make('faq')
                                            ->icon('heroicon-m-question-mark-circle')
                                            ->label('FAQ')
                                            ->schema([
                                                Forms\Components\Repeater::make('items')
                                                    ->label('Questions')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('q')
                                                            ->label('Question'),
                                                        Forms\Components\Textarea::make('a')
                                                            ->label('Réponse'),
                                                    ]),
                                            ]),

                                        Forms\Components\Builder\Block::make('divider')
                                            ->icon('heroicon-m-minus')
                                            ->label('Séparateur')
                                            ->schema([
                                                Forms\Components\Select::make('style')
                                                    ->options([
                                                        'line' => 'Ligne simple',
                                                        'spacing' => 'Espacement',
                                                        'dashed' => 'Tiretés',
                                                    ])
                                                    ->default('line'),
                                            ]),
                                    ])
                                    ->blockIcons()
                                    ->blockLabels()
                                    ->columnSpanFull(),
                            ]),

                        Forms\Components\Tabs\Tab::make('SEO')
                            ->icon('heroicon-o-globe-alt')
                            ->schema([
                                Forms\Components\TextInput::make('meta.seo_title')
                                    ->label('Titre SEO')
                                    ->maxLength(70),
                                Forms\Components\Textarea::make('meta.seo_description')
                                    ->label('Description SEO')
                                    ->maxLength(160),
                                Forms\Components\FileUpload::make('meta.og_image')
                                    ->image()
                                    ->directory('pages/seo')
                                    ->label('Image Open Graph'),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Titre')
                    ->searchable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->color('gray')
                    ->icon('heroicon-m-link'),
                Tables\Columns\TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'published' => 'success',
                        'draft' => 'gray',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'published' => 'Publié',
                        'draft' => 'Brouillon',
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('template')
                    ->label('Template')
                    ->badge()
                    ->color('primary')
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'default' => 'Standard',
                        'full-width' => 'Pleine largeur',
                        'landing' => 'Landing',
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Ordre')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Modifié')
                    ->date('d/m/Y')
                    ->sortable(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('preview')
                    ->label('Aperçu')
                    ->icon('heroicon-m-eye')
                    ->color('gray')
                    ->url(fn (Page $record) => url('/page/'.$record->slug))
                    ->openUrlInNewTab(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPages::route('/'),
            'create' => Pages\CreatePage::route('/create'),
            'view' => Pages\ViewPage::route('/{record}'),
            'edit' => Pages\EditPage::route('/{record}/edit'),
        ];
    }
}
