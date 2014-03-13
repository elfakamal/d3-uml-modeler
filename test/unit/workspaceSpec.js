'use strict';

/* jasmine specs for services go here */

describe('Workspace ::', function()
{
  beforeEach(function(){
    module('d3-uml-modeler.run');
    module('d3-uml-modeler.base');
    module('d3-uml-modeler.mocks');
    module('d3-uml-modeler.constants');
    module('firebase');
    module('d3-uml-modeler.login');
    module('d3-uml-modeler.uml-diagram');
    module('d3-uml-modeler.underscore');
    module('d3-uml-modeler.notifications');
    module('d3-uml-modeler.uml-workspace');
    module('d3-uml-modeler.uml-abstract-factory');
  });

  describe('Workspace - diagram ::', function()
  {

    it("should add a diagram to a workspace CONCRETE", inject(["WorkspaceModelClass", "DiagramModelClass",
      function(WorkspaceModelClass, DiagramModelClass)
      {
        expect(typeof WorkspaceModelClass).toBe('function');
        expect(typeof DiagramModelClass).toBe('function');

        var modelWS = new WorkspaceModelClass();
        var modelDiagram = new DiagramModelClass();

        modelWS.addElement(modelDiagram);
        expect(modelWS.children[modelDiagram.GUID]).toBe(modelDiagram);
        expect(modelWS.count).toBe(1);

        var modelDiagram2 = DiagramModelClass();
        expect(modelDiagram2).toBeUndefined();

        expect(modelWS.addElement).toThrow(new Error("element is undefined"));
      }
    ]));

    it("should add a diagram to a workspace ABTSRACT", inject([

      "$rootScope", "$controller", "WorkspaceModelClass", "DiagramModelClass", "UmlModelAbstractFactory", "_", "Constants",
      function($rootScope, $controller, WorkspaceModelClass, DiagramModelClass, UmlModelAbstractFactory, _, Constants)
      {
        var $scope = $rootScope.$new();
        expect(typeof $controller).toBe('function');

        //debugger;
        var ctrl = $controller('WorkspaceController', {
          $scope:$scope
        });

        expect(WorkspaceModelClass).toBeDefined();
        expect(typeof WorkspaceModelClass).toBe("function");

        var modelWS = new WorkspaceModelClass();
        expect(typeof modelWS).toBe('object');
        expect(_.isEmpty(modelWS.children)).toBe(true);

        //have notifs
        expect(ctrl.notifications).toBeDefined();

        //have a model
        expect(ctrl.model).toBeDefined();
        expect(typeof ctrl.model).toBe("object");

        //add a diagram to the workspace
        UmlModelAbstractFactory.registerUmlModelElementClass(Constants.DIAGRAM.TYPES.CLASS_DIAGRAM, DiagramModelClass);
        var options = {name:"diagram1"};
        var modelDiagram = UmlModelAbstractFactory.createUmlModelElement(Constants.DIAGRAM.TYPES.CLASS_DIAGRAM, options);

        expect(typeof modelDiagram).toBe("object");
        expect(modelDiagram.name).toBe("diagram1");
        expect(modelDiagram.GUID).not.toBe("");
        expect(_.isEmpty(modelDiagram.children)).toBe(true);

        modelWS.addElement(modelDiagram);
        expect(_.isEmpty(modelWS.children)).toBe(false);
        expect(modelWS.count).toBe(1);
        expect(modelWS.children[modelDiagram.GUID]).toBe(modelDiagram);

        //add a diagram by calling the addDiagram function on modelWS
        expect(function(){modelWS.addDiagram()}).toThrow("element type is undefined");
        var el = modelWS.addDiagram(Constants.DIAGRAM.TYPES.CLASS_DIAGRAM);
        expect(el).toBeDefined();
        expect(el.name).toBe("untitled Class Diagram");

        var el2 = modelWS.addDiagram(Constants.DIAGRAM.TYPES.CLASS_DIAGRAM, {name: "el2", type:Constants.DIAGRAM.TYPES.CLASS_DIAGRAM});
        expect(el2).toBeDefined();
        expect(el2.name).toBe("el2");
        expect(el2.type).toBe(Constants.DIAGRAM.TYPES.CLASS_DIAGRAM);


        var el3 = modelWS.addDiagram(Constants.DIAGRAM.TYPES.CLASS_DIAGRAM, {name: "el3"});
        expect(el3).toBeDefined();
        expect(el3.name).toBe("el3");
        expect(el3.type).toBe(1);


        var el4 = modelWS.addDiagram(Constants.DIAGRAM.TYPES.CLASS_DIAGRAM, {type:Constants.DIAGRAM.TYPES.CLASS_DIAGRAM});
        expect(el4).toBeDefined();
        expect(el4.name).toBe("untitled Class Diagram");
        expect(el4.type).toBe(1);


        expect(function(){modelWS.addDiagram(Constants.DIAGRAM.TYPES.STATE_DIAGRAM);}).toThrow(new Error("type not found : 3"));

      }
    ]));




  });

});