<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// App Routes
Route::get('/', [GameController::class, 'index'])->name('home');
Route::get('/game', [GameController::class, 'play'])->defaults('mode', 'game')->name('game');
Route::get('/practice', [GameController::class, 'play'])->defaults('mode', 'practice')->name('practice');
Route::get('/gallery', [GameController::class, 'gallery'])->name('gallery');
Route::get('/replay/{game}', [GameController::class, 'replay'])->name('replay');

// Auth Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// API to save and delete games
Route::post('/api/games', [GameController::class, 'store']);
Route::delete('/api/games/{game}', [GameController::class, 'destroy']);
