<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

    Route::get('/user', function (Request $request) {
    return $request->user();
    })->middleware('auth:api');

    // login
        Route::post('/login', [App\Http\Controllers\Api\Auth\LoginController::class, 'index']);

    // group route with middleware "auth"
        Route::group(['middleware' => 'auth:api'], function () {

        // logout
            Route::post('/logout', [App\Http\Controllers\Api\Auth\LoginController::class, 'logout']);
    
    // lupa password
        Route::post('/forgot-password', [App\Http\Controllers\Api\Auth\ForgotPasswordController::class, 'sendResetLinkEmail']);
        Route::post('/verify-reset-token', [App\Http\Controllers\Api\Auth\ForgotPasswordController::class, 'verifyResetToken']);
        Route::post('/reset-password', [App\Http\Controllers\Api\Auth\ResetPasswordController::class, 'reset']);
    });

// Admin
    Route::prefix('admin')->group(function () {
    //group route with middleware "auth:api"
        Route::group(['middleware' => 'auth:api'], function () {

                // lupa password
                Route::post('/forgot-password', [App\Http\Controllers\Api\Auth\ForgotPasswordController::class, 'sendResetLinkEmail']);
                Route::post('/verify-reset-token', [App\Http\Controllers\Api\Auth\ForgotPasswordController::class, 'verifyResetToken']);
                Route::post('/reset-password', [App\Http\Controllers\Api\Auth\ResetPasswordController::class, 'reset']);

            //users
                Route::apiResource('/users', App\Http\Controllers\Api\Admin\UserController::class)
                ->middleware('permission:users.index|users.store|users.update|users.delete');

            // permissions
                Route::middleware(['auth:api', 'permission:permissions.index'])->group(function ()
                {
                    Route::get('/permissions', [App\Http\Controllers\Api\Admin\PermissionController::class, 'index']);
                    Route::get('/permissions/all', [App\Http\Controllers\Api\Admin\PermissionController::class, 'all']);
                });

            // dashboard
                Route::get('/dashboard', App\Http\Controllers\Api\Admin\DashboardController::class);

                Route::get('/dashboard/attendance', [App\Http\Controllers\Api\Admin\DashboardController::class, 'getAttendanceData']);

            // roles
                Route::apiResource('/roles', App\Http\Controllers\Api\Admin\RoleController::class)
                ->middleware('permission:roles.index|roles.store|roles.update|roles.delete');

            //posts
                Route::apiResource('/posts', App\Http\Controllers\Api\Admin\PostController::class)
                ->middleware('permission:posts.index|posts.store|posts.update|posts.delete');

            // roles all
                Route::get('/roles/all', [App\Http\Controllers\Api\Admin\RoleController::class, 'all'])
                ->middleware('permission:roles.index');

            // categories
                Route::apiResource('/categories', App\Http\Controllers\Api\Admin\CategoryController::class)
                ->middleware('permission:categories.index|categories.store|categories.update|categories.delete');

            // categories all
                Route::get('/categories/all', [App\Http\Controllers\Api\Admin\CategoryController::class, 'all'])
                ->middleware('permission:categories.index');

            // profile
                Route::post('/profile', [App\Http\Controllers\ProfileController::class, 'store'])
                ->middleware('permission:profiles.store');

                Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'show'])
                ->middleware('permission:profiles.show');

                Route::post('/profile-update', [App\Http\Controllers\ProfileController::class, 'update'])
                ->middleware('permission:profiles.update');

        });
    });

// User
    Route::prefix('user')->group(function () {
    //group route with middleware "auth:api"
        Route::group(['middleware' => 'auth:api'], function () {

            // lupa password
                Route::post('/forgot-password', [App\Http\Controllers\Api\Auth\ForgotPasswordController::class, 'sendResetLinkEmail']);
                Route::post('/verify-reset-token', [App\Http\Controllers\Api\Auth\ForgotPasswordController::class, 'verifyResetToken']);
                Route::post('/reset-password', [App\Http\Controllers\Api\Auth\ResetPasswordController::class, 'reset']);

            // dashboard
                Route::get('/dashboard', [App\Http\Controllers\Api\User\UserDashboardController::class, 'index']);

            // absen
                Route::post('/absen', [App\Http\Controllers\AbsenController::class, 'absen'])
                ->middleware('permission:absens.absen');

            // pengajuan cuti/izin/lembur
                Route::get('/lihat', [App\Http\Controllers\PengajuanTidakHadirController::class, 'index']);
                Route::get('/melihat/{id}', [App\Http\Controllers\PengajuanTidakHadirController::class, 'show']);
                Route::post('/membuat', [App\Http\Controllers\PengajuanTidakHadirController::class, 'store']);
                Route::post('/mengubah/{id}', [App\Http\Controllers\PengajuanTidakHadirController::class, 'update']);
                Route::delete('/menghapus/{id}', [App\Http\Controllers\PengajuanTidakHadirController::class, 'destroy']);

            // izin sakit
                Route::get('/izin-sakit/count', [App\Http\Controllers\IzinSakitController::class, 'getMonthlyCounts'])
                ->middleware('permission:izin_sakits.getMonthlyCounts');
    
                Route::post('/izin-sakit', [App\Http\Controllers\IzinSakitController::class, 'store'])            
                ->middleware('permission:izin_sakits.store');

            // profile
                Route::post('/profile', [App\Http\Controllers\ProfileController::class, 'store'])
                ->middleware('permission:profiles.store');

                Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'show'])
                ->middleware('permission:profiles.show');

                Route::post('/profile-update', [App\Http\Controllers\ProfileController::class, 'update'])
                ->middleware('permission:profiles.update');
                                 
        });
    });
