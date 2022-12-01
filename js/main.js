"use strict";


//MAPBOX API
mapboxgl.accessToken = MAP_BOX_KEY
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-98.4861, 29.4260], // starting position [lng, lat]
    zoom:10, // starting zoom
});


//OPENWEATHER API
let excludeList = "hourly,daily"

$.get("http://api.openweathermap.org/data/2.5/forecast", {
    lat:    29.493490,
    lon:   -98.499634,
    units: "imperial",
    APPID: OPEN_WEATHER_MAP_KEY
}).done(function(data) {
    $("#city").append(data.city.name);
    $("#date-1").text(data.list[0].dt);
    console.log('5 day forecast', data);
});

function convertDate(dt){
    var a = new Date(dt * 1000).toLocaleTimeString("en-US");
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}