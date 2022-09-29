<?php

use Illuminate\Database\Seeder;
use App\Models\Type;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            ['name' => 'Color', 'description' => 'Color de el producto'],
            ['name' => 'Talla', 'description' => 'Talla de el producto'],
            ['name' => 'Marca', 'description' => 'Talla de el productoTalla de el producto'],
            ['name' => 'Fábrica', 'description' => 'Fábrica de el producto']
        ];

        foreach ($data as $data) {
            Type::create($data);
        }
    }
}
