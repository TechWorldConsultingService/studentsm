import { useState, useEffect } from "react";
import axios from "axios";

const TrackLocation = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    const sendLocation = async (latitude, longitude) => {
        try {
            await axios.post("http://localhost:8000/api/staff/location/", {
                latitude,
                longitude,
            });
        } catch (error) {
            console.error("Error sending location:", error);
        }
    };

    const trackLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    sendLocation(latitude, longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                },
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    useEffect(() => {
        trackLocation();
    }, []);

    return (
        <div>
            <h1>Driver/staff Location Tracking</h1>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
        </div>
    );
};

export default TrackLocation;
