"use strict";

angular.module("d3-uml-modeler.uml-classifier")
  .factory("ClassifierView", ["BaseView", "Constants", "_", "$compile", "ClassifierResizer", "ClassifierPicker",
    function(BaseView, Constants, _, $compile, ClassifierResizer, ClassifierPicker){
    return BaseView.extend({

      backgroundRect              : null,
      propertiesContainer         : null,
      classifierDragBehavior      : null,
      classifierResizer           : null,
      selected                    : false,
      handlersCoordinates         : null,
      picker                      : null,

      /**
       * Initializer function for the classifier view.
       */
      init: function($scope, element, config)
      {
        BaseView.prototype.init.call(this, $scope, element, config);

        this.svgNode = d3.select(this.$el);

        this.initClassifierPicker();
        this.initResizer();
        this.initListeners();
        this.initDragBehaviors();
      },

      /**
       * Initializer function for the picker view.
       */
      initClassifierPicker: function()
      {
        this.picker = new ClassifierPicker(this.$scope, this.$el, this.config);
        this.picker.render();
        this.picker.hidePicker();
      },

      /**
       * Initializer function for the resizer view.
       */
      initResizer: function()
      {
        this.classifierResizer = new ClassifierResizer(this.$scope, this.$el, this.config);
        this.classifierResizer.hideResizer();
        this.classifierResizer.addEventListener("resize-done-" + this.$scope.model.GUID, this.onClassifeierResizerDone, this);
      },

      /**
       * Initialize the classifier's listeners.
       */
      initListeners: function()
      {
        //this event comes from the diagram.
        this.notifications.addEventListener("hide-resizer", this.onHideResizer, this);
        d3.select(this.$el.parentNode).on("mousedown", angular.bind(this, this.onClassifierMouseDown));
        this.notifications.addEventListener("hit-test", this.selectorHitTest, this);
      },

      /**
       * this function initializes the drag behaviors
       * (classifier & resizer handlers)
       */
      initDragBehaviors: function()
      {
        //creating the classifier drag behavior.
        this.classifierDragBehavior = d3.behavior.drag().origin(Object)
          .on("drag", this.onDragMove);

        //assigning the classifier drag behavior.
        d3.select(this.$el.parentNode)
          .attr("transform", "translate(300,100)")
          .datum({x: 300, y: 100})
          .call(this.classifierDragBehavior);
      },

      /**
       * this function is the callback of the mousedown on the classifier view.
       *
       * - it selects only one classifier, if the user don't press control key
       * 
       * - The "hide-resizer" event allow us to tell the other classifiers 
       * to hide their resizers because we are in the process of selecting
       * a specific classifier, that's why we are sending the GUID with the 
       * event
       *
       * - it stops the event propagation to the diagram.
       *
       * - the d3.event.defaultPrevented allow us to prevents selection 
       * when dragging the classifier.
       *
       * - and sends an selection event to the diagram, so it can know
       * what classifiers are actually selected.
       */
      onClassifierMouseDown: function()
      {
        if(!d3.event.ctrlKey)
          this.notifications.notify("hide-resizer", this.$scope.model.GUID);

        d3.event.stopPropagation();
        if(d3.event.defaultPrevented) return;
        this.select();
      },

      /**
       * thie function allows us to know whether a given rectangle intersects 
       * with some this classifier or no. if it does, the classifier 
       * is immediately selected.
       */
      selectorHitTest: function(rawSVG, selectorRect)
      {
        if(typeof rawSVG === "undefined" || rawSVG === null)
          throw new Error("svg is undefined/null");

        if( typeof selectorRect === "undefined" ||
            !(selectorRect instanceof SVGRect) ||
            selectorRect === null)
          throw new Error("selectorRect is undefined or null or not an intance of SVGRect");

        var hitSuccess = rawSVG.checkIntersection(this.backgroundRect[0][0], selectorRect);

        if(hitSuccess)
          this.select();
      },

      /**
       * 
       */
      select: function()
      {
        this.selected = true;

        var self = this;
        this.$scope.$apply(function() {
          self.$scope.model.selected = true;
        });

        //notify the diagram
        this.notifications.notify("classifier-selected", this.$scope.model);

        //displays the resizer.
        this.classifierResizer.showResizer();
        this.picker.showPicker();
      },

      /**
       *
       */
      deselect: function()
      {
        this.selected = false;

        var self = this;
        this.$scope.$apply(function() {
          self.$scope.model.selected = false;
        });

        this.notifications.notify("classifier-deselected", this.$scope.model);
      },

      /**
       * This function is called when the user finished resising the classifier,
       * it does a bunch of updates on the position, size, and other properties 
       * and styles of the different objects composing the classifier.
       */
      onClassifeierResizerDone: function()
      {
        var currentX, currentY, newX, newY, newW, newH;

        currentX = +d3.select(this.$el.parentNode).data()[0].x;
        currentY = +d3.select(this.$el.parentNode).data()[0].y;

        var box = this.classifierResizer.getBox();


        newX = box.x + currentX;
        newY = box.y + currentY;

        if( box.width > 0 && box.height > 0 ) {
          newW = box.width;
          newH = box.height;
        }

        d3.select(this.$el.parentNode)
          .attr("transform", "translate(" + newX + "," + newY + ")")
          .datum({x: newX, y: newY});

        if( box.width > 0 && box.height > 0 ) {
          this.config.width = newW;
          this.config.height = newH;
        }

        this.classifierResizer.resetResizer();
        this.updateBackground();
        this.picker.setClassifierWidth(this.config.width);
        this.updatePropertiesContainer();
      },

      /**
       * this function hides the classifier including its picker and resizer
       * objects, and then deselects it.
       */
      onHideResizer: function(guid)
      {
        if( this.classifierResizer &&
            (typeof guid === "undefined" || guid === null || guid !== this.$scope.model.GUID))
        {
          this.classifierResizer.hideResizer();
          this.picker.hidePicker();
          this.deselect();
        }
      },

      /**
       * the callback to the drag move d3 event.
       */
      onDragMove: function(d)
      {
        d.x += d3.event.dx;
        d.y += d3.event.dy;

        d3.select(this)
          .attr("transform", "translate(" + d.x + "," + d.y + ")");
      },

      /**
       * draws the basic objects of the classifier
       */
      drawBase: function()
      {
        this.drawBackground();
        this.drawTitle();
        this.drawBody();

        this.updateClassifierSize();
      },

      updateClassifierSize: function()
      {
        if(!_.isEmpty(this.$scope.model.children))
        {
          var box = {};
          box.width = +this.svgNode.select(".classifier-bg").attr("width");
          box.height = 0;

          var borderTopHeight = 2;
          var propertyHeight = 20;

          var headerHeight = borderTopHeight + this.config.titleHeight
          var propertiesHeight = propertyHeight * _.keys(this.$scope.model.children).length;

          box.height = headerHeight + propertiesHeight;

          if(box.height > Constants.CLASSIFIER.VIEW.DEFAULT_HEIGHT)
          {
            //do to resize.
            this.config.height = box.height;

            this.updateBackground();
            // this.picker.setClassifierWidth(this.config.width);
            this.updatePropertiesContainer();
          }
        }
      },

      /**
       * draws the background rectangle object.
       */
      drawBackground: function()
      {
        this.backgroundRect = this.svgNode.append("svg:rect")
          .attr("class", "classifier-bg")
          .attr("width", this.config.width)
          .attr("height", this.config.height)
          .attr("x", 0)
          .attr("y", 0);

        d3.select(this.$el.parentNode)
          .attr("data-width", this.config.width)
          .attr("data-height", this.config.height);

        this.classifierForeignObject = this.svgNode.append("foreignObject")
          .attr("class", "classifier-foreign-object");

        this.updateClassifierForeignObject();
      },

      updateClassifierForeignObject: function(){
        this.svgNode.select(".classifier-foreign-object")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", this.config.width)
          .attr("height", this.config.height);
      },

      /**
       * draws the title rectangle and the text.
       */
      drawTitle: function()
      {
        this.classifierContainerDiv = this.classifierForeignObject.append("xhtml:div")
          .attr("class", "classifier-title")
          .style("height", this.config.titleHeight + "px")
          .style("line-height", this.config.titleHeight + "px");

        var titleTemplate = '<span>{{model.name}}</<span>';
        var titleElement = angular.element(titleTemplate);

        var compiledTemplate = $compile(titleElement)(this.$scope);
        $(this.classifierContainerDiv[0][0]).append(compiledTemplate[0]);
      },

      /**
       * updates the size of the background (when a resize is done)
       */
      updateBackground: function()
      {
        this.svgNode.select("rect.classifier-bg")
          .attr("width", this.config.width)
          .attr("height", this.config.height);

        d3.select(this.$el.parentNode)
          .attr("data-width", this.config.width)
          .attr("data-height", this.config.height);

        //TODO: update the classifier foreign object size & the container div.
        this.classifierForeignObject
          .attr("width", this.config.width)
          .attr("height", this.config.height);
      },

      /**
       * creates the foreign object that holds the properties.
       * creates the property template and compiles it with angular's $compile 
       * function, this allow us to keep the binding working on the properties 
       * collection.
       */
      drawBody: function()
      {
        this.initPropertiesContainerDiv();

        var propertyTemplate = '<div ng-repeat="property in model.children | propertyTypeFilter:{type: 6}" property class="uml-property"></div>';
        propertyTemplate += '<div ng-repeat="property in model.children | propertyTypeFilter:{type: 7}" property class="uml-property"></div>';
        propertyTemplate += '<div ng-repeat="property in model.children | propertyTypeFilter:{type: 8}" property class="uml-property"></div>';

        //debugger;
        var propertyElement = angular.element(propertyTemplate);

        var compiledTemplate = $compile(propertyElement)(this.$scope);
        $(this.propertiesContainerDiv[0][0]).append(compiledTemplate[0]);
        $(this.propertiesContainerDiv[0][0]).append(compiledTemplate[1]);
        $(this.propertiesContainerDiv[0][0]).append(compiledTemplate[2]);
      },

      initPropertiesContainerDiv: function (argument)
      {
        this.propertiesContainerDiv = this.classifierForeignObject.append("xhtml:div")
          .attr("class", "property-container")
          .style("position", "static");

        this.updatePropertiesContainer();
      },

      updatePropertiesContainer: function()
      {
        $(this.propertiesContainerDiv[0][0])
          .css("height", this.config.height - this.config.titleHeight);
      }

    });
  }]);
