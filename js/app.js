'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('d3-uml-modeler', [
	'ngRoute',
	'firebase',

	'd3-uml-modeler.underscore',

	'd3-uml-modeler.uml-abstract-factory',
	'd3-uml-modeler.base',
	'd3-uml-modeler.notifications',
	'd3-uml-modeler.constants',


	'd3-uml-modeler.view',
	'd3-uml-modeler.filters',
	'd3-uml-modeler.services',
	'd3-uml-modeler.directives',
	'd3-uml-modeler.uml-diagram',
	'd3-uml-modeler.uml-classifier',
	'd3-uml-modeler.uml-property',
	'd3-uml-modeler.uml-workspace',

	'd3-uml-modeler.editor',

	'd3-uml-modeler.menu',
	'd3-uml-modeler.login',
	'd3-uml-modeler.element-list',
	'd3-uml-modeler.run'
]);


app.config(['$routeProvider', function($routeProvider)
{
	$routeProvider.when('/home', {
		templateUrl: 'views/main.html'
	});

	$routeProvider.when('/add-diagram', {
		templateUrl: 'views/add-diagram.html',
		controller: 'AddDiagram'
	});

	$routeProvider.otherwise({
		redirectTo: '/home'
	});

}]);

angular.module('d3-uml-modeler.run').run(function(){

});
