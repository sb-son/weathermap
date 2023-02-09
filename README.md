# weathermap
Weather Map is an application that provides current weather conditions and a five-day forecast for any location. It uses HTML, CSS, jQuery, AJAX, and APIs from OpenWeatherMap and Mapbox to create an interactive weather experience. The application includes a map view and a location search feature, making it easy for users to stay updated on weather conditions.

## Prerequisites
- API key for OpenWeatherMap API
- API key for Mapbox API

## Getting Started
1. Create a keys.js file in the js directory to store your api keys
2. Create variables for your api keys: 
  - **const OPEN_WEATHER_MAP_KEY = 'YOUR_API_KEY_GOES_HERE'**
  - **const MAP_BOX_KEY = 'YOUR_API_KEY_GOES_HERE'**
3. The starting point is set in the defaultLocation function of main.js - change the city, lat and lng values to change it to the location of your choice.

## Features
- Search for any location
- Click anywhere on the map
- Drag the marker and drop on a location
- Click the favorite button to mark your favorite location (This persists the current location in local storage)

## In progress
- Expanding favorite location features
- Styling the favorite button

## Built With
- HTML
- CSS
- Javascript
- jQuery
- AJAX
- Bootstrap 5
- OpenWeatherMap API
- Mapbox API
