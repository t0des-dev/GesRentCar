<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function index(): JsonResponse
    {
        $checks = [];

        try {
            $checks['status'] = 'ok';
        } catch (\Throwable $e) {
            $checks['status'] = 'error';
        }

        try {
            $checks['timestamp'] = now()->toISOString();
        } catch (\Throwable $e) {
            $checks['timestamp'] = null;
        }

        try {
            $checks['php'] = phpversion();
        } catch (\Throwable $e) {
            $checks['php'] = null;
        }

        try {
            $checks['laravel'] = app()->version();
        } catch (\Throwable $e) {
            $checks['laravel'] = null;
        }

        try {
            $checks['database'] = DB::connection()->getPdo() ? 'connected' : 'disconnected';
        } catch (\Throwable $e) {
            $checks['database'] = 'disconnected';
        }

        try {
            $free = disk_free_space(storage_path());
            $checks['storage_free'] = round($free / 1048576, 2).' MB';
        } catch (\Throwable $e) {
            $checks['storage_free'] = null;
        }

        try {
            $uptime = microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'];
            $checks['uptime'] = round($uptime, 4).'s';
        } catch (\Throwable $e) {
            $checks['uptime'] = null;
        }

        try {
            $memory = memory_get_peak_usage(true);
            $checks['memory'] = round($memory / 1048576, 2).' MB';
        } catch (\Throwable $e) {
            $checks['memory'] = null;
        }

        return response()->json($checks);
    }
}
