'use strict';

angular.module('d3-uml-modeler.uml-workspace')
	.controller('WorkspaceController', [
		"$scope", "_", "Notifications", "WorkspaceModel", "Constants", "UmlController",
		function($scope, _, Notifications, WorkspaceModel, Constants, UmlController)
		{
			var WorkspaceController = UmlController.extend(
			{
				model: null,

				init: function($scope)
				{
					this.model = new WorkspaceModel();

					UmlController.prototype.init.call(this, $scope, Notifications);

					this.$scope.model = angular.bind(this, this.model);
					this.$scope.diagrams = angular.bind(this, this.model.children);
				},

				/**
				 * initialize the scope data.
				 */
				initScope : function()
				{
					this.$scope.diagrams = angular.bind(this, this.model.children);

					//for the tree
					this.$scope.children = angular.bind(this, this.model.children);
				},

				initListeners : function()
				{
					this.notifications.addEventListener(Constants.DIAGRAM.EVENTS.ADD, this.addDiagram, this);
				},

				/**
				 * This function is called during the creation of the controller
				 * by the workspace controller in order to pass the recently created
				 * model diagram in parameters, so the diagram controller can know
				 * what model diagram he's dealing with.
				 */
				addDiagram : function(elementType)
				{
					//an adapter method to addElement.
					this.model.addDiagram(elementType);
				}

			});

			return new WorkspaceController($scope, _, Notifications, WorkspaceModel, Constants);
		}]);


