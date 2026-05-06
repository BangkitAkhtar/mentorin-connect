<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => \Illuminate\Support\Facades\DB::table('reviews')->get()
        ]);
    }
}
