(function () {
    'use strict';

    angular
        .module('WeatherCheckup')
        .controller('WeatherListController', WeatherListController);

    WeatherListController.$inject = ['WeatherService', '$window'];

    /* @ngInject */
    function WeatherListController(WeatherService, $window) {
        var weatherListVM = this;
        weatherListVM.title = 'WeatherListController';

        weatherListVM.weatherZip = '';
        weatherListVM.weatherLocales = [];
        weatherListVM.zipCodePattern = new RegExp('^\d{5}');

        weatherListVM.getWeatherDataByZip = getWeatherDataByZip;
        weatherListVM.logChange = function(){console.log('changed zip code'); console.log(weatherListVM.weatherZip)};
        //------------

        activate();

        //////////////////////

        function activate() {
            //get weather by location initially if available
            if($window.navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position){
                    getWeatherDataByCoords(position.coords.latitude, position.coords.longitude);
                })
            }
        }

        function getWeatherDataByZip(){
            console.log(weatherListVM.weatherZip);
            WeatherService.getWeatherByZip({zipCode: weatherListVM.weatherZip}).$promise.then(function(res){
                weatherListVM.weatherLocales.push(res);
            }).catch(function(err){
                //TODO: Let the user know there was an error in UI
                console.log(err);
            });
        }

        function getWeatherDataByCoords(lat, long) {
            WeatherService.getWeatherByCoords({lat: lat, lon: long}).$promise.then(function(res){
                weatherListVM.weatherLocales.push(res);
            }).catch(function(err){
                //TODO: Let the user know there was an error in UI
                console.log(err);
            });
        }
    }

})();

