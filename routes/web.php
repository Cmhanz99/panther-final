<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserControl;
use App\Http\Controllers\PropertyController;


Route::get('/', function () {
    return view('welcome');
});

Route::get('/sign_up',[UserControl::class, 'sign_in']);

Route::post('/sign_up', [UserControl::class, 'signin']);

Route::get('/pages', [UserControl::class, 'pagest']);


Route::get('/', [PropertyController::class, 'index']);

Route::get('/radar', [PropertyController::class, 'radar'])->name('radar');


