<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShortcutRequest;
use App\Models\Shortcuts;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShortcutController extends Controller
{
    public function getUserShortcuts(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Raccourcis récupérés avec succès',
            'data' => $request->user()->shortcuts,
        ]);
    }

    public function addShortcut(StoreShortcutRequest $request): JsonResponse
    {
        $shortcut = $request->user()->shortcuts()->create($request->validated());

        return response()->json([
            'message' => 'Raccourci ajouté avec succès',
            'data' => $shortcut,
        ], 201);
    }

    public function deleteShortcut(Request $request, Shortcuts $shortcut): JsonResponse
    {
        if ($shortcut->user_id !== $request->user()->id) {
            return response()->json(['message' => "Vous n'êtes pas autorisé à supprimer ce raccourci."], 403);
        }

        $shortcut->delete();

        return response()->json(['message' => 'Raccourci supprimé avec succès']);
    }
}
