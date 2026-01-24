import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { divIcon, LatLngBounds } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

const FitBoundsToMarkers = ({ properties }) => {
    const map = useMap();
    useEffect(() => {
        if (properties && properties.length > 0) {
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
                    map.fitBounds(bounds, { padding: [50, 50] });
                } catch (e) {
                    console.warn("Bounds error:", e);
                }
            }
        }
    }, [properties, map]);
    return null;
};

const PropertyMap = ({ properties, hoveredId }) => {
    const navigate = useNavigate();
    const defaultCenter = [51.1657, 10.4515]; 

    // --- PINS (White -> Dark Green) ---
    const createPriceIcon = (price, isSelected) => {
        return divIcon({
            className: 'price-pin', 
            html: `
                <div class="pin-bubble ${isSelected ? 'selected' : ''}">
                    €${price.toLocaleString()}
                </div>
            `,
            iconSize: [60, 40],
            iconAnchor: [30, 40] 
        });
    };

    return (
        <div className="h-full w-full relative z-0">
            <MapContainer 
                center={defaultCenter} 
                zoom={6} 
                scrollWheelZoom={true} 
                // Dark background prevents white flashes while loading
                style={{ height: "100%", width: "100%", background: "#222" }} 
                zoomControl={false}
            >
                {/* 1. BASE: SATELLITE IMAGERY (Beautiful Earth) */}
                <TileLayer
                    attribution='Tiles &copy; Esri'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />

                {/* 2. OVERLAY: LABELS & PLACES (City Names Only - No messy road lines) */}
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                />

                <FitBoundsToMarkers properties={properties} />

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
                                click: () => navigate(`/property/${property.id}`),
                            }}
                        />
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default PropertyMap;