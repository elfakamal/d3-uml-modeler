'use strict';

/**
 * Create a global event dispatcher
 * that can be injected accross multiple components
 * inside the application
 *
 * Use of Class.js
 * @type {class}
 * @author universalmind.com
 */
angular.module('d3-uml-modeler.notifications')
 .provider('Notifications', Class.extend({

		/**
		 * Configures and returns instance of GlobalEventBus.
		 *
		 * @return {GlobalEventBus}
		 */
		$get: ["EventDispatcher", function (EventDispatcher) {
				var instance = new EventDispatcher();
				instance.notify = instance.dispatchEvent;
				return instance;
		}]
}));
