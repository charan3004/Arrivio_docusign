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
    // Neighborhood
    transport_station: '',
    transport_time: '',
    airport_name: '',
    airport_time: '',
    groceries_name: '',
    groceries_time: ''
  });
  const [editingId, setEditingId] = useState(null);

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
      
      transport_station: property.details?.neighborhood?.transport?.station || '',
      transport_time: property.details?.neighborhood?.transport?.time || '',
      airport_name: property.details?.neighborhood?.airport?.name || '',
      airport_time: property.details?.neighborhood?.airport?.time || '',
      groceries_name: property.details?.neighborhood?.groceries?.name || '',
      groceries_time: property.details?.neighborhood?.groceries?.time || ''
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({
      title: '', city: '', price: '', image: '', rating: '', tags: '',
      gallery: [''],
      beds: '', baths: '', size: '', floor: '', maxOccupancy: '',
      description: '',
      amenities_productivity: '', amenities_living: '', amenities_building: '',
      rules: '',
      transport_station: '', transport_time: '',
      airport_name: '', airport_time: '',
      groceries_name: '', groceries_time: ''
    });
    setEditingId(null);
  };

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
          }
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
          rules
      };

      const payload = {
          title: formData.title,
          city: formData.city,
          price: Number(formData.price),
          image: formData.image,
          rating: Number(formData.rating),
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
          gallery,
          details
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Property Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add/Edit Property Form */}
        <div className="lg:col-span-1">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-warmSand sticky top-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-forestGreen font-heading mb-4">
                {editingId ? 'Edit Property' : 'Add New Property'}
              </h3>
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
                    <label className="block text-sm font-medium text-charcoal mb-1">Amenities (comma separated)</label>
                    <div className="space-y-2">
                        <input type="text" placeholder="Productivity (e.g. Wifi, Desk)" className="block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.amenities_productivity} onChange={e => setFormData({...formData, amenities_productivity: e.target.value})} />
                        <input type="text" placeholder="Living (e.g. Cleaning, TV)" className="block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.amenities_living} onChange={e => setFormData({...formData, amenities_living: e.target.value})} />
                        <input type="text" placeholder="Building (e.g. Elevator, Bike Storage)" className="block w-full border border-gray-300 rounded-md py-2 px-3 sm:text-sm focus:outline-none focus:ring-forestGreen focus:border-forestGreen" value={formData.amenities_building} onChange={e => setFormData({...formData, amenities_building: e.target.value})} />
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
                    </div>
                  </div>

                  {/* Rules */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal">Things to Know / Rules (comma separated)</label>
                    <textarea
                      rows={2}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-forestGreen focus:border-forestGreen sm:text-sm"
                      placeholder="e.g. No smoking, Pets allowed"
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

        {/* Properties List */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-warmSand">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-warmSand bg-opacity-20">
              <h3 className="text-lg leading-6 font-medium text-forestGreen font-heading">
                Current Properties
              </h3>
              <span className="text-sm text-earthBrown">Total: {properties.length}</span>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {properties.map((property) => (
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
                {properties.length === 0 && (
                  <li className="px-4 py-8 text-center text-gray-500">
                    No properties found. Add one to get started.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminProperties;
