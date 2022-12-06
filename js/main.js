"use strict";

$(function () {
    //VARIABLES
    //MAPBOX API
    mapboxgl.accessToken = MAP_BOX_KEY
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/sb-son/clb9jshhj000215oysby033kj', // style URL
        color: '#315b7d',
        projection: 'mercator',
        center: [-98.4861, 29.4260], // starting position [lng, lat]
        zoom: 7.15 // starting zoom
    });
    // Mapbox Marker
    const marker = new mapboxgl.Marker({
        color: '#006AFF',
        draggable: true
    })
        .setLngLat([-98.4861, 29.4260])
        .addTo(map);
    //Mapbox geocoder/search
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false
    });
    const markerHeight = 50;
    const markerRadius = 10;
    const linearOffset = 25;
    const popupOffsets = {
        'top': [0, 0],
        'top-left': [0, 0],
        'top-right': [0, 0],
        'bottom': [0, -markerHeight],
        'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'left': [markerRadius, (markerHeight - markerRadius) * -1],
        'right': [-markerRadius, (markerHeight - markerRadius) * -1]
    };
    //popup
    const popup = new mapboxgl.Popup({
        closeButton: false,
        offset: popupOffsets
    })

    map.on('load', function () {
        //get weather on page load
        getCurrentWeather();
        getWeather();

        //CONTROLS
        map.addControl( //geocoder | search bar
            geocoder
        );
        map.addControl(new mapboxgl.NavigationControl()); //Navigation '+' & '-' zoom buttons
        map.addControl(new mapboxgl.FullscreenControl()); //Fullscreen button

        //EVENTS
        map.on('click', function (e) {
            marker.setLngLat(e.lngLat);
            map.flyTo({
                center: [onDragEnd(0), onDragEnd(1)],
                essential: true,
                duration: 800
            })
            getCurrentWeather();
            getWeather();
        })

        geocoder.on('result', function (e) {
            marker.setLngLat(e.result.center);
            map.flyTo({
                center: [onDragEnd(0), onDragEnd(1)],
                essential: true,
                duration: 850
            })
            getCurrentWeather();
            getWeather();
            $(".mapboxgl-ctrl-geocoder--input").val('');
        })

        marker.on('dragend', function () {
            map.flyTo({
                center: [onDragEnd(0), onDragEnd(1)],
                essential: true,
                duration: 800
            })
            onDragEnd();
            getCurrentWeather();
            getWeather();
        })
    });

    //gets coordinates
    function onDragEnd(i) {
        const lngLat = marker.getLngLat();
        let arr = []
        arr.push(lngLat.lng, lngLat.lat)
        return arr[i]
    }

    //OPENWEATHER API
    function getCurrentWeather() {
        $.get("http://api.openweathermap.org/data/2.5/weather", {
            lat: onDragEnd(1),
            lon: onDragEnd(0),
            units: 'imperial',
            APPID: OPEN_WEATHER_MAP_KEY
        }).done(function (data) {
            let weatherIcon = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
            //popup
                popup.setLngLat([onDragEnd(0), onDragEnd(1)])
                .setHTML(`<div class="card row text-center container-fluid p-0 m-auto">
                <h4 class='card-header p-0 cards' id='date-current'>${convertDate(data.dt)}</h4>
                <ul class="list-group list-group-flush p-0 popup-bg">
                        <li class="list-group-item p-0 popup-bg" id="temp-current"><strong>${data.main.temp.toFixed(1)}</strong>&#8457</li>
                        <li class="list-group-item p-0 popup-bg" id="desc-current"><strong>${capitalizeFirstLetter(data.weather[0].description)}</strong><img src=${weatherIcon} style="height: 50px; width: 50px;"></li>
                        <li class="list-group-item p-0 popup-bg" id="hum-current">Humidity: <strong>${data.main.humidity}%</strong></li>
                        <li class="list-group-item p-0 popup-bg" id="wind-current">Wind: <strong>${data.wind.speed}</strong> mph</li>
                        <li class="list-group-item p-0 popup-bg" id="pres-current">Barometer: <strong>${baroPressure(data.main.pressure).toFixed(2)}</strong> inHg</li>
                </ul>`)
                .addTo(map)

            //get city
            $("#city").html(`Current City: ${data.name}`);
            $("#h-item-1").html(`Current: ${data.name} <strong>${data.main.temp.toFixed(1)}</strong>&#8457 <strong>${capitalizeFirstLetter(data.weather[0].description)}</strong>, <strong>${data.main.humidity}%</strong> humidity, <strong>${data.wind.speed}</strong> mph winds`)
            //get time
            $("#timer").html(`Weather Data last accessed: ${changeToTimezone(data.dt, data.timezone)}`);
            //get date
            $("#date-current").html(convertDate(data.dt))
            //get temp
            $("#temp-current").html(`<strong>${data.main.temp.toFixed(1)}</strong>&#8457`)
            //get description
            $("#desc-current").html(`<strong>${capitalizeFirstLetter(data.weather[0].description)}</strong><img src=${weatherIcon} style="height: 50px; width: 50px; position: relative">`);
            //get humidity
            $("#hum-current").html(`Humidity: <strong>${data.main.humidity}%</strong>`);
            //get wind
            $("#wind-current").html(`Wind: <strong>${data.wind.speed}</strong> mph`);
            //get pressure
            $("#pres-current").html(`Barometer: <strong>${baroPressure(data.main.pressure).toFixed(2)}</strong> inHg`);
        });
    }


    //FUNCTIONS
    function getWeather() {
        $.get("http://api.openweathermap.org/data/2.5/forecast", {
            lat: onDragEnd(1),
            lon: onDragEnd(0),
            units: "imperial",
            APPID: OPEN_WEATHER_MAP_KEY
        }).done(function (data) {
            function weatherIndex(i) {
                return "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png"
            }
            //get city
            $("#city").html(`Current City: ${data.city.name}`);
            $("#h-item-2").html(`Tomorrow: ${data.city.name} <strong>${data.list[0].main.temp.toFixed(1)}</strong>&#8457 <strong>${capitalizeFirstLetter(data.list[0].weather[0].description)}</strong>, <strong>${data.list[0].main.humidity}%</strong> humidity, <strong>${data.list[0].wind.speed}</strong> mph winds`)
            //get dates
            $("#date-1").html(convertDate(data.list[0].dt));
            $("#date-2").html(convertDate(data.list[8].dt));
            $("#date-3").html(convertDate(data.list[16].dt));
            $("#date-4").html(convertDate(data.list[24].dt));
            $("#date-5").html(convertDate(data.list[32].dt));
            //get temps
            $("#temp-1").html(`<strong>${data.list[0].main.temp.toFixed(1)}</strong>&#8457`);
            $("#temp-2").html(`<strong>${data.list[8].main.temp.toFixed(1)}</strong>&#8457`);
            $("#temp-3").html(`<strong>${data.list[16].main.temp.toFixed(1)}</strong>&#8457`);
            $("#temp-4").html(`<strong>${data.list[24].main.temp.toFixed(1)}</strong>&#8457`);
            $("#temp-5").html(`<strong>${data.list[32].main.temp.toFixed(1)}</strong>&#8457`);
            //get description
            $("#desc-1").html(`<strong>${capitalizeFirstLetter(data.list[0].weather[0].description)}</strong><img src=${weatherIndex(0)} style="height: 50px; width: 50px">`);
            $("#desc-2").html(`<strong>${capitalizeFirstLetter(data.list[8].weather[0].description)}</strong><img src=${weatherIndex(8)} style="height: 50px; width: 50px">`);
            $("#desc-3").html(`<strong>${capitalizeFirstLetter(data.list[16].weather[0].description)}</strong><img src=${weatherIndex(16)} style="height: 50px; width: 50px">`);
            $("#desc-4").html(`<strong>${capitalizeFirstLetter(data.list[24].weather[0].description)}</strong><img src=${weatherIndex(24)} style="height: 50px; width: 50px">`);
            $("#desc-5").html(`<strong>${capitalizeFirstLetter(data.list[32].weather[0].description)}</strong><img src=${weatherIndex(32)} style="height: 50px; width: 50px">`);
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
        });
    }
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

    //get current time
    setInterval( function () {
        const dt = new Date().toString().slice(0,25);
        $("#timer-2").html(dt);
    }, 1000)

    function changeToTimezone(dt, tz) {
        return new Date((dt * 1000) + (tz * 1000)).toUTCString().toString().slice(0, 26)
    }
});