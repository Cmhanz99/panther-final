// Prevent auto-refresh if there's an error
window.addEventListener("error", function (e) {
    console.error("JavaScript error:", e.message);
    e.preventDefault();
    return true;
});

// Settings you can modify for testing
const mapSettings = {
    // Set to true for testing, false for real-world use
    useTestMode: true,

    // How close a user needs to be to a property (in meters) to trigger notifications
    nearbyDistance: 500,

    // Show helpful console messages? Set to false before going live
    showDebugInfo: true,

    // The starting location for test mode
    testLocation: {
        latitude: 10.315,
        longitude: 123.9175,
    },

    // The boundaries of your map area - used to calculate positions
    mapArea: {
        south: 10.31, // Minimum latitude
        north: 10.32, // Maximum latitude
        west: 123.91, // Minimum longitude
        east: 123.925, // Maximum longitude
    },
};

// ====== PROPERTY DATABASE ======
// List of properties to show on the map
// const propertyList = [
//     {
//         name: "Sugbo Apartment",
//         latitude: 10.315366,
//         longitude: 123.918746,
//         image: "/images/apartment1.jpg",
//         price: "$450,000",
//         details: "2 bed, 2 bath",
//     },
//     {
//         name: "Condo IT Park",
//         latitude: 10.3153,
//         longitude: 123.918,
//         image: "images/condo.jpg",
//         price: "$685,000",
//         details: "3 bed, 2 bath",
//     },
//     {
//         name: "Bed Spaces",
//         latitude: 10.3175,
//         longitude: 123.917,
//         image: "images/bedspace.jpg",
//         price: "$10,000",
//         details: "1 bed, 1 bath",
//     },
// ];

// ====== HELPER FUNCTIONS ======

/**
 * Calculates distance between two points on Earth using the Haversine formula
 * @param {number} lat1 - Starting point latitude
 * @param {number} lon1 - Starting point longitude
 * @param {number} lat2 - Ending point latitude
 * @param {number} lon2 - Ending point longitude
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    // Earth's radius in meters
    const earthRadius = 6371000;

    // Convert degrees to radians
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    // Convert all coordinates to radians
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const latDiff = toRadians(lat2 - lat1);
    const lonDiff = toRadians(lon2 - lon1);

    // Haversine formula calculation
    const a =
        Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(lat1Rad) *
            Math.cos(lat2Rad) *
            Math.sin(lonDiff / 2) *
            Math.sin(lonDiff / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Return distance in meters
    return earthRadius * c;
}

/**
 * Shows a message in the console if debug mode is on
 * @param {string} message - The message to display
 */
function debugLog(message) {
    if (mapSettings.showDebugInfo) {
        console.log(`🗺️ MAP DEBUG: ${message}`);
    }
}

/**
 * Converts geographic coordinates to positions on the map
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @returns {Object} Object with top and left percentages
 */
function convertCoordsToPosition(latitude, longitude) {
    const area = mapSettings.mapArea;

    // Calculate the full range of latitude and longitude in the map area
    const latitudeRange = area.north - area.south;
    const longitudeRange = area.east - area.west;

    // Calculate percentage position within the map (0-100%)
    // Note: We invert the latitude (100 - ...) because 0% is at the top of the screen
    const topPercent = 100 - ((latitude - area.south) / latitudeRange) * 100;
    const leftPercent = ((longitude - area.west) / longitudeRange) * 100;

    // Ensure percentages stay within 0-100% range
    const clampedTop = Math.max(0, Math.min(100, topPercent));
    const clampedLeft = Math.max(0, Math.min(100, leftPercent));

    debugLog(
        `Converted ${latitude}, ${longitude} to map position: top ${clampedTop.toFixed(
            2
        )}%, left ${clampedLeft.toFixed(2)}%`
    );

    return {
        top: clampedTop,
        left: clampedLeft,
    };
}

// ====== USER LOCATION FUNCTIONS ======

/**
 * Updates the user's location marker on the map
 * @param {number} latitude - User's current latitude
 * @param {number} longitude - User's current longitude
 */
function updateUserMarker(latitude, longitude) {
    debugLog(
        `Updating user marker to: ${latitude.toFixed(6)}, ${longitude.toFixed(
            6
        )}`
    );

    // Find the user marker element
    const userMarker = document.getElementById("user-location");

    if (!userMarker) {
        debugLog("ERROR: User marker element not found!");
        return;
    }

    // Convert coordinates to map position
    const position = convertCoordsToPosition(latitude, longitude);

    // Update the map with the user's position
    userMarker.style.top = `${position.top}%`;
    userMarker.style.left = `${position.left}%`;

    // Make sure the marker is visible and properly styled
    userMarker.style.position = "absolute";
    userMarker.style.zIndex = "100";
    userMarker.style.transform = "translate(-50%, -50%)";
    userMarker.style.display = "flex";

    // Update the debug panel if it exists
    updateDebugPanel(latitude, longitude);
}

/**
 * Positions the user marker in the center of the map
 */
function centerUserMarker() {
    const userMarker = document.getElementById("user-location");
    if (userMarker) {
        userMarker.style.top = "50%";
        userMarker.style.left = "50%";
        userMarker.style.position = "absolute";
        userMarker.style.zIndex = "100";
        userMarker.style.transform = "translate(-50%, -50%)";
        userMarker.style.display = "flex";
        debugLog("User marker centered on map");
    }
}

/**
 * Checks if the user is near any properties and shows popups accordingly
 * @param {number} userLat - User's current latitude
 * @param {number} userLon - User's current longitude
 */
function checkNearbyProperties(userLat, userLon) {
    debugLog(
        `Checking for properties near ${userLat.toFixed(6)}, ${userLon.toFixed(
            6
        )}`
    );

    let closestProperty = null;
    let shortestDistance = Infinity;

    // Check distance to each property
    for (const property of propertyList) {
        const distance = calculateDistance(
            userLat,
            userLon,
            property.latitude,
            property.longitude
        );

        debugLog(`Distance to ${property.name}: ${distance.toFixed(0)} meters`);

        // If this property is within range and closer than any previous property
        if (
            distance <= mapSettings.nearbyDistance &&
            distance < shortestDistance
        ) {
            closestProperty = property;
            shortestDistance = distance;
        }
    }

    // If we found a nearby property, show its popup
    if (closestProperty) {
        debugLog(
            `Closest property is ${
                closestProperty.name
            } at ${shortestDistance.toFixed(0)} meters`
        );
        updatePropertyPopup(closestProperty, shortestDistance);
        showPropertyAlert(closestProperty, shortestDistance);
    } else {
        // Otherwise hide any active popups
        hidePropertyPopup();
        debugLog("No properties within range");
    }
}

// ====== PROPERTY POPUP FUNCTIONS ======

/**
 * Shows and updates the popup with property details
 * @param {Object} property - The property to display
 * @param {number} distance - Distance to the property in meters
 */
function updatePropertyPopup(property, distance) {
    const popup = document.getElementById("propertyPopup");

    if (!popup) {
        debugLog("ERROR: Property popup element not found!");
        return;
    }

    // Position the popup near the property
    const position = convertCoordsToPosition(
        property.latitude,
        property.longitude
    );

    popup.style.top = `${position.top}%`;
    popup.style.left = `${position.left}%`;
    popup.style.position = "absolute";
    popup.style.zIndex = "1000";

    // Position popup above the property marker
    popup.style.transform = "translate(-50%, -120%)";

    // Make the popup visible
    popup.style.display = "block";

    // Update the image if it exists
    const imgElement = document.getElementById("popupImage");
    if (imgElement) {
        // Use the property image, handling both relative and absolute paths
        const imagePath = property.image.includes("/")
            ? property.image
            : `{{ asset('images/${property.image}') }}`;

        imgElement.src = imagePath;

        // Add error handling for images
        imgElement.onerror = function () {
            this.src = '{{ asset("images/placeholder.jpg") }}';
            debugLog(`Image failed to load: ${property.image}`);
        };
    }

    // Update the text content
    document.getElementById("popupTitle").textContent = property.name;
    document.getElementById(
        "popupDetails"
    ).textContent = `${property.price} | ${property.details}`;

    // Show distance in miles (1609 meters = 1 mile)
    const distanceInMiles = (distance / 1609).toFixed(1);
    document.getElementById(
        "popupDistance"
    ).textContent = `${distanceInMiles} miles away`;

    debugLog(`Showing popup for ${property.name}`);
}

/**
 * Hides the property popup
 */
function hidePropertyPopup() {
    const popup = document.getElementById("propertyPopup");
    if (popup) {
        popup.style.display = "none";
    }
}

/**
 * Shows a property alert notification
 * @param {Object} property - The property to alert about
 * @param {number} distance - Distance to the property in meters
 */
function showPropertyAlert(property, distance) {
    const alertElement = document.getElementById("property-alert");
    if (!alertElement) {
        return;
    }

    // Update alert content with property information
    const alertTitle = alertElement.querySelector("h4");
    const propertyName = alertElement.querySelector("p strong");
    const distanceText = alertElement.querySelector("p:last-of-type");
    const priceElement = alertElement.querySelector(".alert-price");

    if (alertTitle) alertTitle.textContent = "Property Nearby!";
    if (propertyName) propertyName.textContent = property.name;

    // Show distance in miles
    const distanceInMiles = (distance / 1609).toFixed(1);
    if (distanceText)
        distanceText.textContent = `${distanceInMiles} miles from your current location`;

    if (priceElement) priceElement.textContent = property.price;

    // Show the alert
    alertElement.style.display = "block";

    // Hide alert after 5 seconds
    setTimeout(() => {
        alertElement.style.display = "none";
    }, 5000);

    // Add click event to close button
    const closeBtn = alertElement.querySelector(".close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            alertElement.style.display = "none";
        });
    }

    debugLog(`Showing property alert for ${property.name}`);
}

// ====== PROPERTY MARKERS FUNCTIONS ======

/**
 * Creates and places property markers on the map
 */
function createPropertyMarkers() {
    debugLog("Creating property markers");

    // Find the map container
    const mapOverlay = document.querySelector(".map-overlay");
    if (!mapOverlay) {
        debugLog("ERROR: Map overlay not found!");
        return;
    }

    // Remove any existing property markers before adding new ones
    const existingMarkers = document.querySelectorAll(".property-marker");
    existingMarkers.forEach((marker) => marker.remove());

    // Add a marker for each property
    propertyList.forEach((property) => {
        // Convert coordinates to map position
        const position = convertCoordsToPosition(
            property.latitude,
            property.longitude
        );

        // Create a div element for the marker
        const markerElement = document.createElement("div");
        markerElement.className = "property-marker";

        // Position the marker
        markerElement.style.top = `${position.top}%`;
        markerElement.style.left = `${position.left}%`;
        markerElement.style.position = "absolute";
        markerElement.style.transform = "translate(-50%, -50%)";
        markerElement.style.zIndex = "50";

        // Determine property type based on price
        const isCommercial =
            property.price.includes("1,200,000") ||
            property.price.includes("1.2M");

        // Add the marker content
        markerElement.innerHTML = `
            <div class="marker ${isCommercial ? "commercial" : "residential"}">
                <span>${property.price
                    .replace("$", "")
                    .replace(",000", "K")}</span>
            </div>
        `;

        // Add click event to show the property details
        markerElement.addEventListener("click", () => {
            // Get current user location
            let userLat, userLon;

            if (mapSettings.useTestMode) {
                // Use test mode location
                userLat = mapSettings.testLocation.latitude;
                userLon = mapSettings.testLocation.longitude;
            } else {
                // Use real location if available
                userLat = window.currentUserLocation?.latitude || 0;
                userLon = window.currentUserLocation?.longitude || 0;
            }

            // Calculate distance to this property
            const distance = calculateDistance(
                userLat,
                userLon,
                property.latitude,
                property.longitude
            );

            // Show the property popup
            updatePropertyPopup(property, distance);
        });

        // Add the marker to the map
        mapOverlay.appendChild(markerElement);

        debugLog(`Added marker for ${property.name}`);
    });
}

// ====== TESTING TOOLS FUNCTIONS ======

/**
 * Creates a debug panel for testing features
 */
function createDebugPanel() {
    // Only create the panel if debug mode is enabled
    if (!mapSettings.showDebugInfo) return;

    // Check if panel already exists
    if (document.getElementById("map-debug-panel")) return;

    debugLog("Creating debug panel");

    // Create the debug panel element
    const panel = document.createElement("div");
    panel.id = "map-debug-panel";
    panel.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 1000;
        font-family: monospace;
        font-size: 12px;
        width: 280px;
    `;

    // Add content to the panel
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <strong>Map Testing Tools</strong>
            <button id="toggle-debug" style="background: #555; border: none; color: white; padding: 2px 5px; z-index:0; cursor: pointer;">Hide</button>
        </div>
        <div id="debug-content">
            <div style="margin-bottom: 10px;">
                <span>Current Position:</span><br>
                <span id="debug-lat">Lat: 0.000000</span><br>
                <span id="debug-lon">Lon: 0.000000</span>
            </div>

            <div style="margin-bottom: 10px;">
                <label for="distance-slider">Detection Radius: <span id="distance-value">${
                    mapSettings.nearbyDistance
                }m</span></label>
                <input type="range" id="distance-slider" min="100" max="1000" step="100" value="${
                    mapSettings.nearbyDistance
                }" style="width: 100%;">
            </div>

            <div style="margin-bottom: 10px;">
                <label for="test-mode-toggle">Test Mode:</label>
                <input type="checkbox" id="test-mode-toggle" ${
                    mapSettings.useTestMode ? "checked" : ""
                }>
            </div>

            <div id="test-controls" style="margin-bottom: 10px; ${
                mapSettings.useTestMode ? "" : "display: none;"
            }">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <button class="test-btn" data-dir="nw">↖</button>
                    <button class="test-btn" data-dir="n">↑</button>
                    <button class="test-btn" data-dir="ne">↗</button>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <button class="test-btn" data-dir="w">←</button>
                    <button class="test-btn" data-dir="center">⦿</button>
                    <button class="test-btn" data-dir="e">→</button>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <button class="test-btn" data-dir="sw">↙</button>
                    <button class="test-btn" data-dir="s">↓</button>
                    <button class="test-btn" data-dir="se">↘</button>
                </div>
            </div>

            <div>
                <label for="debug-mode-toggle">Debug Mode:</label>
                <input type="checkbox" id="debug-mode-toggle" checked>
            </div>
        </div>
    `;

    // Add the panel to the map
    const mapContainer = document.querySelector(".map-placeholder");
    if (mapContainer) {
        mapContainer.appendChild(panel);
        setupDebugControls();
    }
}

/**
 * Sets up event listeners for the debug panel controls
 */
function setupDebugControls() {
    debugLog("Setting up debug controls");

    // Toggle panel visibility
    const toggleBtn = document.getElementById("toggle-debug");
    const content = document.getElementById("debug-content");
    if (toggleBtn && content) {
        toggleBtn.addEventListener("click", function () {
            if (content.style.display === "none") {
                content.style.display = "block";
                toggleBtn.textContent = "Hide";
            } else {
                content.style.display = "none";
                toggleBtn.textContent = "Show";
            }
        });
    }

    // Detection distance slider
    const slider = document.getElementById("distance-slider");
    const distanceValue = document.getElementById("distance-value");
    if (slider && distanceValue) {
        slider.addEventListener("input", function () {
            const value = parseInt(this.value);
            mapSettings.nearbyDistance = value;
            distanceValue.textContent = `${value}m`;

            // Update the user location to check for properties with the new distance
            if (mapSettings.useTestMode) {
                checkNearbyProperties(
                    mapSettings.testLocation.latitude,
                    mapSettings.testLocation.longitude
                );
            }

            debugLog(`Detection radius changed to ${value}m`);
        });
    }

    // Test mode toggle
    const testToggle = document.getElementById("test-mode-toggle");
    const testControls = document.getElementById("test-controls");
    if (testToggle && testControls) {
        testToggle.addEventListener("change", function () {
            mapSettings.useTestMode = this.checked;
            testControls.style.display = this.checked ? "block" : "none";

            debugLog(`Test mode ${this.checked ? "enabled" : "disabled"}`);

            // If toggling to test mode, update with test location
            if (this.checked) {
                updateUserMarker(
                    mapSettings.testLocation.latitude,
                    mapSettings.testLocation.longitude
                );
                checkNearbyProperties(
                    mapSettings.testLocation.latitude,
                    mapSettings.testLocation.longitude
                );
            } else if (navigator.geolocation) {
                // If toggling to real mode, try to get current position
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLat = position.coords.latitude;
                        const userLon = position.coords.longitude;

                        // Store current position
                        window.currentUserLocation = {
                            latitude: userLat,
                            longitude: userLon,
                        };

                        updateUserMarker(userLat, userLon);
                        checkNearbyProperties(userLat, userLon);
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        // Fall back to centered marker if geolocation fails
                        centerUserMarker();
                    }
                );
            }
        });
    }

    // Debug mode toggle
    const debugToggle = document.getElementById("debug-mode-toggle");
    if (debugToggle) {
        debugToggle.addEventListener("change", function () {
            mapSettings.showDebugInfo = this.checked;
            debugLog(`Debug mode ${this.checked ? "enabled" : "disabled"}`);
        });
    }

    // Movement buttons for test mode
    const testButtons = document.querySelectorAll(".test-btn");
    testButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const direction = this.getAttribute("data-dir");
            moveTestLocation(direction);
        });
    });
}

/**
 * Moves the test location in the specified direction
 * @param {string} direction - Direction to move (n, s, e, w, etc.)
 */
function moveTestLocation(direction) {
    // Step size in degrees (approximately 50-100 meters)
    const step = 0.0005;

    // Reference to the test location object for easy access
    const location = mapSettings.testLocation;

    // Update coordinates based on direction
    switch (direction) {
        case "n":
            location.latitude += step;
            break;
        case "s":
            location.latitude -= step;
            break;
        case "e":
            location.longitude += step;
            break;
        case "w":
            location.longitude -= step;
            break;
        case "ne":
            location.latitude += step;
            location.longitude += step;
            break;
        case "nw":
            location.latitude += step;
            location.longitude -= step;
            break;
        case "se":
            location.latitude -= step;
            location.longitude += step;
            break;
        case "sw":
            location.latitude -= step;
            location.longitude -= step;
            break;
        case "center":
            // Reset to center of map bounds
            location.latitude =
                (mapSettings.mapArea.north + mapSettings.mapArea.south) / 2;
            location.longitude =
                (mapSettings.mapArea.east + mapSettings.mapArea.west) / 2;
            break;
    }

    // Ensure coordinates stay within map bounds
    location.latitude = Math.max(
        mapSettings.mapArea.south,
        Math.min(mapSettings.mapArea.north, location.latitude)
    );

    location.longitude = Math.max(
        mapSettings.mapArea.west,
        Math.min(mapSettings.mapArea.east, location.longitude)
    );

    // Update the user marker with new position
    updateUserMarker(location.latitude, location.longitude);

    // Check for nearby properties
    checkNearbyProperties(location.latitude, location.longitude);

    debugLog(
        `Test location moved to ${location.latitude.toFixed(
            6
        )}, ${location.longitude.toFixed(6)}`
    );
}

/**
 * Updates the debug panel with current position
 * @param {number} lat - Current latitude
 * @param {number} lon - Current longitude
 */
function updateDebugPanel(lat, lon) {
    const latElement = document.getElementById("debug-lat");
    const lonElement = document.getElementById("debug-lon");

    if (latElement && lonElement) {
        latElement.textContent = `Lat: ${lat.toFixed(6)}`;
        lonElement.textContent = `Lon: ${lon.toFixed(6)}`;
    }
}

// ====== REAL LOCATION FUNCTIONS ======

/**
 * Starts watching the user's real location
 */
function startWatchingLocation() {
    // Only use real geolocation if we're not in test mode
    if (mapSettings.useTestMode) {
        debugLog("Using test location instead of real geolocation");
        return;
    }

    if (navigator.geolocation) {
        debugLog("Starting to watch real location");

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                // Store the position for reference
                window.currentUserLocation = {
                    latitude: userLat,
                    longitude: userLon,
                };

                // Update user marker and check for nearby properties
                updateUserMarker(userLat, userLon);
                checkNearbyProperties(userLat, userLon);

                debugLog(
                    `Real position updated: ${userLat.toFixed(
                        6
                    )}, ${userLon.toFixed(6)}`
                );
            },
            (error) => {
                console.error("Geolocation error:", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000,
            }
        );

        // Store the watch ID for later use
        window.locationWatchId = watchId;
    } else {
        console.error("Geolocation is not supported by your browser.");
    }
}

// ====== INITIALIZATION ======

/**
 * Set up event handlers and initialize the map
 */
function initializeMap() {
    debugLog("Map initialization started");

    // Use the property list from the window object (if available)
    if (window.propertyList && Array.isArray(window.propertyList)) {
        debugLog("Using property list from database");
        propertyList = window.propertyList;
    } else {
        debugLog("No property list found in window object, using default");
        // Keep your original propertyList as a fallback
    }

    // Rest of your initialization code...
    createPropertyMarkers();
    // ...
}

    // Add click handler to close popup when clicking on map
    const mapPlaceholder = document.querySelector(".map-placeholder");
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener("click", function (e) {
            // Only close if not clicking on a marker, popup, or debug panel
            if (
                !e.target.closest(".property-marker") &&
                !e.target.closest(".map-popup") &&
                !e.target.closest("#map-debug-panel")
            ) {
                hidePropertyPopup();
            }
        });
    }

    // Add click handler for "Center on My Location" button
    const centerBtn = document.querySelector(
        'button[title="Center on My Location"]'
    );
    if (centerBtn) {
        centerBtn.addEventListener("click", function () {
            if (mapSettings.useTestMode) {
                // Reset test location to center
                mapSettings.testLocation.latitude =
                    (mapSettings.mapArea.north + mapSettings.mapArea.south) / 2;
                mapSettings.testLocation.longitude =
                    (mapSettings.mapArea.east + mapSettings.mapArea.west) / 2;

                updateUserMarker(
                    mapSettings.testLocation.latitude,
                    mapSettings.testLocation.longitude
                );

                checkNearbyProperties(
                    mapSettings.testLocation.latitude,
                    mapSettings.testLocation.longitude
                );

                debugLog("Centered test location on map");
            } else if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLat = position.coords.latitude;
                        const userLon = position.coords.longitude;

                        // Store current position
                        window.currentUserLocation = {
                            latitude: userLat,
                            longitude: userLon,
                        };

                        updateUserMarker(userLat, userLon);
                        checkNearbyProperties(userLat, userLon);

                        debugLog("Centered on real user location");
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        alert(
                            "Could not get your location. Please check your permission settings."
                        );
                    }
                );
            } else {
                alert("Geolocation is not supported by your browser.");
            }
        });
    }

    // Set up "Enable Location" button in the hero section
    const enableLocationBtn = document.getElementById("enable-location");
    if (enableLocationBtn) {
        enableLocationBtn.addEventListener("click", function () {
            if (mapSettings.useTestMode) {
                // In test mode, just scroll to the map
                document.getElementById("map").scrollIntoView({
                    behavior: "smooth",
                });

                debugLog("Scrolled to map section (test mode)");
            } else if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLat = position.coords.latitude;
                        const userLon = position.coords.longitude;
                        // Store current position
                        window.currentUserLocation = {
                            latitude: userLat,
                            longitude: userLon,
                        };

                        // Update user marker on the map
                        updateUserMarker(userLat, userLon);

                        // Check for nearby properties
                        checkNearbyProperties(userLat, userLon);

                        // Update location status text
                        const locationStatus = document.querySelector(
                            ".location-status span"
                        );
                        if (locationStatus) {
                            locationStatus.textContent =
                                "Your Current Location";
                        }

                        // Scroll to the map section
                        document.getElementById("map").scrollIntoView({
                            behavior: "smooth",
                        });

                        // Show success message
                        alert(
                            "Location services enabled! You can now see properties near your location."
                        );
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        alert(
                            "Could not get your location. Please check your permission settings."
                        );
                    }
                );
            } else {
                alert("Geolocation is not supported by your browser.");
            }
        });
    }

    // Add CSS styles for the debug panel buttons
    addDebugStyles();

    debugLog("Map initialization complete");

/**
 * Adds CSS styles for the debug panel and buttons
 */
function addDebugStyles() {
    // Create a style element
    const styleElement = document.createElement("style");

    // Add CSS rules for debug panel elements
    styleElement.textContent = `
.test-btn {
background: #555;
border: none;
color: white;
padding: 5px;
border-radius: 3px;
cursor: pointer;
width: 30px;
height: 30px;
display: flex;
align-items: center;
justify-content: center;
font-size: 14px;
}

.test-btn:hover {
background: #777;
}

#distance-slider {
height: 8px;
background: #444;
outline: none;
border-radius: 4px;
margin: 10px 0;
}

#distance-slider::-webkit-slider-thumb {
appearance: none;
width: 16px;
height: 16px;
border-radius: 50%;
background: #3498db;
cursor: pointer;
}

#toggle-debug {
background: #555;
border: none;
color: white;
padding: 3px 7px;
border-radius: 3px;
cursor: pointer;
font-size: 11px;
}

#toggle-debug:hover {
background: #777;
}

.map-overlay {
position: relative;
width: 100%;
height: 100%;
}

.user-location-marker {
position: absolute;
width: 30px;
height: 30px;
display: flex;
align-items: center;
justify-content: center;
}

.user-location-marker i {
color: #3498db;
font-size: 24px;
z-index: 10;
}

.pulse-ring {
position: absolute;
width: 40px;
height: 40px;
border-radius: 50%;
background-color: rgba(52, 152, 219, 0.3);
animation: pulse 2s infinite;
}

@keyframes pulse {
0% {
transform: scale(0.5);
opacity: 1;
}
100% {
transform: scale(1.5);
opacity: 0;
}
}
`;

    // Add the style element to the document head
    document.head.appendChild(styleElement);

    debugLog("Debug styles added");
}

// Start the map when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    debugLog("DOM loaded, initializing map...");
    initializeMap();
});
