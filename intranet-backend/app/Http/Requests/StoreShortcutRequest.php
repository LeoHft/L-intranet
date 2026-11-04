<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreShortcutRequest extends FormRequest
{
    /** @return array<string, string> */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'url' => 'required|url:http,https|max:255',
            'icon' => ['required', 'string', 'max:100', 'regex:/^[A-Za-z0-9]+$/'],
        ];
    }

    /** @return array<int, callable> */
    public function after(): array
    {
        return [function (Validator $validator) {
            $limit = config('intranet.max_shortcuts_per_user');

            if ($this->user()->shortcuts()->count() >= $limit) {
                $validator->errors()->add('url', "Vous ne pouvez pas créer plus de {$limit} raccourcis.");
            }
        }];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'url.required' => "L'URL du raccourci est obligatoire.",
            'url.url' => "L'URL du raccourci doit être une adresse http:// ou https:// valide.",
            'url.max' => "L'URL du raccourci ne doit pas dépasser 255 caractères.",
            'icon.required' => "L'icône du raccourci est obligatoire.",
            'icon.string' => "L'icône du raccourci doit être une chaîne de caractères.",
            'icon.max' => "L'icône du raccourci ne doit pas dépasser 100 caractères.",
            'icon.regex' => "L'icône du raccourci est invalide.",
            'name.required' => 'Le nom du raccourci est obligatoire.',
            'name.string' => 'Le nom du raccourci doit être une chaîne de caractères.',
            'name.max' => 'Le nom du raccourci ne doit pas dépasser 100 caractères.',
        ];
    }
}
