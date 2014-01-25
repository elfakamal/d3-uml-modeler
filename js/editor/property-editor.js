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

					this.render();
					this.initEditorListeners();
				},

				initEditorListeners: function()
				{
					this.notifications.addEventListener("edit-property", this.onEditPropertyRequested, this);
					this.$element.find("#button-add-property").bind("click", angular.bind(this, this.onAddPropertyClick));
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
					this.$scope.$apply(function() {
						self.$scope.newPropertyName = "";
						self.$scope.newPropertyUmlType = "";
						self.$scope.newPropertyElementType = "";
					});

					this.$element.find("#input-new-property").focus();
				},

				onEditPropertyRequested: function(model)
				{
					this.originalModel = model;
					var self = this;

					this.$scope.$apply(function() {
						self.$scope.model = model.clone(true);
					});

					this.showEditor();
				},

				showEditor: function()
				{
					this.$element.css("left", "0px");

					this.$element.find("input").removeAttr("disabled");
					this.$element.find("textarea").removeAttr("disabled");
					this.$element.find("button").removeAttr("disabled");
				},

				hideEditor: function()
				{
					this.$element.css("left", "-300px");

					this.$element.find("input").attr("disabled", "true");
					this.$element.find("textarea").attr("disabled", "true");
					this.$element.find("button").attr("disabled", "true");
				},

				clear: function()
				{
					this.$scope.model.clear();
				},

				render: function()
				{
					var myHeight = this.$element.height();
					this.$element.css("top", -myHeight + "px");
				}
			});
		}]
	);

