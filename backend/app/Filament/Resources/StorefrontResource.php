<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StorefrontResource\Pages;
use App\Models\Setting;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;

class StorefrontResource extends Resource
{
    protected static ?string $model = Setting::class;

    protected static ?string $navigationIcon = 'heroicon-o-globe-alt';

    protected static ?string $navigationLabel = 'Storefront';

    protected static ?string $navigationGroup = 'Content';

    protected static ?int $navigationSort = 0;

    protected static ?string $modelLabel = 'Configuration Storefront';

    protected static ?string $pluralModelLabel = 'Configuration Storefront';

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return Setting::query()->where('key', 'agency_config');
    }

    public static function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Forms\Components\Tabs::make('Storefront')
                    ->tabs([
                        self::brandingTab(),
                        self::heroTab(),
                        self::sectionsTab(),
                        self::fleetTab(),
                        self::servicesTab(),
                        self::statsTab(),
                        self::testimonialsTab(),
                        self::faqTab(),
                        self::conciergeTab(),
                        self::offersTab(),
                        self::headerFooterTab(),
                        self::seoTab(),
                        self::socialTab(),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    protected static function brandingTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('Branding')
            ->icon('heroicon-o-paint-brush')
            ->schema([
                Forms\Components\Section::make('Identite')
                    ->schema([
                        Forms\Components\TextInput::make('value')
                            ->label('Nom de l\'agence')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('agency_slogan')
                            ->label('Slogan')
                            ->maxLength(255),
                        Forms\Components\ColorPicker::make('agency_primary_color')
                            ->label('Couleur principale')
                            ->default('#6366f1'),
                    ])->columns(3),

                Forms\Components\Section::make('Logo & Images')
                    ->schema([
                        Forms\Components\FileUpload::make('logo_url')
                            ->image()
                            ->directory('branding')
                            ->label('Logo'),
                        Forms\Components\TextInput::make('logo_config.width')
                            ->label('Largeur logo')
                            ->placeholder('ex: 140px'),
                        Forms\Components\TextInput::make('logo_config.height')
                            ->label('Hauteur logo')
                            ->placeholder('ex: 40px'),
                        Forms\Components\TextInput::make('logo_config.background')
                            ->label('Fond logo'),
                        Forms\Components\Toggle::make('logo_config.show_name')
                            ->label('Afficher le nom a cote du logo')
                            ->default(true),
                    ])->columns(3),

                Forms\Components\Section::make('Textes About')
                    ->schema([
                        Forms\Components\Textarea::make('about_text_fr')
                            ->label('Texte About (FR)')
                            ->rows(3),
                        Forms\Components\Textarea::make('about_text_en')
                            ->label('Texte About (EN)')
                            ->rows(3),
                        Forms\Components\Textarea::make('about_text_ar')
                            ->label('Texte About (AR)')
                            ->rows(3),
                    ])->columns(1),
            ]);
    }

    protected static function heroTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('Hero & Accueil')
            ->icon('heroicon-o-photo')
            ->schema([
                Forms\Components\Section::make('Hero')
                    ->schema([
                        Forms\Components\FileUpload::make('hero_image_url')
                            ->image()
                            ->directory('hero')
                            ->label('Image Hero'),
                        Forms\Components\TextInput::make('hero_video_url')
                            ->label('URL Video Hero')
                            ->placeholder('https://...'),
                    ])->columns(2),

                Forms\Components\Section::make('Contenu Hero')
                    ->schema([
                        Forms\Components\TextInput::make('sections_content.hero.badge')
                            ->label('Badge Hero')
                            ->placeholder('Collection Exclusive 2026'),
                        Forms\Components\TextInput::make('sections_content.hero.title')
                            ->label('Titre Hero')
                            ->placeholder('L\'excellence en mouvement.'),
                        Forms\Components\Textarea::make('sections_content.hero.subtitle')
                            ->label('Sous-titre Hero')
                            ->rows(2),
                    ]),

                Forms\Components\Section::make('Barre de Recherche')
                    ->schema([
                        Forms\Components\TextInput::make('sections_content.search_form.location_label')
                            ->label('Label Destination'),
                        Forms\Components\TextInput::make('sections_content.search_form.location_placeholder')
                            ->label('Placeholder Destination'),
                        Forms\Components\TextInput::make('sections_content.search_form.start_label')
                            ->label('Label Depart'),
                        Forms\Components\TextInput::make('sections_content.search_form.end_label')
                            ->label('Label Retour'),
                        Forms\Components\TextInput::make('sections_content.search_form.search_button')
                            ->label('Texte Bouton Rechercher'),
                        Forms\Components\TextInput::make('sections_content.search_form.fleet_link_text')
                            ->label('Texte Lien Flotte'),
                        Forms\Components\TextInput::make('sections_content.search_form.fleet_link_href')
                            ->label('URL Lien Flotte'),
                    ])->columns(2),
            ]);
    }

    protected static function sectionsTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('Sections')
            ->icon('heroicon-o-rectangle-stack')
            ->schema([
                Forms\Components\Section::make('Activation des Sections')
                    ->description('Active ou desactive les sections de la page d\'accueil')
                    ->schema([
                        Forms\Components\Grid::make(3)->schema([
                            Forms\Components\Toggle::make('sections_config.featured')
                                ->label('Vehicules Vedettes')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.services')
                                ->label('Services VIP')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.fleet')
                                ->label('Flotte')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.stats')
                                ->label('Statistiques')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.why_us')
                                ->label('Nos Avantages')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.testimonials')
                                ->label('Temoignages')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.vibe_selector')
                                ->label('Selecteur Vibe')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.faq')
                                ->label('FAQ')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.concierge_banner')
                                ->label('Banniere Concierge')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.experience')
                                ->label('Experience')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.how_it_works')
                                ->label('Comment ca marche')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.cta_banner')
                                ->label('CTA Banner')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.promotion_banner')
                                ->label('Banniere Promotion')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_config.dual_cta')
                                ->label('Double CTA')
                                ->default(true),
                        ]),
                    ]),

                Forms\Components\Section::make('Ordre des Sections')
                    ->description('Glissez-deplacez pour modifier l\'ordre d\'affichage')
                    ->schema([
                        Forms\Components\Repeater::make('sections_order')
                            ->label('Ordre')
                            ->schema([
                                Forms\Components\TextInput::make('id')
                                    ->label('ID')
                                    ->disabled(),
                                Forms\Components\TextInput::make('label')
                                    ->label('Label')
                                    ->disabled(),
                                Forms\Components\Toggle::make('active')
                                    ->label('Actif')
                                    ->default(true),
                            ])->columns(3)
                            ->defaultItems(11)
                            ->reorderable(),
                    ]),

                Forms\Components\Section::make('Contenu Sections')
                    ->schema([
                        Forms\Components\Tabs::make('Content Sections')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('Pourquoi Nous')
                                    ->schema([
                                        Forms\Components\TextInput::make('sections_content.why_us.title')
                                            ->label('Titre'),
                                        Forms\Components\Textarea::make('sections_content.why_us.subtitle')
                                            ->label('Sous-titre')
                                            ->rows(2),
                                        Forms\Components\Repeater::make('sections_content.why_us.features')
                                            ->label('Avantages')
                                            ->schema([
                                                Forms\Components\TextInput::make('icon')
                                                    ->label('Icone (Lucide)')
                                                    ->placeholder('Crown'),
                                                Forms\Components\TextInput::make('title')
                                                    ->label('Titre'),
                                                Forms\Components\Textarea::make('desc')
                                                    ->label('Description')
                                                    ->rows(2),
                                            ])->columns(3)
                                            ->defaultItems(3),
                                    ]),

                                Forms\Components\Tabs\Tab::make('Vibe Selector')
                                    ->schema([
                                        Forms\Components\TextInput::make('sections_content.vibe.title')
                                            ->label('Titre'),
                                        Forms\Components\Textarea::make('sections_content.vibe.subtitle')
                                            ->label('Sous-titre')
                                            ->rows(2),
                                        Forms\Components\TextInput::make('sections_content.vibe.eyebrow')
                                            ->label('Eyebrow'),
                                        Forms\Components\Repeater::make('sections_content.vibe.items')
                                            ->label('Items Vibe')
                                            ->schema([
                                                Forms\Components\TextInput::make('id')
                                                    ->label('ID'),
                                                Forms\Components\TextInput::make('title')
                                                    ->label('Titre'),
                                                Forms\Components\TextInput::make('subtitle')
                                                    ->label('Sous-titre'),
                                                Forms\Components\TextInput::make('icon')
                                                    ->label('Icone'),
                                                Forms\Components\TextInput::make('image')
                                                    ->label('URL Image'),
                                                Forms\Components\TextInput::make('lifestyle')
                                                    ->label('Lifestyle'),
                                            ])->columns(3)
                                            ->defaultItems(4),
                                    ]),

                                Forms\Components\Tabs\Tab::make('Experience')
                                    ->schema([
                                        Forms\Components\TextInput::make('sections_content.experience.eyebrow')
                                            ->label('Eyebrow'),
                                        Forms\Components\TextInput::make('sections_content.experience.title_line1')
                                            ->label('Titre Ligne 1'),
                                        Forms\Components\TextInput::make('sections_content.experience.title_line2')
                                            ->label('Titre Ligne 2'),
                                        Forms\Components\Textarea::make('sections_content.experience.description')
                                            ->label('Description')
                                            ->rows(2),
                                        Forms\Components\TextInput::make('sections_content.experience.cta_text')
                                            ->label('Texte CTA'),
                                        Forms\Components\TextInput::make('sections_content.experience.cta_link')
                                            ->label('Lien CTA'),
                                    ])->columns(2),

                                Forms\Components\Tabs\Tab::make('Comment ca marche')
                                    ->schema([
                                        Forms\Components\TextInput::make('sections_content.how_it_works.badge')
                                            ->label('Badge'),
                                        Forms\Components\Repeater::make('sections_content.how_it_works.steps')
                                            ->label('Etapes')
                                            ->schema([
                                                Forms\Components\TextInput::make('num')
                                                    ->label('Numero'),
                                                Forms\Components\TextInput::make('title')
                                                    ->label('Titre'),
                                                Forms\Components\Textarea::make('desc')
                                                    ->label('Description')
                                                    ->rows(2),
                                            ])->columns(3)
                                            ->defaultItems(3),
                                    ]),

                                Forms\Components\Tabs\Tab::make('CTA Banners')
                                    ->schema([
                                        Forms\Components\TextInput::make('sections_content.cta_banner.eyebrow')
                                            ->label('Eyebrow CTA'),
                                        Forms\Components\TextInput::make('sections_content.cta_banner.button_text')
                                            ->label('Texte Bouton CTA'),
                                        Forms\Components\TextInput::make('sections_content.cta_banner.button_link')
                                            ->label('Lien Bouton CTA'),
                                        Forms\Components\Section::make('Banniere Promotion')
                                            ->schema([
                                                Forms\Components\TextInput::make('sections_content.promotion_banner.badge')
                                                    ->label('Badge'),
                                                Forms\Components\TextInput::make('sections_content.promotion_banner.title_line1')
                                                    ->label('Titre Ligne 1'),
                                                Forms\Components\TextInput::make('sections_content.promotion_banner.title_line2')
                                                    ->label('Titre Ligne 2'),
                                                Forms\Components\Textarea::make('sections_content.promotion_banner.description')
                                                    ->label('Description')
                                                    ->rows(2),
                                                Forms\Components\TextInput::make('sections_content.promotion_banner.cta_text')
                                                    ->label('Texte CTA'),
                                                Forms\Components\TextInput::make('sections_content.promotion_banner.cta_link')
                                                    ->label('Lien CTA'),
                                                Forms\Components\TextInput::make('sections_content.promotion_banner.side_note')
                                                    ->label('Note laterale'),
                                            ])->columns(2),
                                    ]),

                                Forms\Components\Tabs\Tab::make('Temoignages Section')
                                    ->schema([
                                        Forms\Components\TextInput::make('sections_content.testimonials.badge')
                                            ->label('Badge'),
                                        Forms\Components\TextInput::make('sections_content.testimonials.heading')
                                            ->label('Titre'),
                                        Forms\Components\Textarea::make('sections_content.testimonials.description')
                                            ->label('Description')
                                            ->rows(2),
                                    ]),
                            ]),
                    ]),
            ]);
    }

    protected static function fleetTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('Page Flotte')
            ->icon('heroicon-o-truck')
            ->schema([
                Forms\Components\Section::make('Hero Flotte')
                    ->schema([
                        Forms\Components\TextInput::make('sections_content.fleet.hero_eyebrow')
                            ->label('Eyebrow'),
                        Forms\Components\TextInput::make('sections_content.fleet.hero_title')
                            ->label('Titre'),
                        Forms\Components\Textarea::make('sections_content.fleet.hero_subtitle')
                            ->label('Sous-titre')
                            ->rows(2),
                    ])->columns(2),

                Forms\Components\Section::make('Configuration')
                    ->schema([
                        Forms\Components\Select::make('sections_content.fleet.default_columns')
                            ->label('Colonnes par defaut')
                            ->options([
                                '2' => '2 colonnes',
                                '3' => '3 colonnes',
                                '4' => '4 colonnes',
                            ])
                            ->default('3'),
                        Forms\Components\Select::make('sections_content.fleet.default_sort')
                            ->label('Tri par defaut')
                            ->options([
                                'price_asc' => 'Prix croissant',
                                'price_desc' => 'Prix decroissant',
                                'year_desc' => 'Plus recent',
                                'year_asc' => 'Plus ancien',
                                'mileage_asc' => 'Kilometrage croissant',
                            ])
                            ->default('price_asc'),
                        Forms\Components\Select::make('sections_content.fleet.page_size')
                            ->label('Elements par page')
                            ->options([
                                '6' => '6',
                                '12' => '12',
                                '18' => '18',
                                '24' => '24',
                            ])
                            ->default('12'),
                        Forms\Components\Select::make('sections_content.fleet.theme')
                            ->label('Theme')
                            ->options([
                                'light' => 'Clair',
                                'dark' => 'Sombre',
                            ])
                            ->default('light'),
                        Forms\Components\TextInput::make('sections_content.fleet.default_location')
                            ->label('Localisation par defaut')
                            ->placeholder('Casablanca - Aeroport Mohammed V (CMN)'),
                    ])->columns(3),

                Forms\Components\Section::make('Filtres Actifs')
                    ->schema([
                        Forms\Components\Grid::make(3)->schema([
                            Forms\Components\Toggle::make('sections_content.fleet.show_lifestyle_filter')
                                ->label('Filtre Lifestyle')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_content.fleet.show_category_filter')
                                ->label('Filtre Categorie')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_content.fleet.show_transmission_filter')
                                ->label('Filtre Transmission')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_content.fleet.show_fuel_filter')
                                ->label('Filtre Carburant')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_content.fleet.show_seats_filter')
                                ->label('Filtre Places')
                                ->default(true),
                            Forms\Components\Toggle::make('sections_content.fleet.show_price_filter')
                                ->label('Filtre Prix')
                                ->default(true),
                        ]),
                    ]),

                Forms\Components\Section::make('Points de Retrait')
                    ->description('Liste des lieux de retrait/depot disponibles')
                    ->schema([
                        Forms\Components\Repeater::make('sections_content.fleet.locations')
                            ->label('Localisations')
                            ->schema([
                                Forms\Components\TextInput::make('id')
                                    ->label('ID')
                                    ->placeholder('cmn'),
                                Forms\Components\TextInput::make('city')
                                    ->label('Ville')
                                    ->placeholder('Casablanca'),
                                Forms\Components\TextInput::make('name')
                                    ->label('Nom du lieu')
                                    ->placeholder('Aeroport Mohammed V (CMN)'),
                            ])->columns(3)
                            ->defaultItems(6)
                            ->reorderable(),
                    ]),
            ]);
    }

    protected static function servicesTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('Services')
            ->icon('heroicon-o-star')
            ->schema([
                Forms\Components\Section::make('Configuration Services')
                    ->schema([
                        Forms\Components\TextInput::make('sections_content.services.eyebrow')
                            ->label('Eyebrow'),
                        Forms\Components\TextInput::make('sections_content.services.title')
                            ->label('Titre'),
                        Forms\Components\Textarea::make('sections_content.services.subtitle')
                            ->label('Sous-titre')
                            ->rows(2),
                        Forms\Components\Select::make('sections_content.services.columns')
                            ->label('Colonnes')
                            ->options([
                                '2' => '2 colonnes',
                                '3' => '3 colonnes',
                                '4' => '4 colonnes',
                            ])
                            ->default('3'),
                        Forms\Components\Select::make('sections_content.services.theme')
                            ->label('Theme')
                            ->options([
                                'light' => 'Clair',
                                'dark' => 'Sombre',
                            ])
                            ->default('dark'),
                        Forms\Components\Select::make('sections_content.services.layout_style')
                            ->label('Style de mise en page')
                            ->options([
                                'cards' => 'Cartes',
                                'minimal' => 'Minimal',
                                'banner' => 'Banniere',
                            ])
                            ->default('cards'),
                    ])->columns(3),

                Forms\Components\Section::make('Liste des Services')
                    ->schema([
                        Forms\Components\Repeater::make('sections_content.services.items')
                            ->label('Services')
                            ->schema([
                                Forms\Components\TextInput::make('id')
                                    ->label('ID')
                                    ->placeholder('srv-1'),
                                Forms\Components\TextInput::make('title')
                                    ->label('Titre'),
                                Forms\Components\Textarea::make('description')
                                    ->label('Description')
                                    ->rows(2),
                                Forms\Components\TextInput::make('icon')
                                    ->label('Icone (Lucide)')
                                    ->placeholder('Globe'),
                                Forms\Components\TextInput::make('badge')
                                    ->label('Badge'),
                                Forms\Components\TextInput::make('color')
                                    ->label('Couleur')
                                    ->placeholder('amber'),
                            ])->columns(3)
                            ->defaultItems(6)
                            ->reorderable(),
                    ]),
            ]);
    }

    protected static function statsTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('Statistiques')
            ->icon('heroicon-o-chart-bar')
            ->schema([
                Forms\Components\Section::make('Configuration')
                    ->schema([
                        Forms\Components\Select::make('stats_config.columns')
                            ->label('Colonnes')
                            ->options([
                                '2' => '2 colonnes',
                                '3' => '3 colonnes',
                                '4' => '4 colonnes',
                            ])
                            ->default('4'),
                        Forms\Components\Select::make('stats_config.theme')
                            ->label('Theme')
                            ->options([
                                'light' => 'Clair',
                                'dark' => 'Sombre',
                            ])
                            ->default('dark'),
                        Forms\Components\Select::make('stats_config.height')
                            ->label('Hauteur')
                            ->options([
                                'compact' => 'Compact',
                                'normal' => 'Normal',
                                'tall' => 'Grand',
                            ])
                            ->default('normal'),
                        Forms\Components\Select::make('stats_config.text_size')
                            ->label('Taille du texte')
                            ->options([
                                'small' => 'Petit',
                                'normal' => 'Normal',
                                'large' => 'Grand',
                            ])
                            ->default('normal'),
                    ])->columns(4),

                Forms\Components\Section::make('Elements Statistiques')
                    ->schema([
                        Forms\Components\Repeater::make('stats_config.items')
                            ->label('Statistiques')
                            ->schema([
                                Forms\Components\TextInput::make('id')
                                    ->label('ID'),
                                Forms\Components\TextInput::make('value')
                                    ->label('Valeur')
                                    ->placeholder('2,400+'),
                                Forms\Components\TextInput::make('label')
                                    ->label('Label')
                                    ->placeholder('Clients satisfaits'),
                                Forms\Components\TextInput::make('icon')
                                    ->label('Icone (Lucide)')
                                    ->placeholder('Users'),
                                Forms\Components\TextInput::make('color')
                                    ->label('Couleur')
                                    ->placeholder('primary'),
                            ])->columns(5)
                            ->defaultItems(4)
                            ->reorderable(),
                    ]),
            ]);
    }

    protected static function testimonialsTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('Temoignages')
            ->icon('heroicon-o-chat-bubble-left-right')
            ->schema([
                Forms\Components\Repeater::make('testimonials')
                    ->label('Temoignages')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nom')
                            ->required(),
                        Forms\Components\TextInput::make('role')
                            ->label('Role / Titre')
                            ->placeholder('CEO, Entreprise XYZ'),
                        Forms\Components\Textarea::make('content')
                            ->label('Temoignage')
                            ->rows(3)
                            ->required(),
                        Forms\Components\TextInput::make('rating')
                            ->label('Note (1-5)')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(5)
                            ->default(5),
                        Forms\Components\FileUpload::make('image')
                            ->image()
                            ->directory('testimonials')
                            ->label('Photo'),
                    ])->columns(2)
                    ->defaultItems(3)
                    ->reorderable(),
            ]);
    }

    protected static function faqTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('FAQ')
            ->icon('heroicon-o-question-mark-circle')
            ->schema([
                Forms\Components\Section::make('Configuration FAQ')
                    ->schema([
                        Forms\Components\TextInput::make('sections_content.faq.title')
                            ->label('Titre'),
                        Forms\Components\Textarea::make('sections_content.faq.subtitle')
                            ->label('Sous-titre')
                            ->rows(2),
                        Forms\Components\TextInput::make('sections_content.faq.badge')
                            ->label('Badge'),
                        Forms\Components\TextInput::make('sections_content.faq.contact_text')
                            ->label('Texte Contact'),
                        Forms\Components\TextInput::make('sections_content.faq.contact_link')
                            ->label('Lien Contact'),
                    ])->columns(2),

                Forms\Components\Section::make('Questions & Reponses')
                    ->schema([
                        Forms\Components\Repeater::make('faq_config')
                            ->label('FAQ Items')
                            ->schema([
                                Forms\Components\TextInput::make('q')
                                    ->label('Question')
                                    ->required()
                                    ->columnSpanFull(),
                                Forms\Components\Textarea::make('a')
                                    ->label('Reponse')
                                    ->rows(3)
                                    ->columnSpanFull(),
                            ])->defaultItems(3)
                            ->reorderable(),
                    ]),
            ]);
    }

    protected static function conciergeTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('Conciergerie')
            ->icon('heroicon-o-sparkles')
            ->schema([
                Forms\Components\Section::make('Banniere Conciergerie')
                    ->schema([
                        Forms\Components\TextInput::make('concierge_config.title')
                            ->label('Titre'),
                        Forms\Components\Textarea::make('concierge_config.text')
                            ->label('Texte')
                            ->rows(3),
                        Forms\Components\TextInput::make('concierge_config.badge')
                            ->label('Badge'),
                    ]),

                Forms\Components\Section::make('Features / Avantages')
                    ->description('Les 3 avantages affiches sur la page d\'accueil')
                    ->schema([
                        Forms\Components\Repeater::make('features_config')
                            ->label('Features')
                            ->schema([
                                Forms\Components\TextInput::make('icon')
                                    ->label('Icone (Lucide)')
                                    ->placeholder('Crown'),
                                Forms\Components\TextInput::make('title')
                                    ->label('Titre')
                                    ->required(),
                                Forms\Components\Textarea::make('desc')
                                    ->label('Description')
                                    ->rows(2)
                                    ->required(),
                            ])->columns(3)
                            ->defaultItems(3),
                    ]),
            ]);
    }

    protected static function offersTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('Offres & Tarifs')
            ->icon('heroicon-o-currency-dollar')
            ->schema([
                Forms\Components\Section::make('Prix par Categorie')
                    ->schema([
                        Forms\Components\TextInput::make('category_prices.eco')
                            ->label('Economique (DH/jour)')
                            ->numeric(),
                        Forms\Components\TextInput::make('category_prices.standard')
                            ->label('Standard (DH/jour)')
                            ->numeric(),
                        Forms\Components\TextInput::make('category_prices.suv')
                            ->label('SUV (DH/jour)')
                            ->numeric(),
                        Forms\Components\TextInput::make('category_prices.luxury')
                            ->label('Luxe (DH/jour)')
                            ->numeric(),
                        Forms\Components\TextInput::make('category_prices.sport')
                            ->label('Sport (DH/jour)')
                            ->numeric(),
                    ])->columns(5),

                Forms\Components\Section::make('Offres Speciales')
                    ->schema([
                        Forms\Components\Repeater::make('special_offers')
                            ->label('Offres')
                            ->schema([
                                Forms\Components\TextInput::make('category')
                                    ->label('Categorie')
                                    ->placeholder('luxury'),
                                Forms\Components\TextInput::make('discount')
                                    ->label('Remise (%)')
                                    ->numeric()
                                    ->suffix('%'),
                                Forms\Components\TextInput::make('end_date')
                                    ->label('Date de fin')
                                    ->placeholder('2026-12-31'),
                                Forms\Components\Toggle::make('active')
                                    ->label('Active')
                                    ->default(true),
                            ])->columns(4)
                            ->defaultItems(2)
                            ->reorderable(),
                    ]),
            ]);
    }

    protected static function headerFooterTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('Header & Footer')
            ->icon('heroicon-o-bars-3')
            ->schema([
                Forms\Components\Section::make('Header')
                    ->schema([
                        Forms\Components\Toggle::make('header_config.sticky')
                            ->label('Header Sticky')
                            ->default(true),
                        Forms\Components\Toggle::make('header_config.transparent_hero')
                            ->label('Transparent sur Hero')
                            ->default(true),
                        Forms\Components\Repeater::make('header_config.menu_links')
                            ->label('Liens du Menu')
                            ->schema([
                                Forms\Components\TextInput::make('label')
                                    ->label('Label')
                                    ->placeholder('Flotte'),
                                Forms\Components\TextInput::make('url')
                                    ->label('URL')
                                    ->placeholder('/fleet'),
                            ])->columns(2)
                            ->defaultItems(5)
                            ->reorderable(),
                    ]),

                Forms\Components\Section::make('Footer')
                    ->schema([
                        Forms\Components\TextInput::make('footer_config.address')
                            ->label('Adresse'),
                        Forms\Components\TextInput::make('footer_config.phone')
                            ->label('Telephone'),
                        Forms\Components\TextInput::make('footer_config.email')
                            ->label('Email'),
                        Forms\Components\TextInput::make('footer_config.social_links.facebook')
                            ->label('Facebook URL'),
                        Forms\Components\TextInput::make('footer_config.social_links.instagram')
                            ->label('Instagram URL'),
                        Forms\Components\TextInput::make('footer_config.social_links.whatsapp')
                            ->label('WhatsApp URL'),
                        Forms\Components\TextInput::make('footer_config.social_links.tiktok')
                            ->label('TikTok URL'),
                    ])->columns(3),
            ]);
    }

    protected static function seoTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('SEO')
            ->icon('heroicon-o-magnifying-glass')
            ->schema([
                Forms\Components\Section::make('Configuration SEO')
                    ->schema([
                        Forms\Components\TextInput::make('seo_config.title')
                            ->label('Titre SEO')
                            ->maxLength(70)
                            ->placeholder('Vectoria - Location de vehicules premium au Maroc'),
                        Forms\Components\Textarea::make('seo_config.description')
                            ->label('Description SEO')
                            ->maxLength(160)
                            ->rows(3)
                            ->placeholder('Decouvrez notre flotte de vehicules premium...'),
                        Forms\Components\TextInput::make('seo_config.keywords')
                            ->label('Mots-cles SEO')
                            ->placeholder('location voiture, casablanca, luxe, premium'),
                        Forms\Components\FileUpload::make('seo_config.og_image')
                            ->image()
                            ->directory('seo')
                            ->label('Image Open Graph'),
                    ]),
            ]);
    }

    protected static function socialTab(): Forms\Components\Tabs\Tab
    {
        return Forms\Components\Tabs\Tab::make('Social & Theme')
            ->icon('heroicon-o-heart')
            ->schema([
                Forms\Components\Section::make('Reseaux Sociaux')
                    ->schema([
                        Forms\Components\TextInput::make('social_hub.facebook')
                            ->label('Facebook URL'),
                        Forms\Components\TextInput::make('social_hub.instagram')
                            ->label('Instagram URL'),
                        Forms\Components\TextInput::make('social_hub.whatsapp')
                            ->label('WhatsApp URL'),
                        Forms\Components\TextInput::make('social_hub.tiktok')
                            ->label('TikTok URL'),
                    ])->columns(2),

                Forms\Components\Section::make('Theme')
                    ->schema([
                        Forms\Components\TextInput::make('theme_config.border_radius')
                            ->label('Border Radius')
                            ->placeholder('24px'),
                        Forms\Components\Select::make('theme_config.button_style')
                            ->label('Style Boutons')
                            ->options([
                                'pill' => 'Pill (arrondi)',
                                'rounded' => 'Rounded',
                                'square' => 'Carre',
                            ])
                            ->default('pill'),
                        Forms\Components\Toggle::make('theme_config.glassmorphism')
                            ->label('Glassmorphism')
                            ->default(true),
                        Forms\Components\TextInput::make('theme_config.font_family')
                            ->label('Police')
                            ->placeholder('Inter'),
                    ])->columns(2),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'edit' => Pages\EditStorefront::route('/{record}/edit'),
        ];
    }
}
