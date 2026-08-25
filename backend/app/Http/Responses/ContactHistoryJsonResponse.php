<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactHistoryJsonResponse extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'content' => $this->content,
            'created_by' => $this->created_by,
            'creator' => $this->whenLoaded('createdByUser', fn () => $this->createdByUser ? [
                'id' => $this->createdByUser->id,
                'name' => $this->createdByUser->name,
                'avatar_url' => $this->createdByUser->avatar_url,
            ] : null),
            'created_at' => $this->created_at,
        ];
    }
}
