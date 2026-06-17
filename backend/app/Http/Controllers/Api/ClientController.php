<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return response()->json(Client::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:clients',
            'phone' => 'required|string',
            'cin' => 'required|string|unique:clients',
            'license' => 'nullable|string',
            'cin_image_url' => 'nullable|string',
            'license_image_url' => 'nullable|string',
        ]);

        $client = Client::create($validated);

        return response()->json($client, 201);
    }

    public function show(Client $client)
    {
        return response()->json($client);
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'string',
            'email' => 'email|unique:clients,email,'.$client->id,
            'phone' => 'string',
            'cin' => 'string|unique:clients,cin,'.$client->id,
        ]);

        $client->update($validated);

        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json(null, 204);
    }
}
