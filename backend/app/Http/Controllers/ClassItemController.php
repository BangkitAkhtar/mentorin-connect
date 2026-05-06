<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClassItemController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => \App\Models\ClassItem::with('tutor')->get()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string',
            'subject' => 'required|string',
            'description' => 'required|string',
            'day' => 'required|string',
            'startTime' => 'required|string',
            'endTime' => 'required|string',
            'capacity' => 'required|integer',
            'enrolled' => 'nullable|array',
            'active' => 'boolean',
        ]);

        $class = \App\Models\ClassItem::create($data);

        return response()->json([
            'success' => true,
            'data' => $class
        ]);
    }

    public function update(Request $request, $id)
    {
        $class = \App\Models\ClassItem::findOrFail($id);
        $class->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $class
        ]);
    }

    public function destroy($id)
    {
        \App\Models\ClassItem::destroy($id);
        return response()->json(['success' => true]);
    }
}
