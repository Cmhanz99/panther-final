// Haversine formula to calculate distance between two lat/lon points in meters
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Function to update the user's location marker on the map
function updateUserMarker(lat, lon) {
    const userMarker = document.getElementById("user-location");
    if (userMarker) {
        // Map the latitude and longitude to the map's coordinate system
        const mapHeight =
            document.querySelector(".map-placeholder").offsetHeight;
        const mapWidth = document.querySelector(".map-placeholder").offsetWidth;

        // Example mapping logic (adjust based on your map's dimensions and scaling)
        const top = mapHeight * (lat - 10.314) * 100; // Adjust scaling factor as needed
        const left = mapWidth * (lon - 123.916) * 100;

        userMarker.style.top = `${top}px`;
        userMarker.style.left = `${left}px`;
    }
}

// Function to update the popup with property details
function updatePopup(property, distance) {
    const popup = document.querySelector(".map-popup");
    if (popup) {
        popup.style.display = "block";
        popup.querySelector("img").src = property.image;
        popup.querySelector("h4").textContent = property.name;
        popup.querySelector(
            "p"
        ).textContent = `${property.price} | ${property.details}`;
        popup.querySelector(".distance-text").textContent = `${(
            distance / 1609
        ).toFixed(1)} miles away`;
    }
}

// Function to hide the popup
function hidePopup() {
    const popup = document.querySelector(".map-popup");
    if (popup) {
        popup.style.display = "none";
    }
}

// Sample properties with lat/lon
const properties = [
    {
        name: "Bayview Apartment",
        lat: 10.315366,
        lon: 123.918746,
        image: "images/apartment1.jpg",
        price: "$450,000",
        details: "2 bed, 2 bath",
    },
    {
        name: "Uptown Condo",
        lat: 10.3153,
        lon: 123.918,
        image: "images/condo.jpg",
        price: "$685,000",
        details: "3 bed, 2 bath",
    },
    {
        name: "Harbor Homes",
        lat: 10.3175,
        lon: 123.917,
        image: "images/bedspace.jpg",
        price: "$1,200,000",
        details: "4 bed, 3 bath",
    },
];

// Watch user's location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            // Update user location marker on the map
            updateUserMarker(userLat, userLon);

            let nearbyProperty = null;
            let minDistance = Infinity;

            // Check if user is near any property
            for (const property of properties) {
                const distance = getDistance(
                    userLat,
                    userLon,
                    property.lat,
                    property.lon
                );
                if (distance <= 500 && distance < minDistance) {
                    // Within 500 meters and closer than previous properties
                    nearbyProperty = property;
                    minDistance = distance;
                }
            }

            if (nearbyProperty) {
                // Show popup with property details
                updatePopup(nearbyProperty, minDistance);
            } else {
                // Hide popup if no property is nearby
                hidePopup();
            }
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
    );
} else {
    alert("Geolocation is not supported by your browser.");
}
