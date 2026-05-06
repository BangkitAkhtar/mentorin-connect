<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        \App\Models\User::create([
            'name' => 'Admin SASC',
            'email' => 'admin@binus.ac.id',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin',
            'university' => 'BINUS University',
            'major' => 'Student Academic Support Center',
        ]);

        // Tutors
        $tutors = [
            [
                'name' => 'Aulia Rahman',
                'email' => 'aulia@binus.ac.id',
                'major' => 'Computer Science',
                'bio' => 'Mahasiswa CS semester 6. Suka bantu teman paham algoritma & web dev dengan analogi sederhana.',
                'subjects' => ["Algoritma & Pemrograman", "Pemrograman Web", "Struktur Data"],
                'rating' => 4.9,
                'reviewCount' => 32,
                'availability' => [
                    'Senin' => ["09:00-11:00", "14:00-16:00"],
                    'Rabu' => ["10:00-12:00"],
                    'Jumat' => ["13:00-15:00", "16:00-18:00"],
                ],
            ],
            [
                'name' => 'Bintang Pratama',
                'email' => 'bintang@binus.ac.id',
                'major' => 'Mathematics',
                'bio' => 'Asisten dosen Kalkulus. Senang menjelaskan konsep matematika dari dasar sampai mahir.',
                'subjects' => ["Kalkulus", "Statistika", "Fisika Dasar"],
                'rating' => 4.8,
                'reviewCount' => 21,
                'availability' => [
                    'Selasa' => ["08:00-10:00", "13:00-15:00"],
                    'Kamis' => ["10:00-12:00"],
                    'Sabtu' => ["09:00-11:00"],
                ],
            ],
            [
                'name' => 'Citra Maharani',
                'email' => 'citra@binus.ac.id',
                'major' => 'Information Systems',
                'bio' => 'Fokus di basis data dan analisis sistem. Pernah jadi mentor SASC selama 2 semester.',
                'subjects' => ["Basis Data", "Sistem Operasi", "Jaringan Komputer"],
                'rating' => 4.7,
                'reviewCount' => 18,
                'availability' => [
                    'Senin' => ["13:00-15:00"],
                    'Rabu' => ["09:00-11:00", "15:00-17:00"],
                    'Jumat' => ["10:00-12:00"],
                ],
            ],
            [
                'name' => 'Dimas Hartanto',
                'email' => 'dimas@binus.ac.id',
                'major' => 'Computer Science',
                'bio' => 'Suka kompetisi pemrograman dan bantu temen-temen ngerti struktur data secara visual.',
                'subjects' => ["Algoritma & Pemrograman", "Struktur Data", "Pemrograman Web"],
                'rating' => 4.6,
                'reviewCount' => 12,
                'availability' => [
                    'Selasa' => ["15:00-17:00"],
                    'Kamis' => ["13:00-15:00", "16:00-18:00"],
                ],
            ],
        ];

        foreach ($tutors as $t) {
            \App\Models\User::create(array_merge($t, [
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'tutor',
                'university' => 'BINUS University',
                'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . urlencode($t['name']),
            ]));
        }

        // Students
        $students = [
            ['name' => 'Demo Mahasiswa', 'email' => 'demo@binus.ac.id', 'major' => 'Computer Science'],
            ['name' => 'Rina Kusuma', 'email' => 'rina@binus.ac.id', 'major' => 'Information Systems'],
        ];

        foreach ($students as $s) {
            \App\Models\User::create(array_merge($s, [
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'mahasiswa',
                'university' => 'BINUS University',
                'avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . urlencode($s['name']),
            ]));
        }
    }
}
