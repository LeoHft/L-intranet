<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateClickRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\NumberClickByServiceByUserByDay;
use App\Models\Services;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ServicesController extends Controller
{
    public function getServices(): JsonResponse
    {
        $services = Services::with(['categories', 'status', 'users:id,name'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'message' => 'Services récupérés avec succès',
            'data' => $services,
        ]);
    }

    public function getUserServices(Request $request): JsonResponse
    {
        $user = $request->user();

        // Seuls les administrateurs voient les adresses du réseau local.
        $services = $user->services()
            ->with(['categories', 'status'])
            ->orderBy('name')
            ->get()
            ->makeHidden($user->is_admin ? ['pivot'] : ['pivot', 'internal_url']);

        return response()->json([
            'message' => 'Services récupérés avec succès',
            'data' => $services,
        ]);
    }

    public function store(StoreServiceRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['image_url'] = $request->hasFile('image')
            ? $this->storeImage($request->file('image'))
            : Services::DEFAULT_IMAGE;

        $service = DB::transaction(function () use ($data) {
            $service = Services::create($data);
            $service->categories()->sync($data['category_id'] ?? []);
            $service->users()->sync($data['user_id']);

            return $service;
        });

        return response()->json([
            'message' => 'Service créé avec succès',
            'data' => $service,
        ], 201);
    }

    public function update(UpdateServiceRequest $request, Services $service): JsonResponse
    {
        $data = $request->validated();
        $data['status_id'] ??= null; // Un statut absent du formulaire signifie « aucun statut ».

        $previousImage = $service->image_url;
        if ($request->hasFile('image')) {
            $data['image_url'] = $this->storeImage($request->file('image'));
        }

        DB::transaction(function () use ($data, $service) {
            $service->update($data);
            $service->categories()->sync($data['category_id'] ?? []);
            $service->users()->sync($data['user_id']);
        });

        if (isset($data['image_url'])) {
            $this->deleteImage($previousImage);
        }

        return response()->json([
            'message' => 'Service mis à jour avec succès',
            'data' => $service,
        ]);
    }

    public function destroy(Services $service): JsonResponse
    {
        $image = $service->image_url;
        $service->delete();
        $this->deleteImage($image);

        return response()->json(['message' => 'Service supprimé avec succès']);
    }

    public function updateNumberClick(UpdateClickRequest $request, Services $service): JsonResponse
    {
        $user = $request->user();

        if (! $user->services()->whereKey($service->id)->exists()) {
            return response()->json(['message' => "Vous n'avez pas accès à ce service."], 403);
        }

        $column = $request->validated('isInternalUrl') ? 'internal_url_click' : 'external_url_click';

        NumberClickByServiceByUserByDay::createOrFirst([
            'service_id' => $service->id,
            'user_id' => $user->id,
            'click_date' => now()->toDateString(),
        ])->increment($column);

        return response()->json(['message' => 'Nombre de clics mis à jour avec succès']);
    }

    private function storeImage(UploadedFile $image): string
    {
        return '/storage/'.$image->store('images', 'public');
    }

    private function deleteImage(?string $imageUrl): void
    {
        if ($imageUrl && $imageUrl !== Services::DEFAULT_IMAGE && str_starts_with($imageUrl, '/storage/')) {
            Storage::disk('public')->delete(substr($imageUrl, strlen('/storage/')));
        }
    }
}
