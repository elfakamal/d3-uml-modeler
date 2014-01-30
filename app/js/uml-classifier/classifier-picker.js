'use strict';

angular.module("d3-uml-modeler.uml-classifier")
	.factory("ClassifierPicker", ["BaseView", "Constants", "_", function(BaseView, Constants, _){

		return BaseView.extend({

			picker: null,
			foreignObject: null,
			classifierWidth: 0,

			init: function($scope, element, config)
			{
				BaseView.prototype.init.call(this, $scope, element, config);

				this.classifierWidth = this.config.width;
				this.picker = d3.select(this.$el.parentNode).select(".controls-picker");
				this.initForeignObject();
			},

			setClassifierWidth: function(width)
			{
				this.classifierWidth = width;
				this.updateForeignObject();
			},
			
			getPicker: function()
			{
				return this.picker;
			},

			initForeignObject: function()
			{
				this.foreignObject = this.picker.append("foreignObject")
					.attr("class", "picker-foreign-object");

				this.updateForeignObject();
			},

			updateForeignObject: function()
			{
				this.picker.select(".picker-foreign-object")
					.attr("x", this.classifierWidth)
					.attr("y", 0)
					.attr("width", 30)
					.attr("height", 100)
					.attr("style", "fill:turquoise");
			},

			drawBase: function()
			{
				var pickerDiv = this.foreignObject.append("xhtml:div")
					.style("position", "static");

				var addAttributeButton = pickerDiv.append("xhtml:button")
					.attr("class", "button-edit-classifier")
					.on("click", angular.bind(this, this.onEditClassifierClick));
					//.text("+");

				var addAssociationButton = pickerDiv.append("xhtml:button")
					.attr("class", "button-add-association");
					// .text("#");
			},

			onEditClassifierClick: function()
			{
				this.notifications.notify("edit-classifier", this.$scope.model);
			},

			showPicker: function()
			{
				this.picker.transition()
					.attr("transform", "translate(" + [0, 0] + ")")
					.attr("disabled", null);
			},

			hidePicker: function()
			{
				this.picker.transition()
					.attr("transform", "translate(" + [-30, 0] + ")")
					.attr("disabled", "true");
			}

		});

	}]);