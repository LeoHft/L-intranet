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



class ServicesController extends Controller
{   
    public function getServices(): JsonResponse
    {

        $services = Services::with('categories')->with('status')->with('users')->get();
        return response()->json($services);
    }

    public function getUserServices(): JsonResponse
    {
        // Log::info('Authenticated User:', ['user' => Auth::user()]); //Pour vérification d'authentification d'user
        // Log::info('Guards:', ['web' => Auth::guard('web')->check(), 'api' => Auth::guard('api')->check()]); //Pour vérification d'authentification d'user
        // Log::info('User :', ['web' => Auth::guard('web')->user(), 'api' => Auth::guard('api')->user()]); //Pour vérification d'authentification d'user

        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        // Log::info('User ID: ' . Auth::id()); // Pour vérification d'authentification d'user
    
        $services = Services::with('categories', 'status', 'users')
            ->whereHas('users', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->get();
    
        return response()->json($services);
    }
    

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'internal_url' => 'nullable|string',
            'external_url' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $image_url = asset('storage/' . $imagePath);
        } else {
            $image_url = null;
        }
        
        $service = Services::create([
            'name' => $request->name,
            'description' => $request->description,
            'internal_url' => $request->internal_url,
            'external_url' => $request->external_url,
            'image_url' => $image_url,
            'status_id' => $request->status_id,
        ]);

        if ($service) {
            foreach (json_decode($request->category_id) as $categoryId) {
                CategoriesServices::create([
                    'category_id' => $categoryId,
                    'service_id' => $service->id,
                ]);
            }
            foreach (json_decode($request->user_id) as $userId) {
                ServicesAccess::create([
                    'user_id' => $userId,
                    'service_id' => $service->id,
                ]);
            }

        }

        return response()->json(['message' => 'Service created successfully', 'service' => $service], 201);
    }


    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'internal_url' => 'nullable|string',
            'external_url' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $service = Services::findOrFail($id);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $image_url = asset('storage/' . $imagePath);
        } else {
            $image_url = $service->image_url;
        }

        $service->update([
            'name' => $request->name,
            'description' => $request->description,
            'internal_url' => $request->internal_url,
            'external_url' => $request->external_url,
            'image_url' => $image_url,
            'status_id' => $request->status_id,
        ]);

        // Update categories
        CategoriesServices::where('service_id', $id)->delete();
        foreach (json_decode($request->category_id) as $categoryId) {
            CategoriesServices::create([
                'category_id' => $categoryId,
                'service_id' => $service->id,
            ]);
        }
        ServicesAccess::where('service_id', $id)->delete();
        foreach (json_decode($request->user_id) as $userId) {
            ServicesAccess::create([
                'user_id' => $userId,
                'service_id' => $service->id,
            ]);
        }

        return response()->json(['message' => 'Service updated successfully', 'service' => $service], 200);
    }

    public function destroy($id): JsonResponse
    {
        $service = Services::findOrFail($id);
        $service->delete();

        // Delete associated categories
        CategoriesServices::where('service_id', $id)->delete();
        ServicesAccess::where('service_id', $id)->delete();

        return response()->json(['message' => 'Service deleted successfully'], 200);
    }
}
