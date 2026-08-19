<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\UseCases\Auth\LoginWithGoogleUseCase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(LoginWithGoogleUseCase $useCase): RedirectResponse
    {
        $googleUser = Socialite::driver('google')->user();

        $user = $useCase->execute($googleUser);

        Auth::guard('web')->login($user, remember: true);

        request()->session()->regenerate();

        return redirect(config('app.frontend_url'));
    }
}
