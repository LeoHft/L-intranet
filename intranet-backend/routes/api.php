<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Middleware\AdminMiddleware;


// Login
Route::post('login', [UserController::class, 'login']);

Route::get('test', function (Request $request) {
    return response()->json(['message' => 'API is working']);
});

Route::get('getCurrentUserInfo', 'App\Http\Controllers\UserController@getCurrentUserInfo');


// Pour les users normaux authentifiés
Route::middleware('jwt')->group(function () {

    //User
    Route::post('logout', [UserController::class, 'logout']);
    Route::put('updateCurrentUser', 'App\Http\Controllers\UserController@updateCurrentUser'); // Met à jour les informations de l'utilisateur actuel
    Route::put('updateCurrentUserPassword', 'App\Http\Controllers\UserController@updateCurrentUserPassword'); // Met à jour le mot de passe de l'utilisateur actuel

    //Services
    Route::get('getUserServices', 'App\Http\Controllers\ServicesController@getUserServices'); // Récupère un service
    Route::post('updateNumberClick/{service_id}', 'App\Http\Controllers\ServicesController@updateNumberClick'); // Augmente le nombre de clics sur un service

    //Catégories
    Route::get('getAllCategory', 'App\Http\Controllers\CategoryController@getAllCategory'); // Récupère les catégories

    //Status
    Route::get('getAllStatus', 'App\Http\Controllers\StatusController@getAllStatus'); // Récupère les status
});



// Pour les admins authentifiés (gestion des services, catégories, status et utilisateurs)
Route::middleware(['jwt', 'admin'])->group(function() {

    //Services
    Route::get('getServices', 'App\Http\Controllers\ServicesController@getServices'); // Récupère les services
    Route::post('storeService', 'App\Http\Controllers\ServicesController@store'); // Enregistre un service 
    Route::post('updateService/{id}', 'App\Http\Controllers\ServicesController@update'); // Modifie un service
    Route::delete('deleteService/{id}', 'App\Http\Controllers\ServicesController@destroy'); // Supprime un service

    //Catégories
    Route::post('storeCategory', 'App\Http\Controllers\CategoryController@store'); // Enregistre une catégorie
    Route::put('updateCategory/{id}', 'App\Http\Controllers\CategoryController@update'); // Modifie une catégorie
    Route::delete('deleteCategory/{id}', 'App\Http\Controllers\CategoryController@destroy'); // Supprime une catégorie

    //Status
    Route::post('storeStatus', 'App\Http\Controllers\StatusController@store'); // Enregistre un status
    Route::put('updateStatus/{id}', 'App\Http\Controllers\StatusController@update'); // Modifie un status
    Route::delete('deleteStatus/{id}', 'App\Http\Controllers\StatusController@destroy'); // Supprime un status

    //utilisateurs
    Route::get('getUsers', 'App\Http\Controllers\UserController@getUsers'); // Récupère les utilisateurs
    Route::post('storeUser', 'App\Http\Controllers\UserController@store'); // Enregistre un utilisateur
    Route::put('updateUser/{id}', 'App\Http\Controllers\UserController@update'); // Modifie un utilisateur
    Route::delete('deleteUser/{id}', 'App\Http\Controllers\UserController@delete'); // Supprime un utilisateur

    //Statistiques
    Route::get('getStatByUserByServiceByDate', 'App\Http\Controllers\StatistiquesController@getStatByUserByServiceByDate'); // Récupère les statistiques 'barres' par utilisateur, service et date
});