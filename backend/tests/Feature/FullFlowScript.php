<?php

$baseUrl = "http://localhost:8000/api";

function call($method, $url, $data = null, $token = null) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    $headers = ["Accept: application/json"];
    if ($token) $headers[] = "Authorization: Bearer $token";
    if ($data) {
        $headers[] = "Content-Type: application/json";
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ["status" => $status, "data" => json_decode($response, true)];
}

echo "1. Login...\n";
$login = call("POST", "$baseUrl/login", ["email" => "agent@vectoria.com", "password" => "Agent2026!"]);
if ($login['status'] != 200) die("Login failed: " . json_encode($login) . "\n");
$token = $login['data']['token'];
echo "Success! Token: " . substr($token, 0, 10) . "...\n\n";

echo "2. OCR Scan...\n";
$scan = call("POST", "$baseUrl/ocr/scan", ["type" => "cin"], $token);
if ($scan['status'] != 200) die("OCR failed: " . json_encode($scan) . "\n");
$clientData = $scan['data']['data'];
echo "Success! Extracted: " . $clientData['name'] . "\n\n";

echo "3. Save Client...\n";
$randomSuffix = rand(100, 999);
$clientSave = call("POST", "$baseUrl/clients", [
    "name" => $clientData['name'],
    "cin" => $clientData['id_number'] . $randomSuffix,
    "email" => "test$randomSuffix@example.com",
    "phone" => "0600000" . $randomSuffix
], $token);
if ($clientSave['status'] != 201 && $clientSave['status'] != 200) die("Client save failed: " . json_encode($clientSave) . "\n");
$clientId = $clientSave['data']['id'];
echo "Success! Client ID: $clientId\n\n";

echo "4. Get Vehicles...\n";
$vehicles = call("GET", "$baseUrl/vehicles", null, $token);
if ($vehicles['status'] != 200) die("Vehicles fetch failed\n");
$vehicleId = $vehicles['data'][0]['id'];
echo "Success! Using Vehicle: " . $vehicles['data'][0]['brand'] . "\n\n";

echo "5. Create Reservation...\n";
$start = date('Y-m-d', strtotime('+30 days'));
$end = date('Y-m-d', strtotime('+32 days'));
$reservation = call("POST", "$baseUrl/reservations", [
    "client_id" => $clientId,
    "vehicle_id" => $vehicleId,
    "start_date" => $start,
    "end_date" => $end
], $token);
if ($reservation['status'] != 201 && $reservation['status'] != 200) die("Reservation failed: " . json_encode($reservation) . "\n");
$reservationId = $reservation['data']['id'];
echo "Success! Reservation ID: $reservationId\n\n";

echo "6. Generate Contract...\n";
$contract = call("POST", "$baseUrl/reservations/$reservationId/contract", null, $token);
if ($contract['status'] != 200) die("Contract failed: " . json_encode($contract) . "\n");
echo "Success! Contract URL: " . $contract['data']['url'] . "\n\n";

echo "🔥 FULL FLOW TEST PASSED SUCCESSFULLY! 🔥\n";
