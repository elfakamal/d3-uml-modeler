'use strict';

/**
 * Create a global event dispatcher
 * that can be injected accross multiple components
 * inside the application
 */
angular.module('d3-uml-modeler.notifications')
 .provider('Notifications', Class.extend({

		/**
		 * Configures and returns instance of GlobalEventBus.
		 */
		$get: ["EventDispatcher", function (EventDispatcher) {
				var instance = new EventDispatcher();
				instance.notify = instance.dispatchEvent;
				return instance;
		}]
}));
