<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $teachers = Teacher::orderBy('created_at', 'desc')->get();
        return response()->json($teachers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:teachers,email',
            'subject' => 'nullable|string|max:255',
            'department' => 'required|string|in:english,spanish',
            'level' => 'required|string|in:preprimaria,primaria,bys,areas_practicas,especialidad',
            'hire_date' => 'nullable|date',
            'status' => 'nullable|string|in:active,inactive,on_leave',
        ]);

        $teacher = Teacher::create($validated);
        return response()->json($teacher, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Teacher $teacher): JsonResponse
    {
        return response()->json($teacher);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Teacher $teacher): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|unique:teachers,email,' . $teacher->id,
            'subject' => 'nullable|string|max:255',
            'department' => 'sometimes|required|string|in:english,spanish',
            'level' => 'sometimes|required|string|in:preprimaria,primaria,bys,areas_practicas,especialidad',
            'hire_date' => 'nullable|date',
            'status' => 'nullable|string|in:active,inactive,on_leave',
        ]);

        $teacher->update($validated);
        return response()->json($teacher);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher): JsonResponse
    {
        $teacher->delete();
        return response()->json(null, 204);
    }
}
