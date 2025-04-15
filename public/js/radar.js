/**
 * radar.js - Dedicated radar functionality for PropertyFinder
 * This file contains all functionality needed for the separate radar page
 */

// Settings you can modify for testing
const radarSettings = {
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

// ====== HELPER FUNCTIONS ======

/**
 * Calculates distance between two points on Earth using the Haversine formula
 * @param {number} lat1 - Starting point latitude
 * @param {number} lon1 - Starting point longitude
 * @param {number} lat2 - Ending point latitude
 * @param {number} lon2 - Ending point longitude
 * @returns {number} Distance in meters
 */
function calculateRadarDistance(lat1, lon1, lat2, lon2) {
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
function radarDebugLog(message) {
    if (radarSettings.showDebugInfo) {
        console.log(`🎯 RADAR DEBUG: ${message}`);
    }
}

/**
 * Converts geographic coordinates to positions on the map
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @returns {Object} Object with top and left percentages
 */
function convertRadarCoordsToPosition(latitude, longitude) {
    const area = radarSettings.mapArea;

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

    radarDebugLog(
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
 * Updates the user's location marker on the radar map
 * @param {number} latitude - User's current latitude
 * @param {number} longitude - User's current longitude
 */
function updateRadarUserMarker(latitude, longitude) {
    radarDebugLog(
        `Updating radar user marker to: ${latitude.toFixed(6)}, ${longitude.toFixed(
            6
        )}`
    );

    // Find the user marker element
    const userMarker = document.getElementById("radar-user-location");

    if (!userMarker) {
        radarDebugLog("ERROR: Radar user marker element not found!");
        return;
    }

    // Convert coordinates to map position
    const position = convertRadarCoordsToPosition(latitude, longitude);

    // Update the map with the user's position
    userMarker.style.top = `${position.top}%`;
    userMarker.style.left = `${position.left}%`;

    // Make sure the marker is visible and properly styled
    userMarker.style.position = "absolute";
    userMarker.style.zIndex = "100";
    userMarker.style.transform = "translate(-50%, -50%)";
    userMarker.style.display = "flex";

    // Update the debug panel if it exists
    updateRadarDebugPanel(latitude, longitude);

    // Check for nearby properties
    checkRadarNearbyProperties(latitude, longitude);
}

/**
 * Positions the user marker in the center of the radar map
 */
function centerRadarUserMarker() {
    const userMarker = document.getElementById("radar-user-location");
    if (userMarker) {
        userMarker.style.top = "50%";
        userMarker.style.left = "50%";
        userMarker.style.position = "absolute";
        userMarker.style.zIndex = "100";
        userMarker.style.transform = "translate(-50%, -50%)";
        userMarker.style.display = "flex";
        radarDebugLog("Radar user marker centered on map");
    }
}

/**
 * Checks if the user is near any properties and shows popups accordingly
 * @param {number} userLat - User's current latitude
 * @param {number} userLon - User's current longitude
 */
function checkRadarNearbyProperties(userLat, userLon) {
    radarDebugLog(
        `Checking for properties near ${userLat.toFixed(6)}, ${userLon.toFixed(
            6
        )}`
    );

    let closestProperty = null;
    let shortestDistance = Infinity;

    // Check distance to each property in the window.propertyList
    if (window.propertyList && Array.isArray(window.propertyList)) {
        for (const property of window.propertyList) {
            const distance = calculateRadarDistance(
                userLat,
                userLon,
                property.latitude,
                property.longitude
            );

            radarDebugLog(`Distance to ${property.name}: ${distance.toFixed(0)} meters`);

            // If this property is within range and closer than any previous property
            if (
                distance <= radarSettings.nearbyDistance &&
                distance < shortestDistance
            ) {
                closestProperty = property;
                shortestDistance = distance;
            }
        }
    }

    // If we found a nearby property, show its popup
    if (closestProperty) {
        radarDebugLog(
            `Closest property is ${
                closestProperty.name
            } at ${shortestDistance.toFixed(0)} meters`
        );
        updateRadarPropertyPopup(closestProperty, shortestDistance);
    } else {
        // Otherwise hide any active popups
        hideRadarPropertyPopup();
        radarDebugLog("No properties within range");
    }
}

// ====== PROPERTY POPUP FUNCTIONS ======

/**
 * Shows and updates the popup with property details
 * @param {Object} property - The property to display
 * @param {number} distance - Distance to the property in meters
 */
function updateRadarPropertyPopup(property, distance) {
    const popup = document.getElementById("radarPropertyPopup");

    if (!popup) {
        radarDebugLog("ERROR: Radar property popup element not found!");
        return;
    }

    // Position the popup near the property
    const position = convertRadarCoordsToPosition(
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
    const imgElement = document.getElementById("radarPopupImage");
    if (imgElement) {
        // Use the property image, handling both relative and absolute paths
        const imagePath = property.image.startsWith('/')
            ? property.image
            : `/${property.image}`;

        imgElement.src = imagePath;

        // Add error handling for images
        imgElement.onerror = function () {
            this.src = '/images/placeholder.jpg';
            radarDebugLog(`Image failed to load: ${property.image}`);
        };
    }

    // Update the text content
    document.getElementById("radarPopupTitle").textContent = property.name;
    document.getElementById(
        "radarPopupDetails"
    ).textContent = `${property.price} | ${property.details}`;

    // Show distance in miles (1609 meters = 1 mile)
    const distanceInMiles = (distance / 1609).toFixed(1);
    document.getElementById(
        "radarPopupDistance"
    ).textContent = `${distanceInMiles} miles away`;

    radarDebugLog(`Showing popup for ${property.name}`);
}

/**
 * Hides the property popup
 */
function hideRadarPropertyPopup() {
    const popup = document.getElementById("radarPropertyPopup");
    if (popup) {
        popup.style.display = "none";
    }
}

// ====== PROPERTY MARKERS FUNCTIONS ======

/**
 * Creates and places property markers on the radar map
 */
function createRadarPropertyMarkers() {
    radarDebugLog("Creating radar property markers");

    // Find the map container
    const mapOverlay = document.querySelector(".radar-section .map-overlay");
    if (!mapOverlay) {
        radarDebugLog("ERROR: Radar map overlay not found!");
        return;
    }

    // Remove any existing property markers before adding new ones
    const existingMarkers = mapOverlay.querySelectorAll(".property-marker");
    existingMarkers.forEach((marker) => marker.remove());

    // Check if the property list exists in window object
    if (!window.propertyList || !Array.isArray(window.propertyList)) {
        radarDebugLog("ERROR: Property list not found!");
        return;
    }

    // Add a marker for each property
    window.propertyList.forEach((property) => {
        // Convert coordinates to map position
        const position = convertRadarCoordsToPosition(
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

            if (radarSettings.useTestMode) {
                // Use test mode location
                userLat = radarSettings.testLocation.latitude;
                userLon = radarSettings.testLocation.longitude;
            } else {
                // Use real location if available
                userLat = window.currentUserLocation?.latitude || 0;
                userLon = window.currentUserLocation?.longitude || 0;
            }

            // Calculate distance to this property
            const distance = calculateRadarDistance(
                userLat,
                userLon,
                property.latitude,
                property.longitude
            );

            // Show the property popup
            updateRadarPropertyPopup(property, distance);
        });

        // Add the marker to the map
        mapOverlay.appendChild(markerElement);

        radarDebugLog(`Added marker for ${property.name}`);
    });
}

// ====== TESTING TOOLS FUNCTIONS ======

/**
 * Creates a debug panel for testing radar features
 */
function createRadarDebugPanel() {
    // Only create the panel if debug mode is enabled
    if (!radarSettings.showDebugInfo) return;

    // Check if panel already exists
    if (document.getElementById("radar-debug-panel")) return;

    radarDebugLog("Creating radar debug panel");

    // Create the debug panel element
    const panel = document.createElement("div");
    panel.id = "radar-debug-panel";
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
            <strong>Radar Testing Tools</strong>
            <button id="toggle-radar-debug" style="background: #555; border: none; color: white; padding: 2px 5px; z-index:0; cursor: pointer;">Hide</button>
        </div>
        <div id="radar-debug-content">
            <div style="margin-bottom: 10px;">
                <span>Current Position:</span><br>
                <span id="radar-debug-lat">Lat: 0.000000</span><br>
                <span id="radar-debug-lon">Lon: 0.000000</span>
            </div>

            <div style="margin-bottom: 10px;">
                <label for="radar-distance-slider">Detection Radius: <span id="radar-distance-value">${
                    radarSettings.nearbyDistance
                }m</span></label>
                <input type="range" id="radar-distance-slider" min="100" max="1000" step="100" value="${
                    radarSettings.nearbyDistance
                }" style="width: 100%;">
            </div>

            <div style="margin-bottom: 10px;">
                <label for="radar-test-mode-toggle">Test Mode:</label>
                <input type="checkbox" id="radar-test-mode-toggle" ${
                    radarSettings.useTestMode ? "checked" : ""
                }>
            </div>

            <div id="radar-test-controls" style="margin-bottom: 10px; ${
                radarSettings.useTestMode ? "" : "display: none;"
            }">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <button class="radar-test-btn" data-dir="nw">↖</button>
                    <button class="radar-test-btn" data-dir="n">↑</button>
                    <button class="radar-test-btn" data-dir="ne">↗</button>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <button class="radar-test-btn" data-dir="w">←</button>
                    <button class="radar-test-btn" data-dir="center">⦿</button>
                    <button class="radar-test-btn" data-dir="e">→</button>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <button class="radar-test-btn" data-dir="sw">↙</button>
                    <button class="radar-test-btn" data-dir="s">↓</button>
                    <button class="radar-test-btn" data-dir="se">↘</button>
                </div>
            </div>

            <div>
                <label for="radar-debug-mode-toggle">Debug Mode:</label>
                <input type="checkbox" id="radar-debug-mode-toggle" checked>
            </div>
        </div>
    `;

    // Add the panel to the map
    const mapContainer = document.querySelector(".radar-section .map-placeholder");
    if (mapContainer) {
        mapContainer.appendChild(panel);
        setupRadarDebugControls();
    }
}

/**
 * Sets up event listeners for the radar debug panel controls
 */
function setupRadarDebugControls() {
    radarDebugLog("Setting up radar debug controls");

    // Toggle panel visibility
    const toggleBtn = document.getElementById("toggle-radar-debug");
    const content = document.getElementById("radar-debug-content");
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
    const slider = document.getElementById("radar-distance-slider");
    const distanceValue = document.getElementById("radar-distance-value");
    if (slider && distanceValue) {
        slider.addEventListener("input", function () {
            const value = parseInt(this.value);
            radarSettings.nearbyDistance = value;
            distanceValue.textContent = `${value}m`;

            // Update the user location to check for properties with the new distance
            if (radarSettings.useTestMode) {
                checkRadarNearbyProperties(
                    radarSettings.testLocation.latitude,
                    radarSettings.testLocation.longitude
                );
            }

            radarDebugLog(`Detection radius changed to ${value}m`);
        });
    }

    // Test mode toggle
    const testToggle = document.getElementById("radar-test-mode-toggle");
    const testControls = document.getElementById("radar-test-controls");
    if (testToggle && testControls) {
        testToggle.addEventListener("change", function () {
            radarSettings.useTestMode = this.checked;
            testControls.style.display = this.checked ? "block" : "none";

            radarDebugLog(`Test mode ${this.checked ? "enabled" : "disabled"}`);

            // If toggling to test mode, update with test location
            if (this.checked) {
                updateRadarUserMarker(
                    radarSettings.testLocation.latitude,
                    radarSettings.testLocation.longitude
                );
                checkRadarNearbyProperties(
                    radarSettings.testLocation.latitude,
                    radarSettings.testLocation.longitude
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

                        updateRadarUserMarker(userLat, userLon);
                        checkRadarNearbyProperties(userLat, userLon);
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        // Fall back to centered marker if geolocation fails
                        centerRadarUserMarker();
                    }
                );
            }
        });
    }

    // Debug mode toggle
    const debugToggle = document.getElementById("radar-debug-mode-toggle");
    if (debugToggle) {
        debugToggle.addEventListener("change", function () {
            radarSettings.showDebugInfo = this.checked;
            radarDebugLog(`Debug mode ${this.checked ? "enabled" : "disabled"}`);
        });
    }

    // Movement buttons for test mode
    const testButtons = document.querySelectorAll(".radar-test-btn");
    testButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const direction = this.getAttribute("data-dir");
            moveRadarTestLocation(direction);
        });
    });
}

/**
 * Moves the test location in the specified direction
 * @param {string} direction - Direction to move (n, s, e, w, etc.)
 */
function moveRadarTestLocation(direction) {
    // Step size in degrees (approximately 50-100 meters)
    const step = 0.0005;

    // Reference to the test location object for easy access
    const location = radarSettings.testLocation;

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
                (radarSettings.mapArea.north + radarSettings.mapArea.south) / 2;
            location.longitude =
                (radarSettings.mapArea.east + radarSettings.mapArea.west) / 2;
            break;
    }

    // Ensure coordinates stay within map bounds
    location.latitude = Math.max(
        radarSettings.mapArea.south,
        Math.min(radarSettings.mapArea.north, location.latitude)
    );

    location.longitude = Math.max(
        radarSettings.mapArea.west,
        Math.min(radarSettings.mapArea.east, location.longitude)
    );

    // Update the user marker with new position
    updateRadarUserMarker(location.latitude, location.longitude);

    // Check for nearby properties
    checkRadarNearbyProperties(location.latitude, location.longitude);

    radarDebugLog(
        `Test location moved to ${location.latitude.toFixed(
            6
        )}, ${location.longitude.toFixed(6)}`
    );
}

/**
 * Updates the radar debug panel with current position
 * @param {number} lat - Current latitude
 * @param {number} lon - Current longitude
 */
function updateRadarDebugPanel(lat, lon) {
    const latElement = document.getElementById("radar-debug-lat");
    const lonElement = document.getElementById("radar-debug-lon");

    if (latElement && lonElement) {
        latElement.textContent = `Lat: ${lat.toFixed(6)}`;
        lonElement.textContent = `Lon: ${lon.toFixed(6)}`;
    }
}

// ====== REAL LOCATION FUNCTIONS ======

/**
 * Starts watching the user's real location for the radar
 */
function startRadarWatchingLocation() {
    // Only use real geolocation if we're not in test mode
    if (radarSettings.useTestMode) {
        radarDebugLog("Using test location instead of real geolocation for radar");
        return;
    }

    if (navigator.geolocation) {
        radarDebugLog("Starting to watch real location for radar");

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
                updateRadarUserMarker(userLat, userLon);
                checkRadarNearbyProperties(userLat, userLon);

                radarDebugLog(
                    `Real position updated for radar: ${userLat.toFixed(
                        6
                    )}, ${userLon.toFixed(6)}`
                );
            },
            (error) => {
                console.error("Geolocation error for radar:", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000,
            }
        );

        // Store the watch ID for later use
        window.radarLocationWatchId = watchId;
    } else {
        console.error("Geolocation is not supported by your browser for radar.");
    }
}

// ====== ADD STYLES ======

/**
 * Adds CSS styles for the radar debug panel buttons
 */
function addRadarDebugStyles() {
    // Check if styles were already added
    if (document.getElementById('radar-debug-styles')) return;

    // Create a style element
    const styleElement = document.createElement("style");
    styleElement.id = 'radar-debug-styles';

    // Add CSS rules for debug panel elements
    styleElement.textContent = `
.radar-test-btn {
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

.radar-test-btn:hover {
background: #777;
}

#radar-distance-slider {
height: 8px;
background: #444;
outline: none;
border-radius: 4px;
margin: 10px 0;
}

#radar-distance-slider::-webkit-slider-thumb {
appearance: none;
width: 16px;
height: 16px;
border-radius: 50%;
background: #3498db;
cursor: pointer;
}

#toggle-radar-debug {
background: #555;
border: none;
color: white;
padding: 3px 7px;
border-radius: 3px;
cursor: pointer;
font-size: 11px;
}

#toggle-radar-debug:hover {
background: #777;
}
`;

    // Add the style element to the document head
    document.head.appendChild(styleElement);

    radarDebugLog("Radar debug styles added");
}

// ====== INITIALIZATION ======

/**
 * Initialize the radar page
 */
function initializeRadar() {
    radarDebugLog("Radar initialization started");

    // Add necessary styles
    addRadarDebugStyles();

    // Create property markers on the map
    createRadarPropertyMarkers();

    // Create debug panel if in debug mode
    if (radarSettings.showDebugInfo) {
        createRadarDebugPanel();
    }

    // Set initial position based on mode
    if (radarSettings.useTestMode) {
        // Use test location
        updateRadarUserMarker(
            radarSettings.testLocation.latitude,
            radarSettings.testLocation.longitude
        );

        // Check for nearby properties
        checkRadarNearbyProperties(
            radarSettings.testLocation.latitude,
            radarSettings.testLocation.longitude
        );
    } else {
        // Center the user marker until we get real location
        centerRadarUserMarker();

        // Start watching for real location
        startRadarWatchingLocation();
    }

    // Add click handler to close popup when clicking on map
    const mapPlaceholder = document.querySelector(".radar-section .map-placeholder");
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener("click", function (e) {
            // Only close if not clicking on a marker, popup, or debug panel
            if (
                !e.target.closest(".property-marker") &&
                !e.target.closest(".map-popup") &&
                !e.target.closest("#radar-debug-panel")
            ) {
                hideRadarPropertyPopup();
            }
        });
    }

    // Add click handler for "Center on My Location" button
    const centerBtn = document.querySelector(
        '.radar-section button[title="Center on My Location"]'
    );
    if (centerBtn) {
        centerBtn.addEventListener("click", function () {
            if (radarSettings.useTestMode) {
                // Reset test location to center
                radarSettings.testLocation.latitude =
                    (radarSettings.mapArea.north + radarSettings.mapArea.south) / 2;
                radarSettings.testLocation.longitude =
                    (radarSettings.mapArea.east + radarSettings.mapArea.west) / 2;

                updateRadarUserMarker(
                    radarSettings.testLocation.latitude,
                    radarSettings.testLocation.longitude
                );

                checkRadarNearbyProperties(
                    radarSettings.testLocation.latitude,
                    radarSettings.testLocation.longitude
                );

                radarDebugLog("Centered test location on radar map");
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

                        updateRadarUserMarker(userLat, userLon);
                        checkRadarNearbyProperties(userLat, userLon);

                        radarDebugLog("Centered on real user location for radar");
                    },
                    (error) => {
                        console.error("Geolocation error for radar:", error);
                        alert(
                            "Could not get your location for radar. Please check your permission settings."
                        );
                    }
                );
            } else {
                alert("Geolocation is not supported by your browser for radar.");
            }
        });
    }

    radarDebugLog("Radar initialization complete");
}

// Start the radar when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Only initialize if we're on the radar page
    if (document.querySelector('.radar-section')) {
        radarDebugLog("DOM loaded, initializing radar...");
        initializeRadar();
    }
});
