"use strict";

angular.module('d3-uml-modeler.uml-classifier')
  .factory('ClassifierModelClass', ["BaseModelElement", "_",
    function(BaseModelElement, _) {

    var ClassifierModelClass = BaseModelElement.extend(
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
      addProperty: function(elementType, options)
      {
        return this.createElement(elementType, options);
      },

      /**
       * Overriden.
       * Clones the classifier and each child property in it.
       */
      clone: function(deep)
      {
        var clone = BaseModelElement.prototype.clone.call(this, deep);

        if(deep === true)
        {
          var clonedChildren = clone.children;
          var newChildren = {};

          //cloning each child property to add it to the clone.
          _.each(clonedChildren, function(child) {
            newChildren[child.GUID] = child.clone();
          });

          //setting the copied property collection to the clone.
          clone.children = newChildren;
        }

        return clone;
      }

    });

    return ClassifierModelClass;
  }]);
