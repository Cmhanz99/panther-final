<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <title>Sign In Form</title>
</head>

<body class="w-full h-screen flex items-center justify-center bg-gray-100">
    <div class="shadow-lg rounded-lg p-8 bg-white w-96">
        <h2 class="font-bold text-3xl mb-6">Sign In</h2>
        <form action="/sign_up" method="POST">
            @csrf
            <div class="mb-4">
                <label for="name" class="block mb-2">Name</label>
                <input type="text" id="name" name="name"
                    class="w-full border border-gray-300 rounded-md p-2">
            </div>
            <div class="mb-4">
                <label for="password" class="block mb-2">Password</label>
                <input type="password" id="password" name="password"
                    class="w-full border border-gray-300 rounded-md p-2">
            </div>
            <div class="mt-6">
                <div class="flex justify-between mb-4">
                    <a href="/sign_up" class="inline-block underline">Sign up?</a>
                    <a href="/forgot-password" class="inline-block underline">Forgot password?</a>
                </div>
                <input type="submit" value="Login"
                    class="w-full bg-blue-500 text-white rounded-md p-2 mb-3 cursor-pointer hover:bg-blue-600">
                <a href="/"
                    class="block w-full bg-gray-200 text-center text-gray-700 rounded-md p-2 cursor-pointer hover:bg-gray-300">Home
                    Page</a>
            </div>
        </form>
    </div>
</body>

</html>
