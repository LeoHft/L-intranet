<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStatusRequest;
use App\Http\Requests\UpdateStatusRequest;
use App\Models\Status;

class StatusController extends Controller
{
    public function getAllStatus()
    {
        $status = Status::all();

        return response()->json([
            'message' => 'Status récupérés avec succès',
            'data' => $status
        ], 200);
    }


    public function store(StoreStatusRequest $request)
    {
        $validatedData = $request->validated();

        $status = Status::create($validatedData);
        
        return response()->json([
            'message' => 'Status créé avec succès',
            'data' => $status
        ], 201);
    }


    public function update(UpdateStatusRequest $request, Status $status)
    {
        $validatedData = $request->validated();

        $status->update($validatedData);
        
        return response()->json([
            'message' => 'Status modifié avec succès',
            'data' => $status->fresh()
        ], 200);
    }


    public function destroy(Status $status)
    {
        $status->delete();

        return response()->json([
            'message' => 'Status supprimé avec succès'
        ], 200);
    }
}
