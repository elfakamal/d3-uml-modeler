'use strict';

angular.module('d3-uml-modeler.element-list')
	.provider('ElementList', Class.extend({

		$get:["Constants", "_", "BaseModelElement", "EventDispatcher", function(Constants, _, BaseModelElement, EventDispatcher)
		{
			var ListElementItem = EventDispatcher.extend(
			{
				index: 0,
				name: "",
				type: 0,
				GUID: null,

				init: function(name, index, type) {
					this.index = index;
					this.name = name;
					this.type = type;
					this.GUID = Util.guid();
				}
			});

			var ElementList = BaseModelElement.extend(
			{
				initElements: function()
				{
					var list = Constants.ELEMENT_LIST;

					if(typeof list !== "undefined" && list !== null)
					{
						var i = 0;

						_.each(list, function(item)
						{
							var type = item.type;

							if(_.has(item, "children")) type = "-";
							else type = (typeof item.type == 'function') ? item.type.apply(Constants) : item.type;

							var element = new ListElementItem(item.name, i, type);
							this.addElement(element);
							i++;

							if(_.has(item, "children"))
							{
								//this is a 2 dimension array so no need of a recursive process.
								_.each(item.children, function(childItem)
								{
									var childType = (typeof childItem.type == 'function') ? childItem.type.apply(Constants) : childItem.type;
									var child = new ListElementItem(childItem.name, i, childType);
									this.addElement(child);
									i++;
								}, this);
							}

						}, this);
					}
				}
			});

			return new ElementList();
		}]
	}));



