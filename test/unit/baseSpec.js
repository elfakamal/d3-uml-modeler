'use strict';

/* jasmine specs for services go here */

describe('base', function()
{
	beforeEach(function(){
		module('d3-uml-modeler.base');
		module('d3-uml-modeler.uml-abstract-factory');
		module('d3-uml-modeler.constants');
		module('d3-uml-modeler.notifications');
	});


  describe('BaseModelElement', function() {

    it('T1: should contain a GUID and an empty children hash', inject(["BaseModelElement", function($BaseModelElement)
		{
      var model = new $BaseModelElement();

			expect(model.GUID).not.toBe("");
			expect(model.count).toBe(0);
			expect(_.isEmpty(model.children)).toBe(true);
    }]));

    it('T2: should contain 2 children after a addElement call', inject(["BaseModelElement", function($BaseModelElement)
		{
      var model = new $BaseModelElement();

			//add 2 models to it.
			var child1 = new $BaseModelElement();
			var child2 = new $BaseModelElement();

			model.addElement(child1);
			model.addElement(child2);

			//non empty children
			expect(_.isEmpty(model.children)).toBe(false);
			expect(model.count).toBe(2);

    }]));

    it("T3: should remove elements by passing them or their GUID to removeElement", inject(["BaseModelElement", function($BaseModelElement)
		{
      var model = new $BaseModelElement();

			//add 2 models to it.
			var child1 = new $BaseModelElement();
			var child2 = new $BaseModelElement();
			var child3 = new $BaseModelElement();
			var child4 = new $BaseModelElement();

			//add some childs
			model.addElement(child1);
			model.addElement(child2);
			model.addElement(child3);
			model.addElement(child4);

			//remove a child by passing it to removeElement
			model.removeElement(child2);

			//remove a child by passing its GUID to removeElement
			model.removeElement(child3.GUID);

			//children count
			expect(model.count).toBe(2);

			//test remaining children.
			expect(model.children[child1.GUID]).toBe(child1);
			expect(model.children[child2.GUID]).toBe(undefined);
			expect(model.children[child3.GUID]).toBe(undefined);
			expect(model.children[child4.GUID]).toBe(child4);

    }]));

    it('T4: should contain 3 children after a removeElement call', inject(["BaseModelElement", function($BaseModelElement)
		{
      var model = new $BaseModelElement();

			//add 2 models to it.
			var child1 = new $BaseModelElement();
			var child2 = new $BaseModelElement();
			var child3 = new $BaseModelElement();
			var child4 = new $BaseModelElement();

			//add some childs
			model.addElement(child1);
			model.addElement(child2);
			model.addElement(child3);
			model.addElement(child4);

			//children count
			expect(model.count).toBe(4);

			//remove a child
			model.removeElement(child2);

			//children count
			expect(model.count).toBe(3);
    }]));
  });




	//EventDispatcher
	describe('EventDispatcher', function(){

    it('T5: should contain an empty listeners hash', inject(["EventDispatcher", function(EventDispatcher)
		{
      var eventDispatcher = new EventDispatcher();
			expect(_.isEmpty(eventDispatcher._listeners)).toBe(true);
    }]));

    it('T6: should add and remove listeners', inject(["EventDispatcher", function(EventDispatcher)
		{
      var eventDispatcher = new EventDispatcher();

			var anAwesomeFunction = function() {
				//my brilliant code here.
				console.log("T6: my brilliant code is being executed");
			};

			eventDispatcher.addEventListener("an.awesome.event", anAwesomeFunction);
			expect(eventDispatcher.hasListeners()).toBeTruthy();

			//remove a listener
			eventDispatcher.removeEventListener("an.awesome.event", anAwesomeFunction);

			//check if th event has been removed
			expect(eventDispatcher.hasListener("an.awesome.event")).toBeFalsy();
			expect(eventDispatcher.hasListeners()).toBe(false);

			var args = ["lol", "cool", "mdr"];
			var params = [].concat(args.splice(1, args.length));
			expect(params).toContain("cool");
			expect(params).toContain("mdr");
			expect(params).not.toContain("lol");

			spyOn(console, "warn");

			expect(function(){eventDispatcher.dispatchEvent("kool");}).not.toThrow();
			expect(console.warn).toHaveBeenCalled();
			expect(console.warn).toHaveBeenCalledWith("no such registered event : kool");
    }]));

	});


	describe('UmlController', function()
	{

		beforeEach(function(){
			module('d3-uml-modeler.base');
			module('d3-uml-modeler.notifications');
			module('d3-uml-modeler.underscore');
		});

		it('T7: should contain a notifications list', inject([
			"$rootScope", "_", "Notifications", "UmlController",
			function($rootScope, _, Notifications, UmlController) {
				var $scope = $rootScope.$new();
				var ctrlFactory = new UmlController($scope, _, Notifications);
				expect(ctrlFactory.notifications).toBeDefined();
			}
		]));

	});


	describe('Lodash Service:', function() {
		beforeEach(module('d3-uml-modeler.underscore'));
		it('T8: should get an instance of the underscore factory', inject(function(_) {
			expect(_).toBeDefined();
		}));
	});



	describe('Uml Model Abstract Factory', function()
	{

		beforeEach(function(){
			module('d3-uml-modeler.underscore');
			module('d3-uml-modeler.uml-abstract-factory');
		});

		it('T9: should contain a notifications list', inject(["UmlModelAbstractFactory", "_",
			function(UmlModelAbstractFactory, _) {

				expect(UmlModelAbstractFactory).toBeDefined();
				expect(typeof UmlModelAbstractFactory).toBe("object");
				expect(typeof UmlModelAbstractFactory.createUmlModelElement).toBe("function");
				expect(typeof UmlModelAbstractFactory.registerUmlModelElementClass).toBe("function");
			}
		]));
		
		it('T10: should contain a notifications list', inject(["UmlModelAbstractFactory", "Constants", "_",
			function(UmlModelAbstractFactory, Constants, _) {

				Constants.ELEMENT_TYPES_TO_NAMES["car"] = "Car";
				Constants.ELEMENT_TYPES_TO_NAMES["bicycle"] = "Bicycle";

				var CarClass = Class.extend({
					name: "",
					color: "",
					brand: ""
				});

				var BicycleClass = Class.extend({
					color: "",
					type: ""
				});

				expect(typeof CarClass).toBe('function');
				expect(typeof BicycleClass).toBe('function');

				UmlModelAbstractFactory.registerUmlModelElementClass("car", CarClass);
				UmlModelAbstractFactory.registerUmlModelElementClass("bicycle", BicycleClass);

				expect(function(){
					UmlModelAbstractFactory.registerUmlModelElementClass("truck", {});
				}).toThrow();

				var modelCar = UmlModelAbstractFactory.createUmlModelElement("car", {name: "peugeot"});
				expect(modelCar).toBeDefined();
				expect(typeof modelCar).toBe("object");
				expect(modelCar.GUID).toBeUndefined();
				expect(modelCar.name).toBe("peugeot");

				var modelBicycle = UmlModelAbstractFactory.createUmlModelElement("bicycle", {name: "BTwin"});
				expect(modelBicycle).toBeDefined();
				expect(typeof modelBicycle).toBe("object");
				expect(modelBicycle.GUID).toBeUndefined();
				expect(modelBicycle.name).toBe("BTwin");

				//creating an object without passing arguments
				//expect to throw
				expect(UmlModelAbstractFactory.createUmlModelElement).toThrow("type not found : undefined");

				//creating an object without passing options
				//expect to work
				var newCar = UmlModelAbstractFactory.createUmlModelElement("car");
				expect(newCar).toBeDefined();
				expect(typeof newCar).toBe("object");
				expect(newCar.GUID).toBeUndefined();
				expect(newCar.name).toBe("");

				UmlModelAbstractFactory.unregisterUmlModelElementClass("bicycle", BicycleClass);
				expect(_.isEmpty(UmlModelAbstractFactory.types)).toBe(false);
				UmlModelAbstractFactory.unregisterUmlModelElementClass("car", CarClass);
				expect(_.isEmpty(UmlModelAbstractFactory.types)).toBe(true);
				// console.log("types : ", UmlModelAbstractFactory.types);
			}
		]));

	});

});

