<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tutorBintang = \App\Models\User::where('email', 'bintang@binus.ac.id')->first();
        $tutorAulia = \App\Models\User::where('email', 'aulia@binus.ac.id')->first();
        $tutorCitra = \App\Models\User::where('email', 'citra@binus.ac.id')->first();
        $mhsDemo = \App\Models\User::where('email', 'demo@binus.ac.id')->first();

        $bookings = [
            [
                'mahasiswa_id' => $mhsDemo->id,
                'tutor_id' => $tutorBintang->id,
                'subject' => 'Kalkulus',
                'day' => 'Selasa',
                'time' => '08:00',
                'topic' => 'Bantuan soal limit dan turunan',
                'status' => 'Confirmed',
                'created_at' => now()->subDay(),
            ],
            [
                'mahasiswa_id' => $mhsDemo->id,
                'tutor_id' => $tutorAulia->id,
                'subject' => 'Pemrograman Web',
                'day' => 'Jumat',
                'time' => '13:00',
                'topic' => 'Setup React + routing dasar',
                'status' => 'Pending',
                'created_at' => now()->subHour(),
            ],
            [
                'mahasiswa_id' => $mhsDemo->id,
                'tutor_id' => $tutorCitra->id,
                'subject' => 'Basis Data',
                'day' => 'Senin',
                'time' => '13:00',
                'topic' => 'Normalisasi 1NF-3NF',
                'status' => 'Completed',
                'reviewed' => false,
                'created_at' => now()->subWeek(),
            ],
        ];

        foreach ($bookings as $b) {
            \Illuminate\Support\Facades\DB::table('bookings')->insert(array_merge($b, [
                'updated_at' => now(),
            ]));
        }
    }
}
