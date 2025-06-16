<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DicomImageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('/users', UserController::class);

    Route::get('/imagens-dicom', [DicomImageController::class, 'index']);
    Route::post('/imagens-dicom', [DicomImageController::class, 'store']);
    Route::get('/imagens-dicom/{id}', [DicomImageController::class, 'show']);
    Route::post('/imagens-dicom/{id}', [DicomImageController::class, 'update']);
    Route::delete('/imagens-dicom/{id}', [DicomImageController::class, 'destroy']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
