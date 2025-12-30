<?php

use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\EvaluationToolController;
use App\Http\Controllers\Api\ObservationController;
use App\Http\Controllers\Api\ObserverController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;

Route::apiResource('teachers', TeacherController::class);
Route::apiResource('evaluation-tools', EvaluationToolController::class);
Route::apiResource('observations', ObservationController::class);
Route::apiResource('observers', ObserverController::class);

// Dashboard endpoints
Route::get('dashboard/tool-analysis', [DashboardController::class, 'toolAnalysis']);
Route::get('dashboard/teacher-performance', [DashboardController::class, 'teacherPerformance']);
