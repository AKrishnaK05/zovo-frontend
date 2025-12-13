// frontend/src/components/maps/WorkerLocationMap.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Worker icon
const workerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Job location icon
const jobIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);
  return null;
};

const WorkerLocationMap = ({
  workerLocation = null, // [lat, lng]
  jobLocation = null,    // [lat, lng]
  jobAddress = '',
  workerName = 'Worker',
  showRadius = true,
  radius = 5, // km
  height = '400px',
  onLocationUpdate = null // For workers to update their location
}) => {
  const [currentPosition, setCurrentPosition] = useState(workerLocation);
  const [isUpdating, setIsUpdating] = useState(false);

  const defaultCenter = jobLocation || workerLocation || [40.7128, -74.0060];

  // Update worker's current location
  const updateCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported');
      return;
    }

    setIsUpdating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition = [pos.coords.latitude, pos.coords.longitude];
        setCurrentPosition(newPosition);
        if (onLocationUpdate) {
          onLocationUpdate(newPosition);
        }
        setIsUpdating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsUpdating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const distance = currentPosition && jobLocation
    ? calculateDistance(currentPosition[0], currentPosition[1], jobLocation[0], jobLocation[1])
    : null;

  return (
    <div className="space-y-4">
      {/* Map */}
      <div className="rounded-lg overflow-hidden border border-gray-700" style={{ height }}>
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Worker Location */}
          {currentPosition && (
            <>
              <Marker position={currentPosition} icon={workerIcon}>
                <Popup>
                  <div className="text-gray-900">
                    <h4 className="font-bold">🔧 {workerName}</h4>
                    <p className="text-sm text-gray-600">Current Location</p>
                  </div>
                </Popup>
              </Marker>
              
              {/* Service Radius */}
              {showRadius && (
                <Circle
                  center={currentPosition}
                  radius={radius * 1000}
                  pathOptions={{
                    color: '#8b5cf6',
                    fillColor: '#8b5cf6',
                    fillOpacity: 0.1,
                    weight: 2,
                    dashArray: '5, 5'
                  }}
                />
              )}
            </>
          )}

          {/* Job Location */}
          {jobLocation && (
            <Marker position={jobLocation} icon={jobIcon}>
              <Popup>
                <div className="text-gray-900">
                  <h4 className="font-bold">📍 Job Location</h4>
                  <p className="text-sm text-gray-600">{jobAddress || 'Customer Address'}</p>
                  {distance && (
                    <p className="text-sm font-medium text-purple-600 mt-1">
                      {distance.toFixed(1)} km away
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          )}

          <RecenterMap position={currentPosition || jobLocation} />
        </MapContainer>
      </div>

      {/* Controls & Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Distance Info */}
          {distance && (
            <div className="flex items-center text-gray-400">
              <span className="mr-2">📏</span>
              <span>Distance: <span className="text-white font-medium">{distance.toFixed(1)} km</span></span>
            </div>
          )}
          
          {/* Estimated Time */}
          {distance && (
            <div className="flex items-center text-gray-400">
              <span className="mr-2">🕐</span>
              <span>ETA: <span className="text-white font-medium">{Math.ceil(distance * 3)} mins</span></span>
            </div>
          )}
        </div>

        {/* Update Location Button */}
        {onLocationUpdate && (
          <button
            onClick={updateCurrentLocation}
            disabled={isUpdating}
            className="btn-secondary flex items-center"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update Location
              </>
            )}
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Worker</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span>Job Location</span>
        </div>
        {showRadius && (
          <div className="flex items-center">
            <div className="w-3 h-3 border-2 border-purple-500 border-dashed rounded-full mr-2"></div>
            <span>Service Area ({radius} km)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerLocationMap;