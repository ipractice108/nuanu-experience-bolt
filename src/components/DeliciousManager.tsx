import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { 
  LogOut, Plus, Trash2, Edit, Save, X, 
  Coffee, Pizza, UtensilsCrossed, Wine,
  IceCream
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'desserts' | 'water' | 'juice' | 'coffee';
  isAvailable: boolean;
}

interface Venue {
  id: string;
  name: string;
  items: MenuItem[];
}

export function DeliciousManager() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([
    { id: 'ash', name: 'Ash', items: [] },
    { id: 'alpacafe', name: 'Alpacafe', items: [] }
  ]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'food' | 'drinks' | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const foodCategories = [
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'desserts', name: 'Desserts' }
  ];

  const drinkCategories = [
    { id: 'water', name: 'Water' },
    { id: 'juice', name: 'Juice' },
    { id: 'coffee', name: 'Coffee' }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle item creation/update logic here
    setShowForm(false);
    setEditingItem(null);
  };

  if (!selectedVenue) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Delicious Manager</h1>
            <p className="text-gray-600">Manage food and drink menus</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <button
              key={venue.id}
              onClick={() => setSelectedVenue(venue)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-nuanu/10 rounded-lg">
                  <UtensilsCrossed className="w-8 h-8 text-nuanu" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{venue.name}</h3>
                  <p className="text-gray-600 text-sm">{venue.items.length} menu items</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVenue(venue)}
                className="w-full py-3 bg-nuanu text-white rounded-lg hover:bg-nuanu-light transition-colors"
              >
                Manage Menu
              </button>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => {
          setSelectedVenue(null);
          setSelectedCategory(null);
          setSelectedSubCategory(null);
        }}
        className="mb-8 flex items-center text-nuanu hover:text-nuanu-light font-medium"
      >
        <X className="w-5 h-5 mr-1" />
        Back to Venues
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">{selectedVenue.name} Menu</h2>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setSelectedCategory('food');
              setSelectedSubCategory(null);
            }}
            className={`px-6 py-3 rounded-lg transition-all ${
              selectedCategory === 'food'
                ? 'bg-nuanu text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Food Menu
          </button>
          <button
            onClick={() => {
              setSelectedCategory('drinks');
              setSelectedSubCategory(null);
            }}
            className={`px-6 py-3 rounded-lg transition-all ${
              selectedCategory === 'drinks'
                ? 'bg-nuanu text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Drinks Menu
          </button>
        </div>

        {selectedCategory && !selectedSubCategory && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {(selectedCategory === 'food' ? foodCategories : drinkCategories).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedSubCategory(category.id)}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all text-center"
              >
                <div className="flex justify-center mb-2">
                  {category.id === 'desserts' ? (
                    <IceCream className="w-6 h-6 text-nuanu" />
                  ) : category.id === 'coffee' ? (
                    <Coffee className="w-6 h-6 text-nuanu" />
                  ) : category.id === 'juice' ? (
                    <Wine className="w-6 h-6 text-nuanu" />
                  ) : (
                    <UtensilsCrossed className="w-6 h-6 text-nuanu" />
                  )}
                </div>
                <h3 className="font-medium text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">
                  {venues[0].items.filter(item => item.category === category.id).length} items
                </p>
              </button>
            ))}
          </div>
        )}

        {selectedCategory && selectedSubCategory && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedSubCategory(null)}
                className="text-nuanu hover:text-nuanu-light font-medium flex items-center"
              >
                <X className="w-5 h-5 mr-1" />
                Back to Categories
              </button>

              <button
                onClick={() => {
                  setEditingItem({
                    id: '',
                    name: '',
                    price: 0,
                    category: selectedSubCategory as any,
                    isAvailable: true
                  });
                  setShowForm(true);
                }}
                className="flex items-center px-4 py-2 bg-nuanu text-white rounded-lg hover:bg-nuanu-light"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {selectedVenue.items
                .filter(item => item.category === selectedSubCategory)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-lg">{item.name}</h4>
                        {!item.isAvailable && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm">
                            Sold Out
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      )}
                      <p className="text-nuanu font-medium mt-1">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowForm(true);
                        }}
                        className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-200"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          // Handle delete
                        }}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">
                    {editingItem?.id ? 'Edit Item' : 'Add New Item'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingItem?.name || ''}
                      onChange={(e) => setEditingItem(prev => ({ ...prev!, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingItem?.description || ''}
                      onChange={(e) => setEditingItem(prev => ({ ...prev!, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      value={editingItem?.price || ''}
                      onChange={(e) => setEditingItem(prev => ({ ...prev!, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editingItem?.isAvailable || false}
                        onChange={(e) => setEditingItem(prev => ({ ...prev!, isAvailable: e.target.checked }))}
                        className="rounded border-gray-300 text-nuanu focus:ring-nuanu"
                      />
                      <span className="ml-2">Item is available</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingItem(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-nuanu rounded-lg hover:bg-nuanu-light"
                    >
                      {editingItem?.id ? 'Save Changes' : 'Add Item'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}