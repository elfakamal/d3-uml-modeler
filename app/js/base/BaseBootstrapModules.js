'use strict';

angular.module("d3-uml-modeler.constants", []);
angular.module('d3-uml-modeler.underscore', []);

angular.module('d3-uml-modeler.base', []);
angular.module('d3-uml-modeler.uml-abstract-factory', ['d3-uml-modeler.underscore']);
angular.module('d3-uml-modeler.notifications', []);
angular.module('d3-uml-modeler.constants', []);

angular.module('d3-uml-modeler.view', []);
angular.module('d3-uml-modeler.filters', []);
angular.module('d3-uml-modeler.services', []);
angular.module('d3-uml-modeler.directives', []);

angular.module('d3-uml-modeler.uml-diagram', [
	'd3-uml-modeler.base',
	'd3-uml-modeler.base',
	'd3-uml-modeler.view'
]);

angular.module('d3-uml-modeler.uml-workspace', [
	'd3-uml-modeler.base',
	'd3-uml-modeler.uml-abstract-factory',
	'd3-uml-modeler.constants',
	'd3-uml-modeler.underscore',
	'd3-uml-modeler.notifications'
]);

angular.module('d3-uml-modeler.uml-property', ['d3-uml-modeler.base']);
angular.module('d3-uml-modeler.uml-classifier', ['d3-uml-modeler.base']);

angular.module('d3-uml-modeler.editor', [
	'd3-uml-modeler.uml-workspace',
	'd3-uml-modeler.uml-diagram',
	'd3-uml-modeler.uml-classifier',
	'd3-uml-modeler.uml-property'
]);

angular.module('d3-uml-modeler.menu', []);
angular.module('d3-uml-modeler.element-list', ['d3-uml-modeler.underscore']);

angular.module('d3-uml-modeler.login', ['firebase']);


angular.module('d3-uml-modeler.run', [
		'd3-uml-modeler.uml-abstract-factory',
		'd3-uml-modeler.constants',
		'd3-uml-modeler.uml-diagram',
		'd3-uml-modeler.uml-classifier',
		'd3-uml-modeler.uml-property'
	])
	.run(function(Constants, UmlModelAbstractFactory, WorkspaceModelClass, DiagramModelClass, ClassifierModelClass, PropertyModelClass) {
		
		UmlModelAbstractFactory.registerUmlModelElementClass(Constants.WORKSPACE.TYPES.NORMAL, WorkspaceModelClass);
		UmlModelAbstractFactory.registerUmlModelElementClass(Constants.DIAGRAM.TYPES.CLASS_DIAGRAM, DiagramModelClass);

		UmlModelAbstractFactory.registerUmlModelElementClass(Constants.CLASSIFIER.TYPES.CLASS, ClassifierModelClass);
		UmlModelAbstractFactory.registerUmlModelElementClass(Constants.CLASSIFIER.TYPES.INTERFACE, ClassifierModelClass);

		UmlModelAbstractFactory.registerUmlModelElementClass(Constants.PROPERTY.TYPES.CONSTANT, PropertyModelClass);
		UmlModelAbstractFactory.registerUmlModelElementClass(Constants.PROPERTY.TYPES.ATTRIBUTE, PropertyModelClass);
		UmlModelAbstractFactory.registerUmlModelElementClass(Constants.PROPERTY.TYPES.METHOD, PropertyModelClass);
	});

