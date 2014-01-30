"use strict";

angular.module("d3-uml-modeler.editor")
	.factory("PropertyEditorDirective", [
		"BaseDirective", "Constants", "Notifications",
		function(BaseDirective, Constants, Notifications)
		{
			return BaseDirective.extend(
			{
				notifications: null,
				originalModel: null,

				init:function($scope, $element, $attributes)
				{
					this.notifications = Notifications;
					BaseDirective.prototype.init.call(this, $scope, $element, $attributes);
					this.$scope.mode = "add";

					//this.render();
					this.initEditorListeners();
				},

				initEditorListeners: function()
				{
					//this event comes from property dircetive
					this.notifications.addEventListener("edit-property-request", this.onEditPropertyRequested, this);
//					this.$element.find("#button-add-property").bind("click", angular.bind(this, this.onAddPropertyClick));

					this.$scope.addProperty = angular.bind(this, this.onAddPropertyClick);
					this.$scope.saveProperty = angular.bind(this, this.saveProperty);
				},

				onAddPropertyClick: function()
				{
					var data = {
						newPropertyElementType: +this.$attributes['elementType'],
						newPropertyUmlType: this.$scope.newPropertyUmlType,
						newPropertyName: this.$scope.newPropertyName
					};

					//this event is emitted for the classifier editor.
					this.$scope.$emit("add-property", data);

					var self = this;
					// this.$scope.$apply(function() {
						self.$scope.newPropertyName = "";
						self.$scope.newPropertyUmlType = "";
						self.$scope.newPropertyElementType = "";
					// });

					this.$element.find("#input-new-property").focus();
				},

				/**
				 *
				 */
				onEditPropertyRequested: function(modelProperty)
				{
					if(+this.$attributes['elementType'] === modelProperty.type)
					{
						this.originalModel = modelProperty;

						this.$scope.newPropertyName = modelProperty.name;
						this.$scope.newPropertyUmlType = modelProperty.propertyType;
						this.$scope.newPropertyElementType = modelProperty.type;

						this.$scope.mode = "edit";
					}
				},

				saveProperty: function()
				{
					var self = this;

					this.originalModel.name = this.$scope.newPropertyName;
					this.originalModel.propertyType = this.$scope.newPropertyUmlType;
					this.originalModel.type = this.$scope.newPropertyElementType;

					this.$scope.newPropertyName = "";
					this.$scope.newPropertyUmlType = "";
					this.$scope.newPropertyElementType = "";

					this.$scope.mode = "add";
				},

				render: function()
				{
					var myHeight = this.$element.height();
					this.$element.css("top", -myHeight + "px");
				}
			});
		}]
	);

