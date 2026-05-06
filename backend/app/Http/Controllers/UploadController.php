<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->file('avatar')) {
            $imagePath = $request->file('avatar')->store('avatars', 'public');
            
            // Get the full URL for the image
            $url = url('storage/' . $imagePath);

            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'url' => $url
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to upload image'
        ], 400);
    }
}
