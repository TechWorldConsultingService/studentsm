import React, { useEffect, useState } from 'react';
import MainLayout from '../layout/MainLayout';

const MyBus = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    // Fetch the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setMapUrl(
            `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${latitude},${longitude}&zoom=15`
          );
        },
        (error) => {
          console.error('Error fetching location:', error);
          alert('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, []);

  return (
    <>
      <MainLayout>
        <div>
          <h2>Track Your Current Location</h2>
          <br />
          <div>
            {currentLocation.lat && currentLocation.lng ? (
              <iframe
                src={mapUrl}
                width="600"
                height="450"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <p>Loading map...</p>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default MyBus;
