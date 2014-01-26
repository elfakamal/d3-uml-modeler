"use strict";

angular.module('d3-uml-modeler.constants')
.constant('Constants', {


	FIREBASE: {
		URL: "https://modeler.firebaseio.com/",
		LOGIN_PROVIDERS: {
			TWITTER: "twitter",
			GITHUB: "github"
		}
	},


	MENU_HEIGHT: 50,
	NAVBAR_HEIGHT: 52,

	DIAGRAM_MARGIN:{
		TOP: 0,
		RIGHT: 0,
		BOTTOM: 0,
		LEFT: 0
	},

	ELEMENT_TYPES_TO_NAMES: {
		0: "Workspace",
		//diagrams
		1: "Class Diagram",
		2: "Use Case Diagram",
		3: "State Diagram",
		//classifiers
		4: "Class",
		5: "Interface",
		//properties
		6: "Constant",
		7: "Attribute",
		8: "Method",
		//associations
		9: "Association",
		10: "Generalization",
		11: "Aggregation",
		12: "Composition"
	},

	WORKSPACE: {
		TYPES: {
			NORMAL: 0
		}
	},

	/**
	 *
	 */
	DIAGRAM: {
		TYPES: {
			CLASS_DIAGRAM: 1,
			USE_CASE_DIAGRAM: 2,
			STATE_DIAGRAM: 3
		},

		EVENTS: {
			ADD: 'add_diagram',
			REMOVE: 'remove_diagram'
		}
	},

	/**
	 *
	 */
	CLASSIFIER: {
		TYPES: {
			CLASS: 4,
			INTERFACE: 5
		},

		EVENTS: {
			ADD: 'add_classifier',
			REMOVE: 'remove_classifier'
		},

		VIEW: {
			DEFAULT_WIDTH: 150,
			DEFAULT_HEIGHT: 100,

			TITLE_HEIGHT: 30,

			RESIZE_HANDLER_SIZE: 5
		}
	},

	/**
	 *
	 */
	PROPERTY: {
		TYPES: {
			CONSTANT: 6,
			ATTRIBUTE: 7,
			METHOD: 8
		},

		EVENTS: {
			ADD: 'add_property',
			REMOVE: 'remove_property'
		},

		PRIMITIVE_TYPES: {
			VOID : "void",
			STRING : "String",
			INT : "int",
			UINT : "uint",
			FLOAT : "Float",
			DOUBLE : "Double",
			DATE : "Date"/*,
			OTHER : "other"*/
		}
	},

	ASSOCIATION: {
		TYPES: {
			ASSOCIATION: 9,
			GENERALIZATION: 10,
			AGGREGATION: 11,
			COMPOSITION: 12
		},

		EVENTS: {
			ADD: "add_association",
			REMOVE: "remove_association"
		}
	},

	/**
	 *
	 */
	ELEMENT_LIST: [{
			name: "Diagrams",
			children: [{
				name: "Class Diagram", type:function(){return this.DIAGRAM.TYPES.CLASS_DIAGRAM;}
			}
//				{name: "Use Case Diagram", type:function(){return this.DIAGRAM.TYPES.USE_CASE_DIAGRAM;}},
//				{name: "State Diagram", type:function(){return this.DIAGRAM.TYPES.STATE_DIAGRAM;}}
			]
		}, {
			name: "Classifiers",
			children: [{
					name: "Class", type:function(){return this.CLASSIFIER.TYPES.CLASS;}
				}, {
					name: "Interface", type:function(){return this.CLASSIFIER.TYPES.INTERFACE;}
				}
			]
		}
//		{
//			name: "Properties",
//			children: [
//				{name: "Constants", type:function(){return this.PROPERTY.TYPES.CONSTANT;}},
//				{name: "Attribute", type:function(){return this.PROPERTY.TYPES.ATTRIBUTE;}},
//				{name: "Method", type:function(){return this.PROPERTY.TYPES.METHOD;}}
//			]
//		},
//
//		{
//			name: "Associations",
//			children: [
//				{name:"Association", type:function(){return this.ASSOCIATION.TYPES.ASSOCIATION;}},
//				{name:"Generalization", type:function(){return this.ASSOCIATION.TYPES.GENERALIZATION;}},
//				{name:"Aggregation", type:function(){return this.ASSOCIATION.TYPES.AGGREGATION;}},
//				{name:"Composition", type:function(){return this.ASSOCIATION.TYPES.COMPOSITION;}}
//			]
//		}
	]

});
