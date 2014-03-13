'use strict';

/**
 * Event dispatcher class,
 * add ability to dispatch event
 * on native classes.
 *
 * Use of Class.js
 *
 * @author universalmind.com
 */

angular.module('d3-uml-modeler.notifications')
  .factory('EventDispatcher', function() {


    return Class.extend({

      listeners : {},
      listenersCount : 0,

      /**
       * Add a listener on the object
       * @param event : Event type
       * @param listener : Listener callback
       */
      addEventListener:function(event, listener, context) {
        if(!this.listeners[event]) {
          this.listeners[event] = [];
        }

        this.listenersCount++;
        this.listeners[event].push({listener: listener, context: context});
      },

      /**
       * Remove a listener on the object
       * @param event : Event type
       * @param listener : Listener callback
       */
      removeEventListener:function(event, listener) {
        if(this.listeners[event]) {
          var currentListeners = this.listeners[event];
          var index = 0;

          for(var eventKey in currentListeners) {
            if( currentListeners[eventKey].listener === listener ) break;
            index++;
          }

          if(index !== -1) {
            this.listeners[event].splice(index, 1);
            this.listenersCount--;

            //kamal patch
            if(this.listeners[event].length === 0)
              delete this.listeners[event];
          }
        }
      },

      /**
       * Dispatch an event to all registered listener
       * @param Multiple params available, first must be string
       */
      dispatchEvent:function() {
        var currentListeners;

        if(typeof arguments[0] !== 'string') {
          console.warn('EventDispatcher','First params must be an event type (String)');
        } else {
          if(!this.listeners.hasOwnProperty(arguments[0])) {
            //throw new Error("no such registered event : " + arguments[0]);
            console.warn("no such registered event : " + arguments[0]);
            return;
          }

          currentListeners = this.listeners[arguments[0]];

          for(var i = 0; i < currentListeners.length; i++) {
            var params = Array.prototype.slice.call(arguments, 1);
            currentListeners[i].listener.apply(currentListeners[i].context, params);
            params = null;
          }
        }
      },

      /**
       * for the unit test
       */
      hasListeners: function() {
        return this.listenersCount > 0;
      },

      /**
       * for the unit test
       */
      hasListener: function(event) {
        return this.listeners.hasOwnProperty(event);
      }

    });
  });
