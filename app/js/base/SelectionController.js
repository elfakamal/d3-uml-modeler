/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module("d3-uml-modeler.base")
	.factory("SelectionController", ["_", function(_)
	{
		//
		var selectedElements = null;

		return Class.extend({
			init: function()
			{
				selectedElements = {};
			},

			selectElement: function(element)
			{
				if(!_.has(selectedElements, element.GUID))
					selectedElements[element.GUID] = element;
			},

			deselectElement: function(element)
			{
				if(_.has(selectedElements, element.GUID)) {
					selectedElements[element.GUID] = null;
					delete selectedElements[element.GUID];
				}
			}
		});
	}])