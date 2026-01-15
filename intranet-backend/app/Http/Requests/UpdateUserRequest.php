<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends StoreUserRequest
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
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . ($this->route('user')->id ?? $this->route('user') ?? auth()->id()),        
        ];

        if ($this->routeIs('users.update')) {
            $rules['is_admin'] = 'required|boolean';
        }

        return $rules;
    }

    public function messages(): array
    {
        return parent::messages();
    }
}
