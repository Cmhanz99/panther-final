<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProptHunt - Discover Real Estate Near You</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">
</head>

<body>
    @include('layout.nav')
    <!-- Header -->
    @yield('content')

    <script src="{{asset ('js/geolocation.js')}}"></script>
    <script src="{{asset ('js/userFilter.js')}}"></script>
    <script src="{{asset ('js/zoom.js')}}"></script>
    <script src="{{asset ('js/gridToggle.js')}}"></script>
    <script src="{{asset ('js/radar.js')}}"></script>
    <script>
        // Any general, app-wide JavaScript can go here
        console.log("PropertyFinder application initialized");
    </script>
</body>

</html>
