<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class UserController extends Controller
{
    /**
     * Récupérer tous les utilisateurs (admin seulement)
     */
    public function getUsers()
    {
        try {
            // Vérifier que l'utilisateur est authentifié
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Vérifier que l'utilisateur est admin
            if (!$user->is_admin) {
                return response()->json(['error' => 'Unauthorized - Admin access required'], 403);
            }

            $users = User::select('id', 'name', 'email', 'created_at', 'updated_at','is_admin')->with('services')->get();

            return response()->json([
                'message' => 'Utilisateurs récupérés avec succès',
                'data' => $users
            ], 200);
            
        } catch (JWTException $e) {
            Log::error('Erreur lors de la récupération des informations des utilisateurs: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la récupération des informations des utilisateurs',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
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


    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            // Get the authenticated user.
            $user = auth()->user();

            $token = JWTAuth::claims(['is_admin' => $user->is_admin])->fromUser($user);

            $isFirstConnection = is_null($user->last_login_at);

            $user->last_login_at = now();
            $user->save();

            if ($isFirstConnection) {
                return response()->json([
                    'message' => 'connexion reussie, premiere connexion',
                    'data' => $token,
                ], 200);
            }

            return response()->json([
                'message' => 'Connexion réussie',
                'data' => $token
            ], 200);

        } catch (JWTException $e) {
            Log::error('Erreur lors de la connexion de l\'utilisateur: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la connexion',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }
    

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'is_admin' => 'required|boolean',
        ], $this->validationErrorMessage());

        try {
            $user = User::create($validatedData);

            return response()->json([
                'message' => 'Utilisateur créé avec succès',
                'data' => $user->makeHidden('password')
            ], 201);

        } catch (JWTException $e) {
            Log::error('Erreur lors de l\'ajout de l\'utilisateur: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de l\'ajout de l\'utilisateur',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id, // Vérifie que le mail est unique dans la table users, colonne , email mais ignore l'enregistrement avec l'ID $id
            'is_admin' => 'required|boolean',
        ], $this->validationErrorMessage());

        try {
            $user = User::findOrFail($id);

            $user->update($validatedData);

            return response()->json([
                'message' => 'Utilisateur modifié avec succès',
                'data' => $user->fresh()
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de l\'utilisateur: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la mise à jour de l\'utilisateur',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }

    public function updateCurrentUserFirstLogin(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'required|string|min:6|confirmed',
        ], $this->validationErrorMessage());

        try {
            $user->name = $validatedData['name'];
            $user->email = $validatedData['email'];
            $user->password = Hash::make($validatedData['password']);
            $user->save();

            return response()->json([
                'message' => 'Informations de l\'utilisateur mises à jour avec succès',
                'data' => $user->fresh()
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour des informations de l\'utilisateur lors de la première connexion: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la mise à jour des informations de l\'utilisateur',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }


    public function updateCurrentUser(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        try {
            $user->update($validatedData);

            return response()->json([
                'message' => 'Informations de l\'utilisateur mises à jour avec succès',
                'data' => $user->fresh()
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour des informations de l\'utilisateur: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la mise à jour des informations de l\'utilisateur',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }


    public function updateCurrentUserPassword(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $validatedData = $request->validate([
            'current_password' => 'required|string',
            'new_password' => ['required', 'string', 'min:6', 'confirmed', Rules\Password::defaults()], // Utilise les règles de mot de passe par défaut de Laravel qui sont configurées dans config/auth.php
        ]);

        if (!Hash::check($validatedData['current_password'], $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 400);
        }

        try {
            $user->password = Hash::make($validatedData['new_password']);
            $user->save();

            return response()->json([
                'message' => 'Mot de passe mis à jour avec succès'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du mot de passe de l\'utilisateur: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la mise à jour du mot de passe',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }

    
    public function delete($id)
    {
        try {
            // Vérifier que l'utilisateur est authentifié
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Vérifier que l'utilisateur est admin
            if (!$user->is_admin) {
                return response()->json(['error' => 'Unauthorized - Admin access required'], 403);
            }

            $user = User::findOrFail($id);
            $user->delete();

            return response()->json([
                'message' => 'Utilisateur supprimé avec succès',
            ], 200);
        } catch (JWTException $e) {
            Log::error('Erreur lors de la suppression de l\'utilisateur: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la suppression de l\'utilisateur',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }


    public function logout()
    {
        try {
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

        } catch (JWTException $e) {
            Log::error('Erreur lors de la déconnexion: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la déconnexion',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }

    public function validationErrorMessage()
    {
        return [
            // --- Name ---
            'name.required' => 'Le nom est obligatoire.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne doit pas dépasser 255 caractères.',

            // --- Email ---
            'email.required' => "L'adresse email est obligatoire.",
            'email.string' => "L'adresse email doit être une chaîne de caractères.",
            'email.email' => "L'adresse email doit être un format valide.",
            'email.max' => "L'adresse email ne doit pas dépasser 255 caractères.",
            'email.unique' => "Cette adresse email est déjà utilisée par un autre compte.",

            // --- Password ---
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.string' => 'Le mot de passe doit être une chaîne de caractères.',
            'password.min' => 'Le mot de passe doit contenir au moins 6 caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',

            // --- Is Admin ---
            'is_admin.required' => 'Le choix du rôle (admin ou non) est obligatoire.',
            'is_admin.boolean' => 'Le champ administrateur doit être vrai ou faux.',
        ];
    }
}
