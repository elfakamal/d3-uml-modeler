'use strict';

/**
 *
 * @type controller
 */

angular.module("d3-uml-modeler.base")
	.factory("UmlController", ["BaseController", "Notifications",
		function(BaseController, Notifications){
			return BaseController.extend(
			{

				/**
				 * The utility object that allow us to trigger global events.
				 */
				notifications: null,

				/**
				 * Init is like the constructor.
				 */
				init: function($scope, Notifications)
				{
					this.notifications = Notifications;
					BaseController.prototype.init.call(this, $scope);

					/**
					 * If there is something to do with the Notifications object,
					 * it needs to be done Here (after call of the super constructor).
					 */
				}

			});
		}]);