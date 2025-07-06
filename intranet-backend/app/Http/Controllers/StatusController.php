<?php

namespace App\Http\Controllers;
use App\Models\Status;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    public function getStatus()
    {
        $status = Status::all();
        return response()->json($status);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
        ]);

        Status::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Status created successfully'], 201);
    }


    public function update(Request $request, $id)
    {
        $status = Status::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $status->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json(['message' => 'Status updated successfully'], 200);
    }


    public function destroy($id)
    {
        $status = Status::findOrFail($id);
        $status->delete();

        return response()->json(['message' => 'Status deleted successfully'], 200);
    }
}
