'use strict';

angular.module("d3-uml-modeler.uml-classifier")
  .controller("ClassifierController", [
    "$scope", "_", "Notifications", "Constants", "UmlController",
    function($scope, _, Notifications, Constants, UmlController)
    {
      var ClassifierController = UmlController.extend(
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
        },

        /**
         * This function is called during the creation of the controller
         * by the workspace controller in order to pass the recently created
         * model diagram in parameters, so the diagram controller can know
         * what model diagram he's dealing with.
         */
        initModel: function(modelClassifier)
        {
          this.model = modelClassifier;
          this.$scope.model = angular.bind(this, this.model);
          this.$scope.properties = angular.bind(this, this.model.children);

          //for the tree
          this.$scope.children = angular.bind(this, this.model.children);
        },

        /**
         * listens for classifiers add requests.
         */
        initListeners : function()
        {
          this.notifications.addEventListener(Constants.PROPERTY.EVENTS.ADD, this.addProperty, this);
        },

        /**
         * Creates the model classifier and adds it to the list of classifiers.
         */
        addProperty : function(elementType)
        {
          //an adapter method to addElement.
          this.model.addProperty(elementType);

          //this line is gonna add a classifier model object to the list
          //of classifiers, and as we bound this list to the scope classifiers
          //list, angular will automatically add a classifier element
          //to the html using ng-repeat.
        }

      });

      return new ClassifierController($scope);
    }]);

