"use strict";

angular.module("d3-uml-modeler.uml-property")
	.factory("PropertyDirective", [
		"PropertyView", "BaseDirective", "Constants", "Notifications",
		function(PropertyView, BaseDirective, Constants, Notifications)
		{
			return BaseDirective.extend(
			{
				init:function($scope, $element, $attributes)
				{
					BaseDirective.prototype.init.call(this, $scope, $element, $attributes);
					this.draw();
				},

				draw: function()
				{
					var config = {
						width : 200,
						height : 200,
						titleHeight : 40
					};

					console.log("PropertyDirective::draw");
					this.view = new PropertyView(this.$scope, this.$element[0], config);
					this.view.render();
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

