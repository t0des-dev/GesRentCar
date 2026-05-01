<x-filament-widgets::widget>
    <x-filament::section>
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold tracking-tight flex items-center gap-2">
                <x-heroicon-o-map-pin class="w-5 h-5 text-primary-600" />
                Suivi GPS de la Flotte (Temps Réel)
            </h2>
            <div class="flex gap-2">
                <span class="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span> Disponible
                </span>
                <span class="flex items-center gap-1 text-xs font-medium text-gray-500">
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span> En Location
                </span>
            </div>
        </div>

        <div 
            x-data="{
                vehicles: {{ json_encode($vehicles) }},
                map: null,
                init() {
                    this.map = L.map($refs.map).setView([33.5731, -7.5898], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(this.map);

                    this.vehicles.forEach(v => {
                        const color = v.status === 'available' ? '#22c55e' : '#3b82f6';
                        const marker = L.circleMarker([v.lat, v.lng], {
                            radius: 8,
                            fillColor: color,
                            color: '#fff',
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.8
                        }).addTo(this.map);

                        marker.bindPopup(`
                            <div class='p-2'>
                                <strong class='text-sm'>${v.name}</strong><br/>
                                <span class='text-xs text-gray-500'>${v.plate}</span><br/>
                                <span class='inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase' style='background: ${color}20; color: ${color}'>
                                    ${v.status === 'available' ? 'Disponible' : 'Loué'}
                                </span>
                            </div>
                        `);
                    });
                }
            }"
            class="relative w-full"
        >
            <div 
                x-ref="map" 
                class="w-full h-[450px] rounded-xl border border-gray-200 z-0"
                wire:ignore
            ></div>

            {{-- Load Leaflet CSS/JS --}}
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
