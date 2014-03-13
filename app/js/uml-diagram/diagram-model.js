"use strict";

angular.module('d3-uml-modeler.uml-diagram')
  .factory('DiagramModelClass', ["BaseModelElement",
    function(BaseModelElement) {

    var DiagramModelClass = BaseModelElement.extend(
    {
      init: function(name, type)
      {
        BaseModelElement.prototype.init.call(this);

        this.name = name;
        this.type = type;
      },

      /**
       * Adapter method for the create element method.
       */
      addClassifier: function(elementType, options)
      {
        return this.createElement(elementType, options);
      },

      /**
       * Adapter method for the remove element method.
       */
      removeClassifier: function(guid)
      {
        return this.removeElement(guid);
      }

    });

    return DiagramModelClass;
  }]);
