<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Listing</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="{{asset ('css/nav.css')}}">
</head>
    @include('layout.nav')
<body class="bg-gray-100 p-4">
    <div class="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow-md">
        <!-- Main Flex Container -->
        <div class="flex flex-col md:flex-row">
            <!-- Property Image Container with Relative Position -->
            <div class="relative w-full md:w-1/2">
                <!-- Distance Badge -->
                <div class="absolute top-4 left-4 bg-gray-800 text-white px-4 py-1 rounded-full text-sm flex items-center">
                    <i class="fa-solid fa-location-dot mr-2"></i>
                    0.3 miles away
                </div>

                <!-- Favorite Button -->
                <div class="cursor-pointer absolute top-4 right-4 bg-white w-10 h-10 items-center justify-center flex p-2 rounded-full shadow-md">
                    <i class="fa-regular fa-heart text-gray-400"></i>
                </div>

                <!-- Property Image -->
                <img src="{{asset ('images/apartment1.jpg')}}" alt="Property Interior" class="w-full h-65 object-cover"/>
            </div>

            <!-- Property Details -->
            <div class="w-full md:w-1/2 p-5">
                <!-- Price -->
                <div class="text-blue-500 text-3xl font-bold mb-2">₱450,000</div>

                <!-- Title and Location -->
                <h2 class="text-2xl font-bold text-gray-800 mb-1">Sugbo Apartment</h2>
                <p class="text-gray-500 mb-6">Lahug Cebu City</p>

                <!-- Property Features -->
                <div class="flex flex-wrap items-center gap-6 text-gray-700 mb-6">
                    <!-- Beds -->
                    <div class="flex items-center">
                        <i class="fa-solid fa-bed text-gray-500 mr-2"></i>
                        <span>2 bed</span>
                    </div>

                    <!-- Baths -->
                    <div class="flex items-center">
                        <i class="fa-solid fa-bath text-gray-500 mr-2"></i>
                        <span>2 bath</span>
                    </div>

                    <!-- Square Footage -->
                    <div class="flex items-center">
                        <i class="fa-solid fa-expand text-gray-500 mr-2"></i>
                        <span>1,250 sqft</span>
                    </div>
                </div>

                <!-- Bottom Section with View Details and Walking Time -->
                <div class="flex items-center justify-between mt-4">
                    <button class="cursor-pointer border border-gray-300 text-gray-800 rounded-full px-6 py-2 hover:bg-gray-50 transition-colors">
                        View Details
                    </button>

                    <div class="flex items-center text-gray-500">
                        <i class="fa-solid fa-clock mr-2"></i>
                        <span>5 min</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
