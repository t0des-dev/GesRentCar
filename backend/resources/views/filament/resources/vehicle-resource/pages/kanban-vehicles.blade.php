<x-filament-panels::page>
    <div 
        class="flex gap-4 overflow-x-auto pb-4 h-[75vh]"
        x-data="{
            draggingId: null,
            handleDragStart(e, id) {
                this.draggingId = id;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', id);
                setTimeout(() => e.target.classList.add('opacity-50'), 0);
            },
            handleDragEnd(e) {
                this.draggingId = null;
                e.target.classList.remove('opacity-50');
            },
            handleDragOver(e) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            },
            handleDrop(e, status) {
                e.preventDefault();
                let id = e.dataTransfer.getData('text/plain');
                if (id) {
                    @this.call('updateStatus', id, status);
                }
            }
        }"
    >
        @foreach($this->getColumns() as $status => $title)
            <div 
                class="flex-shrink-0 w-80 bg-gray-100 dark:bg-gray-800/50 rounded-xl p-4 flex flex-col gap-4 border border-gray-200 dark:border-gray-700"
                @dragover="handleDragOver"
                @drop="handleDrop($event, '{{ $status }}')"
            >
                <div class="flex items-center justify-between">
                    <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ $title }}</h3>
                    <span class="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {{ count($this->getVehicles()[$status]) }}
                    </span>
                </div>

                <div class="flex flex-col gap-3 overflow-y-auto min-h-[100px]">
                    @foreach($this->getVehicles()[$status] as $vehicle)
                        <div 
                            draggable="true"
                            @dragstart="handleDragStart($event, {{ $vehicle->id }})"
                            @dragend="handleDragEnd($event)"
                            class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-grab active:cursor-grabbing hover:border-primary-500 transition-colors"
                        >
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-bold bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400 px-2 py-1 rounded-md">
                                    {{ $vehicle->plate }}
                                </span>
                                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                                    {{ number_format($vehicle->price_per_day, 0) }} MAD
                                </span>
                            </div>
                            
                            <h4 class="font-bold text-md text-gray-900 dark:text-white line-clamp-1">
                                {{ $vehicle->brand }} {{ $vehicle->model }}
                            </h4>
                            
                            <div class="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <div class="flex items-center gap-1">
                                    <x-heroicon-o-arrow-path class="w-4 h-4"/>
                                    <span>{{ number_format($vehicle->mileage, 0, ',', ' ') }} km</span>
                                </div>
                                @if($vehicle->image_url)
                                    <div class="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <img src="{{ Storage::url($vehicle->image_url) }}" alt="photo" class="w-full h-full object-cover" />
                                    </div>
                                @endif
                            </div>
                        </div>
                    @endforeach
                    
                    @if(count($this->getVehicles()[$status]) === 0)
                        <div class="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-400 dark:text-gray-500 text-sm">
                            Glissez un véhicule ici
                        </div>
                    @endif
                </div>
            </div>
        @endforeach
    </div>
</x-filament-panels::page>
