"use strict";

angular.module("d3-uml-modeler.uml-property")
  .factory("PropertyDirective", [
    "BaseDirective", "Constants", "Notifications",
    function(BaseDirective, Constants, Notifications)
    {
      return BaseDirective.extend(
      {
        init:function($scope, $element, $attributes)
        {
          BaseDirective.prototype.init.call(this, $scope, $element, $attributes);
        }
      });
    }]
  );


angular.module('d3-uml-modeler.uml-property')
  .directive('property',["Notifications",
  function(Notifications) {
    return {

      templateUrl: "views/property.html",

      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs)
      {
        $scope.edit = angular.bind(this, function() {
          //this event is fired to the property editor.
          Notifications.notify("edit-property-request", $scope.property);
        });

        $scope.remove = angular.bind(this, function() {
          //this event is triggered to the classifier editor
          $scope.$emit("remove-property", $scope.property);
        });
      }],

      link: function($scope, $element, $attributes)
      {

      }

    };
  }]);

