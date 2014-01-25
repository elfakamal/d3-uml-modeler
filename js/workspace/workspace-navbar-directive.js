'use strict';

// /* Directives */
angular.module('d3-uml-modeler.uml-workspace')
	.directive('workspaceNavbar', [function() {
		return {
			restrict: "E",
			replace: true,
			templateUrl: "views/workspace-navbar.html"
		};
	}]);

