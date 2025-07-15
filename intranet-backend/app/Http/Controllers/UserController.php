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
    public function getUser()
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

            return response()->json($users);
            
        } catch (JWTException $e) {
            return response()->json(['error' => 'Invalid token'], 401);
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
                'connected' => true,
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
            ]);
            
        } catch (JWTException $e) {
            return response()->json(['connected' => false]);
        }
    }

    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'is_admin' => 'boolean',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
            'is_admin' => $request->get('is_admin', false), 
        ]);

        // $token = JWTAuth::fromUser($user);

        // return response()->json(compact('user','token'), 201);

        return response()->json($user, 201); //TODO Attention à ce que ça ne renvoie pas le mot de passe
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

            return response()->json([
                'message' => 'Utilisateur connecté avec succès',
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


    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());

        return response()->json($user, 200);
    }

    
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }


    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Successfully logged out']);
    }
}
