import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

const StaffMap = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/staff/locations/");
                console.log(response.data); // Check the structure of the response
                setLocations(response.data.locations); // Set the locations array properly
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        fetchLocations();
        const interval = setInterval(fetchLocations, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <MapContainer center={[27.7172, 85.3240]} zoom={13} style={{ height: "100vh" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {locations.map((location, index) => (
                <Marker key={index} position={[location.latitude, location.longitude]}>
                    <Popup>
                        Staff: {location.staff} <br />
                        Last Updated: {new Date(location.timestamp).toLocaleTimeString()}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default StaffMap;
