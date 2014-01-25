'use strict';

angular.module("d3-uml-modeler.element-list")
.controller("ElementListController", [
	"$scope", "_", "Notifications", "ElementList", "Constants", "UmlController",
	function($scope, _, Notifications, ElementList, Constants, UmlController)
	{
		var ElementListController = UmlController.extend(
		{
			/**
			 * List of the Uml Elements that can be added to the workspace or the diagram.
			 */
			elementList: null,

			init: function($scope, _, Notifications, ElementList, Constants)
			{
				this.elementList = ElementList;

				/**
				 * initialize the scope data.
				 */
				this.initScope = function()
				{
					this.$scope.children = _.sortBy(_.values(this.elementList.children), "index", this);
					this.$scope.addElementClick = angular.bind(this, this.addElementClick);
				};

				/**
				 * this functiontrigger an event based on what element have been clicked
				 * on the view.
				 */
				this.addElementClick = function(elementListItem)
				{
					if(typeof elementListItem === "undefined" || elementListItem === null)
						throw new Error("ElementListController::addElementClick => Element is undefined");

					//loop through categories to implicitly treat each one.
					var categories = [Constants.DIAGRAM, Constants.CLASSIFIER, Constants.ASSOCIATION];

					_.each(categories, function(category)
					{
						//this event is triggered to the workspace or the diagram controller,
						//based on element type.
						if(_.values(category.TYPES).indexOf(elementListItem.type) >= 0)
							this.notifications.notify(category.EVENTS.ADD, elementListItem.type);

					}, this);
				};

				/**
				 * this have to be the last thing to do in the constructor.
				 */
				UmlController.prototype.init.call(this, $scope, Notifications);

				/**
				 * If there is something to do with the Notifications object,
				 * it needs to be done Here (after call of the super constructor).
				 */
			}
		});

		return new ElementListController($scope, _, Notifications, ElementList, Constants);

	}
]);
