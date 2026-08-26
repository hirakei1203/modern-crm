<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => ['sometimes', 'required', 'string', 'max:255'],
            'url' => ['sometimes', 'required', 'url', 'max:2048'],
            'icon_type' => ['sometimes', 'required', 'string', 'in:notion,gmail,other'],
        ];
    }
}
