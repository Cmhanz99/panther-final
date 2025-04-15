@extends('layout.layout')

@section('content')
<section id="radar" class="radar-section">
    <div class="container">
        <div class="section-header">
            <h2>Property Radar</h2>
            <p>View properties around you with our distance radar</p>
        </div>

        <div class="map-container">
            <!-- Map Placeholder -->
            <div class="map-placeholder">
                <div class="map-overlay">
                    <div class="user-location-marker" id="radar-user-location">
                        <div class="pulse-ring"></div>
                        <i class="fas fa-user-circle"></i>
                    </div>

                    <!-- Distance Circles -->
                    <div class="distance-circle" data-miles="1"></div>
                    <div class="distance-circle" data-miles="3"></div>
                    <div class="distance-circle" data-miles="5"></div>

                    <!-- Sample popup -->
                    <div class="map-popup" id="radarPropertyPopup" style="display: none;">
                        <img src="{{ asset('images/apartment1.jpg') }}" alt="Property Preview" id="radarPopupImage">
                        <h4 id="radarPopupTitle">Sugbo Apartment</h4>
                        <p id="radarPopupDetails">$450,000 | 2 bed, 2 bath</p>
                        <p class="distance-text" id="radarPopupDistance">0.3 miles away</p>
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
                    <button class="btn-icon" title="Center on My Location"><i class="fas fa-location-crosshairs"></i></button>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
<script>
    // Pass the PHP properties to JavaScript
    window.propertyList = @json($properties);
</script>
