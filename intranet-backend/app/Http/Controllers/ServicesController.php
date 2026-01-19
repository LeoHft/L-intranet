<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateClickRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Services;
use Illuminate\Http\JsonResponse;
use App\Models\NumberClickByServiceByUserByDay;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class ServicesController extends Controller
{   
    public function getServices(): JsonResponse
    {
        $services = Services::with(['categories', 'status', 'users'])
        ->orderBy('name', 'asc')
        ->get();
        
        return response()->json([
            'message' => 'Services récupérés avec succès',
            'data' => $services
        ], 200);
    }

    public function getUserServices(): JsonResponse
    {
        $services = auth()->user()->services()
        ->with(['categories', 'status', 'users'])
        ->orderBy('name', 'asc')
        ->get();
    
        return response()->json([
            'message' => 'Services récupérés avec succès',
            'data' => $services
        ], 200);
    }
    

    public function store(StoreServiceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['image_url'] = '/storage/images/no-image-available.jpg';

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $data['image_url'] = Storage::url($imagePath);
        }

        $service = DB::transaction(function () use ($data) {
            $service = Services::create($data);

            $service->categories()->sync($data['category_id'] ?? []);
            $service->users()->sync($data['user_id'] ?? []);
            return $service;
        });

        return response()->json([
            'message' => 'Service créé avec succès',
            'data' => $service
        ], 200);
    }


    public function update(UpdateServiceRequest $request, Services $service): JsonResponse
    {
        $data = $request->validated();

        $data['image_url'] = $service->image_url;
        if ($request->hasFile('image')) {
            $oldImagePath = parse_url($service->image_url, PHP_URL_PATH);
            $oldImagePath = str_replace('/storage/', '', $oldImagePath);
            if ($oldImagePath !== 'images/no-image-available.jpg' && Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
            $data['image_url'] = Storage::url($request->file('image')->store('images', 'public'));
        }

        $service = DB::transaction(function () use ($data, $service) {
            $service->update($data);
            
            $service->categories()->sync($data['category_id'] ?? []);
            $service->users()->sync($data['user_id'] ?? []);

            return $service;
        });
        
        return response()->json([
            'message' => 'Service mis à jour avec succès',
            'data' => $service
        ], 200);
    }

    public function destroy(Services $service): JsonResponse
    {
        $service->delete();

        return response()->json([
            'message' => 'Service supprimé avec succès',
            'data' => null
        ], 200);
    }

    public function updateNumberClick(UpdateClickRequest $request, Services $service): JsonResponse
    {
        $validatedData = $request->validated();

        $columnToIncrement = $validatedData['isInternalUrl'] ? 'internal_url_click' : 'external_url_click';
        NumberClickByServiceByUserByDay::updateOrCreate(
            [
                'service_id' => $service->id,
                'user_id' => $validatedData['userId'],
                'click_date' => now()->format('Y-m-d'),
            ],
            [$columnToIncrement => DB::raw($columnToIncrement . ' + 1')]
        );
        return response()->json([
            'message' => 'Nombre de clics mis à jour avec succès',
            'data' => null
        ], 200);
    }
}
