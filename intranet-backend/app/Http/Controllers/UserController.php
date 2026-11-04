<?php

namespace App\Http\Controllers;

use App\Http\Middleware\JwtMiddleware;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserFirstLoginRequest;
use App\Http\Requests\UpdateUserPasswordRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function getUsers(): JsonResponse
    {
        $users = User::with('services')->get(['id', 'name', 'email', 'created_at', 'updated_at', 'last_login_at', 'is_admin']);

        return response()->json([
            'message' => 'Utilisateurs récupérés avec succès',
            'data' => $users,
        ]);
    }

    public function getCurrentUserInfo(): JsonResponse
    {
        $user = JwtMiddleware::resolveUser();

        if (! $user) {
            return response()->json(['connected' => false]);
        }

        return response()->json([
            'message' => "Informations de l'utilisateur récupérées avec succès",
            'connected' => true,
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_admin' => $user->is_admin,
            'must_change_password' => $user->must_change_password,
        ]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();
        $user = User::firstWhere('email', $credentials['email']);

        if (! $user) {
            // Même durée de traitement qu'un compte existant : évite l'énumération des e-mails.
            Hash::make($credentials['password']);
        }

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $user->last_login_at = now();
        $user->save();

        return response()->json([
            'message' => 'Connexion réussie',
            'data' => JWTAuth::fromUser($user),
            'must_change_password' => $user->must_change_password,
        ]);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = new User($request->validated());
        $user->must_change_password = true; // Le mot de passe choisi par l'administrateur est provisoire.
        $user->save();

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'data' => $user,
        ], 201);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        if ($user->is($request->user()) && ! $data['is_admin']) {
            return response()->json(['message' => 'Vous ne pouvez pas retirer vos propres droits administrateur.'], 422);
        }

        $password = $data['password'] ?? null;
        unset($data['password']);

        $user->update($data);

        if ($password) {
            $user->resetPassword($password, mustChange: true);
        }

        return response()->json([
            'message' => 'Utilisateur modifié avec succès',
            'data' => $user->fresh(),
        ]);
    }

    public function updateCurrentUserFirstLogin(UpdateUserFirstLoginRequest $request): JsonResponse
    {
        $user = $request->user();

        // Sans cette garde, ce formulaire permettrait de changer le mot de passe sans fournir l'actuel.
        if (! $user->must_change_password) {
            return response()->json(['message' => 'Votre compte est déjà configuré.'], 403);
        }

        $data = $request->validated();

        $user->update(['name' => $data['name'], 'email' => $data['email']]);
        $user->resetPassword($data['password']);

        return response()->json([
            'message' => 'Informations de votre compte mises à jour avec succès',
            'data' => JWTAuth::fromUser($user),
        ]);
    }

    public function updateCurrentUser(UpdateUserRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->update($request->validated());

        return response()->json([
            'message' => "Informations de l'utilisateur mises à jour avec succès",
            'data' => $user,
        ]);
    }

    public function updateCurrentUserPassword(UpdateUserPasswordRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect'], 422);
        }

        $user->resetPassword($data['new_password']);

        return response()->json([
            'message' => 'Mot de passe mis à jour avec succès',
            'data' => JWTAuth::fromUser($user), // Les anciens tokens viennent d'être révoqués.
        ]);
    }

    public function delete(Request $request, User $user): JsonResponse
    {
        if ($user->is($request->user())) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    public function logout(): JsonResponse
    {
        JWTAuth::invalidate();

        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
