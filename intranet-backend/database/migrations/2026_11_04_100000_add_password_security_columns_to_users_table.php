<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('must_change_password')->default(false)->after('password');
            $table->unsignedInteger('token_version')->default(0)->after('must_change_password');
        });

        // Comptes jamais utilisés : leur mot de passe a été choisi par quelqu'un d'autre.
        DB::table('users')->whereNull('last_login_at')->update(['must_change_password' => true]);

        // Anciennes installations : l'administrateur par défaut a peut-être gardé "password".
        $defaultAdmin = DB::table('users')->where('email', 'admin@example.com')->first();

        if ($defaultAdmin && Hash::check('password', $defaultAdmin->password)) {
            DB::table('users')->where('id', $defaultAdmin->id)->update(['must_change_password' => true]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['must_change_password', 'token_version']);
        });
    }
};
