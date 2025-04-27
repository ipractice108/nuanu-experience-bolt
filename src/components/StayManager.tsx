import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Accommodation } from '../types';
import { 
  Calendar, Plus, Trash2, Edit, LogOut, Building2, 
  DollarSign, Image, Check, X, Clock, Upload 
} from 'lucide-react';
import { ImageUpload } from './ImageUpload';

// Import initial accommodations from types
import { accommodations as initialAccommodations } from '../types';

interface StayForm extends Omit<Accommodation, 'gallery'> {
  gallery: string[];
  isFullyBooked: boolean;
}

export function StayManager() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stays, setStays] = useState<Accommodation[]>(initialAccommodations);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStay, setEditingStay] = useState<StayForm | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState<number | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStay) {
      if (isEditing) {
        setStays(stays.map(stay => 
          stay.name === editingStay.name ? { ...editingStay, isFullyBooked: editingStay.isFullyBooked } : stay
        ));
      } else {
        setStays([...stays, { ...editingStay, isFullyBooked: editingStay.isFullyBooked }]);
      }
      setShowForm(false);
      setEditingStay(null);
      setIsEditing(false);
    }
  };

  const handleEdit = (stay: Accommodation) => {
    setEditingStay({
      ...stay,
      isFullyBooked: stay.isFullyBooked || false,
      gallery: stay.gallery || []
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (stayName: string) => {
    setStays(stays.filter(stay => stay.name !== stayName));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stay Manager</h1>
          <p className="text-gray-600">Manage your accommodations</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-red-600 hover:text-red-700"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

      {!showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button 
            onClick={() => {
              setEditingStay({
                name: '',
                description: '',
                category: 'standard',
                imageUrl: '',
                price: '',
                pricePerNight: 0,
                amenities: [],
                concept: '',
                architecture: '',
                gallery: [],
                isFullyBooked: false
              });
              setIsEditing(false);
              setShowForm(true);
            }}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center"
          >
            <Plus className="w-8 h-8 text-nuanu mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Add New Stay</h3>
            <p className="text-gray-600 mt-2">Create a new accommodation</p>
          </button>

          {stays.map((stay, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={stay.imageUrl}
                  alt={stay.name}
                  className="w-full h-full object-cover"
                />
                {stay.isFullyBooked && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    Fully Booked
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{stay.name}</h3>
                <p className="text-gray-600 mb-4">{stay.description}</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 bg-nuanu/10 text-nuanu rounded-full capitalize">
                      {stay.category}
                    </span>
                    <span className="font-semibold text-nuanu">
                      {formatPrice(stay.pricePerNight)}/night
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Concept</h4>
                    <p className="text-gray-600 text-sm">{stay.concept}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Architecture</h4>
                    <p className="text-gray-600 text-sm">{stay.architecture}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {stay.amenities.map((amenity, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Gallery</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {stay.gallery.map((image, i) => (
                        <div key={i} className="h-20 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`${stay.name} gallery ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(stay)}
                    className="p-2 text-nuanu hover:bg-nuanu/10 rounded-full"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(stay.name)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit Stay' : 'Add New Stay'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingStay(null);
                setShowImageUpload(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={editingStay?.name || ''}
                onChange={(e) => setEditingStay(prev => ({ ...prev!, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editingStay?.description || ''}
                onChange={(e) => setEditingStay(prev => ({ ...prev!, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={editingStay?.category || 'standard'}
                onChange={(e) => setEditingStay(prev => ({ 
                  ...prev!, 
                  category: e.target.value as 'lux' | 'standard' | 'eco'
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="lux">Luxury</option>
                <option value="standard">Standard</option>
                <option value="eco">Eco</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Night
              </label>
              <input
                type="number"
                value={editingStay?.pricePerNight || ''}
                onChange={(e) => setEditingStay(prev => ({ 
                  ...prev!, 
                  pricePerNight: Number(e.target.value),
                  price: `From IDR ${Number(e.target.value).toLocaleString()}/night`
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concept
              </label>
              <textarea
                value={editingStay?.concept || ''}
                onChange={(e) => setEditingStay(prev => ({ ...prev!, concept: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Architecture
              </label>
              <textarea
                value={editingStay?.architecture || ''}
                onChange={(e) => setEditingStay(prev => ({ ...prev!, architecture: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image
              </label>
              {showImageUpload ? (
                <ImageUpload 
                  onImageUpload={(url) => {
                    setEditingStay(prev => ({ ...prev!, imageUrl: url }));
                    setShowImageUpload(false);
                  }}
                  onCancel={() => setShowImageUpload(false)}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editingStay?.imageUrl || ''}
                      onChange={(e) => setEditingStay(prev => ({ ...prev!, imageUrl: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Enter image URL"
                    />
                    <button
                      type="button"
                      onClick={() => setShowImageUpload(true)}
                      className="px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Upload
                    </button>
                  </div>
                  {editingStay?.imageUrl && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <img
                        src={editingStay.imageUrl}
                        alt="Main preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingStay(prev => ({ ...prev!, imageUrl: '' }))}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Images
              </label>
              <div className="space-y-4">
                {editingStay?.gallery.map((url, index) => (
                  <div key={index} className="space-y-2">
                    {uploadingGalleryIndex === index ? (
                      <ImageUpload 
                        onImageUpload={(newUrl) => {
                          const newGallery = [...editingStay.gallery];
                          newGallery[index] = newUrl;
                          setEditingStay(prev => ({ ...prev!, gallery: newGallery }));
                          setUploadingGalleryIndex(null);
                        }}
                        onCancel={() => setUploadingGalleryIndex(null)}
                      />
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            const newGallery = [...editingStay.gallery];
                            newGallery[index] = e.target.value;
                            setEditingStay(prev => ({ ...prev!, gallery: newGallery }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Enter image URL"
                        />
                        <button
                          type="button"
                          onClick={() => setUploadingGalleryIndex(index)}
                          className="px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light flex items-center gap-2"
                        >
                          <Upload className="w-5 h-5" />
                          Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = editingStay.gallery.filter((_, i) => i !== index);
                            setEditingStay(prev => ({ ...prev!, gallery: newGallery }));
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {url && !uploadingGalleryIndex && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`Gallery preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setEditingStay(prev => ({
                      ...prev!,
                      gallery: [...(prev?.gallery || []), '']
                    }));
                  }}
                  className="w-full px-4 py-2 text-nuanu border border-nuanu rounded-lg hover:bg-nuanu/10 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Gallery Image
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Private Beach', 'Infinity Pool', 'Spa', 'Fine Dining', 
                  '24/7 Concierge', 'Room Service', 'Gym', 'Restaurant',
                  'Free WiFi', 'Bar', 'Garden', 'Airport Shuttle',
                  'Terrace', 'Air Conditioning', 'Laundry', 'Parking'
                ].map((amenity) => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingStay?.amenities.includes(amenity) || false}
                      onChange={(e) => {
                        setEditingStay(prev => ({
                          ...prev!,
                          amenities: e.target.checked
                            ? [...prev!.amenities, amenity]
                            : prev!.amenities.filter(a => a !== amenity)
                        }));
                      }}
                      className="rounded border-gray-300 text-nuanu focus:ring-nuanu"
                    />
                    <span className="ml-2">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingStay?.isFullyBooked || false}
                  onChange={(e) => setEditingStay(prev => ({ 
                    ...prev!, 
                    isFullyBooked: e.target.checked 
                  }))}
                  className="rounded border-gray-300 text-nuanu focus:ring-nuanu"
                />
                <span className="ml-2">Mark as Fully Booked</span>
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingStay(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-nuanu rounded-lg hover:bg-nuanu-light"
              >
                {isEditing ? 'Save Changes' : 'Add Stay'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}