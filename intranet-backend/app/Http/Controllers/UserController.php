<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserFirstLoginRequest;
use App\Http\Requests\UpdateUserPasswordRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class UserController extends Controller
{
    /**
     * Récupérer tous les utilisateurs (admin seulement)
     */
    public function getUsers()
    {
        $users = User::with('services')->get(['id', 'name', 'email', 'created_at', 'updated_at', 'last_login_at','is_admin']);        
        
        return response()->json([
            'message' => 'Utilisateurs récupérés avec succès',
            'data' => $users
        ], 200);
    }

    /**
     * Récupérer les informations de l'utilisateur connecté
     */
    public function getCurrentUserInfo()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user) {
                return response()->json(['connected' => false]);
            }

            return response()->json([
                'message' => 'Informations de l\'utilisateur récupérées avec succès',
                'connected' => true,
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
            ]);
            
        } catch (JWTException $e) {
            return response()->json([
                'connected' => false,
                'message' => 'Erreur lors de la récupération des informations de l\'utilisateur',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
        ]);
        }
    }


    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Identifiants invalides'], 401);
        }

        $user = auth()->user();


        $isFirstConnection = is_null($user->last_login_at);
        $token = JWTAuth::claims(['is_admin' => $user->is_admin])->fromUser($user);
        $user->last_login_at = now();
        $user->save();
        return response()->json([
            'message' => $isFirstConnection ? 'connexion reussie, premiere connexion' : 'Connexion réussie',
            'data' => $token
        ], 200);
    }
    

    public function store(StoreUserRequest $request)
    {
        $validatedData = $request->validated();

        $user = User::create($validatedData);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'data' => $user->makeHidden('password')
        ], 201);
    }


    public function update(UpdateUserRequest $request, User $user)
    {
        $validatedData = $request->validated();

        $user->update($validatedData);

        return response()->json([
            'message' => 'Utilisateur modifié avec succès',
            'data' => $user->fresh()
        ], 200);
    }

    public function updateCurrentUserFirstLogin(UpdateUserFirstLoginRequest $request)
    {
        $user = auth()->user();
        
        $validatedData = $request->validated();

        $validatedData['password'] = Hash::make($validatedData['password']);
        
        $user->update($validatedData);

        return response()->json([
            'message' => 'Informations de l\'utilisateur mises à jour avec succès',
            'data' => $user
        ], 200);
    }


    public function updateCurrentUser(UpdateUserRequest $request)
    {
        $validatedData = $request->validated();

        $user = auth()->user();

        $user->update($validatedData);

        return response()->json([
            'message' => 'Informations de l\'utilisateur mises à jour avec succès',
            'data' => $user
        ], 200);
    }


    public function updateCurrentUserPassword(UpdateUserPasswordRequest $request)
    {
        $validatedData = $request->validated();

        $user = auth()->user();

        if (!Hash::check($validatedData['current_password'], $user->password)) {
            return response()->json(['error' => 'Le mot de passe actuel est incorrect'], 400);
        }

        $user->password = Hash::make($validatedData['new_password']);
        $user->save();
        return response()->json([
            'message' => 'Mot de passe mis à jour avec succès'
        ], 200);
    }

    
    public function delete(User $user)
    {
        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès',
        ], 200);
    }


    public function logout()
    {
        // Récupérer le token depuis l'en-tête Authorization
        $token = JWTAuth::parseToken();
        
        if (!$token) {
            return response()->json([
                'message' => 'Token non fourni'
            ], 401);
        }

        // Invalider le token
        JWTAuth::invalidate($token);

        return response()->json([
            'message' => 'Déconnexion réussie'
        ], 200);
    }
}
