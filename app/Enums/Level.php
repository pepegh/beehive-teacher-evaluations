<?php

namespace App\Enums;

enum Level: string
{
    case PREPRIMARIA = 'preprimaria';
    case PRIMARIA = 'primaria';
    case BYS = 'bys';
    case AREAS_PRACTICAS = 'areas_practicas';
    case ESPECIALIDAD = 'especialidad';

    public function label(): string
    {
        return match($this) {
            self::PREPRIMARIA => 'Preprimaria',
            self::PRIMARIA => 'Primaria',
            self::BYS => 'BYS',
            self::AREAS_PRACTICAS => 'Áreas Prácticas',
            self::ESPECIALIDAD => 'Especialidad',
        };
    }
}
