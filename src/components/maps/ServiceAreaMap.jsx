// frontend/src/components/maps/ServiceAreaMap.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../services/api';

// Custom marker for workers
const workerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom marker for user
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const FitBounds = ({ areas, userLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (areas.length > 0 || userLocation) {
      const bounds = L.latLngBounds([]);
      
      areas.forEach(area => {
        if (area.center?.coordinates) {
          bounds.extend([area.center.coordinates[1], area.center.coordinates[0]]);
        }
      });
      
      if (userLocation) {
        bounds.extend(userLocation);
      }
      
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [areas, userLocation, map]);
  
  return null;
};

const ServiceAreaMap = ({ 
  userLocation = null,
  category = '',
  showWorkers = true,
  height = '500px',
  onAreaSelect = null
}) => {
  const [areas, setAreas] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState(null);

  const defaultCenter = [40.7128, -74.0060]; // NYC

  useEffect(() => {
    fetchServiceAreas();
  }, []);

  useEffect(() => {
    if (showWorkers && userLocation) {
      fetchNearbyWorkers();
    }
  }, [userLocation, category, showWorkers]);

  const fetchServiceAreas = async () => {
    try {
      const response = await api.get('/areas');
      setAreas(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch service areas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyWorkers = async () => {
    if (!userLocation) return;
    
    try {
      const [lat, lng] = userLocation;
      const response = await api.get(`/areas/workers?lat=${lat}&lng=${lng}&category=${category}&radius=15`);
      setWorkers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch workers:', error);
    }
  };

  const handleAreaClick = (area) => {
    setSelectedArea(area);
    if (onAreaSelect) {
      onAreaSelect(area);
    }
  };

  const getAreaColor = (area) => {
    if (area.priceModifier > 1.1) return '#ef4444'; // Red for premium
    if (area.priceModifier > 1.0) return '#f59e0b'; // Yellow for slightly higher
    return '#22c55e'; // Green for normal
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-800 rounded-lg" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map */}
      <div className="rounded-lg overflow-hidden border border-gray-700" style={{ height }}>
        <MapContainer
          center={userLocation || defaultCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Service Areas as Circles */}
          {areas.map((area) => (
            <Circle
              key={area._id}
              center={[area.center.coordinates[1], area.center.coordinates[0]]}
              radius={area.radius * 1000} // Convert km to meters
              pathOptions={{
                color: getAreaColor(area),
                fillColor: getAreaColor(area),
                fillOpacity: 0.2,
                weight: 2
              }}
              eventHandlers={{
                click: () => handleAreaClick(area)
              }}
            >
              <Popup>
                <div className="text-gray-900">
                  <h3 className="font-bold text-lg">{area.name}</h3>
                  <p className="text-gray-600">{area.city}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>📍 Radius: {area.radius} km</p>
                    <p>💰 Price Modifier: {((area.priceModifier - 1) * 100).toFixed(0)}%</p>
                    <p>🚗 Travel Fee: ${area.travelFee}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Available Services:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {area.availableCategories?.slice(0, 4).map((cat, i) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded capitalize">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* User Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div className="text-gray-900 font-medium">📍 Your Location</div>
              </Popup>
            </Marker>
          )}

          {/* Worker Markers */}
          {showWorkers && workers.map((worker) => (
            worker.location && (
              <Marker
                key={worker.id}
                position={[worker.location[1], worker.location[0]]}
                icon={workerIcon}
              >
                <Popup>
                  <div className="text-gray-900">
                    <h4 className="font-bold">{worker.name}</h4>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{worker.rating?.toFixed(1) || 'New'}</span>
                      <span className="text-gray-500 ml-1">({worker.reviews || 0} reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {worker.categories?.map((cat, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded capitalize">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          <FitBounds areas={areas} userLocation={userLocation} />
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-500/30 border-2 border-green-500 mr-2"></div>
          <span className="text-gray-400">Standard Pricing</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-yellow-500/30 border-2 border-yellow-500 mr-2"></div>
          <span className="text-gray-400">+10% Area</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-500/30 border-2 border-red-500 mr-2"></div>
          <span className="text-gray-400">Premium Area</span>
        </div>
        {showWorkers && (
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded-sm mr-2"></div>
            <span className="text-gray-400">Available Workers ({workers.length})</span>
          </div>
        )}
      </div>

      {/* Selected Area Info */}
      {selectedArea && (
        <div className="panel-card p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white">{selectedArea.name}</h4>
              <p className="text-gray-400">{selectedArea.city}</p>
            </div>
            <button
              onClick={() => setSelectedArea(null)}
              className="text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <p className="text-2xl font-bold text-white">{selectedArea.radius} km</p>
              <p className="text-gray-500 text-sm">Coverage</p>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <p className="text-2xl font-bold text-white">
                {selectedArea.priceModifier === 1 ? 'Standard' : `+${((selectedArea.priceModifier - 1) * 100).toFixed(0)}%`}
              </p>
              <p className="text-gray-500 text-sm">Pricing</p>
            </div>
            <div className="text-center p-3 bg-gray-800/50 rounded-lg">
              <p className="text-2xl font-bold text-white">${selectedArea.travelFee}</p>
              <p className="text-gray-500 text-sm">Travel Fee</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceAreaMap;