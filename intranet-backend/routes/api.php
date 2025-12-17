<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\ShortcutController;
use App\Http\Controllers\StatistiquesController;
use App\Http\Controllers\UserController;


// Login
Route::post('login', [UserController::class, 'login']);

Route::get('test', function (Request $request) {
    return response()->json(['message' => 'API is working']);
});

Route::get('getCurrentUserInfo', [UserController::class, 'getCurrentUserInfo']);


// Pour les users normaux authentifiés
Route::middleware([JwtMiddleware::class])->group(function () {

    //User
    Route::post('logout', [UserController::class, 'logout']);
    Route::put('updateCurrentUser', [UserController::class, 'updateCurrentUser']); // Met à jour les informations de l'utilisateur actuel
    Route::put('updateCurrentUserPassword', [UserController::class, 'updateCurrentUserPassword']); // Met à jour le mot de passe de l'utilisateur actuel
    Route::put('updateCurrentUserFirstLogin', [UserController::class, 'updateCurrentUserFirstLogin']); // Met à jour les informations de l'utilisateur actuel lors de la première connexion

    //Services
    Route::get('getUserServices', [ServicesController::class, 'getUserServices']); // Récupère un service
    Route::post('updateNumberClick/{service_id}', [ServicesController::class, 'updateNumberClick']); // Augmente le nombre de clics sur un service

    //Catégories
    Route::get('getAllCategory', [CategoryController::class, 'getAllCategory']); // Récupère les catégories

    //Status
    Route::get('getAllStatus', [StatusController::class, 'getAllStatus']); // Récupère les status

    //Shortcuts
    Route::get('getUserShortcuts', [ShortcutController::class, 'getUserShortcuts']); // Récupère les shortcuts de l'utilisateur connecté
    Route::post('addShortcut', [ShortcutController::class, 'addShortcut']); // Ajoute un shortcut pour l'utilisateur connecté
    Route::delete('deleteShortcut/{id}', [ShortcutController::class, 'deleteShortcut']); // Supprime un shortcut pour l'utilisateur connecté
});



// Pour les admins authentifiés (gestion des services, catégories, status et utilisateurs)
Route::middleware([JwtMiddleware::class, AdminMiddleware::class])->group(function() {

    //Services
    Route::get('getServices', [ServicesController::class, 'getServices']); // Récupère les services
    Route::post('storeService', [ServicesController::class, 'store']); // Enregistre un service 
    Route::post('updateService/{id}', [ServicesController::class, 'update']); // Modifie un service
    Route::delete('deleteService/{id}', [ServicesController::class, 'destroy']); // Supprime un service

    //Catégories
    Route::post('storeCategory', [CategoryController::class, 'store']); // Enregistre une catégorie
    Route::put('updateCategory/{id}', [CategoryController::class, 'update']); // Modifie une catégorie
    Route::delete('deleteCategory/{id}', [CategoryController::class, 'destroy']); // Supprime une catégorie

    //Status
    Route::post('storeStatus', [StatusController::class, 'store']); // Enregistre un status
    Route::put('updateStatus/{id}', [StatusController::class, 'update']); // Modifie un status
    Route::delete('deleteStatus/{id}', [StatusController::class, 'destroy']); // Supprime un status

    //utilisateurs
    Route::get('getUsers', [UserController::class, 'getUsers']); // Récupère les utilisateurs
    Route::post('storeUser', [UserController::class, 'store']); // Enregistre un utilisateur
    Route::put('updateUser/{id}', [UserController::class, 'update']); // Modifie un utilisateur
    Route::delete('deleteUser/{id}', [UserController::class, 'delete']); // Supprime un utilisateur

    //Statistiques
    Route::get('getStatByUserByServiceByDate', [StatistiquesController::class, 'getStatByUserByServiceByDate']); // Récupère les statistiques 'barres' par utilisateur, service et date
});