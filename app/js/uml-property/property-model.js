"use strict";

angular.module('d3-uml-modeler.uml-property')
	.factory('PropertyModelClass', ["BaseModelElement",
		function(BaseModelElement) {

		var PropertyModelClass = BaseModelElement.extend(
		{
			propertyType: "",

			init: function(name, type)
			{
				BaseModelElement.prototype.init.call(this);

				this.name = name;
				this.type = type;
				this.children = null;
			},

			/**
			 * Adapter method for the create element method.
			 */
			addProperty: function(elementType, options)
			{
				return this.createElement(elementType, options);
			}

		});

		return PropertyModelClass;
	}]);
