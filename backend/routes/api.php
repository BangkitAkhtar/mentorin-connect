<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\ClassItemController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReviewController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/upload-avatar', [UploadController::class, 'uploadAvatar']);

Route::get('/classes', [ClassItemController::class, 'index']);
Route::post('/classes', [ClassItemController::class, 'store']);
Route::put('/classes/{id}', [ClassItemController::class, 'update']);
Route::delete('/classes/{id}', [ClassItemController::class, 'destroy']);

Route::get('/bookings', [BookingController::class, 'index']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::put('/bookings/{id}', [BookingController::class, 'update']);
Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);
Route::get('/reviews', [ReviewController::class, 'index']);

// Kita buat sementara tanpa middleware auth sanctum agar lebih mudah dites
// Kalau ingin aman, pindahkan ke dalam blok middleware('auth:sanctum')
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
