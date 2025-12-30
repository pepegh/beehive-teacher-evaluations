<?php

namespace App\Enums;

enum Department: string
{
    case ENGLISH = 'english';
    case SPANISH = 'spanish';

    public function label(): string
    {
        return match($this) {
            self::ENGLISH => 'English',
            self::SPANISH => 'Spanish',
        };
    }
}
