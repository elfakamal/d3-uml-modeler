"use strict";


angular.module('d3-uml-modeler.editor')
  .directive('editor', ["_", "Constants", "ClassifierEditorDirective", "PropertyEditorDirective",
    function(_, Constants, ClassifierEditorDirective, PropertyEditorDirective) {

      return {
        scope: {},
        restrict: "E",
        replace: true,

        templateUrl: function(scope, attributes) {
          return "views/" + attributes["elementTypeName"] + "-editor.html";
        },

        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs)
        {
          if($attrs.elementTypeName == "property")
            $scope.primitiveTypes = _.values(Constants.PROPERTY.PRIMITIVE_TYPES);
        }],

        link: function($scope, $element, $attrs)
        {
          if($attrs.elementTypeName == "classifier")
            new ClassifierEditorDirective($scope, $element, $attrs);

          if($attrs.elementTypeName == "property")
            new PropertyEditorDirective($scope, $element, $attrs);
        }

      };

    }]);
