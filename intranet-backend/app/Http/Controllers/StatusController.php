<?php

namespace App\Http\Controllers;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StatusController extends Controller
{
    public function getAllStatus()
    {
        try {
            $status = Status::all();

            return response()->json([
                'message' => 'Status récupérés avec succès',
                'data' => $status
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération de tous les status:' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la récupération de tous les status',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:status,name',
            'description' => 'nullable|string|max:255',
        ], $this->validationErrorMessage());

        try {
            $status = Status::create($validatedData);

            return response()->json([
                'message' => 'Status créé avec succès',
                'data' => $status
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la création du status: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la création du status',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue' // On retourne toute l'erreur seulement en mode debug 
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:status,name,' . $id, // Vérifie que le nom est unique dans la table status, colonne name, mais ignore l'enregistrement avec l'ID $id
            'description' => 'nullable|string|max:255',
        ], $this->validationErrorMessage());

        try {
            $status = Status::findOrFail($id);

            $status->update($validatedData);

            return response()->json([
                'message' => 'Status modifié avec succès',
                'data' => $status->fresh()
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du status: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la mise à jour du status',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }


    public function destroy($id)
    {
        try {
            $status = Status::findOrFail($id);
            $status->delete();

            return response()->json([
                'message' => 'Status supprimé avec succès'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du status: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la suppression du status',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }

    public function validationErrorMessage()
    {
        return [
            // --- Name ---
            'name.required' => 'Le nom du statut est obligatoire.',
            'name.string' => 'Le nom du statut doit être une chaîne de caractères.',
            'name.max' => 'Le nom du statut ne doit pas dépasser 255 caractères.',
            'name.unique' => 'Ce nom de statut est déjà utilisé.',

            // --- Description ---
            'description.string' => 'La description doit être une chaîne de caractères.',
            'description.max' => 'La description ne doit pas dépasser 255 caractères.',
        ];
    }
}
