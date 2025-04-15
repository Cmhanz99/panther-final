<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index()
    {
        $properties = Property::all();
        return view('welcome', compact('properties'));
    }
    public function radar()
    {
        // Check if user is logged in

        // Get properties from database
        $properties = Property::all();

        return view('radar', compact('properties'));
    }
}
