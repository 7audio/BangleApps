<?php

header('Access-Control-Allow-Origin: *');

$tgToken = '__TG_TOKEN__';

$audio = $_FILES['audio'] ?? null;
if ($audio !== null && (
    !is_array($audio) ||
    ($audio['error'] ?? null) !== UPLOAD_ERR_OK ||
    !is_string($audio['tmp_name'] ?? null) ||
    !is_string($audio['name'] ?? null) ||
    !is_uploaded_file($audio['tmp_name'])
)) {
    http_response_code(400);
    exit('fail');
}

$text = $_GET['message'] ?? $argv[1] ?? 'Hello';

$text = base64_decode($text);

$disableNotification = (bool) ($_GET['disable_notification'] ?? true);

function formatTimestampInString(string $input) {
    return preg_replace_callback('/(\d{1,2}):(\d{2})/', function ($matches) {
        return str_pad($matches[1], 2, '0', STR_PAD_LEFT) . ':' . $matches[2] . ':00';
    }, $input);
}

if ($audio === null && ($_GET['extend_timestamps'] ?? false)) {
    $lines = explode("\n", $text);
    if (isset($lines[0])) $lines[0] .= ' лег';
    if (isset($lines[1])) $lines[1] .= ($lines[3] ?? false) ? ' закрыл глаза' : ' встал с кровати';
    if (strpos($text, 'budilnik') !== false) {
        if ($lines[4] ?? false) {
            $lines[2] .= ' встал с кровати';
            $lines[3] .= ' встал с кровати';
            $lines[4] = str_replace('budilnik', 'будильник', $lines[4]);
            $lines[4] = formatTimestampInString($lines[4]);
            if ($lines[3] > $lines[4]) {
                [$lines[3], $lines[4]] = [$lines[4], $lines[3]];
            }
        } elseif ($lines[3] ?? false) {
            $lines[2] .= ' встал с кровати';
            $lines[3] = str_replace('budilnik', 'будильник', $lines[3]);
            $lines[3] = formatTimestampInString($lines[3]);
            if ($lines[2] > $lines[3]) {
                [$lines[2], $lines[3]] = [$lines[3], $lines[2]];
            }
        } else {
            $lines[2] = str_replace('budilnik', 'будильник', $lines[2]);
            $lines[2] = formatTimestampInString($lines[2]);
            if ($lines[1] > $lines[2]) {
                [$lines[1], $lines[2]] = [$lines[2], $lines[1]];
            }
        }
        array_unshift($lines, implode('.', array_reverse(explode('-', mb_substr($lines[2], 0, 10)))));
    } elseif (isset($lines[2])) {
        $lines[2] .= ' встал с кровати';
        $lines[] = mb_substr($lines[2], 0, 10) . ' будильник';
        array_unshift($lines, implode('.', array_reverse(explode('-', mb_substr($lines[2], 0, 10)))));
    }
    $text = implode("\n", $lines);
}

$ch = curl_init();

curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
if ($audio !== null) {
    $audioPath = tempnam(sys_get_temp_dir(), 'puckfind-audio-');
    if ($audioPath === false) {
        http_response_code(500);
        exit('fail1');
    }
    register_shutdown_function(function () use ($audioPath) {
        if (is_file($audioPath)) unlink($audioPath);
    });

    if (!is_callable('exec')) {
        error_log('puckfind: PHP exec is unavailable for audio conversion');
        http_response_code(500);
        exit('fail2');
    }

    // Explicitly select MP3 because the temporary output has no file extension.
    // Boost the audio by 6 dB (approximately twice the amplitude).
    $command = 'ffmpeg -nostdin -hide_banner -loglevel error -y -i ' . escapeshellarg($audio['tmp_name'])
        . ' -map 0:a:0 -vn -af volume=6dB -c:a libmp3lame -ac 1 -ar 44100 -b:a 64k -f mp3 '
        . escapeshellarg($audioPath) . ' 2>&1';
    exec($command, $conversionOutput, $conversionStatus);
    if ($conversionStatus !== 0 || filesize($audioPath) === 0) {
        error_log('puckfind: audio conversion failed: ' . implode("\n", $conversionOutput));
        http_response_code(500);
        exit('fail3');
    }

    curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/$tgToken/sendAudio");
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'chat_id' => '85762097',
        'audio' => new CURLFile(
            $audioPath,
            'audio/mpeg',
            pathinfo(basename($audio['name']), PATHINFO_FILENAME) . '.mp3'
        ),
        'disable_notification' => $disableNotification ? 'true' : 'false',
    ]);
} else {
    curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/$tgToken/sendMessage");
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'chat_id' => '85762097',
        'text' => sprintf("<pre>%s</pre>", htmlspecialchars($text)),
        'parse_mode' => 'HTML',
        'disable_notification' => $disableNotification,
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
}

$result = curl_exec($ch);

curl_close($ch);

$isSuccess = $result !== false && strpos($result, '"ok":true') !== false;
echo $isSuccess ? 'ok' : 'fail';
