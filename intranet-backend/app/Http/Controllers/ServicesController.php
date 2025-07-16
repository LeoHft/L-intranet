<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\CategoriesServices;
use App\Models\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use App\Models\ServicesAccess;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;



class ServicesController extends Controller
{   
    public function getServices(): JsonResponse
    {
        try {
            $services = Services::with('categories')->with('status')->with('users')->get();
            
            return response()->json([
                'message' => 'Services récupérés avec succès',
                'data' => $services
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des services: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la récupération des services',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }

    public function getUserServices(): JsonResponse
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user) {
                return response()->json([
                    'message' => 'Non autorisé',
                    'error' => 'Token invalide ou utilisateur non authentifié'
                ], 401);
            }
    
            $services = Services::with('categories', 'status', 'users')
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->get();
    
            return response()->json([
                'message' => 'Services utilisateur récupérés avec succès',
                'data' => $services
            ], 200);

        } catch (JWTException $e) {
            Log::error('Erreur JWT lors de la récupération des services utilisateur: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur d\'authentification',
                'error' => config('app.debug') ? $e->getMessage() : 'Token invalide ou expiré'
            ], 401);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des services utilisateur: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la récupération des services utilisateur',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }
    

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'internal_url' => 'nullable|string',
            'external_url' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status_id' => 'required|exists:status,id',
            'category_id' => 'required|string',
            'user_id' => 'required|string',
        ]);

        try {
            $image_url = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('images', 'public');
                $image_url = '/storage/' . $imagePath;
            }
            
            $service = Services::create([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'internal_url' => $validatedData['internal_url'],
                'external_url' => $validatedData['external_url'],
                'image_url' => $image_url,
                'status_id' => $validatedData['status_id'],
            ]);

            if ($service) {
                foreach (json_decode($validatedData['category_id']) as $categoryId) {
                    CategoriesServices::create([
                        'category_id' => $categoryId,
                        'service_id' => $service->id,
                    ]);
                }
                foreach (json_decode($validatedData['user_id']) as $userId) {
                    ServicesAccess::create([
                        'user_id' => $userId,
                        'service_id' => $service->id,
                    ]);
                }
            }

            return response()->json([
                'message' => 'Service créé avec succès',
                'data' => $service
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du service: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la création du service',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }


    public function update(Request $request, $id): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'internal_url' => 'nullable|string',
            'external_url' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status_id' => 'nullable|exists:status,id',
            'category_id' => 'nullable|string',
            'user_id' => 'nullable|string',
        ]);

        try {
            $service = Services::findOrFail($id);

            $image_url = $service->image_url;

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('images', 'public');
                $image_url = '/storage/' . $imagePath;
            }

            $service->update([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'internal_url' => $validatedData['internal_url'],
                'external_url' => $validatedData['external_url'],
                'image_url' => $image_url,
                'status_id' => $validatedData['status_id'],
            ]);

            // Update categories
            CategoriesServices::where('service_id', $id)->delete();
            
            // Gérer les catégories (JSON string ou array)
            $categoryIds = is_string($validatedData['category_id']) ? 
                json_decode($validatedData['category_id']) : $validatedData['category_id'];
            
            foreach ($categoryIds as $categoryId) {
                CategoriesServices::create([
                    'category_id' => $categoryId,
                    'service_id' => $service->id,
                ]);
            }
            
            // Update users
            ServicesAccess::where('service_id', $id)->delete();
            
            // Gérer les utilisateurs (JSON string ou array)
            $userIds = is_string($validatedData['user_id']) ? 
                json_decode($validatedData['user_id']) : $validatedData['user_id'];
            
            foreach ($userIds as $userId) {
                ServicesAccess::create([
                    'user_id' => $userId,
                    'service_id' => $service->id,
                ]);
            }

            return response()->json([
                'message' => 'Service mis à jour avec succès',
                'data' => $service
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du service: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du service',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $service = Services::findOrFail($id);
            $service->delete();

            // Delete associated categories
            CategoriesServices::where('service_id', $id)->delete();
            ServicesAccess::where('service_id', $id)->delete();

            return response()->json([
                'message' => 'Service supprimé avec succès',
                'data' => null
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du service: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la suppression du service',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }
}
