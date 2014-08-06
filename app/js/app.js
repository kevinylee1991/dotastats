'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/',
		{
			templateUrl: 'partials/home.html',
			controller: 'HomeController'
		});
	$routeProvider.when('/player/:playerId',
		{
			templateUrl: 'partials/stats.html', 
			controller: 'StatsController'
		});
	$routeProvider.when('/login',
		{
			templateUrl: 'partials/login.html',
			controller: 'LoginController'
		});
	$routeProvider.when('/match/:matchId',
        {
            templateUrl: 'partials/match.html',
            controller: 'MatchController'
        });
	$routeProvider.otherwise({redirectTo: '/'});
}]);
