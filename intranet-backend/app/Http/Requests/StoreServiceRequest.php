<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
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
            'description' => 'nullable|string',
            'internal_url' => 'nullable|url',
            'external_url' => 'nullable|url',
            'image' => 'nullable|mimes:jpeg,png,jpg,gif,webp,ico,gif|max:32768', // Max 32MB
            'status_id' => 'nullable|exists:status,id',
            'category_id' => 'nullable|array',
            'category_id.*' => 'exists:categories,id',
            'user_id' => 'required|array',
            'user_id.*' => 'exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            // --- Name ---
            'name.required' => 'Le nom du service est obligatoire.',
            'name.string' => 'Le nom du service doit être une chaîne de caractères.',
            'name.max' => 'Le nom du service ne doit pas dépasser 255 caractères.',

            // --- Description ---
            'description.string' => 'La description doit être une chaîne de caractères.',

            // --- URLs ---
            'internal_url.url' => "Le format de l'URL interne est invalide.",
            'external_url.url' => "Le format de l'URL externe est invalide.",

            // --- Image ---
            'image.mimes' => "L'image doit être au format : jpeg, png, jpg, gif, ico ou webp.",
            'image.max' => "L'image ne doit pas dépasser 32 Mo.",

            // --- Status ---
            'status_id.exists' => "Le statut sélectionné est invalide ou n'existe pas.",

            // --- Categories ---
            'category_id.array' => "Le format des catégories est invalide.",
            'category_id.*.exists' => "Une des catégories sélectionnées est invalide.",

            // --- Users ---
            'user_id.required' => "Au moins un utilisateur doit être assigné au service.",
            'user_id.array' => "Le format de la sélection des utilisateurs est invalide.",
            'user_id.*.exists' => "Un des utilisateurs sélectionnés est invalide ou n'existe pas.",
        ];
    }
}
