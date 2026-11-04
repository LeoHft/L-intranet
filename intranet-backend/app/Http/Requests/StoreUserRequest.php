<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
            'is_admin' => 'required|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            // --- Name ---
            'name.required' => 'Le nom est obligatoire.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne doit pas dépasser 255 caractères.',

            // --- Email ---
            'email.required' => "L'adresse email est obligatoire.",
            'email.string' => "L'adresse email doit être une chaîne de caractères.",
            'email.email' => "L'adresse email doit être un format valide.",
            'email.max' => "L'adresse email ne doit pas dépasser 255 caractères.",
            'email.unique' => "Cette adresse email est déjà utilisée par un autre compte.",

            // --- Password ---
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.string' => 'Le mot de passe doit être une chaîne de caractères.',
            'password.min' => 'Le mot de passe doit contenir au moins :min caractères.',
            'password.confirmed' => 'Les mots de passes ne correspondent pas.',

            // --- Is Admin ---
            'is_admin.required' => 'Le choix du rôle (admin ou non) est obligatoire.',
            'is_admin.boolean' => 'Le champ administrateur doit être vrai ou faux.',
        ];
    }
}
