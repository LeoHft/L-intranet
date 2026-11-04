<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const TABLE = 'number_click_by_service_by_user_by_day';

    public function up(): void
    {
        // Fusionne les doublons éventuels, sans perdre de clics, avant de poser la contrainte.
        DB::transaction(function () {
            DB::table(self::TABLE)
                ->selectRaw('service_id, user_id, click_date, MIN(id) as keep_id, SUM(internal_url_click) as internal_total, SUM(external_url_click) as external_total')
                ->groupBy('service_id', 'user_id', 'click_date')
                ->havingRaw('COUNT(*) > 1')
                ->get()
                ->each(function ($row) {
                    DB::table(self::TABLE)->where('id', $row->keep_id)->update([
                        'internal_url_click' => $row->internal_total,
                        'external_url_click' => $row->external_total,
                    ]);

                    DB::table(self::TABLE)
                        ->where('service_id', $row->service_id)
                        ->where('user_id', $row->user_id)
                        ->where('click_date', $row->click_date)
                        ->where('id', '!=', $row->keep_id)
                        ->delete();
                });
        });

        Schema::table(self::TABLE, function (Blueprint $table) {
            $table->unique(['service_id', 'user_id', 'click_date'], 'clicks_service_user_date_unique');
        });
    }

    public function down(): void
    {
        Schema::table(self::TABLE, function (Blueprint $table) {
            // Cet index peut être le seul à couvrir la clé étrangère service_id.
            $table->index('service_id', 'clicks_service_id_index');
            $table->dropUnique('clicks_service_user_date_unique');
        });
    }
};
