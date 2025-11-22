<?php

namespace App\Http\Controllers;
use App\Models\Shortcuts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class ShortcutController extends Controller
{
    public function getUserShortcuts()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            Log::info('Utilisateur authentifié pour la récupération des shortcuts: ' . ($user ? $user->id : 'Aucun utilisateur'));
            
            if (!$user) {
                return response()->json([
                    'message' => 'Non autorisé',
                    'error' => 'Token invalide ou utilisateur non authentifié'
                ], 401);
            }


            $shortcuts = Shortcuts::where('user_id', $user->id)->get();

            return response()->json([
                'message' => 'Shortcuts récupérés avec succès',
                'data' => $shortcuts
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération de tous les shortcuts:' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la récupération des shortcuts de l\'utilisateur',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }

    public function addShortcut(Request $request)
    {
        $validatedData = $request->validate([
            'url' => 'required|string|max:255',
            'icon' => 'required|string|max:255',
        ]);

        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user) {
                return response()->json([
                    'message' => 'Non autorisé',
                    'error' => 'Token invalide ou utilisateur non authentifié'
                ], 401);
            }

            $validatedData['user_id'] = $user->id;

            $shortcut = Shortcuts::create($validatedData);

            return response()->json([
                'message' => 'Shortcut ajouté avec succès',
                'data' => $shortcut
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'ajout du shortcut:' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de l\'ajout du shortcut',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }

    public function deleteShortcut($id)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user) {
                return response()->json([
                    'message' => 'Non autorisé',
                    'error' => 'Token invalide ou utilisateur non authentifié'
                ], 401);
            }

            $shortcut = Shortcuts::where('id', $id)->where('user_id', $user->id)->first();

            if (!$shortcut) {
                return response()->json([
                    'message' => 'Shortcut non trouvé'
                ], 404);
            }

            $shortcut->delete();

            return response()->json([
                'message' => 'Shortcut supprimé avec succès'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du shortcut:' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la suppression du shortcut',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }
}