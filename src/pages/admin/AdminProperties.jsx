import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { Plus, Trash2, BedDouble, Bath, Maximize, Layers, Users } from 'lucide-react';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    price: '',
    image: '',
    rating: '',
    tags: '',
    gallery: [''], // Array of gallery URLs
    // Details fields
    beds: '',
    baths: '',
    size: '',
    floor: '',
    maxOccupancy: '',
    description: '',
    amenities_productivity: '',
    amenities_living: '',
    amenities_building: '',
    rules: '',
    refundPolicy: '',
    // Neighborhood
    transport_station: '',
    transport_time: '',
    airport_name: '',
    airport_time: '',
    groceries_name: '',
    groceries_time: '',
    coffee_name: '',
    coffee_time: '',
    park_name: '',
    park_time: '',
    commute_label: '',
    commute_time: '',
    // Location (Map)
    lat: '',
    lng: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [ruleInput, setRuleInput] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('All');

  const COMMON_RULES = [
    'Suitable for children',
    'Pets allowed',
    'No parties or events',
    'No smoking allowed',
    'Quiet hours after 10 PM',
    'No unregistered guests',
    'No illegal substances',
  ];

  // Preset amenities used in the frontend UI
  const PRODUCTIVITY_AMENITIES = ["Fiber Internet", "Dedicated Desk", "Ergonomic Chair", "Monitor"];
  const LIVING_AMENITIES = ["Weekly Cleaning", "Smart TV", "Washer/Dryer", "Fully Furnished"];
  const BUILDING_AMENITIES = ["Elevator", "Secure Entry", "Bike Storage", "Mail Service"];

  useEffect(() => {
    fetchProperties();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setProperties(properties.filter(p => p.id !== id));
        if (editingId === id) handleCancelEdit();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete property');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting property');
    }
  };

  const handleEdit = (property) => {
    setEditingId(property.id);
    
    // Parse amenities
    let prod = '', liv = '', build = '';
    if (property.details?.amenities) {
      const prodCat = property.details.amenities.find(c => c.title === 'Productivity');
      if (prodCat) prod = prodCat.items.join(', ');
      
      const livCat = property.details.amenities.find(c => c.title === 'Living');
      if (livCat) liv = livCat.items.join(', ');
      
      const buildCat = property.details.amenities.find(c => c.title === 'Building');
      if (buildCat) build = buildCat.items.join(', ');
    }

    // Parse gallery
    const g = property.gallery && property.gallery.length > 0 ? property.gallery : [''];

    setFormData({
      title: property.title,
      city: property.city,
      price: property.price,
      image: property.image || '',
      rating: property.rating || '',
      tags: property.tags ? property.tags.join(', ') : '',
      
      gallery: g,

      beds: property.details?.beds || '',
      baths: property.details?.baths || '',
      size: property.details?.size || property.details?.sqm || '',
      floor: property.details?.floor || '',
      maxOccupancy: property.details?.maxOccupancy || property.details?.capacity || '',
      description: property.details?.description || '',
      
      amenities_productivity: prod,
      amenities_living: liv,
      amenities_building: build,
      
      rules: property.details?.rules ? property.details.rules.join(', ') : '',
      refundPolicy: property.details?.refundPolicy || '',
      
      transport_station: property.details?.neighborhood?.transport?.station || '',
      transport_time: property.details?.neighborhood?.transport?.time || '',
      airport_name: property.details?.neighborhood?.airport?.name || '',
      airport_time: property.details?.neighborhood?.airport?.time || '',
      groceries_name: property.details?.neighborhood?.groceries?.name || '',
      groceries_time: property.details?.neighborhood?.groceries?.time || '',
      coffee_name: property.details?.neighborhood?.coffee?.name || '',
      coffee_time: property.details?.neighborhood?.coffee?.time || '',
      park_name: property.details?.neighborhood?.park?.name || '',
      park_time: property.details?.neighborhood?.park?.time || '',
      commute_label: property.details?.neighborhood?.commuteLabel || '',
      commute_time: property.details?.neighborhood?.commuteTime || '',

      lat: property.lat ?? '',
      lng: property.lng ?? ''
    });
    setIsDrawerOpen(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      title: '', city: '', price: '', image: '', rating: '', tags: '',
      gallery: [''],
      beds: '', baths: '', size: '', floor: '', maxOccupancy: '',
      description: '',
      amenities_productivity: '',
      amenities_living: '',
      amenities_building: '',
      rules: '',
      refundPolicy: '',
      transport_station: '', transport_time: '',
      airport_name: '', airport_time: '',
      groceries_name: '', groceries_time: '',
      coffee_name: '', coffee_time: '',
      park_name: '', park_time: '',
      commute_label: '', commute_time: '',
      lat: '', lng: ''
    });
    setEditingId(null);
    setIsDrawerOpen(false);
  };

  const toggleAmenity = (field, label) => {
    const current = formData[field]
      ? formData[field].split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const exists = current.includes(label);
    const next = exists
      ? current.filter(item => item !== label)
      : [...current, label];
    setFormData({
      ...formData,
      [field]: next.join(', '),
    });
  };

  const getRulesList = () =>
    (formData.rules || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const setRulesList = (rulesArr) => {
    const unique = Array.from(new Set((rulesArr || []).map((r) => String(r).trim()).filter(Boolean)));
    setFormData({ ...formData, rules: unique.join(', ') });
  };

  const addRule = () => {
    const val = ruleInput.trim();
    if (!val) return;
    setRulesList([...getRulesList(), val]);
    setRuleInput('');
  };

  const removeRule = (ruleToRemove) => {
    setRulesList(getRulesList().filter((r) => r !== ruleToRemove));
  };

  // --- Derived data: filters + stats ---
  const availableCities = ['All', ...Array.from(new Set(properties.map((p) => p.city).filter(Boolean)))];

  const filteredProperties = properties.filter((p) => {
    const matchesCity = cityFilter === 'All' || p.city === cityFilter;
    const term = searchTerm.trim().toLowerCase();
    if (!term) return matchesCity;
    const inTitle = p.title?.toLowerCase().includes(term);
    const inCity = p.city?.toLowerCase().includes(term);
    const inTags = Array.isArray(p.tags) && p.tags.some((t) => String(t).toLowerCase().includes(term));
    return matchesCity && (inTitle || inCity || inTags);
  });

  const totalProps = properties.length;
  const totalCities = new Set(properties.map((p) => p.city).filter(Boolean)).size;
  const avgPrice =
    properties.length === 0
      ? 0
      : Math.round(
          properties.reduce((sum, p) => sum + (typeof p.price === 'number' ? p.price : 0), 0) / properties.length
        );

  const filtersLabel =
    filteredProperties.length !== totalProps
      ? `${filteredProperties.length} matching current filters`
      : 'All properties shown';

  const avgPriceLabel = avgPrice > 0 ? `€${avgPrice.toLocaleString()}` : '—';

  const handleGalleryChange = (index, value) => {
    const newGallery = [...formData.gallery];
    newGallery[index] = value;
    setFormData({ ...formData, gallery: newGallery });
  };

  const addGalleryField = () => {
    setFormData({ ...formData, gallery: [...formData.gallery, ''] });
  };

  const removeGalleryField = (index) => {
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: newGallery.length ? newGallery : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `${API_BASE_URL}/properties/${editingId}`
        : `${API_BASE_URL}/properties`;
      
      const method = editingId ? 'PUT' : 'POST';

      // Construct gallery
      const gallery = formData.gallery.filter(Boolean);

      // Construct amenities
      const amenities = [];
      if (formData.amenities_productivity) {
          amenities.push({
              title: 'Productivity',
              items: formData.amenities_productivity.split(',').map(s => s.trim()).filter(Boolean)
          });
      }
      if (formData.amenities_living) {
          amenities.push({
              title: 'Living',
              items: formData.amenities_living.split(',').map(s => s.trim()).filter(Boolean)
          });
      }
      if (formData.amenities_building) {
          amenities.push({
              title: 'Building',
              items: formData.amenities_building.split(',').map(s => s.trim()).filter(Boolean)
          });
      }

      // Construct neighborhood
      const neighborhood = {
          transport: {
              station: formData.transport_station,
              time: formData.transport_time
          },
          airport: {
              name: formData.airport_name,
              time: formData.airport_time
          },
          groceries: {
              name: formData.groceries_name,
              time: formData.groceries_time
          },
          coffee: {
              name: formData.coffee_name,
              time: formData.coffee_time
          },
          park: {
              name: formData.park_name,
              time: formData.park_time
          },
          commuteLabel: formData.commute_label,
          commuteTime: formData.commute_time
      };

      // Construct rules
      const rules = formData.rules.split(',').map(s => s.trim()).filter(Boolean);

      // Construct details
      const details = {
          beds: formData.beds,
          baths: formData.baths,
          size: formData.size,
          floor: formData.floor,
          maxOccupancy: formData.maxOccupancy,
          description: formData.description,
          amenities,
          neighborhood,
          rules,
          refundPolicy: formData.refundPolicy
      };

      const payload = {
          title: formData.title,
          city: formData.city,
          price: Number(formData.price),
          image: formData.image,
          rating: Number(formData.rating),
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
          gallery,
          details,
          lat: formData.lat === '' ? null : Number(formData.lat),
          lng: formData.lng === '' ? null : Number(formData.lng)
      };

      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        
        if (editingId) {
          // Update existing property in list
          setProperties(properties.map(p => p.id === editingId ? result : p));
          alert('Property updated successfully');
        } else {
          // Add new property
          setProperties([result, ...properties]); // Add to top
        }
        
        handleCancelEdit();
      } else {
        const data = await response.json();
        alert(data.message || `Failed to ${editingId ? 'update' : 'add'} property`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error ${editingId ? 'updating' : 'adding'} property`);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="text-forestGreen text-xl font-heading">Loading...</div></div>;

  const openForCreate = () => {
    handleCancelEdit();
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Property Management</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage your live Supabase-backed listings, amenities, and neighborhood details.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by title, city, or tag…"
            className="flex-1 border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-md py-2 px-3 text-sm bg-white focus:outline-none focus:ring-forestGreen focus:border-forestGreen"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main area: stats + list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Properties List + Stats (takes full width on small, 2/3 on large) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-warmSand rounded-lg px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                Total Properties
              </p>
              <p className="text-2xl font-heading text-forestGreen">{totalProps}</p>
              <p className="text-[11px] text-gray-400 mt-1">
                {filtersLabel}
              </p>
            </div>
            <div className="bg-white border border-warmSand rounded-lg px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                Average Monthly Rent
              </p>
              <p className="text-2xl font-heading text-forestGreen">
                {avgPriceLabel}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">Across all properties</p>
            </div>
            <div className="bg-white border border-warmSand rounded-lg px-4 py-3 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                Active Cities
              </p>
              <p className="text-2xl font-heading text-forestGreen">{totalCities}</p>
              <p className="text-[11px] text-gray-400 mt-1">Based on city field</p>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-warmSand">
            <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-warmSand bg-opacity-20 gap-3">
              <div className="flex flex-col">
                <h3 className="text-lg leading-6 font-medium text-forestGreen font-heading">
                  Current Properties
                </h3>
                <span className="text-sm text-earthBrown">
                  Showing {filteredProperties.length} of {properties.length}
                </span>
              </div>
              <button
                type="button"
                onClick={openForCreate}
                className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-forestGreen text-white hover:bg-opacity-90 shadow-sm"
              >
                <Plus size={16} className="mr-2" />
                Add Property
              </button>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <li key={property.id} className={`px-4 py-4 sm:px-6 transition-colors ${editingId === property.id ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-md font-bold text-forestGreen truncate">{property.title}</h4>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <span className="truncate">{property.city}</span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-charcoal font-medium">
                            €{property.price}/mo
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => handleEdit(property)}
                          className="font-medium text-forestGreen hover:text-green-800 text-sm bg-green-50 hover:bg-green-100 px-3 py-1 rounded-full transition-colors border border-green-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="font-medium text-red-600 hover:text-red-800 text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors border border-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                {filteredProperties.length === 0 && (
                  <li className="px-4 py-8 text-center text-gray-500">
                    No properties found. Adjust your search / filters or add a new property to get started.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Empty spacer column on large screens to keep grid balance (drawer overlays separately) */}
        <div className="hidden lg:block" />
      </div>

      {/* Slide-over drawer for Add/Edit Property */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
          <div className="h-full w-full max-w-xl bg-white shadow-2xl overflow-y-auto">
            <div className="px-4 py-5 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg leading-6 font-medium text-forestGreen font-heading">
                  {editingId ? 'Edit Property' : 'Add New Property'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Fill out the details and save to update the live listing.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600 rounded-full p-2 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

          <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal">Title</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forestGreen focus:border-forestGreen sm:text-sm"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal">City</label>
                        <input
                          type="text"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forestGreen focus:border-forestGreen sm:text-sm"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal">Price (€/month)</label>
                        <input
                          type="number"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forestGreen focus:border-forestGreen sm:text-sm"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-charcoal">Rating (0-5)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forestGreen focus:border-forestGreen sm:text-sm"
                          value={formData.rating}
                          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal">Tags (comma separated)</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forestGreen focus:border-forestGreen sm:text-sm"
                          placeholder="e.g. Loft, Central"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal">Main Image URL</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forestGreen focus:border-forestGreen sm:text-sm"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>

                  {/* Gallery */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Gallery Images</label>
                    <div className="space-y-2">
                        {formData.gallery.map((url, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder={`Image URL ${index + 1}`}
                                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forestGreen focus:border-forestGreen sm:text-sm"
                                  value={url}
                                  onChange={(e) => handleGalleryChange(index, e.target.value)}
                                />
                                {formData.gallery.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryField(index)}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addGalleryField}
                            className="mt-2 flex items-center text-sm text-forestGreen hover:text-green-700 font-medium"
                        >
                            <Plus size={16} className="mr-1" /> Add Another Image
                        </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Property Stats</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BedDouble className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="number" 
                                placeholder="Beds" 
                                className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" 
                                value={formData.beds} 
                                onChange={e => setFormData({...formData, beds: e.target.value})} 
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Bath className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="number" 
                                placeholder="Baths" 
                                className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" 
                                value={formData.baths} 
                                onChange={e => setFormData({...formData, baths: e.target.value})} 
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Maximize className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Size (e.g. 90 m²)" 
                                className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" 
                                value={formData.size} 
                                onChange={e => setFormData({...formData, size: e.target.value})} 
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Layers className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="number" 
                                placeholder="Floor" 
                                className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" 
                                value={formData.floor} 
                                onChange={e => setFormData({...formData, floor: e.target.value})} 
                            />
                        </div>
                        <div className="relative col-span-2">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Users className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="number" 
                                placeholder="Max Occupancy" 
                                className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" 
                                value={formData.maxOccupancy} 
                                onChange={e => setFormData({...formData, maxOccupancy: e.target.value})} 
                            />
                        </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal">Description</label>
                    <textarea
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forestGreen focus:border-forestGreen sm:text-sm"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Amenities</label>
                    <p className="text-xs text-gray-500 mb-3">
                      Click to enable / disable each amenity. These map directly to the Amenities section on the property page.
                    </p>

                    <div className="space-y-3">
                      {/* Productivity */}
                      <div>
                        <span className="block text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-1">
                          Productivity
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {PRODUCTIVITY_AMENITIES.map((label) => {
                            const selected = formData.amenities_productivity
                              .split(',')
                              .map(s => s.trim())
                              .filter(Boolean)
                              .includes(label);
                            return (
                              <button
                                key={label}
                                type="button"
                                onClick={() => toggleAmenity('amenities_productivity', label)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                  selected
                                    ? 'bg-forestGreen text-white border-forestGreen'
                                    : 'bg-white text-charcoal border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Living */}
                      <div>
                        <span className="block text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-1">
                          Living
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {LIVING_AMENITIES.map((label) => {
                            const selected = formData.amenities_living
                              .split(',')
                              .map(s => s.trim())
                              .filter(Boolean)
                              .includes(label);
                            return (
                              <button
                                key={label}
                                type="button"
                                onClick={() => toggleAmenity('amenities_living', label)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                  selected
                                    ? 'bg-forestGreen text-white border-forestGreen'
                                    : 'bg-white text-charcoal border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Building */}
                      <div>
                        <span className="block text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-1">
                          Building
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {BUILDING_AMENITIES.map((label) => {
                            const selected = formData.amenities_building
                              .split(',')
                              .map(s => s.trim())
                              .filter(Boolean)
                              .includes(label);
                            return (
                              <button
                                key={label}
                                type="button"
                                onClick={() => toggleAmenity('amenities_building', label)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                  selected
                                    ? 'bg-forestGreen text-white border-forestGreen'
                                    : 'bg-white text-charcoal border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Neighborhood */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Neighborhood</label>
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Transport Station" className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.transport_station} onChange={e => setFormData({...formData, transport_station: e.target.value})} />
                            <input type="text" placeholder="Time (e.g. 12 min)" className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.transport_time} onChange={e => setFormData({...formData, transport_time: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Airport Name" className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.airport_name} onChange={e => setFormData({...formData, airport_name: e.target.value})} />
                            <input type="text" placeholder="Time (e.g. 35 min)" className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.airport_time} onChange={e => setFormData({...formData, airport_time: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Groceries Name" className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.groceries_name} onChange={e => setFormData({...formData, groceries_name: e.target.value})} />
                            <input type="text" placeholder="Time (e.g. 5 min walk)" className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.groceries_time} onChange={e => setFormData({...formData, groceries_time: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Coffee Place Name" className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.coffee_name} onChange={e => setFormData({...formData, coffee_name: e.target.value})} />
                            <input type="text" placeholder="Time (e.g. 5 min walk)" className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.coffee_time} onChange={e => setFormData({...formData, coffee_time: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Park Name" className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.park_name} onChange={e => setFormData({...formData, park_name: e.target.value})} />
                            <input type="text" placeholder="Time (e.g. 8 min walk)" className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.park_time} onChange={e => setFormData({...formData, park_time: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Commute Label (e.g. Commute to City Center)" className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.commute_label} onChange={e => setFormData({...formData, commute_label: e.target.value})} />
                            <input type="text" placeholder="Commute Time (e.g. 15 Minutes)" className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.commute_time} onChange={e => setFormData({...formData, commute_time: e.target.value})} />
                        </div>
                    </div>
                  </div>

                  {/* Map Location */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Map Location (Latitude / Longitude)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.000001"
                        placeholder="Latitude (e.g. 52.520008)"
                        className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen"
                        value={formData.lat}
                        onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                      />
                      <input
                        type="number"
                        step="0.000001"
                        placeholder="Longitude (e.g. 13.404954)"
                        className="border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen"
                        value={formData.lng}
                        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      This controls the map pin and enables “Open in Maps” on the property page.
                    </p>
                  </div>

                  {/* Refund policy */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal">Refund Policy (shows under “Things to know”)</label>
                    <textarea
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forestGreen focus:border-forestGreen sm:text-sm"
                      value={formData.refundPolicy}
                      onChange={(e) => setFormData({ ...formData, refundPolicy: e.target.value })}
                    />
                  </div>

                  {/* Rules */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Things to Know / Rules</label>
                    <p className="text-xs text-gray-500 mb-2">
                      Pick from the dropdown or type a new rule and click Add. These appear on the property page.
                    </p>

                    <div className="flex gap-2">
                      <input
                        list="rules-suggestions"
                        type="text"
                        placeholder="Select or type a rule..."
                        className="flex-1 border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen"
                        value={ruleInput}
                        onChange={(e) => setRuleInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addRule();
                          }
                        }}
                      />
                      <datalist id="rules-suggestions">
                        {COMMON_RULES.map((r) => (
                          <option key={r} value={r} />
                        ))}
                      </datalist>

                      <button
                        type="button"
                        onClick={addRule}
                        className="px-4 py-2 rounded-md bg-forestGreen text-white text-sm font-medium hover:bg-opacity-90"
                      >
                        Add
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {getRulesList().map((r) => (
                        <span
                          key={r}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-gray-300 bg-white"
                        >
                          {r}
                          <button
                            type="button"
                            onClick={() => removeRule(r)}
                            className="text-gray-400 hover:text-red-600"
                            title="Remove"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {getRulesList().length === 0 && (
                        <span className="text-xs text-gray-500">No rules added yet.</span>
                      )}
                    </div>

                    {/* Keep the raw field for debugging/advanced use */}
                    <textarea
                      rows={2}
                      className="mt-3 block w-full border border-gray-200 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forestGreen focus:border-forestGreen sm:text-sm text-gray-500"
                      placeholder="Raw rules (comma separated)"
                      value={formData.rules}
                      onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-forestGreen hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forestGreen transition-colors"
                    >
                      {editingId ? 'Update' : 'Add'}
                    </button>
                    
                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forestGreen transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
