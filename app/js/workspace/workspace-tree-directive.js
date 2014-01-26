"use strict";


angular.module('d3-uml-modeler.uml-workspace')
	.directive('workspaceTreeItem', ["$compile",
	function($compile) {
		return {

			restrict: "E",
			replace: true,
			templateUrl: "views/workspace-tree-item.html",

			link: function($scope, $element, $attributes)
			{
				var childrenDirectives = angular.element('<workspace-tree-item ng-repeat="model in model.children"></workspace-tree-item>');
				var compiledTemplate = $compile(childrenDirectives)($scope);
				var childrenContainer = $element.find('.dd-list')[0];

				$(childrenContainer).append(compiledTemplate);

				$('.dd').nestable();
			}
		};
	}]);


angular.module('d3-uml-modeler.uml-workspace')
	.directive('workspaceTree', ["Firebase",
	function(Firebase) {
		return {

			restrict: "E",
			replace: true,
			templateUrl: "views/workspace-tree.html",

			link: function($scope, $element, $attributes)
			{
				// var dataRef = new Firebase('https://modeler.firebaseIO.com/users');

				// dataRef.on('value', function(snapshot) {
				//   alert('fred’s first name is ' + snapshot.val());
				// });
			}

		};
	}]);

