"use strict";

//get current time
setInterval( function () {
    const dt = new Date().toString().slice(0,25);
    $("#timer-2").html(dt);
}, 1000)

function changeToTimezone(dt, tz) {
    return new Date((dt * 1000 - (tz * 1000))).toString().slice(4,33)
}

//MAPBOX API
mapboxgl.accessToken = MAP_BOX_KEY
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-98.4861, 29.4260], // starting position [lng, lat]
    zoom:10, // starting zoom
});

map.on('load', function () {
    // Mapbox Marker
    const marker = new mapboxgl.Marker({
        draggable: true
    })
        .setLngLat([-98.4861, 29.4260])
        .addTo(map);

    //Mapbox geocoder/search
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false
    })

    map.addControl(
        geocoder
    );

    function onDragEnd(i) {
        const lngLat = marker.getLngLat();
        let arr = []
        arr.push(lngLat.lng, lngLat.lat)
        return arr[i]
    }

    geocoder.on('result', function (e) {
        marker.setLngLat(e.result.center);
        getWeather();
        $(".mapboxgl-ctrl-geocoder--input").val('');
    })
    marker.on('dragend', onDragEnd);
    marker.on('dragend', getWeather);
    marker.on('dragend', getCurrentWeather);
    getWeather(); //get weather on page load
    getCurrentWeather()

    function getCurrentWeather() {
        $.get("http://api.openweathermap.org/data/2.5/weather", {
            lat: onDragEnd(1),
            lon: onDragEnd(0),
            APPID: OPEN_WEATHER_MAP_KEY
        }).done(function (data) {
            //get time
            $("#timer").html(`Weather Data last accessed: ${changeToTimezone(data.dt, data.timezone)}`);
            console.log('current weather', data);
        });
    }

    //OPENWEATHER API
    function getWeather() {
        $.get("http://api.openweathermap.org/data/2.5/forecast", {
            lat: onDragEnd(1),
            lon: onDragEnd(0),
            units: "imperial",
            APPID: OPEN_WEATHER_MAP_KEY
        }).done(function (data) {
            //get city
            $("#city").html(`Current City: ${data.city.name}`);
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
            $("#hum-1").html(`Humidity: <strong>${data.list[0].main.humidity}%</strong>`);
            $("#hum-2").html(`Humidity: <strong>${data.list[8].main.humidity}%</strong>`);
            $("#hum-3").html(`Humidity: <strong>${data.list[16].main.humidity}%</strong>`);
            $("#hum-4").html(`Humidity: <strong>${data.list[24].main.humidity}%</strong>`);
            $("#hum-5").html(`Humidity: <strong>${data.list[32].main.humidity}%</strong>`);
            //get wind
            $("#wind-1").html(`Wind: <strong>${data.list[0].wind.speed}</strong> mph`);
            $("#wind-2").html(`Wind: <strong>${data.list[8].wind.speed}</strong> mph`);
            $("#wind-3").html(`Wind: <strong>${data.list[16].wind.speed}</strong> mph`);
            $("#wind-4").html(`Wind: <strong>${data.list[24].wind.speed}</strong> mph`);
            $("#wind-5").html(`Wind: <strong>${data.list[32].wind.speed}</strong> mph`);
            //get pressure
            $("#pres-1").html(`Barometer: <strong>${baroPressure(data.list[0].main.pressure).toFixed(2)}</strong> inHg`);
            $("#pres-2").html(`Barometer: <strong>${baroPressure(data.list[8].main.pressure).toFixed(2)}</strong> inHg`);
            $("#pres-3").html(`Barometer: <strong>${baroPressure(data.list[16].main.pressure).toFixed(2)}</strong> inHg`);
            $("#pres-4").html(`Barometer: <strong>${baroPressure(data.list[24].main.pressure).toFixed(2)}</strong> inHg`);
            $("#pres-5").html(`Barometer: <strong>${baroPressure(data.list[32].main.pressure).toFixed(2)}</strong> inHg`);

            console.log('5 day forecast', data);
        });
    }
});

//convert hectopascals to inch of mercury | hPa -> inHg
function baroPressure(pressure) {
    const inchOfMercuryPerHectopascal = 0.02952998597817832;
    return pressure * inchOfMercuryPerHectopascal;
}

//convert timestamp to new date format
function convertDate(dt) {
    var a = new Date(dt * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var day = days[a.getDay()];
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = day + '<br>' + ' ' + month + ' ' + date;
    return time;
}
//Capitalize first letter of a string
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}