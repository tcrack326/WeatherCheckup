(function (){
  'use strict'

  angular
      .module('WeatherCheckup', ['ngResource', 'ngMessages', 'ui.router'])

      .config(function($stateProvider, $urlRouterProvider, $httpProvider){

        $httpProvider.defaults.useXDomain = true;
        $urlRouterProvider.when('/', ['$state','$match', function ($state, $match) {
          $state.go('default');
        }]);
        $urlRouterProvider.when('/#', ['$state','$match', function ($state, $match) {
          $state.go('default');
        }]);
        $urlRouterProvider.otherwise('/');

          $stateProvider
                  .state('default', {
                      url: '/',
                      templateUrl: '../WeatherList.html',
                      controller: 'WeatherListController',
                      controllerAs: 'weatherListVM',
                      "data": {
                          "pageTitle" : 'WeatherList'
                      }
                  });

          $stateProvider
              .state('detail', {
                  url: '/weatherdetail',
                  templateUrl: '../WeatherDetail.html',
                  controller: 'WeatherDetailController',
                  controllerAs: 'weatherDetailVM',
                  params: {
                      locale: null
                  },
                  "data": {
                      "pageTitle" : 'WeatherDetail'
                  }
              });
      })
})();