<?php

header('Content-type: application/json; charset=utf-8');

/**
 * Returns the JSON produced by $build, cached in a temp file for $ttl seconds.
 * $build returns the JSON string, or false on failure (nothing is cached then,
 * and the last good cache is served if there is one).
 */
function cached(int $ttl, callable $build): string
{
    $file = sys_get_temp_dir() . '/bangle-backend.cache.json';

    if (is_file($file) && time() - filemtime($file) < $ttl) {
        return file_get_contents($file);
    }

    $json = $build();
    if ($json === false) {
        if (is_file($file)) {
            return file_get_contents($file);
        }
        http_response_code(500);
        return json_encode(['err' => json_last_error_msg()]);
    }

    // write atomically so concurrent requests never read a half-written file
    $tmp = tempnam(dirname($file), 'bangle');
    if ($tmp !== false && file_put_contents($tmp, $json) !== false) {
        rename($tmp, $file);
    }
    return $json;
}

function fetchAQI()
{
    $aqiStatuses = "0-50\tGood\n51-100\tModerate\n101-150\tUnhealthy for Sensitive\n151-200\tUnhealthy\n201-300\tVery Unhealthy\n300-999999\tHazardous";
    $aqiLocations = [
        'Din Daeng' => '@1861',
        'Kashirskoye shosse' => 'A194614',
        'Pranangklao' => 'A419596',
        'SPb Lesnaya' => 'A230920',
    ];
    $aqiDataLocation = $aqiLocations['SPb Lesnaya'];
    $aqiData = json_decode(file_get_contents("https://api.waqi.info/feed/{$aqiDataLocation}/?token=baf1c562ecda746eff772626b2ed246e8a66ffa3"), true);
    $readableStatus = explode("\n", $aqiStatuses)[array_search(true, array_map(function ($statusLine) use ($aqiData) {
        $aqiRange = explode("-", explode("\t", $statusLine)[0]);
        return $aqiData["data"]["aqi"] >= $aqiRange[0] && $aqiData["data"]["aqi"] <= $aqiRange[1];
    }, explode("\n", $aqiStatuses)))];
    return [
        'aqi' => sprintf("PM2.5: %s (%s)", $aqiData["data"]["iaqi"]["pm25"]["v"], explode("\t", $readableStatus)[1]),
    ];
}

function fetchTemperature()
{
    $latLngs = [
        'BKK' => 'latitude=13.75&longitude=100.50',
        'Moscow' => 'latitude=55.7522&longitude=37.6156',
        'SPb Lesnaya' => 'latitude=59.9492&longitude=30.3489',
    ];
    $weatherDataLocation = $latLngs['SPb Lesnaya'];
    $weatherData = json_decode(file_get_contents("https://api.open-meteo.com/v1/forecast?{$weatherDataLocation}&current_weather=true"), true);
    return [
        'w' => sprintf(
            "T:%s°C W:%sm/s %s°",
            $weatherData["current_weather"]["temperature"],
            $weatherData["current_weather"]["windspeed"],
            $weatherData["current_weather"]["winddirection"]
        ),
    ];
}

function fetchWeight()
{
    $weightData = file_get_contents("https://docs.google.com/spreadsheets/d/e/2PACX-1vQiMaFZGokrosoi1naM2WQgYB5mAMU7x3Jtf0obXSgQFstkQDKLYhcEI98XV-hH4e7UgHBieH4C6BZ-/pub?gid=0&single=true&output=csv");
    $weightData = explode("\n", $weightData);
    $weightData = explode(",", $weightData[count($weightData) - 1]);
    return [
        'Weight' => sprintf("%s (%s)", trim($weightData[1]), $weightData[0]),
    ];
}

function fetchPixlDashboard()
{
    $result = trim(file_get_contents('https://legift.ru/pixl-backend.php'));
    $result = str_replace([
        '🌳', '☁️', '🍸',
    ], [
        'W', 'T', 'A',
    ], $result);
    return ['Quit' => $result];
}

echo cached(30 * 60, function () {
    $data = fetchAQI()
        + fetchTemperature()
        + fetchWeight()
        + fetchPixlDashboard()
        + ['updated' => (new DateTime("now", new DateTimeZone('Europe/Moscow')))->format('H:i:s')];

    return json_encode($data, JSON_PRETTY_PRINT + JSON_UNESCAPED_UNICODE);
});
