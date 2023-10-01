<?php

$text = $_GET['message'] ?? $argv[1] ?? 'Hello';

$text = base64_decode($text);

$disableNotification = (bool) $_GET['disable_notification'] ?? true;

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 'https://api.telegram.org//sendMessage');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'chat_id' => '85762097',
    'text' => $text,
    'disable_notification' => $disableNotification,
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$result = curl_exec($ch);

curl_close($ch);
