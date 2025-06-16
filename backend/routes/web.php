<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});


Route::get('/dcm/{filename}', function ($filename) {
    $path = storage_path("app/public/dcm/$filename");

    if (!file_exists($path)) {
        return response()->json(['error' => 'Arquivo não encontrado'], 404);
    }

    return response()->file($path, [
        'Content-Type' => 'application/dicom',
        'Access-Control-Allow-Origin' => '*',
    ]);
});
