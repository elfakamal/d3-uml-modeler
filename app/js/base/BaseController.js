'use strict';

/**
 * Base controller for all controllers.
 * Use this as a template for all future controllers
 */

angular.module("d3-uml-modeler.base")
  .factory("BaseController", function(){
    return Class.extend({

      $scope:null,

      /**
       * Initialize Base Controller
       * $scope, current controller scope
       */
      init:function(scope)
      {
        this.$scope = scope;
        this.initListeners();
        this.initScope();
      },

      /**
       * Initialize listeners needs to be overrided by the subclass.
       * Don't forget to call _super() to activate
       */
      initListeners:function()
      {
        this.$scope.$on('$destroy',this.destroy.bind(this));
      },

      /**
       * Use this function to define all scope objects.
       * Give a way to instantaly view whats available
       * publicly on the scope.
       */
      initScope:function()
      {
        //OVERRIDE
      },

      /**
       * Triggered when controller is about
       * to be destroyed, clear all remaining values.
       */
      destroy:function(event)
      {
        //OVERRIDE
      }
    });

  });