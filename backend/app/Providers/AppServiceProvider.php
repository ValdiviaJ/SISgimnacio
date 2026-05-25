<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\ClienteRepositoryInterface;
use App\Repositories\Eloquent\ClienteRepository;
use App\Repositories\Contracts\MembresiaRepositoryInterface;
use App\Repositories\Eloquent\MembresiaRepository;
use App\Repositories\Contracts\PlanRepositoryInterface;
use App\Repositories\Eloquent\PlanRepository;
use App\Repositories\Contracts\AsistenciaRepositoryInterface;
use App\Repositories\Eloquent\AsistenciaRepository;
use App\Repositories\Contracts\EntrenadorRepositoryInterface;
use App\Repositories\Eloquent\EntrenadorRepository;
use App\Repositories\Contracts\RutinaRepositoryInterface;
use App\Repositories\Eloquent\RutinaRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ClienteRepositoryInterface::class, ClienteRepository::class);
        $this->app->bind(MembresiaRepositoryInterface::class, MembresiaRepository::class);
        $this->app->bind(PlanRepositoryInterface::class, PlanRepository::class);
        $this->app->bind(AsistenciaRepositoryInterface::class, AsistenciaRepository::class);
        $this->app->bind(EntrenadorRepositoryInterface::class, EntrenadorRepository::class);
        $this->app->bind(RutinaRepositoryInterface::class, RutinaRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') === 'production') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
    }
}
