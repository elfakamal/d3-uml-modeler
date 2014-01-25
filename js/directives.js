'use strict';

// /* Directives */
var app = angular.module('d3-uml-modeler.directives', []);

app.directive('umlComponent', function() {
	return {
		templateUrl: function(scope, attributes) {
			return "views/" + attributes["umlComponent"] + ".html";
		}
	};
});

app.directive('workspace', function() {
	return {
		restrict: "E",
		templateUrl: "views/workspace.html",
		link: function($scope,$elm,$attrs)
		{
			//new Lol($scope,$elm);
		}
	};
});

app.directive('classDiagram', function()
{
	return {
		require: "?umlComponent",
		templateUrl: "views/class-diagram.html"
	};
});


