"use strict";


//MAPBOX API
mapboxgl.accessToken = MAP_BOX_KEY
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-98.4861, 29.4260], // starting position [lng, lat]
    zoom:10, // starting zoom
});

//Mapbox geocoder/search
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);

//Mapbox Marker


//OPENWEATHER API
let excludeList = "hourly,daily"

$.get("http://api.openweathermap.org/data/2.5/forecast", {
    lat:    29.493490,
    lon:   -98.499634,
    units: "imperial",
    APPID: OPEN_WEATHER_MAP_KEY
}).done(function(data) {
    $("#city").append(data.city.name);
    //get dates
    $("#date-1").html(convertDate(data.list[0].dt));
    $("#date-2").html(convertDate(data.list[8].dt));
    $("#date-3").html(convertDate(data.list[16].dt));
    $("#date-4").html(convertDate(data.list[24].dt));
    $("#date-5").html(convertDate(data.list[32].dt));
    //get temps
    $("#temp-1").html(data.list[0].main.temp.toFixed(1) + '&#8457');
    $("#temp-2").html(data.list[8].main.temp.toFixed(1) + '&#8457');
    $("#temp-3").html(data.list[16].main.temp.toFixed(1) + '&#8457');
    $("#temp-4").html(data.list[24].main.temp.toFixed(1) + '&#8457');
    $("#temp-5").html(data.list[32].main.temp.toFixed(1) + '&#8457');
    //get description
    $("#desc-1").html(`<strong>${capitalizeFirstLetter(data.list[0].weather[0].description)}</strong>`);
    $("#desc-2").html(`<strong>${capitalizeFirstLetter(data.list[8].weather[0].description)}</strong>`);
    $("#desc-3").html(`<strong>${capitalizeFirstLetter(data.list[16].weather[0].description)}</strong>`);
    $("#desc-4").html(`<strong>${capitalizeFirstLetter(data.list[24].weather[0].description)}</strong>`);
    $("#desc-5").html(`<strong>${capitalizeFirstLetter(data.list[32].weather[0].description)}</strong>`);
    //get humidity
    $("#hum-1").append(`<strong>${data.list[0].main.humidity}%</strong>`);
    $("#hum-2").append(`<strong>${data.list[8].main.humidity}%</strong>`);
    $("#hum-3").append(`<strong>${data.list[16].main.humidity}%</strong>`);
    $("#hum-4").append(`<strong>${data.list[24].main.humidity}%</strong>`);
    $("#hum-5").append(`<strong>${data.list[32].main.humidity}%</strong>`);
    //get wind
    $("#wind-1").append(`<strong>${data.list[0].wind.speed}</strong> mph`);
    $("#wind-2").append(`<strong>${data.list[8].wind.speed}</strong> mph`);
    $("#wind-3").append(`<strong>${data.list[16].wind.speed}</strong> mph`);
    $("#wind-4").append(`<strong>${data.list[24].wind.speed}</strong> mph`);
    $("#wind-5").append(`<strong>${data.list[32].wind.speed}</strong> mph`);
    //get pressure
    $("#pres-1").append(`<strong>${baroPressure(data.list[0].main.pressure).toFixed(2)}</strong> inHg`);
    $("#pres-2").append(`<strong>${baroPressure(data.list[8].main.pressure).toFixed(2)}</strong> inHg`);
    $("#pres-3").append(`<strong>${baroPressure(data.list[16].main.pressure).toFixed(2)}</strong> inHg`);
    $("#pres-4").append(`<strong>${baroPressure(data.list[24].main.pressure).toFixed(2)}</strong> inHg`);
    $("#pres-5").append(`<strong>${baroPressure(data.list[32].main.pressure).toFixed(2)}</strong> inHg`);

    console.log('5 day forecast', data);
});

//convert hectopascals to inch of mercury | hPa -> inHg
function baroPressure(pressure) {
    const inchOfMercuryPerHectopascal = 0.02952998597817832;
    let barometricPressure = pressure * inchOfMercuryPerHectopascal;
    return barometricPressure;
}

//convert timestamp to new date format
function convertDate(dt){
    var a = new Date(dt * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var day = days[a.getDay()];
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = day + '<br>' + ' ' + month + ' ' + date;
    return time;
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}