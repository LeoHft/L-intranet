<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\ShortcutController;
use App\Http\Controllers\StatistiquesController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('login', [UserController::class, 'login'])->middleware('throttle:login');
Route::get('getCurrentUserInfo', [UserController::class, 'getCurrentUserInfo']);

// Authentifié, y compris lorsque le mot de passe doit encore être changé
Route::middleware('jwt')->group(function () {
    Route::post('logout', [UserController::class, 'logout']);
    Route::put('updateCurrentUserFirstLogin', [UserController::class, 'updateCurrentUserFirstLogin'])->middleware('throttle:sensitive');
});

// Utilisateurs authentifiés
Route::middleware(['jwt', 'password.changed'])->group(function () {
    // Profil
    Route::put('updateCurrentUser', [UserController::class, 'updateCurrentUser']);
    Route::put('updateCurrentUserPassword', [UserController::class, 'updateCurrentUserPassword'])->middleware('throttle:sensitive');

    // Services
    Route::get('getUserServices', [ServicesController::class, 'getUserServices']);
    Route::post('updateNumberClick/{service}', [ServicesController::class, 'updateNumberClick']);

    // Catégories et statuts
    Route::get('getAllCategory', [CategoryController::class, 'getAllCategory']);
    Route::get('getAllStatus', [StatusController::class, 'getAllStatus']);

    // Raccourcis
    Route::get('getUserShortcuts', [ShortcutController::class, 'getUserShortcuts']);
    Route::post('addShortcut', [ShortcutController::class, 'addShortcut']);
    Route::delete('deleteShortcut/{shortcut}', [ShortcutController::class, 'deleteShortcut']);
});

// Administrateurs
Route::middleware(['jwt', 'password.changed', 'admin'])->group(function () {
    // Services
    Route::get('getServices', [ServicesController::class, 'getServices']);
    Route::post('storeService', [ServicesController::class, 'store']);
    Route::post('updateService/{service}', [ServicesController::class, 'update']);
    Route::delete('deleteService/{service}', [ServicesController::class, 'destroy']);

    // Catégories
    Route::post('storeCategory', [CategoryController::class, 'store']);
    Route::put('updateCategory/{category}', [CategoryController::class, 'update']);
    Route::delete('deleteCategory/{category}', [CategoryController::class, 'destroy']);

    // Statuts
    Route::post('storeStatus', [StatusController::class, 'store']);
    Route::put('updateStatus/{status}', [StatusController::class, 'update']);
    Route::delete('deleteStatus/{status}', [StatusController::class, 'destroy']);

    // Utilisateurs
    Route::get('getUsers', [UserController::class, 'getUsers']);
    Route::post('storeUser', [UserController::class, 'store']);
    Route::put('updateUser/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('deleteUser/{user}', [UserController::class, 'delete']);

    // Statistiques
    Route::get('getStatByUserByServiceByDate', [StatistiquesController::class, 'getStatByUserByServiceByDate']);
});
