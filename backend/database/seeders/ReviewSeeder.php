<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tutorAulia = \App\Models\User::where('email', 'aulia@binus.ac.id')->first();
        $tutorBintang = \App\Models\User::where('email', 'bintang@binus.ac.id')->first();
        $tutorCitra = \App\Models\User::where('email', 'citra@binus.ac.id')->first();
        $mhsDemo = \App\Models\User::where('email', 'demo@binus.ac.id')->first();
        $mhsRina = \App\Models\User::where('email', 'rina@binus.ac.id')->first();

        $reviews = [
            ['tutor_id' => $tutorAulia->id, 'mahasiswa_id' => $mhsRina->id, 'rating' => 5, 'comment' => 'Sangat sabar menjelaskan, langsung paham!', 'created_at' => now()->subDays(3)],
            ['tutor_id' => $tutorAulia->id, 'mahasiswa_id' => $mhsDemo->id, 'rating' => 5, 'comment' => 'Materi runtut dan ada contoh kode.', 'created_at' => now()->subDays(10)],
            ['tutor_id' => $tutorBintang->id, 'mahasiswa_id' => $mhsRina->id, 'rating' => 5, 'comment' => 'Penjelasan kalkulus jadi mudah.', 'created_at' => now()->subDays(5)],
            ['tutor_id' => $tutorCitra->id, 'mahasiswa_id' => $mhsDemo->id, 'rating' => 4, 'comment' => 'Workshop SQL-nya seru, banyak latihan.', 'created_at' => now()->subDays(14)],
        ];

        foreach ($reviews as $r) {
            \Illuminate\Support\Facades\DB::table('reviews')->insert(array_merge($r, [
                'updated_at' => now(),
            ]));
        }
    }
}
