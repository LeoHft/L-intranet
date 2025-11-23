<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class CategoryController extends Controller
{
    public function getAllCategory()
    {
        try {
            $categories = Categories::all();

            return response()->json([
                'message' => 'Catégories récupérées avec succès',
                'data' => $categories
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération de toutes les catégories:' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la récupération de toutes les catégories',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string|max:255',
        ], $this->validationErrorMessage());

        try {
            $category = Categories::create($validatedData);

            return response()->json([
                'message' => 'Catégorie créée avec succès',
                'data' => $category
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de la catégorie: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la création de la catégorie',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue' // On retourne toute l'erreur seulement en mode debug 
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id, //Vérifie que le nom est unique dans la table categories, colonne name, mais ignore l'enregistrement avec l'ID $id
            'description' => 'nullable|string|max:255',
        ], $this->validationErrorMessage());

        try {
            $category = Categories::findOrFail($id);
            
            $category->update($validatedData);

            return response()->json([
                'message' => 'Catégorie modifiée avec succès',
                'data' => $category->fresh() // Récupère la version mise à jour
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de la catégorie: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la mise à jour de la catégorie',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        } 
    }

    public function destroy($id)
    {
        try { 
            $category = Categories::findOrFail($id);
            $category->delete();

            return response()->json([
                'message' => 'Catégorie supprimée avec succès'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de la catégorie: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur lors de la suppression de la catégorie',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }

    public function validationErrorMessage()
    {
        return [
            // --- Name ---
            'name.required' => 'Le nom de la catégorie est obligatoire.',
            'name.string' => 'Le nom de la catégorie doit être une chaîne de caractères.',
            'name.max' => 'Le nom de la catégorie ne doit pas dépasser 255 caractères.',
            'name.unique' => 'Ce nom de catégorie est déjà utilisé.',

            // --- Description ---
            'description.string' => 'La description doit être une chaîne de caractères.',
            'description.max' => 'La description ne doit pas dépasser 255 caractères.',
        ];
    }
}
