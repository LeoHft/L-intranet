<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetStatisticsRequest extends FormRequest
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
            'serviceId' => 'nullable|array',
            'userIds' => 'nullable|array',
            'linkTypes' => 'nullable|array',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
        ];
    }

    public function messages(): array
    {
        return [
            // --- Tableaux (IDs & Types) ---
            'serviceId.array' => 'Le format de la sélection des services est invalide.',
            'userIds.array' => 'Le format de la sélection des utilisateurs est invalide.',
            'linkTypes.array' => 'Le format des types de liens est invalide.',

            // --- Date de début ---
            'startDate.required' => 'La date de début est obligatoire.',
            'startDate.date' => 'La date de début doit être une date valide.',

            // --- Date de fin ---
            'endDate.required' => 'La date de fin est obligatoire.',
            'endDate.date' => 'La date de fin doit être une date valide.',
            'endDate.after_or_equal' => 'La date de fin doit être ultérieure ou égale à la date de début.',
        ];
    }
}
