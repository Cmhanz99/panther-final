<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;

class PropertySeeder extends Seeder
{
    public function run()
    {
        // Clear existing records
        Property::truncate();

        // Insert sample data
        Property::create([
            'name' => 'Sugbo Apartment',
            'latitude' => 10.315366,
            'longitude' => 123.918746,
            'price' => '$450,000',
            'details' => '2 bed, 2 bath',
            'image' => 'images/apartment1.jpg'
        ]);

        Property::create([
            'name' => 'Condo IT Park',
            'latitude' => 10.3153,
            'longitude' => 123.918,
            'price' => '$685,000',
            'details' => '3 bed, 2 bath',
            'image' => 'images/condo.jpg'
        ]);

        Property::create([
            'name' => 'Bed Spaces',
            'latitude' => 10.3175,
            'longitude' => 123.917,
            'price' => '$10,000',
            'details' => '1 bed, 1 bath',
            'image' => 'images/bedspace.jpg'
        ]);
    }
}


