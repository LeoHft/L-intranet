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
use App\Models\NumberClickByServiceByUserByDay;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;



class ServicesController extends Controller
{   
    public function getServices(): JsonResponse
    {
        try {
            $services = Services::with(['categories', 'status', 'users'])->get();
            
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
    
            $services = Services::with(['categories', 'status', 'users'])
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->get();
    
            return response()->json([
                'message' => 'Services récupérés avec succès',
                'data' => $services
            ], 200);
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status_id' => 'nullable|exists:status,id',
            'category_id' => 'nullable|array',
            'category_id.*' => 'exists:categories,id',
            'user_id' => 'required|array',
            'user_id.*' => 'exists:users,id',
        ]);

        try {
            $image_url = '/storage/images/no-image-available.jpg';
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('images', 'public');
                $image_url = '/storage/' . $imagePath;
            }
            
            $service = Services::create([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'] ?? null,
                'internal_url' => $validatedData['internal_url'] ?? null,
                'external_url' => $validatedData['external_url'] ?? null,
                'image_url' => $image_url,
                'status_id' => $validatedData['status_id'] ?? null,
            ]);

            if ($service) {
                if (!empty($validatedData['category_id'])) {
                    foreach ($validatedData['category_id'] as $categoryId) {
                        CategoriesServices::create([
                            'category_id' => $categoryId,
                            'service_id' => $service->id,
                        ]);
                    }
                }
                foreach ($validatedData['user_id'] as $userId) {
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
            'category_id' => 'nullable|array',
            'category_id.*' => 'exists:categories,id',
            'user_id' => 'required|array',
            'user_id.*' => 'exists:users,id',
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
                'description' => $validatedData['description'] ?? null,
                'internal_url' => $validatedData['internal_url'] ?? null,
                'external_url' => $validatedData['external_url'] ?? null,
                'image_url' => $image_url,
                'status_id' => $validatedData['status_id'] ?? null,
            ]);

            // Update categories
            CategoriesServices::where('service_id', $id)->delete();
            
            if (!empty($validatedData['category_id'])) {
                foreach ($validatedData['category_id'] as $categoryId) {
                    CategoriesServices::create([
                        'category_id' => $categoryId,
                        'service_id' => $service->id,
                    ]);
                }
            }
            
            // Update users
            ServicesAccess::where('service_id', $id)->delete();
            
            foreach ($validatedData['user_id'] as $userId) {
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

    public function updateNumberClick(Request $request, $service_id): JsonResponse
    {
        $validatedData = $request->validate([
            'isInternalUrl' => 'boolean',
            'userId' => 'nullable|exists:users,id',
        ]);

        try {
            $columnToIncrement = $validatedData['isInternalUrl'] ? 'internal_url_click' : 'external_url_click';

            NumberClickByServiceByUserByDay::updateOrCreate(
                [
                    'service_id' => $service_id,
                    'user_id' => $validatedData['userId'],
                    'click_date' => now()->format('Y-m-d'),
                ],
                [$columnToIncrement => \DB::raw($columnToIncrement . ' + 1')]
            );

            Log::info('Nombre de clics mis à jour pour le service ID: ' . $service_id . ', User ID: ' . $validatedData['userId'] . ', Date: ' . now()->format('Y-m-d') . ', Type: ' . ($validatedData['isInternalUrl'] ? 'interne' : 'externe'));


            return response()->json([
                'message' => 'Nombre de clics mis à jour avec succès',
                'data' => null
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du nombre de clics: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du nombre de clics',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }
}
