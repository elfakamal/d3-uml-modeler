"use strict";

angular.module("d3-uml-modeler.uml-property")
	.factory("PropertyDirective", [
		"BaseDirective", "Constants", "Notifications",
		function(BaseDirective, Constants, Notifications)
		{
			return BaseDirective.extend(
			{
				init:function($scope, $element, $attributes)
				{
					BaseDirective.prototype.init.call(this, $scope, $element, $attributes);
				},

				draw: function()
				{

				}
			});
		}]
	);


/* Directives */
angular.module('d3-uml-modeler.uml-property')
	.directive('property',[
	function() {
		return {

			// scope: {
			// 	guid: "@",
			// 	coco: "@elementType",
			// 	name: "="
			// },
			// replace: true,
			// restrict: "E",

			templateUrl: "views/property.html",

			link: function($scope, $element, $attributes)
			{
				// new PropertyDirective($scope, $element, $attributes);
			}

		};
	}]);

