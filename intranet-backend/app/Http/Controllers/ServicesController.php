<?php

namespace App\Http\Controllers;

use App\Models\CategoriesServices;
use App\Models\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use App\Models\ServicesAccess;
use App\Models\NumberClickByServiceByUserByDay;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\DB;


class ServicesController extends Controller
{   
    public function getServices(): JsonResponse
    {
        try {
            $services = Services::with(['categories', 'status', 'users'])->orderBy('name', 'asc')->get();
            
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
                })->orderBy('name', 'asc')
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
            'internal_url' => 'nullable|url',
            'external_url' => 'nullable|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status_id' => 'nullable|exists:status,id',
            'category_id' => 'nullable|array',
            'category_id.*' => 'exists:categories,id',
            'user_id' => 'required|array',
            'user_id.*' => 'exists:users,id',
        ], $this->validationErrorMessage());

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
                if (isset($validatedData['category_id'])) {
                    $service->categories()->sync($validatedData['category_id']);
                } 
                if (isset($validatedData['user_id'])) {
                    $service->users()->sync($validatedData['user_id']);
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
            'internal_url' => 'nullable|url',
            'external_url' => 'nullable|url',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status_id' => 'nullable|exists:status,id',
            'category_id' => 'nullable|array',
            'category_id.*' => 'exists:categories,id',
            'user_id' => 'required|array',
            'user_id.*' => 'exists:users,id',
        ], $this->validationErrorMessage());

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

            // Update categories and users
            if (isset($validatedData['category_id'])) {
                $service->categories()->sync($validatedData['category_id'] ?? []);
            } 
            if (isset($validatedData['user_id'])) {
                $service->users()->sync($validatedData['user_id'] ?? []);
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
            $service->categories()->detach();
            $service->users()->detach();
            $service->categories()->detach();
            $service->delete();

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
        ], $this->validationErrorMessage());

        try {
            $columnToIncrement = $validatedData['isInternalUrl'] ? 'internal_url_click' : 'external_url_click';

            NumberClickByServiceByUserByDay::updateOrCreate(
                [
                    'service_id' => $service_id,
                    'user_id' => $validatedData['userId'],
                    'click_date' => now()->format('Y-m-d'),
                ],
                [$columnToIncrement => DB::raw($columnToIncrement . ' + 1')]
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

    public function validationErrorMessage()
    {
        return [
            // --- Name ---
            'name.required' => 'Le nom du service est obligatoire.',
            'name.string' => 'Le nom du service doit être une chaîne de caractères.',
            'name.max' => 'Le nom du service ne doit pas dépasser 255 caractères.',

            // --- Description ---
            'description.string' => 'La description doit être une chaîne de caractères.',

            // --- URLs ---
            'internal_url.url' => "Le format de l'URL interne est invalide.",
            'external_url.url' => "Le format de l'URL externe est invalide.",

            // --- Image ---
            'image.image' => "Le fichier doit être une image.",
            'image.mimes' => "L'image doit être au format : jpeg, png, jpg, gif ou webp.",
            'image.max' => "L'image ne doit pas dépasser 2 Mo.", // 2048 KB = 2 MB

            // --- Status ---
            'status_id.exists' => "Le statut sélectionné est invalide ou n'existe pas.",

            // --- Categories ---
            'category_id.array' => "Le format des catégories est invalide.",
            'category_id.*.exists' => "Une des catégories sélectionnées est invalide.",

            // --- Users ---
            'user_id.required' => "Au moins un utilisateur doit être assigné au service.",
            'user_id.array' => "Le format de la sélection des utilisateurs est invalide.",
            'user_id.*.exists' => "Un des utilisateurs sélectionnés est invalide ou n'existe pas.",
        ];
    }
}
