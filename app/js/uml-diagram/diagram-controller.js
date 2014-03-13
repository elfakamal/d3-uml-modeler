'use strict';

angular.module("d3-uml-modeler.uml-diagram")
  .controller("ClassDiagramController", [
    "$scope", "_", "Notifications", "Constants", "UmlController",
    function($scope, _, Notifications, Constants, UmlController)
    {
      var DiagramController = UmlController.extend(
      {
        model: null,

        /**
         * The "constructor".
         */
        init: function($scope)
        {
          UmlController.prototype.init.call(this, $scope, Notifications);
        },

        /**
         * initialize the scope data.
         */
        initScope : function()
        {
          this.$scope.initModel = angular.bind(this, this.initModel);
          this.$scope.removeClassifier = angular.bind(this, this.removeClassifier);
        },

        /**
         * This function is called during the creation of the controller
         * by the workspace controller in order to pass the recently created
         * model diagram in parameters, so the diagram controller can know
         * what model diagram he's dealing with.
         */
        initModel: function(modelDiagram)
        {
          this.model = modelDiagram;
          this.$scope.model = angular.bind(this, this.model);
          this.$scope.classifiers = angular.bind(this, this.model.children);

          //for the tree
          this.$scope.children = angular.bind(this, this.model.children);
        },

        /**
         * listens for classifiers add requests.
         */
        initListeners : function()
        {
          this.notifications.addEventListener(Constants.CLASSIFIER.EVENTS.ADD, this.addClassifier, this);
        },

        /**
         * Creates the model classifier and adds it to the list of classifiers.
         */
        addClassifier : function(elementType)
        {
          //an adapter method to addElement.

          //this line is gonna add a classifier model object to the list
          //of classifiers, and as we bound this list to the scope classifiers
          //list, angular will automatically add a classifier element
          //to the html using ng-repeat.
          this.model.addClassifier(elementType);
        },

        removeClassifier: function(guid)
        {
          if(typeof guid === "undefined" || guid === null)
            throw new Error("guidList is undefined/null");

          var self = this;

          this.$scope.$apply(function(){
            self.model.removeClassifier(guid);
          });
        }

      });

      return new DiagramController($scope);
    }]);

