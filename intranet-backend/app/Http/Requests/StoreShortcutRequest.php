<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShortcutRequest extends FormRequest
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
            'name' => 'required|string|max:100',
            'url' => 'required|string|max:255',
            'icon' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'url.required' => 'L\'URL du shortcut est obligatoire.',
            'url.string' => 'L\'URL du shortcut doit être une chaîne de caractères.',
            'url.max' => 'L\'URL du shortcut ne doit pas dépasser 255 caractères.',
            'icon.required' => 'L\'icône du shortcut est obligatoire.',
            'icon.string' => 'L\'icône du shortcut doit être une chaîne de caractères.',
            'icon.max' => 'L\'icône du shortcut ne doit pas dépasser 255 caractères.',
            'name.required' => 'Le nom du shortcut est obligatoire.',
            'name.string' => 'Le nom du shortcut doit être une chaîne de caractères.',
            'name.max' => 'Le nom du shortcut ne doit pas dépasser 100 caractères.',
        ];
    }
}
