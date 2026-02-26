import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Map as MapIcon,
  List as ListIcon,
  Search as SearchIcon,
  X as CloseIcon
} from "lucide-react";
import { motion } from "framer-motion";

import { useProperties } from "@/supabase/hooks/useProperties";
import { useSearchFilters } from "@/supabase/hooks/useSearchFilters";
import { useFilteredProperties } from "@/supabase/hooks/useFilteredProperties";

import PropertyMap from "../components/search/PropertyMap";
import FilterPanel from "../components/search/FilterPanel";
import PropertyCard from "@/components/property/PropertyCard";
import SearchSkeleton from "@/components/skeletons/SearchSkeleton";
import SearchFiltersBar from "../components/search/SearchFiltersBar";
import SearchTabs from "../components/search/SearchTabs";
import SearchHeader from "../components/search/SearchHeader";
import CityGrid from "../components/search/CityGrid";


const Search = () => {
  const navigate = useNavigate();

  // Data
  const { properties, loading } = useProperties();

  // Filter/search state (extracted hook)
  const {
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    searchType,
    setSearchType,
    showFilters,
    setShowFilters,
    showMap,
    setShowMap,
    mapSearchBounds,
    setMapSearchBounds,
    resetFilters
  } = useSearchFilters();

  // Computed filtered results (memoized)
  const { filteredProperties } = useFilteredProperties(properties, {
    filters,
    searchTerm,
    activeTab,
    mapSearchBounds
  });

  // Local UI state
  const [hoveredId, setHoveredId] = useState(null);

  // Stable callbacks
  const handleOpenFilters = useCallback(() => setShowFilters(true), [setShowFilters]);
  const handleCloseFilters = useCallback(() => setShowFilters(false), [setShowFilters]);
  const handleToggleMap = useCallback(() => setShowMap(prev => !prev), [setShowMap]);
  const handleMapSearchArea = useCallback((bounds) => setMapSearchBounds(bounds), [setMapSearchBounds]);
  const handleHoverEnter = useCallback((id) => setHoveredId(id), []);
  const handleHoverLeave = useCallback(() => setHoveredId(null), []);

  if (loading) {
    return <SearchSkeleton />;
  }

  return (
    <div className="min-h-screen w-full bg-[#EAE8E4] pt-20 flex flex-col relative">

      {/* 1. STICKY FILTER BAR */}
      <SearchFiltersBar
        onOpenFilters={handleOpenFilters}
        onReset={resetFilters}
        filters={filters}
        setFilters={setFilters}
        listingCount={filteredProperties.length}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full flex flex-col lg:flex-row gap-8 relative">

        {/* LEFT (LIST) */}
        <div className={`transition-all duration-500 ease-in-out ${showMap ? 'lg:w-[60%]' : 'w-full'}`}>

          {/* 1.5 TYPE TOGGLE (Stays vs Cities) */}
          <div className="flex md:hidden justify-center mb-8">
            <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-[#2C3E30]/5 flex items-center shadow-sm">
              <button
                onClick={() => setSearchType("cities")}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${searchType === "cities" ? "bg-[#2C3E30] text-white shadow-md" : "text-[#2C3E30]/50 hover:text-[#2C3E30]"}`}
              >
                Cities
              </button>
              <button
                onClick={() => setSearchType("stays")}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${searchType === "stays" ? "bg-[#2C3E30] text-white shadow-md" : "text-[#2C3E30]/50 hover:text-[#2C3E30]"}`}
              >
                Stays
              </button>
            </div>
          </div>

          {/* 2. TABS & SEARCH ROW */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#2C3E30]/5 pb-1">
            <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="relative w-full md:w-64 lg:w-72 shrink-0">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2C3E30]/60" size={16} />
              <input
                type="text"
                placeholder="Search by city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#2C3E30]/5 focus:border-[#2C3E30]/20 rounded-full text-sm font-medium text-[#2C3E30] placeholder:text-[#2C3E30]/50 focus:outline-none focus:ring-4 focus:ring-[#2C3E30]/5 transition-all shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {searchType === "cities" ? (
            <CityGrid onCityClick={(cityName) => {
              setSearchTerm(cityName);
              setFilters(prev => ({ ...prev, city: cityName }));
              setSearchType("stays");
            }} />
          ) : (
            <>
              {/* 3. HEADER (Breadcrumbs + Title) */}
              <SearchHeader
                city={filters.city}
                count={filteredProperties.length}
                searchTerm={searchTerm}
              />

              {/* 4. CARDS GRID OR EMPTY STATE */}
              {filteredProperties.length > 0 ? (
                <div className={`grid gap-6 transition-all duration-500 ${showMap
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  }`}>
                  {filteredProperties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      activeTab={activeTab}
                      onClick={() => navigate(`/property/${property.id}`)}
                      onMouseEnter={() => handleHoverEnter(property.id)}
                      onMouseLeave={handleHoverLeave}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/50 rounded-3xl border border-[#EAE8E4] mt-4"
                >
                  <div className="w-16 h-16 bg-[#2C3E30]/5 rounded-full flex items-center justify-center mb-6">
                    <SearchIcon size={32} className="text-[#2C3E30]/40" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#2C3E30] mb-2">No properties found</h3>
                  <p className="text-[#2C3E30]/60 max-w-sm mb-8">
                    We couldn't find any properties matching your current filters. Try adjusting your search or resetting all filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-8 py-3 bg-[#2C3E30] text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    Reset all filters
                  </button>
                </motion.div>
              )}
            </>
          )}

          {/* FLOATING MAP TOGGLE */}
          {filteredProperties.length > 0 && (
            <div className="fixed md:sticky bottom-24 md:bottom-6 left-0 right-0 md:left-auto md:right-auto z-[40] flex justify-center pointer-events-none">
              <button
                onClick={handleToggleMap}
                className="pointer-events-auto bg-[#2C3E30] text-white px-5 py-2 rounded-full shadow-xl flex items-center gap-2 font-medium text-sm"
              >
                {showMap ? (
                  <>
                    <ListIcon size={16} />
                    Show List
                  </>
                ) : (
                  <>
                    <MapIcon size={16} />
                    Show Map
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* MAP CONTAINER */}
        <div
          className={`fixed inset-0 z-[60] pt-20 bg-[#F4F3F0] transition-transform duration-300 ease-in-out lg:sticky lg:top-36 lg:h-[calc(100vh-9rem)] lg:z-0 lg:pt-0 lg:block lg:border-l lg:border-[#2C3E30]/10 rounded-xl overflow-hidden shadow-sm ${showMap
            ? 'translate-y-0 lg:translate-y-0 lg:w-[40%] lg:translate-x-0'
            : 'translate-y-full lg:translate-y-0 lg:w-0 lg:translate-x-full lg:hidden'
            }`}
        >
          {/* MOBILE CLOSE BUTTON */}
          <button
            onClick={handleToggleMap}
            className="absolute top-24 right-6 z-[110] bg-white p-3 rounded-full shadow-xl border border-black/5 lg:hidden text-[#2C3E30] active:scale-95 transition-transform"
          >
            <CloseIcon size={20} />
          </button>

          <PropertyMap
            properties={filteredProperties}
            hoveredId={hoveredId}
            onSearchArea={handleMapSearchArea}
          />
        </div>

      </div>

      {/* FILTER PANEL OVERLAY */}
      <FilterPanel
        isVisible={showFilters}
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
        onClose={handleCloseFilters}
        properties={properties || []}
      />

    </div>
  );
};

export default Search;
