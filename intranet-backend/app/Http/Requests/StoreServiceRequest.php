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
            'description' => 'nullable|string|max:255',
            'internal_url' => 'nullable|url:http,https|max:255',
            'external_url' => 'nullable|url:http,https|max:255',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,ico|max:32768', // Max 32 Mo (SVG exclu : risque de XSS)
            'status_id' => 'nullable|exists:status,id',
            'category_id' => 'nullable|array',
            'category_id.*' => 'exists:categories,id',
            'user_id' => 'required|array|min:1',
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
            'description.max' => 'La description ne doit pas dépasser 255 caractères.',

            // --- URLs ---
            'internal_url.url' => "L'URL interne doit être une adresse http:// ou https:// valide.",
            'internal_url.max' => "L'URL interne ne doit pas dépasser 255 caractères.",
            'external_url.url' => "L'URL externe doit être une adresse http:// ou https:// valide.",
            'external_url.max' => "L'URL externe ne doit pas dépasser 255 caractères.",

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
            'user_id.min' => "Au moins un utilisateur doit être assigné au service.",
            'user_id.array' => "Le format de la sélection des utilisateurs est invalide.",
            'user_id.*.exists' => "Un des utilisateurs sélectionnés est invalide ou n'existe pas.",
        ];
    }
}
