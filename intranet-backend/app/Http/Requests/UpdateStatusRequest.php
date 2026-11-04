<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class UpdateStatusRequest extends StoreStatusRequest
{
    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            ...parent::rules(),
            'name' => ['required', 'string', 'max:255', Rule::unique('status', 'name')->ignore($this->route('status'))],
        ];
    }
}
