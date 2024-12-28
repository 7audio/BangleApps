<?php

$text = $_GET['message'] ?? $argv[1] ?? 'Hello';

$text = base64_decode($text);

$disableNotification = (bool) $_GET['disable_notification'] ?? true;

if ($_GET['extend_timestamps'] ?? false) {
    $lines = explode("\n", $text);
    if (isset($lines[0])) $lines[0] .= ' лег';
    if (isset($lines[1])) $lines[1] .= ' закрыл глаза';
    if (isset($lines[2])) {
        $lines[2] .= ' встал с кровати';
        $lines[] = mb_substr($lines[2], 0, 10) . ' будильник';
        array_unshift($lines, implode('.', array_reverse(explode('-', mb_substr($lines[2], 0, 10)))));
    }
    $text = implode("\n", $lines);
}

$ch = curl_init();

$tgToken = '__TG_TOKEN__';
curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/$tgToken/sendMessage");
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

$isSuccess = strpos($result, '"ok":true') !== false;
echo $isSuccess ? 'ok' : 'fail';
