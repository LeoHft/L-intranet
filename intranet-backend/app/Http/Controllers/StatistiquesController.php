<?php

namespace App\Http\Controllers;

use App\Http\Requests\GetStatisticsRequest;
use App\Models\NumberClickByServiceByUserByDay;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StatistiquesController extends Controller
{
    public function getStatByUserByServiceByDate(GetStatisticsRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $linkTypes = $filters['linkTypes'] ?? [];
        $includeInternal = empty($linkTypes) || in_array('internal', $linkTypes, true);
        $includeExternal = empty($linkTypes) || in_array('external', $linkTypes, true);
        $clicks = 'number_click_by_service_by_user_by_day';

        $results = NumberClickByServiceByUserByDay::query()
            ->select([
                "$clicks.service_id",
                "$clicks.user_id",
                "$clicks.click_date",
                'users.name as user_name',
                'services.name as service_name',
                // Un type de lien non demandé vaut 0, pour que le frontend reçoive toujours les deux colonnes.
                DB::raw($includeInternal ? "SUM($clicks.internal_url_click) as internal_url_click" : '0 as internal_url_click'),
                DB::raw($includeExternal ? "SUM($clicks.external_url_click) as external_url_click" : '0 as external_url_click'),
            ])
            ->leftJoin('users', "$clicks.user_id", '=', 'users.id')
            ->leftJoin('services', "$clicks.service_id", '=', 'services.id')
            ->whereBetween("$clicks.click_date", [$filters['startDate'], $filters['endDate']])
            ->when(! empty($filters['serviceId']), fn ($query) => $query->whereIn("$clicks.service_id", $filters['serviceId']))
            ->when(! empty($filters['userIds']), fn ($query) => $query->whereIn("$clicks.user_id", $filters['userIds']))
            ->when(! ($includeInternal && $includeExternal), fn ($query) => $query->where(
                $includeInternal ? "$clicks.internal_url_click" : "$clicks.external_url_click", '>', 0
            ))
            ->groupBy("$clicks.service_id", "$clicks.user_id", "$clicks.click_date", 'users.name', 'services.name')
            ->get();

        return response()->json([
            'message' => 'Statistiques récupérées avec succès',
            'data' => $results,
        ]);
    }
}
