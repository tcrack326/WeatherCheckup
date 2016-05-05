(function () {
    'use strict';

    angular
        .module('WeatherCheckup')
        .controller('WeatherDetailController', WeatherDetailController);

    WeatherDetailController.$inject = ['$stateParams'];

    /* @ngInject */
    function WeatherDetailController($stateParams) {
        var weatherDetailVM = this;
        weatherDetailVM.title = 'WeatherDetailController';

       weatherDetailVM.locale = $stateParams.locale;
        //---------------

        activate();

        //////////////////////

        function activate() {
            console.log(weatherDetailVM.locale);
        }
    }

})();

