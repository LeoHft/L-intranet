<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Categories;

class CategoryController extends Controller
{
    public function getAllCategory()
    {
        $categories = Categories::all();

        return response()->json([
            'message' => 'Catégories récupérées avec succès',
            'data' => $categories
        ], 200);
    }


    public function store(StoreCategoryRequest $request)
    {
        $validatedData = $request->validated();

        $category = Categories::create($validatedData);

        return response()->json([
            'message' => 'Catégorie créée avec succès',
            'data' => $category
        ], 201);
    }


    public function update(UpdateCategoryRequest $request, Categories $category)
    {
        $validatedData = $request->validated();
        
        $category->update($validatedData);

        return response()->json([
            'message' => 'Catégorie modifiée avec succès',
            'data' => $category->fresh() // Récupère la version mise à jour
        ], 200);
    }
    

    public function destroy(Categories $category)
    {
        $category->delete();
        return response()->json([
            'message' => 'Catégorie supprimée avec succès'
        ], 200);
    }
}
