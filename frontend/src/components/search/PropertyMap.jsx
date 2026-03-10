import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup, useMapEvents } from 'react-leaflet';
import { divIcon, LatLngBounds } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const FitBoundsToMarkers = ({ properties }) => {
    const map = useMap();

    useEffect(() => {
        if (!properties || properties.length === 0) return;

        const fitBounds = () => {
            const bounds = new LatLngBounds();
            let hasValidCoords = false;

            properties.forEach(prop => {
                if (prop.lat && prop.lng) {
                    bounds.extend([prop.lat, prop.lng]);
                    hasValidCoords = true;
                }
            });

            if (hasValidCoords) {
                try {
                    map.invalidateSize();
                    map.fitBounds(bounds, {
                        padding: [50, 50],
                        maxZoom: 14,
                        animate: true,
                        duration: 1
                    });
                } catch (e) {
                    console.warn("Bounds error:", e);
                }
            }
        };

        fitBounds();

        const resizeObserver = new ResizeObserver(() => {
            fitBounds();
        });
        resizeObserver.observe(map.getContainer());

        return () => resizeObserver.disconnect();

    }, [properties, map]);
    return null;
};

const MapEventsHandler = ({ onMove, onMoveEnd }) => {
    useMapEvents({
        dragstart: onMove,
        zoomstart: onMove,
        moveend: (e) => onMoveEnd(e.target.getBounds()),
    });
    return null;
};

const ResizeMap = () => {
    const map = useMap();
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        const container = map.getContainer();
        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, [map]);
    return null;
};

const PropertyMap = ({ properties, hoveredId, onSearchArea }) => {
    const navigate = useNavigate();
    const defaultCenter = [51.1657, 10.4515];

    const [currentBounds, setCurrentBounds] = React.useState(null);
    const [hasMoved, setHasMoved] = React.useState(false);

    // Reset button when properties change (user manually searched or initial load)
    useEffect(() => {
        setHasMoved(false);
    }, [properties]);

    // --- PINS (White -> Arrivio Dark Green) ---
    const createPriceIcon = (price, isSelected) => {
        return divIcon({
            className: 'price-pin',
            html: `
                <div class="pin-bubble ${isSelected ? 'selected scale-110 shadow-xl' : 'shadow-md'}">
                    €${price.toLocaleString()}
                </div>
            `,
            iconSize: [64, 32],
            iconAnchor: [32, 16]
        });
    };

    return (
        <div className="h-full w-full relative z-0 property-map-container overflow-hidden">
            <style>
                {`
                    .pin-bubble {
                        background: white;
                        color: #2C3E30;
                        padding: 6px 10px;
                        border-radius: 99px;
                        font-weight: 700;
                        font-size: 13px;
                        border: 1px solid #EAE8E4;
                        transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        white-space: nowrap;
                    }
                    .pin-bubble.selected {
                        background: #2C3E30;
                        color: white !important;
                        border-color: #2C3E30;
                        z-index: 1000;
                    }
                    .leaflet-popup-content-wrapper {
                        padding: 0;
                        overflow: hidden;
                        border-radius: 12px;
                    }
                    .leaflet-popup-content {
                        margin: 0;
                        width: 220px !important;
                    }
                    .leaflet-popup-tip-container {
                        display: none;
                    }
                `}
            </style>

            {/* FLOATING "SEARCH THIS AREA" BUTTON */}
            <AnimatePresence>
                {hasMoved && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 10, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="absolute top-4 left-1/2 z-[1000]"
                    >
                        <button
                            onClick={() => {
                                setHasMoved(false);
                                if (onSearchArea && currentBounds) onSearchArea(currentBounds);
                            }}
                            className="bg-white text-[#2C3E30] px-6 py-2.5 rounded-full shadow-2xl border border-[#EAE8E4] flex items-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-[#2C3E30] hover:text-white transition-all active:scale-95 shadow-[#2C3E30]/10"
                        >
                            <Search size={14} strokeWidth={2.5} />
                            Search this area
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <MapContainer
                center={defaultCenter}
                zoom={6}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", background: "#F4F3F0" }}
                zoomControl={false}
            >
                {/* PREMIUM MINIMALIST THEME (CartoDB Positron) */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap'
                />

                <FitBoundsToMarkers properties={properties} />
                <MapEventsHandler
                    onMove={() => setHasMoved(true)}
                    onMoveEnd={(bounds) => setCurrentBounds(bounds)}
                />

                {properties.map(property => {
                    if (!property.lat || !property.lng) return null;
                    const isSelected = property.id === hoveredId;

                    return (
                        <Marker
                            key={property.id}
                            position={[property.lat, property.lng]}
                            icon={createPriceIcon(property.price, isSelected)}
                            zIndexOffset={isSelected ? 1000 : 1}
                            eventHandlers={{
                                mouseover: (e) => {
                                    if (!isSelected) e.target.openPopup();
                                },
                            }}
                        >
                            <Popup closeButton={false} offset={[0, -10]}>
                                <div
                                    className="cursor-pointer group"
                                    onClick={() => navigate(`/property/${property.id}`)}
                                >
                                    <div className="h-32 w-full overflow-hidden">
                                        <img
                                            src={property.image}
                                            alt={property.title}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-3 bg-white">
                                        <h4 className="font-serif font-bold text-[#2C3E30] text-sm truncate mb-1">
                                            {property.title}
                                        </h4>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-[#2C3E30]/60">{property.city}</span>
                                            <span className="font-bold text-[#2C3E30]">€{property.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                <ResizeMap />
            </MapContainer>
        </div>
    );
};

export default PropertyMap;