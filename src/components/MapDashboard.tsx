import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { locations } from '../types';
import { ArrowLeft, MapPin, Search, Cuboid as Cube } from 'lucide-react';

type LocationCategory = 'all' | 'education' | 'art' | 'wellness' | 'community' | 'nature' | 'coworking';

export function MapDashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<LocationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTour, setShowTour] = useState(false);

  const categories: { id: LocationCategory; label: string }[] = [
    { id: 'all', label: 'All Locations' },
    { id: 'education', label: 'Education' },
    { id: 'art', label: 'Art & Culture' },
    { id: 'wellness', label: 'Wellness' },
    { id: 'community', label: 'Community' },
    { id: 'nature', label: 'Nature' },
    { id: 'coworking', label: 'Coworking' }
  ];

  const filteredLocations = locations.filter(location => {
    const matchesCategory = selectedCategory === 'all' || location.category === selectedCategory;
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-8 flex items-center text-nuanu hover:text-nuanu-light font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to Home
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuanu Locations</h1>
          <p className="text-gray-600">Discover our spaces across the community</p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nuanu focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 md:px-0">
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-nuanu text-white'
                  : 'bg-white text-gray-600 hover:bg-nuanu/10'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px] lg:sticky lg:top-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setShowTour(false)}
              className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
                !showTour ? 'bg-nuanu text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-5 h-5 inline-block mr-2" />
              2D Map
            </button>
            <button
              onClick={() => setShowTour(true)}
              className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
                showTour ? 'bg-nuanu text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Cube className="w-5 h-5 inline-block mr-2" />
              3D Tour
            </button>
          </div>
          
          {showTour ? (
            <>
              <iframe 
                id="tour-embeded"
                name="Nuanu guide map"
                src="https://tour.panoee.net/iframe/67f3c3bec8d77d4790780acb"
                frameBorder="0"
                width="100%"
                height="100%"
                scrolling="no"
                allowVr="yes"
                allow="vr; xr; accelerometer; gyroscope; autoplay;"
                allowFullScreen={false}
                loading="eager"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    var pano_iframe_name = "tour-embeded";
                    window.addEventListener("devicemotion", function(e){
                      var iframe = document.getElementById(pano_iframe_name);
                      if (iframe) iframe.contentWindow.postMessage({
                        type: "devicemotion",
                        deviceMotionEvent: {
                          acceleration: {
                            x: e.acceleration.x,
                            y: e.acceleration.y,
                            z: e.acceleration.z
                          },
                          accelerationIncludingGravity: {
                            x: e.accelerationIncludingGravity.x,
                            y: e.accelerationIncludingGravity.y,
                            z: e.accelerationIncludingGravity.z
                          },
                          rotationRate: {
                            alpha: e.rotationRate.alpha,
                            beta: e.rotationRate.beta,
                            gamma: e.rotationRate.gamma
                          },
                          interval: e.interval,
                          timeStamp: e.timeStamp
                        }
                      }, "*");
                    });
                  `
                }}
              />
            </>
          ) : (
            <iframe 
              src="https://www.google.com/maps/d/u/0/embed?mid=1hnWRhaI-CgTwi-zZ2GmoUBAN_QTaUG4&ehbc=2E312F" 
              width="100%" 
              height="100%"
              title="Nuanu Locations Map"
              className="border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>

        {/* Location Cards Section */}
        <div className="space-y-6">
          {filteredLocations.map(location => (
            <div
              key={location.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={location.logo}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{location.name}</h3>
                    <span className="inline-block px-3 py-1 bg-nuanu/10 text-nuanu rounded-full text-sm mt-2 capitalize">
                      {location.category}
                    </span>
                  </div>
                  <MapPin className="w-6 h-6 text-nuanu flex-shrink-0" />
                </div>
                <p className="text-gray-600">{location.description}</p>
              </div>
            </div>
          ))}

          {filteredLocations.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">No locations found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}