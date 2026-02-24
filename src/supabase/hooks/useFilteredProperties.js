import { useMemo } from "react";

/**
 * Filters a list of properties based on the current search/filter state.
 * Returns memoized filteredProperties and suggestions arrays.
 */
export function useFilteredProperties(properties, { filters, searchTerm, activeTab, mapSearchBounds }) {
    const safeProperties = properties || [];

    const filteredProperties = useMemo(() => {
        return safeProperties.filter(p => {
            // City / Map bounds
            const matchesCity =
                mapSearchBounds || filters.city === "All" || p.city === filters.city;

            let matchesBounds = true;
            if (mapSearchBounds) {
                const sw = mapSearchBounds._southWest;
                const ne = mapSearchBounds._northEast;
                matchesBounds =
                    p.lat >= sw.lat &&
                    p.lat <= ne.lat &&
                    p.lng >= sw.lng &&
                    p.lng <= ne.lng;
            }

            // Free-text search
            const searchLower = searchTerm.trim().toLowerCase();
            const matchesSearch =
                searchLower === "" ||
                p.title?.toLowerCase().includes(searchLower) ||
                p.city?.toLowerCase().includes(searchLower) ||
                p.tags?.some(tag => tag.toLowerCase().includes(searchLower));

            // Price
            const price = p.price || 0;
            const matchesPrice = price >= filters.priceMin && price <= filters.priceMax;

            // Floor
            let matchesFloor = true;
            if (filters.floor !== "Any") {
                if (filters.floor === "5th+") {
                    const floorNum = parseInt(p.details?.floor) || 0;
                    matchesFloor = floorNum >= 5;
                } else {
                    matchesFloor = p.details?.floor === filters.floor;
                }
            }

            // Tags / Amenities
            const matchesTags =
                filters.tags.length === 0 ||
                filters.tags.every(tag => {
                    const lowerTag = tag.toLowerCase();
                    const isInTags = p.tags?.some(t => t.toLowerCase() === lowerTag);
                    const isInAmenities = p.amenities
                        ? Object.values(p.amenities).some(categoryList =>
                            Array.isArray(categoryList) && categoryList.some(a => a.toLowerCase() === lowerTag)
                        )
                        : false;
                    return isInTags || isInAmenities;
                });

            // Furniture
            const matchesFurniture =
                filters.furniture === "Any" ||
                (filters.furniture === "Furnished" && (p.details?.furnished === true || p.tags?.some(t => t.toLowerCase().includes("furnish")))) ||
                (filters.furniture === "Unfurnished" && (p.details?.furnished === false || !p.tags?.some(t => t.toLowerCase().includes("furnish"))));

            // Availability dates
            let matchesAvailability = true;
            if (filters.availableFrom) {
                const userStart = new Date(filters.availableFrom);
                userStart.setHours(0, 0, 0, 0);
                const userEnd = filters.availableTo ? new Date(filters.availableTo) : null;
                if (userEnd) userEnd.setHours(23, 59, 59, 999);

                const hasSlot = p.availability?.some(slot => {
                    if (slot.status !== 'available') return false;
                    const slotStart = new Date(slot.start_date);
                    const slotEnd = slot.end_date ? new Date(slot.end_date) : null;
                    const startsBeforeMoveIn = slotStart <= userStart;
                    const coversDuration = !userEnd || (!slotEnd || slotEnd >= userEnd);
                    return startsBeforeMoveIn && coversDuration;
                });
                if (!hasSlot) matchesAvailability = false;
            }

            // Property type
            const matchesPropertyType =
                !filters.propertyTypes ||
                filters.propertyTypes.length === 0 ||
                filters.propertyTypes.some(type => {
                    if (p.type === type) return true;

                    const keywords = [type.toLowerCase()];
                    if (type === "Studio") keywords.push("1 room", "studio");
                    if (type === "Private Room") keywords.push("room", "wg", "shared");
                    if (type === "Shared Room" || type === "Shared room") keywords.push("shared", "roommate");
                    if (type === "Apartment") keywords.push("flat", "appartment", "apartment", "penthouse", "loft");

                    const textToCheck = (p.title + " " + (p.tags?.join(" ") || "")).toLowerCase();
                    return keywords.some(k => textToCheck.includes(k));
                });

            // Tab-based audience filter
            let matchesTab = true;
            if (activeTab !== "Anyone") {
                const type = p.type || "";
                const details = p.details || {};

                if (activeTab === "Students") {
                    matchesTab = type === "Student Residence" || type === "Private Room" || p.price < 800;
                } else if (activeTab === "Professionals") {
                    matchesTab = type === "Apartment" || type === "Studio";
                } else if (activeTab === "Families") {
                    matchesTab = (details.bedrooms >= 2) || (details.size > 50) || type === "Apartment";
                }
            }

            return (
                matchesCity &&
                matchesSearch &&
                matchesPrice &&
                matchesFloor &&
                matchesTags &&
                matchesAvailability &&
                matchesPropertyType &&
                matchesFurniture &&
                matchesTab &&
                matchesBounds
            );
        });
    }, [safeProperties, filters, searchTerm, activeTab, mapSearchBounds]);

    const suggestions = useMemo(() => {
        if (searchTerm.trim().length === 0) return [];
        return safeProperties
            .filter(
                p =>
                    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.city?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5);
    }, [safeProperties, searchTerm]);

    return { filteredProperties, suggestions };
}
