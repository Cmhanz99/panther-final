@extends('layout.layout')

@section('content')
    <!-- Hero Section with Location Permission -->
    <section id="home" class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>Find Real Estate <span>Near You</span></h1>
                <p>Discover properties in your vicinity with our location-based real estate platform</p>

                <div class="location-permission">
                    <div class="permission-icon">
                        <i class="fas fa-map-marker-alt pulse"></i>
                    </div>
                    <div class="permission-content">
                        <h3>Enable Location Services</h3>
                        <p>Get notified about properties near you as you explore neighborhoods</p>
                        <button id="enable-location" class="btn-primary">
                            <i class="fas fa-location-arrow"></i> Enable Location
                        </button>
                    </div>
                </div>

                <div class="search-wrapper">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Enter neighborhood, city, or ZIP code">
                        <button class="near-me-btn" title="Search near me">
                            <i class="fas fa-location-crosshairs"></i>
                        </button>
                    </div>
                    <div class="search-filters">
                        <select>
                            <option>All Property Types</option>
                            <option>Houses</option>
                            <option>Apartments</option>
                            <option>Condos</option>
                            <option>Commercial</option>
                        </select>
                        <select>
                            <option>Any Price</option>
                            <option>₱0 - ₱200,000</option>
                            <option>₱200,000 - ₱500,000</option>
                            <option>₱500,000 - ₱1,000,000</option>
                            <option>₱1,000,000+</option>
                        </select>
                        <a href="/pages" class="btn-secondary">Search</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Current Location Properties Section -->
    <section id="properties" class="nearby-properties">
        <div class="container">
            <div class="section-header">
                <h2>Properties Near You</h2>
                <p class="location-status">Currently showing properties near <span>Downtown District</span></p>
            </div>

            <div class="proximity-filter">
                <span>Distance:</span>
                <div class="filter-buttons">
                    <button class="active">0.5 mi</button>
                    <button>1 mi</button>
                    <button>3 mi</button>
                    <button>5 mi</button>
                    <button>10+ mi</button>
                </div>
                <div class="slider-container">
                    <input type="range" min="0" max="10" value="3" class="slider" id="distance-slider">
                    <div class="slider-labels">
                        <span>Walking</span>
                        <span>Biking</span>
                        <span>Short Drive</span>
                    </div>
                </div>
            </div>

            <div class="property-grid">
                <!-- Property Card 1 -->
                <div class="property-card">
                    <div class="property-image">
                        <img src="{{ asset('images/apartment1.jpg') }}" alt="Modern Downtown Apartment">
                        <span class="distance"><i class="fas fa-location-arrow"></i> 0.3 miles away</span>
                        <button class="favorite"><i class="far fa-heart"></i></button>
                    </div>
                    <div class="property-details">
                        <div class="price">₱450,000</div>
                        <h3>Sugbo Apartment</h3>
                        <p class="address">Lahug Cebu City</p>
                        <div class="features">
                            <span><i class="fas fa-bed"></i> 2 bed</span>
                            <span><i class="fas fa-bath"></i> 2 bath</span>
                            <span><i class="fas fa-ruler-combined"></i> 1,250 sqft</span>
                        </div>
                        <div class="property-footer">
                            <button class="btn-secondary">View Details</button>
                            <span class="time-to-reach"><i class="fas fa-walking"></i> 5 min</span>
                        </div>
                    </div>
                </div>

                <!-- Property Card 2 -->
                <div class="property-card">
                    <div class="property-image">
                        <img src="{{ asset('images/condo.jpg') }}" alt="Luxury Condo with Views">
                        <span class="distance"><i class="fas fa-location-arrow"></i> 0.8 miles away</span>
                        <button class="favorite"><i class="far fa-heart"></i></button>
                    </div>
                    <div class="property-details">
                        <div class="price">₱685,000</div>
                        <h3>Condo IT Park</h3>
                        <p class="address">Salinas Drive IT Park Cebu</p>
                        <div class="features">
                            <span><i class="fas fa-bed"></i> 3 bed</span>
                            <span><i class="fas fa-bath"></i> 2 bath</span>
                            <span><i class="fas fa-ruler-combined"></i> 1,850 sqft</span>
                        </div>
                        <div class="property-footer">
                            <button class="btn-secondary">View Details</button>
                            <span class="time-to-reach"><i class="fas fa-bicycle"></i> 4 min</span>
                        </div>
                    </div>
                </div>

                <!-- Property Card 3 -->
                <div class="property-card">
                    <div class="property-image">
                        <img src="{{ asset('images/bedspace.jpg') }}" alt="Contemporary Townhouse">
                        <span class="distance"><i class="fas fa-location-arrow"></i> 1.2 miles away</span>
                        <button class="favorite"><i class="far fa-heart"></i></button>
                    </div>
                    <div class="property-details">
                        <div class="price">₱10,000</div>
                        <h3>Bed Spaces</h3>
                        <p class="address">LaGuardia Lahug Cebu City</p>
                        <div class="features">
                            <span><i class="fas fa-bed"></i> 1 bed</span>
                            <span><i class="fas fa-bath"></i> 1 bath</span>
                            <span><i class="fas fa-ruler-combined"></i> 20 sqft</span>
                        </div>
                        <div class="property-footer">
                            <button class="btn-secondary">View Details</button>
                            <span class="time-to-reach"><i class="fas fa-car"></i> 3 min</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="center-button">
                <a href="#" class="btn-primary large">View All Nearby Properties</a>
            </div>
        </div>
    </section>

    <!-- Interactive Map View -->
    <section id="map" class="map-section">
        <div class="container">
            <div class="section-header">
                <h2>Explore Properties on the Map</h2>
                <p>Interactive map showing real estate around your location</p>
            </div>

            <div class="map-container">
                <!-- Map Placeholder -->
                <div class="map-placeholder">
                    <div class="map-overlay">
                        <div class="user-location-marker" id="user-location">
                            <div class="pulse-ring"></div>
                            <i class="fas fa-user-circle"></i>
                        </div>

                        <!-- Distance Circles -->
                        <div class="distance-circle" data-miles="1"></div>
                        <div class="distance-circle" data-miles="3"></div>
                        <div class="distance-circle" data-miles="5"></div>

                        <!-- Sample popup -->
                        <div class="map-popup" id="propertyPopup" style="display: none;">
                            <img src="{{ asset('images/apartment1.jpg') }}" alt="Property Preview" id="popupImage">
                            <h4 id="popupTitle">Sugbo Apartment</h4>
                            <p id="popupDetails">$450,000 | 2 bed, 2 bath</p>
                            <p class="distance-text" id="popupDistance">0.3 miles away</p>
                            <button class="btn-secondary small">View</button>
                        </div>
                    </div>
                </div>

                <div class="map-controls" style="padding: 20px;">
                    <div class="map-filter-toggle">
                        <button class="btn-secondary small active">All</button>
                        <button class="btn-secondary small">Houses</button>
                        <button class="btn-secondary small">Apartments</button>
                        <button class="btn-secondary small">Commercial</button>
                    </div>
                    <div class="map-actions">
                        <button class="btn-icon" title="Zoom In"><i class="fas fa-plus"></i></button>
                        <button class="btn-icon" title="Zoom Out"><i class="fas fa-minus"></i></button>
                        <button class="btn-icon" title="Center on My Location"><i
                                class="fas fa-location-crosshairs"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Notification Preview Section -->
    <section class="notification-preview">
        <div class="container">
            <div class="section-header">
                <h2>Get Notified About Nearby Properties</h2>
                <p>We'll alert you when you're near properties that match your preferences</p>
            </div>

            <div class="notification-demo">
                <div class="phone-mockup">
                    <div class="phone-screen">
                        <div class="notification-card">
                            <div class="notification-header">
                                <img src="{{asset ('images/ProptFinder.png')}}" alt="Logo" class="notification-logo">
                                <div class="notification-app">PropertyFinder</div>
                                <div class="notification-time">Just now</div>
                            </div>
                            <div class="notification-content">
                                <div class="notification-image">
                                    <img src="{{asset ('images/bedspace.jpg')}}" alt="Property">
                                </div>
                                <div class="notification-text">
                                    <h4>Property Near You!</h4>
                                    <p>Condo IT Park - 0.1 miles away</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
<!--This is a comment-->
                <div class="notification-settings">
                    <h3>Customize Your Notifications</h3>
                    <p>Choose when and how you receive alerts about nearby properties</p>

                    <div class="settings-options">
                        <div class="setting-item">
                            <div class="setting-text">
                                <h4>Proximity Threshold</h4>
                                <p>Get notified when you're within this distance</p>
                            </div>
                            <select>
                                <option>0.1 miles</option>
                                <option selected>0.25 miles</option>
                                <option>0.5 miles</option>
                                <option>1 mile</option>
                            </select>
                        </div>

                        <div class="setting-item">
                            <div class="setting-text">
                                <h4>Property Types</h4>
                                <p>Select which types of properties to get notified about</p>
                            </div>
                            <div class="checkbox-group">
                                <label><input type="checkbox" checked> Houses</label>
                                <label><input type="checkbox" checked> Apartments</label>
                                <label><input type="checkbox" checked> Condos</label>
                                <label><input type="checkbox"> Commercial</label>
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-text">
                                <h4>Price Range</h4>
                                <p>Only notify about properties in your budget</p>
                            </div>
                            <div class="price-range">
                                <input type="text" placeholder="Min" value="200,000">
                                <span>to</span>
                                <input type="text" placeholder="Max" value="750,000">
                            </div>
                        </div>

                        <div class="setting-item">
                            <div class="setting-text">
                                <h4>Notification Frequency</h4>
                                <p>Control how often you receive alerts</p>
                            </div>
                            <select>
                                <option>All properties</option>
                                <option selected>Up to 5 per hour</option>
                                <option>Up to 10 per day</option>
                                <option>Only new listings</option>
                            </select>
                        </div>
                    </div>

                    <button class="btn-primary">Save Preferences</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Neighborhood Insights Section -->
    <section class="neighborhood-insights">
        <div class="container">
            <div class="section-header">
                <h2>Neighborhood Insights</h2>
                <p>Current statistics about <span>Downtown District</span></p>
            </div>

            <div class="insights-grid">
                <div class="insight-card">
                    <div class="insight-icon">
                        <i class="fas fa-home"></i>
                    </div>
                    <div class="insight-data">
                        <h3>Average Price</h3>
                        <div class="data-value">$475,000</div>
                        <div class="data-trend up">+5.2% from last year</div>
                    </div>
                </div>

                <div class="insight-card">
                    <div class="insight-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="insight-data">
                        <h3>Market Activity</h3>
                        <div class="data-value">42 Active Listings</div>
                        <div class="data-trend down">-3.8% from last month</div>
                    </div>
                </div>

                <div class="insight-card">
                    <div class="insight-icon">
                        <i class="fas fa-calendar-day"></i>
                    </div>
                    <div class="insight-data">
                        <h3>Days on Market</h3>
                        <div class="data-value">18 days</div>
                        <div class="data-trend up">Faster than city average</div>
                    </div>
                </div>

                <div class="insight-card">
                    <div class="insight-icon">
                        <i class="fas fa-walking"></i>
                    </div>
                    <div class="insight-data">
                        <h3>Walkability</h3>
                        <div class="data-value">87/100</div>
                        <div class="data-trend">Very Walkable</div>
                    </div>
                </div>
            </div>

            <div class="neighborhood-cta">
                <button class="btn-primary">View Full Neighborhood Report</button>
            </div>
        </div>
    </section>

    <!-- Mobile App Download Section -->
    <section class="app-download">
        <div class="container">
            <div class="app-download-content">
                <div class="app-text">
                    <h2>Get the PropertyFinder Mobile App</h2>
                    <p>Enhanced location features, real-time notifications, and more</p>

                    <ul class="app-features">
                        <li><i class="fas fa-bell"></i> Background location tracking</li>
                        <li><i class="fas fa-map-marked-alt"></i> Save your favorite areas</li>
                        <li><i class="fas fa-route"></i> Plan property viewing routes</li>
                        <li><i class="fas fa-clock"></i> Get instant notifications</li>
                    </ul>

                    <div class="app-buttons">
                        <a href="#" class="app-store-btn">
                            <i class="fab fa-apple"></i>
                            <span>
                                <small>Download on the</small>
                                App Store
                            </span>
                        </a>
                        <a href="#" class="play-store-btn">
                            <i class="fab fa-google-play"></i>
                            <span>
                                <small>GET IT ON</small>
                                Google Play
                            </span>
                        </a>
                    </div>
                </div>

                <div class="app-qr">
                    <div class="qr-code">
                        <img src="{{asset ('images/qrcode_193007252_b3cf5c77a8e1d377e9e3c331393dfc86.png')}}" width="100px" alt="QR Code">
                    </div>
                    <p>Scan to download</p>
                </div>

                <div class="app-mockup">
                    <img src="{{}}" alt="App Screenshot">
                </div>
            </div>
        </div>
    </section>

    <!-- Property Alert Preview -->
    <div class="property-alert" id="property-alert">
        <button class="close-btn"><i class="fas fa-times"></i></button>
        <div class="alert-content">
            <div class="alert-icon">
                <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="alert-text">
                <h4>Property Nearby!</h4>
                <p><strong>Modern Downtown Apartment</strong></p>
                <p>0.3 miles from your current location</p>
                <div class="alert-price">$450,000</div>
                <button class="btn-primary small">View Details</button>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer id="contact">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-column">
                    <div class="footer-logo">
                        <h2>Property<span>Finder</span></h2>
                    </div>
                    <p>Discover nearby properties with our geolocation-based real estate platform.</p>
                    <div class="social-icons">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>

                <div class="footer-column">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Properties</a></li>
                        <li><a href="#">Map View</a></li>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h3>Property Types</h3>
                    <ul>
                        <li><a href="#">Houses</a></li>
                        <li><a href="#">Apartments</a></li>
                        <li><a href="#">Condos</a></li>
                        <li><a href="#">Commercial</a></li>
                        <li><a href="#">Land</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h3>Contact Us</h3>
                    <ul class="contact-info">
                        <li><i class="fas fa-map-marker-alt"></i> 123 Real Estate Ave, City, State 12345</li>
                        <li><i class="fas fa-phone"></i> (555) 123-4567</li>
                        <li><i class="fas fa-envelope"></i> info@propertyfinder.com</li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2025 PropertyFinder. All rights reserved.</p>
                <ul>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Sitemap</a></li>
                </ul>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
@endsection
