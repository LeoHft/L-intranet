<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends StoreUserRequest
{
    /** Utilisée par l'administration (users.update) et par le profil de l'utilisateur connecté. */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($this->route('user') ?? $this->user())],
        ];

        if ($this->routeIs('users.update')) {
            $rules['is_admin'] = 'required|boolean';
            $rules['password'] = ['nullable', 'string', 'confirmed', Password::defaults()];
        }

        return $rules;
    }
}
