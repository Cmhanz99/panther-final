/**
 * Sets up the zoom in and zoom out buttons
 */
function setupZoomButtons() {
    debugLog("Setting up zoom buttons");

    // Get the zoom buttons
    const zoomInBtn = document.querySelector('button[title="Zoom In"]');
    const zoomOutBtn = document.querySelector('button[title="Zoom Out"]');

    // Get the map container that will be zoomed
    const mapOverlay = document.querySelector(".map-overlay");

    // Set initial zoom level
    if (!window.mapZoomLevel) {
        window.mapZoomLevel = 1; // Default zoom level
    }

    // Min and max zoom levels
    const MIN_ZOOM = 0.5; // Zoomed out (can see more properties)
    const MAX_ZOOM = 2.0; // Zoomed in (can see fewer properties in detail)
    const ZOOM_STEP = 0.2; // How much to zoom in/out per click

    // Apply initial zoom if needed
    applyZoom(mapOverlay, window.mapZoomLevel);

    // Add click handlers for the zoom buttons
    if (zoomInBtn) {
        zoomInBtn.addEventListener("click", function () {
            // Increase zoom level but don't exceed max
            window.mapZoomLevel = Math.min(
                MAX_ZOOM,
                window.mapZoomLevel + ZOOM_STEP
            );
            applyZoom(mapOverlay, window.mapZoomLevel);
            debugLog(`Zoomed in to level: ${window.mapZoomLevel.toFixed(1)}`);
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener("click", function () {
            // Decrease zoom level but don't go below min
            window.mapZoomLevel = Math.max(
                MIN_ZOOM,
                window.mapZoomLevel - ZOOM_STEP
            );
            applyZoom(mapOverlay, window.mapZoomLevel);
            debugLog(`Zoomed out to level: ${window.mapZoomLevel.toFixed(1)}`);
        });
    }
}

/**
 * Applies zoom level to the map
 * @param {HTMLElement} mapElement - The map element to zoom
 * @param {number} zoomLevel - The zoom level to apply
 */
function applyZoom(mapElement, zoomLevel) {
    if (!mapElement) return;

    // Apply the zoom level using CSS transform
    mapElement.style.transform = `scale(${zoomLevel})`;

    // Adjust the overflow behavior based on zoom level
    const mapPlaceholder = document.querySelector(".map-placeholder");
    if (mapPlaceholder) {
        if (zoomLevel > 1) {
            // When zoomed in, allow scrolling/panning
            mapPlaceholder.style.overflow = "auto";
        } else {
            // When at normal zoom or zoomed out, hide scrollbars
            mapPlaceholder.style.overflow = "hidden";
        }
    }

    // Update property markers and user marker positions
    adjustMarkerSizes(zoomLevel);

    // If a popup is open, update its position
    updateOpenPopupPosition();
}

/**
 * Adjusts the size of markers based on zoom level
 * @param {number} zoomLevel - Current zoom level
 */
function adjustMarkerSizes(zoomLevel) {
    // Make markers appear relatively the same size regardless of zoom

    // Adjust property markers
    const propertyMarkers = document.querySelectorAll(
        ".property-marker .marker"
    );
    propertyMarkers.forEach((marker) => {
        // Inversely scale the markers so they maintain visual size
        // As the map gets bigger (zoom in), markers get smaller
        const inverseScale = 1 / zoomLevel;
        marker.style.transform = `scale(${inverseScale})`;
    });

    // Adjust the user marker
    const userMarker = document.getElementById("user-location");
    if (userMarker) {
        const inverseScale = 1 / zoomLevel;
        userMarker.style.transform = `translate(-50%, -50%) scale(${inverseScale})`;
    }
}

/**
 * Updates the position of any open popup after zoom changes
 */
function updateOpenPopupPosition() {
    const popup = document.getElementById("propertyPopup");
    if (popup && popup.style.display === "block") {
        // Get the current property being shown
        const propertyTitle = document.getElementById("popupTitle").textContent;

        // Find the matching property
        const property = propertyList.find((p) => p.name === propertyTitle);

        if (property) {
            // Get the property position based on current zoom
            const position = convertCoordsToPosition(
                property.latitude,
                property.longitude
            );

            // Update popup position
            popup.style.top = `${position.top}%`;
            popup.style.left = `${position.left}%`;

            // Scale the popup inversely to zoom to maintain readability
            const inverseScale = 1 / window.mapZoomLevel;
            popup.style.transform = `translate(-50%, -120%) scale(${inverseScale})`;
        }
    }
}

/**
 * Enhanced version of the updatePropertyPopup function that accounts for zoom
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
    popup.style.zIndex = "200";

    // Position popup above the property marker, accounting for zoom
    const inverseScale = 1 / (window.mapZoomLevel || 1);
    popup.style.transform = `translate(-50%, -120%) scale(${inverseScale})`;

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
 * Enhanced version of createPropertyMarkers that supports zooming
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
        markerElement.dataset.propertyId =
            property.id || property.name.replace(/\s+/g, "-").toLowerCase();

        // Position the marker
        markerElement.style.top = `${position.top}%`;
        markerElement.style.left = `${position.left}%`;
        markerElement.style.position = "absolute";
        markerElement.style.transform = "translate(-50%, -50%)";
        markerElement.style.zIndex = "50";

        // Determine property type
        let propertyType = "residential";
        if (
            property.price.includes("1,200,000") ||
            property.price.includes("1.2M")
        ) {
            propertyType = "commercial";
        }

        // Add the marker content
        markerElement.innerHTML = `
            <div class="marker ${propertyType}">
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

    // Apply zoom level to markers if needed
    if (window.mapZoomLevel) {
        adjustMarkerSizes(window.mapZoomLevel);
    }
}

// Add CSS styles for zooming
function addZoomStyles() {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
        .map-placeholder {
            position: relative;
            width: 100%;
            height: 500px;
            background-color: #f8f9fa;
            border-radius: 8px;
            overflow: hidden;
        }

        .map-overlay {
            position: absolute;
            width: 100%;
            height: 100%;
            transform-origin: center center;
            transition: transform 0.3s ease;
        }

        /* When zoomed in, show a hand cursor to indicate panning */
        .map-placeholder.zoomed-in {
            cursor: grab;
        }

        .map-placeholder.zoomed-in:active {
            cursor: grabbing;
        }

        /* Make sure the popup doesn't get cut off */
        .map-popup {
            transform-origin: bottom center;
        }
    `;
    document.head.appendChild(styleElement);
}

// Update the initializeMap function to include zoom setup
function initializeMap() {
    debugLog("Map initialization started");

    // Add zoom styles
    addZoomStyles();

    // Create property markers on the map
    createPropertyMarkers();

    // Set up filter buttons
    setupFilterButtons();

    // Set up zoom buttons
    setupZoomButtons();

    // Create debug panel if in debug mode
    if (mapSettings.showDebugInfo) {
        createDebugPanel();
    }

    // Rest of your initialization function...

    debugLog("Map initialization complete");
}
