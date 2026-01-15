<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShortcutRequest;
use App\Models\Shortcuts;
use Symfony\Component\HttpFoundation\JsonResponse;

class ShortcutController extends Controller
{
    public function getUserShortcuts(): JsonResponse
    {
        return response()->json([
            'message' => 'Shortcuts récupérés avec succès',
            'data' => auth()->user()->shortcuts
        ], 200);
    }

    public function addShortcut(StoreShortcutRequest $request): JsonResponse
    {
        $shortcut = auth()->user()->shortcuts()->create($request->validated());

        return response()->json([
            'message' => 'Shortcut ajouté avec succès',
            'data' => $shortcut
        ], 200);
    }

    public function deleteShortcut(Shortcuts $shortcut): JsonResponse
    {
        if ($shortcut->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Vous n\'êtes pas autorisé à supprimer ce shortcut'
            ], 403);
        }

        $shortcut->delete();

        return response()->json([
            'message' => 'Shortcut supprimé avec succès'
        ], 200);
    }
}