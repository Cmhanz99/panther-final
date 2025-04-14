<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserControl;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/sign_up',[UserControl::class, 'sign_in']);

Route::post('/sign_up', [UserControl::class, 'signin']);

Route::get('/pages', [UserControl::class, 'pagest']);
