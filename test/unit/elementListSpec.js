'use strict';

/* jasmine specs for services go here */

describe('element list test suite', function()
{
	beforeEach(function(){
		module('d3-uml-modeler.underscore');
		module('d3-uml-modeler.notifications');
		module('d3-uml-modeler.constants');
		module('d3-uml-modeler.element-list');
		module('d3-uml-modeler.base');
	});

	it("should contain elements list items", inject([

		"$rootScope", "$controller", "_", "ElementList",
		function($rootScope, $controller, _, ElementList)
		{
			var $scope = $rootScope.$new();
			var ctrl = $controller("ElementListController", {$scope: $scope});

			//verify notifications
			expect(ctrl.notifications).toBeDefined();

			expect(ElementList).toBeDefined();
			expect(typeof ElementList).toBe("object");
			expect(_.isEmpty(ElementList.children)).toBe(false);
//			console.log(ElementList.children);
		}
	]));


});