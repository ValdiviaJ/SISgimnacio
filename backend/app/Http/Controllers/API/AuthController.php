<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends BaseController
{
    /**
     * Handle user login authentication.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Mock verification for structure setup. In production, use standard Auth:
        // if (Auth::attempt($request->only('email', 'password'))) { ... }
        
        $user = User::with(['cliente', 'entrenador'])->where('email', $request->email)->first();

        if ($user) {
            // For now, let's generate token
            $token = $user->createToken('FitFlowToken')->plainTextToken;

            return $this->sendResponse([
                'user' => $user,
                'token' => $token
            ], 'Inicio de sesión exitoso.');
        }

        return $this->sendError('Credenciales inválidas.', [], 401);
    }

    /**
     * Handle user logout and revoke tokens.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->sendResponse([], 'Sesión cerrada correctamente.');
    }

    /**
     * Get authenticated user profile.
     */
    public function me(Request $request)
    {
        $user = $request->user()->load(['cliente', 'entrenador']);
        return $this->sendResponse($user, 'Perfil obtenido correctamente.');
    }

    /**
     * Send password reset requests.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        
        // Mocking logic
        return $this->sendResponse([], 'Si el correo existe, se ha enviado un enlace de recuperación.');
    }
}
