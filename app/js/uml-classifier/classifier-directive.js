"use strict";

angular.module("d3-uml-modeler.uml-classifier")
	.factory("ClassifierDirective", [
		"ClassifierView", "BaseDirective", "Constants", "Notifications",
		function(ClassifierView, BaseDirective, Constants, Notifications)
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
						width : Constants.CLASSIFIER.VIEW.DEFAULT_WIDTH,
						height : Constants.CLASSIFIER.VIEW.DEFAULT_HEIGHT,
						titleHeight : Constants.CLASSIFIER.VIEW.TITLE_HEIGHT
					};

					console.log("ClassifierDirective::draw");
					this.view = new ClassifierView(this.$scope, this.$element[0], config);
					this.view.render();
				}
			});
		}]
	);

/* Directives */
angular.module('d3-uml-modeler.uml-classifier')
	.directive('classifier', ["ClassifierDirective",
	function(ClassifierDirective) {
		return {

			// require: "^classifierEditor",
			restrict: "A",
			//replace: true,
			//templateUrl: "views/classifier.html",

			link: function($scope, $element, $attributes)
			{
				new ClassifierDirective($scope, $element, $attributes);
			}

		};
	}]);

