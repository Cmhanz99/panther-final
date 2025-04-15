/**
 * Sets up the property filter buttons
 */
function setupFilterButtons() {
    debugLog("Setting up property filter buttons");

    // Get all filter buttons
    const filterButtons = document.querySelectorAll(
        ".map-filter-toggle button"
    );

    // Add click event to each button
    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            // Remove 'active' class from all buttons
            filterButtons.forEach((btn) => btn.classList.remove("active"));

            // Add 'active' class to clicked button
            this.classList.add("active");

            // Get the filter type from button text
            const filterType = this.textContent.trim().toLowerCase();

            // Apply the filter
            filterProperties(filterType);
        });
    });
}

/**
 * Filters properties based on the selected type
 * @param {string} filterType - The type of properties to show (all, houses, apartments, commercial)
 */
function filterProperties(filterType) {
    debugLog(`Filtering properties by: ${filterType}`);

    // Get all property markers
    const propertyMarkers = document.querySelectorAll(".property-marker");

    // Show or hide markers based on filter type
    propertyMarkers.forEach((marker) => {
        // First hide the marker
        marker.style.display = "none";

        // Get property type class from the marker
        const isCommercial =
            marker.querySelector(".marker.commercial") !== null;
        const isResidential =
            marker.querySelector(".marker.residential") !== null;

        // Show marker based on filter type
        if (filterType === "all") {
            // Show all markers
            marker.style.display = "block";
        } else if (filterType === "commercial" && isCommercial) {
            // Show only commercial properties
            marker.style.display = "block";
        } else if (filterType === "houses" && isResidential) {
            // This is a simplified example - in a real app, you would
            // have more specific classifications for houses vs apartments
            // Here we're just checking if the price is higher to identify houses
            const priceText = marker.querySelector(".marker span").textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ""));

            if (price >= 450) {
                // Assuming houses are more expensive (e.g., 450K+)
                marker.style.display = "block";
            }
        } else if (filterType === "apartments" && isResidential) {
            // Show only apartments (lower-priced residential properties in this example)
            const priceText = marker.querySelector(".marker span").textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ""));

            if (price < 450) {
                // Assuming apartments are less expensive (e.g., under 450K)
                marker.style.display = "block";
            }
        }
    });

    // Hide any open property popup when filter changes
    hidePropertyPopup();
}

/**
 * Creates and places property markers on the map with property type information
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

        // Determine property type based on price and name
        let propertyType = "residential";

        // Check if it's a commercial property by price or name
        if (
            property.price.includes("1,200,000") ||
            property.price.includes("1.2M")
        ) {
            propertyType = "commercial";
        }

        // Check for property type by name (simplified example)
        if (
            property.name.toLowerCase().includes("condo") ||
            property.name.toLowerCase().includes("apartment")
        ) {
            propertyType = "residential"; // It's already residential, but making it explicit

            // Store specific type as a data attribute for filtering
            markerElement.dataset.specificType = property.name
                .toLowerCase()
                .includes("condo")
                ? "condo"
                : "apartment";
        }

        if (
            property.name.toLowerCase().includes("house") ||
            property.name.toLowerCase().includes("home")
        ) {
            propertyType = "residential";
            markerElement.dataset.specificType = "house";
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

        debugLog(`Added marker for ${property.name} (${propertyType})`);
    });
}

// Add filter setup to the initialization function
function initializeMap() {
    debugLog("Map initialization started");

    // Create property markers on the map
    createPropertyMarkers();

    // Set up property filter buttons
    setupFilterButtons();

    // Create debug panel if in debug mode
    if (mapSettings.showDebugInfo) {
        createDebugPanel();
    }

    // Rest of your existing initializeMap function...

    // Set initial position based on mode
    if (mapSettings.useTestMode) {
        // Use test location
        updateUserMarker(
            mapSettings.testLocation.latitude,
            mapSettings.testLocation.longitude
        );

        // Check for nearby properties
        checkNearbyProperties(
            mapSettings.testLocation.latitude,
            mapSettings.testLocation.longitude
        );
    } else {
        // Center the user marker until we get real location
        centerUserMarker();

        // Start watching for real location
        startWatchingLocation();
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

    // Other initialization code...

    debugLog("Map initialization complete");
}
