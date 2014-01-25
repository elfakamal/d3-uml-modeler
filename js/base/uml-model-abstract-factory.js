"use strict";

angular.module('d3-uml-modeler.uml-abstract-factory')
	.factory("UmlModelAbstractFactory", ["_", "Constants", function(_, Constants){

		/**
		 * Types dictionary that registers concrete factories or simply classes.
		 */
		var types = {};

		return {

			/**
			 * Creates abstractly an instance that belongs to the type passed
			 * in argument.
			 */
			createUmlModelElement: function(type, options)
			{
				if(!_.has(types, type))
					throw new Error("type not found : " + type);

				//extract the type
				var UmlModelElementClass = types[type];

				//Abstractly creating the object
				var model = (UmlModelElementClass ? new UmlModelElementClass() : null);
				console.log("UmlModelAbstractFactory::createUmlModelElement GUID=" + model.GUID + ", type=" + type);

				//initializeing the object by setting all the properties
				//that we found in the options argument.
				if( typeof model !== 'undefined' && model !== null ) {
					if( typeof options !== 'undefined' && options !== null )
						_.each(options, function(value, key, list){ model[key] = value; });
				} else {
					throw new Error("UmlModelAbstractFactory::createUmlModelElement invalid model, please check out the type : " + type);
				}

				return model;
			},

			/**
			 * registers a concrete factory
			 */
			registerUmlModelElementClass: function(type, UmlModelElementClass)
			{
				if( typeof type === 'undefined' || type === null )
					throw new Error("UmlModelAbstractFactory::registerUmlModelElementClass undefined/null type");

				if(!_.has(Constants.ELEMENT_TYPES_TO_NAMES, type))
					throw new Error("UmlModelAbstractFactory::registerUmlModelElementClass type not valid : " + type);

				types[type] = UmlModelElementClass;
				return this;
			},

			/**
			 * unregisters a concrete factory
			 */
			unregisterUmlModelElementClass: function(type, UmlModelElementClass)
			{
				if(_.has(types, type) && types[type] === UmlModelElementClass)
				{
					types[type] = null;
					delete types[type];
				}

				return this;
			},

			/**
			 * for the unit tests
			 */
			types: types

		};
	}]);
