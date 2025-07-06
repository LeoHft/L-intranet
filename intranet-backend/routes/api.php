<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Middleware\AdminMiddleware;


// Login
Route::post('intranet/login', [UserController::class, 'login']);

Route::get('intranet/test', function (Request $request) {
    return response()->json(['message' => 'API is working']);
});


// Pour les users normaux authentifiés
Route::middleware('jwt')->group(function () {

    //Logout
    Route::post('intranet/logout', [UserController::class, 'logout']);

    //Services
    Route::get('intranet/getUserServices', 'App\Http\Controllers\ServicesController@getUserServices'); // Récupère un service

    //Catégories
    Route::get('intranet/getCategories', 'App\Http\Controllers\CategoryController@getCategory'); // Récupère les catégories

    //Status
    Route::get('intranet/getStatus', 'App\Http\Controllers\StatusController@getStatus'); // Récupère les status
});



// Pour les admins authentifiés (gestion des services, catégories, status et utilisateurs)
Route::middleware(['jwt', 'admin'])->group(function() {

    //Services
    Route::get('intranet/getServices', 'App\Http\Controllers\ServicesController@getServices'); // Récupère les services
    Route::post('intranet/storeService', 'App\Http\Controllers\ServicesController@store'); // Enregistre un service 
    Route::put('intranet/updateService/{id}', 'App\Http\Controllers\ServicesController@update'); // Modifie un service
    Route::delete('intranet/deleteService/{id}', 'App\Http\Controllers\ServicesController@destroy'); // Supprime un service

    //Catégories
    Route::post('intranet/storeCategory', 'App\Http\Controllers\CategoryController@store'); // Enregistre une catégorie
    Route::put('intranet/updateCategory/{id}', 'App\Http\Controllers\CategoryController@update'); // Modifie une catégorie
    Route::delete('intranet/deleteCategory/{id}', 'App\Http\Controllers\CategoryController@destroy'); // Supprime une catégorie

    //Status
    Route::post('intranet/storeStatus', 'App\Http\Controllers\StatusController@store'); // Enregistre un status
    Route::put('intranet/updateStatus/{id}', 'App\Http\Controllers\StatusController@update'); // Modifie un status
    Route::delete('intranet/deleteStatus/{id}', 'App\Http\Controllers\StatusController@destroy'); // Supprime un status

    //utilisateurs
    Route::get('intranet/getUsers', 'App\Http\Controllers\UserController@getUsers'); // Récupère les utilisateurs
    Route::post('intranet/storeUser', 'App\Http\Controllers\UserController@store'); // Enregistre un utilisateur
    Route::put('intranet/updateUser/{id}', 'App\Http\Controllers\UserController@update'); // Modifie un utilisateur
    Route::delete('intranet/deleteUser/{id}', 'App\Http\Controllers\UserController@destroy'); // Supprime un utilisateur
});