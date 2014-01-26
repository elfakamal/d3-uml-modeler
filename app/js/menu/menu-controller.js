'use strict';

var app = angular.module('d3-uml-modeler.menu');

app.controller('MenuCtrl', ['$scope', function ($scope)
{
	$scope.items = [
		{name: "Undo",link: "#"},
		{name: "Redo",link: "#"}
	];
}]);
