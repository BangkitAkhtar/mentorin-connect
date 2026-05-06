<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tutorAulia = \App\Models\User::where('email', 'aulia@binus.ac.id')->first();
        $tutorBintang = \App\Models\User::where('email', 'bintang@binus.ac.id')->first();
        $tutorCitra = \App\Models\User::where('email', 'citra@binus.ac.id')->first();
        $tutorDimas = \App\Models\User::where('email', 'dimas@binus.ac.id')->first();
        $mhsDemo = \App\Models\User::where('email', 'demo@binus.ac.id')->first();
        $mhsRina = \App\Models\User::where('email', 'rina@binus.ac.id')->first();

        $classes = [
            [
                'user_id' => $tutorAulia->id,
                'title' => 'Bedah Algoritma Sorting',
                'subject' => 'Algoritma & Pemrograman',
                'description' => 'Pembahasan bubble, merge, quick sort dengan visualisasi.',
                'day' => 'Senin',
                'startTime' => '14:00',
                'endTime' => '16:00',
                'capacity' => 8,
                'enrolled' => [$mhsRina->id],
                'active' => true,
            ],
            [
                'user_id' => $tutorBintang->id,
                'title' => 'Kalkulus Integral untuk Pemula',
                'subject' => 'Kalkulus',
                'description' => 'Konsep integral tentu dan tak tentu, latihan soal UTS.',
                'day' => 'Selasa',
                'startTime' => '13:00',
                'endTime' => '15:00',
                'capacity' => 10,
                'enrolled' => [],
                'active' => true,
            ],
            [
                'user_id' => $tutorCitra->id,
                'title' => 'SQL & ERD Workshop',
                'subject' => 'Basis Data',
                'description' => 'Latihan ERD, normalisasi, dan query SQL kompleks.',
                'day' => 'Rabu',
                'startTime' => '15:00',
                'endTime' => '17:00',
                'capacity' => 6,
                'enrolled' => [$mhsDemo->id],
                'active' => true,
            ],
            [
                'user_id' => $tutorAulia->id,
                'title' => 'React & Tailwind dari Nol',
                'subject' => 'Pemrograman Web',
                'description' => 'Membangun aplikasi React modern dengan Tailwind CSS.',
                'day' => 'Jumat',
                'startTime' => '16:00',
                'endTime' => '18:00',
                'capacity' => 12,
                'enrolled' => [],
                'active' => true,
            ],
            [
                'user_id' => $tutorDimas->id,
                'title' => 'Linked List & Tree Visualisasi',
                'subject' => 'Struktur Data',
                'description' => 'Pemahaman pointer, traversal tree, dan implementasi.',
                'day' => 'Kamis',
                'startTime' => '16:00',
                'endTime' => '18:00',
                'capacity' => 8,
                'enrolled' => [],
                'active' => true,
            ],
        ];

        foreach ($classes as $c) {
            \Illuminate\Support\Facades\DB::table('class_items')->insert(array_merge($c, [
                'enrolled' => json_encode($c['enrolled']),
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
