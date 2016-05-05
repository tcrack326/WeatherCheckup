(function () {
    'use strict';

    angular
        .module('WeatherCheckup')
        .factory('WeatherService', WeatherService);

    WeatherService.$inject = ['$resource'];

    /* @ngInject */
    function WeatherService($resource) {
        var weatherAPIKey = '404e3a9ab5c7953095e9cf73c74293f9';

        var getWeatherByZip = {
            method: 'GET',
            url: 'http://api.openweathermap.org/data/2.5/weather?zip=:zipCode,us&appid=' + weatherAPIKey + '&units=imperial',
            headers: {
                'Accept': 'application/json'
            }
        };

        var getWeatherByCoords = {
            method: 'GET',
            url:  'http://api.openweathermap.org/data/2.5/weather?lat=:lat&lon=:lon&appid=' + weatherAPIKey + '&units=imperial',
            headers: {
                'Accept': 'application/json'
            }
        };

        return $resource('http://api.openweathermap.org/data/2.5/weather', {zipCode: '@zipCode', lat: '@lat', lon: '@lon'}, {
            getWeatherByZip: getWeatherByZip,
            getWeatherByCoords: getWeatherByCoords
        });
    }
})();

