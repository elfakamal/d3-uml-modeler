"use strict";

angular.module("d3-uml-modeler.base")
	.factory("BaseDirective", ["BaseController", function(BaseController) {
		return BaseController.extend({

			$element: null,
			$attributes: null,
			view: null,

			init: function($scope, $element, $attrs)
			{
				BaseController.prototype.init.call(this, $scope);

				this.$element = $element;
				this.$attributes = $attrs;
			}

		});
	}]);