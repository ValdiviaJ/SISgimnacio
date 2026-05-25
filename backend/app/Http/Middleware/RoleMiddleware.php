<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        // Check if the user's role is in the list of allowed roles
        if (!in_array($user->role, $roles)) {
            return response()->json([
                'message' => 'Unauthorized. This resource requires one of the following roles: ' . implode(', ', $roles)
            ], 403);
        }

        return $next($request);
    }
}
