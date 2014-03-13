"use strict";

angular.module("d3-uml-modeler.editor")
  .factory("ClassifierEditorDirective", [
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
          this.notifications.addEventListener("edit-classifier", this.onEditClassifierRequested, this);
          this.$element.find("#button-cancel").bind("click", angular.bind(this, this.onCancelClick));
          this.$element.find("#button-add-property").bind("click", angular.bind(this, this.onAddPropertyClick));
          this.$element.find("#button-save").bind("click", angular.bind(this, this.onEditorSave));

          //this event comes from the property editor.
          this.$scope.$on("add-property", this.addProperty());
          
          //this event comes from the property directive.
          this.$scope.$on("remove-property", this.removeProperty());
        },

        removeProperty: function()
        {
          var self = this;

          return function(event, data){
            //data is the model property sent from the property-directive.
            self.$scope.model.removeElement(data.GUID);
          };
        },

        addProperty: function()
        {
          var self = this;

          return function(event, data) {
            self.$scope.model.addProperty(
              data.newPropertyElementType,
              {
                name: data.newPropertyName,
                propertyType: data.newPropertyUmlType
              }
            );
          };
        },

        onEditorSave: function()
        {
          var self = this;

          this.$scope.$apply(function() {
            self.originalModel.name = self.$scope.model.name;
            self.originalModel.description = self.$scope.model.description;

            self.originalModel.clearChildren();

            _.each(self.$scope.model.children, function(child) {
              self.originalModel.children[child.GUID] = child.clone(true);
            });
          });

          this.hideEditor();
          this.clear();
        },


        onCancelClick: function()
        {
          this.hideEditor();
          this.clear();
          this.$scope.$digest();
        },

        onEditClassifierRequested: function(model)
        {
          this.originalModel = model;
          this.$scope.model = model.clone(true);
          this.$scope.$apply();

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

