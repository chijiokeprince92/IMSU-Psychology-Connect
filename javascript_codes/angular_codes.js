var app = angular.module('prince', ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'homefile/angularhome.hbs'
        })
        .when('/defaultnews', {
            templateurl: 'homefile/angularnews.hbs'
        })
        .when('/aboutus', {
            templateUrl: 'homefile/angularaboutus.hbs'
        });
});