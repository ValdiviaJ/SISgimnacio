<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Entrenador;
use App\Models\Cliente;
use App\Models\Configuracion;
use App\Models\Plan;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Gym Configuration if none exists
        if (!Configuracion::exists()) {
            Configuracion::create([
                'nombre_gimnasio' => 'FitFlow Gym',
                'direccion' => 'Av. Principal 123, San Isidro',
                'telefono' => '+51 987 654 321',
                'moneda' => 'USD',
                'impuesto_porcentaje' => 18.00,
                'horarios' => [
                    'lunes_viernes' => '06:00 - 22:00',
                    'sabado' => '08:00 - 18:00',
                    'domingo' => 'Cerrado'
                ]
            ]);
        }

        // 2. Create Default Plans if none exists
        $planTrimestral = null;
        if (!Plan::exists()) {
            Plan::create([
                'nombre' => 'Plan Mensual',
                'precio' => 35.00,
                'duracion_dias' => 30,
                'features' => ['Acceso libre', 'Evaluación inicial', 'Lockers de cortesía'],
                'popular' => false,
            ]);

            $planTrimestral = Plan::create([
                'nombre' => 'Plan Trimestral',
                'precio' => 90.00,
                'duracion_dias' => 90,
                'features' => ['Acceso libre', 'Plan de entrenamiento', '1 pase de invitado al mes', 'Lockers'],
                'popular' => true,
            ]);

            Plan::create([
                'nombre' => 'Plan Anual',
                'precio' => 320.00,
                'duracion_dias' => 365,
                'features' => ['Acceso ilimitado 24/7', 'Personal trainer asignado', 'Pases ilimitados invitados', 'Lockers premium'],
                'popular' => false,
            ]);
        } else {
            $planTrimestral = Plan::where('nombre', 'Plan Trimestral')->first();
        }

        // 2. Create Admin if none exists
        if (!User::where('email', 'admin@fitflow.com')->exists()) {
            User::create([
                'name' => 'Administrador Sistema',
                'email' => 'admin@fitflow.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]);
        }

        // 3. Create Recepcionista if none exists
        if (!User::where('email', 'recepcion@fitflow.com')->exists()) {
            User::create([
                'name' => 'Recepción FitFlow',
                'email' => 'recepcion@fitflow.com',
                'password' => Hash::make('recep123'),
                'role' => 'recepcionista',
            ]);
        }

        // 4. Create Entrenador and profile if none exists
        $trainer = null;
        if (!User::where('email', 'coach@fitflow.com')->exists()) {
            $userTrainer = User::create([
                'name' => 'Coach Fitness',
                'email' => 'coach@fitflow.com',
                'password' => Hash::make('coach123'),
                'role' => 'entrenador',
            ]);

            $trainer = Entrenador::create([
                'user_id' => $userTrainer->id,
                'especialidad' => 'Musculación & Powerlifting',
                'horario' => 'Turno Mañana',
            ]);
        } else {
            $userTrainer = User::where('email', 'coach@fitflow.com')->first();
            $trainer = Entrenador::where('user_id', $userTrainer->id)->first();
        }

        // 5. Create Cliente and profile if none exists
        if (!User::where('email', 'cliente@fitflow.com')->exists()) {
            $userCliente = User::create([
                'name' => 'Marcos Deza',
                'email' => 'cliente@fitflow.com',
                'password' => Hash::make('client123'),
                'role' => 'cliente',
            ]);

            $cliente = Cliente::create([
                'user_id' => $userCliente->id,
                'entrenador_id' => $trainer ? $trainer->id : null,
                'telefono' => '+51 912 345 678',
                'direccion' => 'Calle Las Magnolias 450',
                'fecha_nacimiento' => '1995-08-12',
                'genero' => 'Masculino',
                'estado' => 'activo',
                'observaciones' => 'Socio fundador. Enfoque en hipertrofia.',
            ]);

            \App\Models\Membresia::create([
                'cliente_id' => $cliente->id,
                'plan_id' => $planTrimestral ? $planTrimestral->id : 2,
                'precio' => 90.00,
                'fecha_inicio' => \Carbon\Carbon::now()->subDays(15)->toDateString(),
                'fecha_vencimiento' => \Carbon\Carbon::now()->addDays(75)->toDateString(),
                'estado' => 'activa'
            ]);
        }
    }
}
