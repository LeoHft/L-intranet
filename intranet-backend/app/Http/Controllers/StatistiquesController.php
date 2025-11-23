<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use App\Models\NumberClickByServiceByUserByDay;
use Illuminate\Support\Facades\DB;


class StatistiquesController extends Controller
{
    public function getStatByUserByServiceByDate(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'serviceId' => 'nullable|array',
            'userIds' => 'nullable|array',
            'linkTypes' => 'nullable|array',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
        ], $this->validationErrorMessage());
        
        $serviceId = $validatedData['serviceId'] ?? [];
        $userIds = $validatedData['userIds'] ?? [];
        $linkTypes = $validatedData['linkTypes'] ?? [];
        $startDate = $validatedData['startDate'];
        $endDate = $validatedData['endDate'];

        try {
            // Déterminer quelles colonnes sélectionner selon les linkTypes
            $selectFields = [
                'number_click_by_service_by_user_by_day.service_id',
                'number_click_by_service_by_user_by_day.user_id',
                'number_click_by_service_by_user_by_day.click_date',
                'users.name as user_name',
                'services.name as service_name'
            ];

            $includeInternal = empty($linkTypes) || in_array('internal', $linkTypes);
            $includeExternal = empty($linkTypes) || in_array('external', $linkTypes);

            if ($includeInternal) {
                $selectFields[] = DB::raw('SUM(number_click_by_service_by_user_by_day.internal_url_click) as internal_url_click');
            }

            if ($includeExternal) {
                $selectFields[] = DB::raw('SUM(number_click_by_service_by_user_by_day.external_url_click) as external_url_click');
            }

            $query = NumberClickByServiceByUserByDay::query()
                ->select($selectFields)
                ->leftJoin('users', 'number_click_by_service_by_user_by_day.user_id', '=', 'users.id')
                ->leftJoin('services', 'number_click_by_service_by_user_by_day.service_id', '=', 'services.id')
                ->whereBetween('number_click_by_service_by_user_by_day.click_date', [$startDate, $endDate]);

            
            if (!empty($serviceId)) {
                $query->whereIn('number_click_by_service_by_user_by_day.service_id', $serviceId);
            }

            if (!empty($userIds)) {
                $query->whereIn('number_click_by_service_by_user_by_day.user_id', $userIds);
            }

            
            if (!empty($linkTypes)) {
                if ($includeInternal && !$includeExternal) {
                    // Seulement internal : filtrer les lignes avec clics internes > 0
                    $query->where('number_click_by_service_by_user_by_day.internal_url_click', '>', 0);
                } elseif ($includeExternal && !$includeInternal) {
                    // Seulement external : filtrer les lignes avec clics externes > 0
                    $query->where('number_click_by_service_by_user_by_day.external_url_click', '>', 0);
                } elseif ($includeInternal && $includeExternal) {
                    // Les deux : au moins un des deux types doit avoir des clics
                    $query->where(function($q) {
                        $q->where('number_click_by_service_by_user_by_day.internal_url_click', '>', 0)
                        ->orWhere('number_click_by_service_by_user_by_day.external_url_click', '>', 0);
                    });
                }
            }

            $results = $query->groupBy(
                'number_click_by_service_by_user_by_day.service_id',
                'number_click_by_service_by_user_by_day.user_id',
                'number_click_by_service_by_user_by_day.click_date',
                'users.name',
                'services.name'
            )->get();

            return response()->json([
                'message' => 'Statistiques récupérées avec succès',
                'data' => $results
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des statistiques: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue'
            ], 500);
        }
    }

    public function validationErrorMessage()
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