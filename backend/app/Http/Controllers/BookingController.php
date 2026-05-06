<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => \App\Models\Booking::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tutor_id' => 'required|exists:users,id',
            'mahasiswa_id' => 'required|exists:users,id',
            'subject' => 'required|string',
            'day' => 'required|string',
            'time' => 'required|string',
            'topic' => 'nullable|string',
            'class_id' => 'nullable|exists:class_items,id',
        ]);

        $booking = \App\Models\Booking::create($validated);

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    public function update(Request $request, $id)
    {
        $booking = \App\Models\Booking::findOrFail($id);
        $booking->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    public function destroy($id)
    {
        $booking = \App\Models\Booking::findOrFail($id);
        $booking->delete();

        return response()->json([
            'success' => true,
            'message' => 'Booking deleted'
        ]);
    }
}
