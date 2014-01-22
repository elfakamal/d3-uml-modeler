"use strict";

/* jasmine specs for services go here */

describe('Workspace', function()
{
	beforeEach(module('d3-uml-modeler'));

	describe('Lodash Service:', function() {
		beforeEach(module('d3-uml-modeler.underscore'));
		it('should handle a diagram and its children', inject(["DiagramModelClass", function(DiagramModelClass) {

			//not undefined.
			expect(DiagramModelClass).toBeDefined();

			//is a function = instantiable.
			expect(typeof DiagramModelClass).toBe("function");

			//create a model diagram
			var model = new DiagramModelClass("parentModel", 1);

			expect(model.GUID).not.toBe("");
			expect(model.count).toBe(0);
			expect(model.name).toBe("parentModel");
			expect(model.type).toBe(1);
			expect(model.children).toBeDefined();


			var child1 = new DiagramModelClass("child1", 5);
			var child2 = new DiagramModelClass("child2", 7);

			model.addElement(child1);
			model.addElement(child2);
			expect(_.isEmpty(model.children)).toBe(false);
			expect(model.count).toBe(2);

			//remove all children
			model.removeElement(child1.GUID);
			model.removeElement(child2.GUID);
			expect(model.count).toBe(0);

			//add a an element (classifier) to the diagram.



		}]));

	});

});
