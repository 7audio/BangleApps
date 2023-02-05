<?php

header('Content-type: application/json; charset=utf-8');

function fetchAQI()
{
    $aqiStatuses = "0-50\tGood\n51-100\tModerate\n101-150\tUnhealthy for Sensitive\n151-200\tUnhealthy\n201-300\tVery Unhealthy\n300-999999\tHazardous";
    $aqiData = json_decode(file_get_contents("https://api.waqi.info/feed/@1861/?token=baf1c562ecda746eff772626b2ed246e8a66ffa3"), true);
    $readableStatus = explode("\n", $aqiStatuses)[array_search(true, array_map(function ($statusLine) use ($aqiData) {
        $aqiRange = explode("-", explode("\t", $statusLine)[0]);
        return $aqiData["data"]["aqi"] >= $aqiRange[0] && $aqiData["data"]["aqi"] <= $aqiRange[1];
    }, explode("\n", $aqiStatuses)))];
    return [
        "PM2.5" => $aqiData["data"]["iaqi"]["pm25"]["v"],
        "Level" => explode("\t", $readableStatus)[1],
    ];
}

function fetchTemperature()
{
    $weatherData = json_decode(file_get_contents("https://api.open-meteo.com/v1/forecast?latitude=13.75&longitude=100.50&current_weather=true"), true);
    return [
        'T' => $weatherData["current_weather"]["temperature"] . '°C',
        'Wind' => $weatherData["current_weather"]["windspeed"] . " m/s, " . $weatherData["current_weather"]["winddirection"] . "°",
    ];
}

function fetchWeight()
{
    $weightData = file_get_contents("https://docs.google.com/spreadsheets/d/e/2PACX-1vQiMaFZGokrosoi1naM2WQgYB5mAMU7x3Jtf0obXSgQFstkQDKLYhcEI98XV-hH4e7UgHBieH4C6BZ-/pub?gid=0&single=true&output=csv");
    $weightData = explode("\n", $weightData);
    $weightData = explode(",", $weightData[count($weightData) - 1]);
    return [
        'Weight' => sprintf("%s (%s)", trim($weightData[count($weightData) - 1]), $weightData[0]),
    ];
}

$data = fetchAQI() + fetchTemperature() + fetchWeight();

echo json_encode($data, JSON_PRETTY_PRINT + JSON_UNESCAPED_UNICODE);
