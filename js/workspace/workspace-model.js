"use strict";

angular.module('d3-uml-modeler.uml-workspace')
	.factory('WorkspaceModel', ["UmlModelAbstractFactory", "Constants", "BaseModelElement", "_",
		function(UmlModelAbstractFactory, Constants, BaseModelElement, _)
		{
			return BaseModelElement.extend({

				/**
				 * Adapter method for the create element method.
				 */
				addDiagram: function(elementType, options)
				{
					return this.createElement(elementType, options);
				},

				/**
				 * Adapter method for the remove element method.
				 */
				removeDiagram: function(guid)
				{
					return this.removeElement(guid);
				}

			});
		}]);
