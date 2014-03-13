'use strict';

angular.module('d3-uml-modeler.base')
  .factory('BaseModelElement', [
    "EventDispatcher", "UmlModelAbstractFactory", "Constants", "_",
    function(EventDispatcher, UmlModelAbstractFactory, Constants, _){
      return EventDispatcher.extend(
      {
        count: 0,
        children: {},
        GUID: null,
        description: "",
        selected: false,
        name: "",
        type: 0,

        init: function()
        {
          this.GUID = Util.guid();
          this.initElements();
        },

        getFields: function()
        {
          return ["GUID", "name", "type", "description", "count"];
        },

        /**
         * 
         *
         */
        toJSON: function()
        {
          var jsonElement = _.pick(this, this.getFields());

          if(this.children != null)
          {
            jsonElement.children = {};
            
            _.each(this.children, function(child){
              jsonElement.children[child.GUID] = child.toJSON();
            });
          }
          
          return jsonElement;
        },

        /**
         * initializes the children collection.
         */
        initElements: function()
        {
          this.children = {};
        },

        /**
         * A generic method that creates an element using the factory, and adds
         * it to the children.
         */
        createElement: function(elementType, options)
        {
          if(typeof elementType === "undefined" || elementType === null)
            throw new Error("element type is undefined");

          if(!_.has(Constants.ELEMENT_TYPES_TO_NAMES, elementType))
            throw new Error("element type is not valid");

          options = options || {};
          var defaultName = Constants.ELEMENT_TYPES_TO_NAMES[elementType];
          options = _.extend({
            name: "untitled " + defaultName,
            type: elementType
          }, options);

          var modelProperty = UmlModelAbstractFactory.createUmlModelElement(elementType, options);
          return this.addElement(modelProperty);
        },

        /**
         * adds an element to the children colleciton.
         */
        addElement : function(element)
        {
          if(typeof element === "undefined" || element === null)
            throw new Error("element is undefined");

          this.children[element.GUID] = element;
          this.count++;

          return element;
        },

        /**
         * removes an element from the children collection.
         */
        removeElement : function(element)
        {
          if(typeof element === "undefined" || element === null)
            throw new Error("element is undefined");

          var guid = ( typeof element === "string" ) ? element : element.GUID;

          this.children[guid] = null;
          delete this.children[guid];
          this.count--;

          return this;
        },

        /**
         * removes all the children.
         */
        clearChildren: function()
        {
          while(!_.isEmpty(this.children)) {
            this.children[_.keys(this.children)[0]] = null;
            delete this.children[_.keys(this.children)[0]];
          }
        },

        /**
         * resets all fields to their default values.
         */
        clear: function()
        {
          this.name = "";
          this.type = 0;

          this.count = 0;
          this.GUID = "";
          this.description = "";

          this.clearChildren();
        },

        /**
         * can be Overriden
         */
        clone: function(deep)
        {
          return _.clone(this);
        }

      });
    }]);
