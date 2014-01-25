"use strict";

angular.module("d3-uml-modeler.uml-classifier")
	.factory("ClassifierView", ["BaseView", "Constants", "_", "$compile", "ClassifierResizer", "ClassifierPicker",
		function(BaseView, Constants, _, $compile, ClassifierResizer, ClassifierPicker){
		return BaseView.extend({

			backgroundRect							: null,
			propertiesContainer					: null,
			classifierDragBehavior			: null,
			classifierResizer						: null,
			selected										: false,
			handlersCoordinates					: null,
			picker											: null,

			init: function($scope, element, config)
			{
				BaseView.prototype.init.call(this, $scope, element, config);

				this.svgNode = d3.select(this.$el);

				this.initClassifierPicker();
				this.initResizer();
				this.initListeners();
				this.initDragBehaviors();
			},

			initClassifierPicker: function()
			{
				this.picker = new ClassifierPicker(this.$scope, this.$el, this.config);
				this.picker.render();
				this.picker.hidePicker();

				
			},

			initResizer: function()
			{
				this.classifierResizer = new ClassifierResizer(this.$scope, this.$el, this.config);
				this.classifierResizer.hideResizer();
				this.classifierResizer.addEventListener("resize-done-" + this.$scope.model.GUID, this.onClassifeierResizerDone, this);
			},

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
			 *
			 */
			onClassifierMouseDown: function()
			{
				//Select only one classifier (if the user don't press the control key)
				//
				//This event allow us to tell the other classifiers to hide their
				//resizers because we are in the process of selecting a specific
				//classifier, that's why we are sending the GUID with the event.
				if(!d3.event.ctrlKey)
					this.notifications.notify("hide-resizer", this.$scope.model.GUID);

				//stop the event propagation to the diagram.
				d3.event.stopPropagation();

				//a little hack to prevent selection when dragging the classifier.
				if(d3.event.defaultPrevented) return;

				//send an selection event to the diagram, so it can know
				//what classifiers are actually selected.
				this.select();
			},

			/**
			 *
			 */
			selectorHitTest: function(rawSVG, selectorRect)
			{
				if(typeof rawSVG === "undefined" || rawSVG === null)
					throw new Error("svg is undefined/null");

				if(	typeof selectorRect === "undefined" ||
						!(selectorRect instanceof SVGRect) ||
						selectorRect === null)
					throw new Error("selectorRect is undefined or null or not an intance of SVGRect");

				var hitSuccess = rawSVG.checkIntersection(this.backgroundRect[0][0], selectorRect);

				if(hitSuccess)
					this.select();
			},

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

			deselect: function()
			{
				this.selected = false;

				var self = this;
				this.$scope.$apply(function() {
					self.$scope.model.selected = false;
				});

				this.notifications.notify("classifier-deselected", this.$scope.model);
			},

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
				this.updateTitle();
				this.picker.setClassifierWidth(this.config.width);
			},

			onHideResizer: function(guid)
			{
				if(	this.classifierResizer &&
						(typeof guid === "undefined" || guid === null || guid !== this.$scope.model.GUID))
				{
					this.classifierResizer.hideResizer();
					this.picker.hidePicker();
					this.deselect();
				}
			},

			onDragMove: function(d)
			{
				d.x += d3.event.dx;
				d.y += d3.event.dy;

				d3.select(this)
					.attr("transform", "translate(" + d.x + "," + d.y + ")");
			},

			drawBase: function()
			{
				this.drawBackground();
				this.drawTitle();
				this.drawBody();
			},

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
			},

			drawTitle: function()
			{
				var title = this.svgNode.append("svg:g")
					.attr("class", "classifier-title-container");

				title.append("svg:rect")
					.attr("width", this.config.width)
					.attr("height", this.config.titleHeight)
					.attr("class", "classifier-title-bg")
					.attr("x", 0)
					.attr("y", 0);

				var titleText = title.append("svg:g")
					.attr("class", "text-container")
					.append("svg:text")
						.text(this.$scope.model.name)
						.attr("class", "title-text")
						.attr("text-anchor", "start")
						.attr("x", 0)
						.attr("y", 0);

				var bbx = titleText[0][0].getBBox();
				var x = Math.abs(bbx.x) + this.config.width/2 - bbx.width/2;
				var y = Math.abs(bbx.y) + this.config.titleHeight/2 - bbx.height/2;

				title.select("g.text-container")
					.attr("transform", "translate(" + [x, y] + ")");
			},

			updateBackground: function()
			{
				this.svgNode.select("rect.classifier-bg")
					.attr("width", this.config.width)
					.attr("height", this.config.height);

				d3.select(this.$el.parentNode)
					.attr("data-width", this.config.width)
					.attr("data-height", this.config.height);
			},

			updateTitle: function(box)
			{
				this.svgNode.select("rect.classifier-title-bg")
					.attr("width", this.config.width)
					.attr("height", this.config.titleHeight);

				var titleText = this.svgNode.select("text.title-text");
				var bbx = titleText[0][0].getBBox();

				var x = Math.abs(bbx.x) + this.config.width/2 - bbx.width/2;
				var y = Math.abs(bbx.y) + this.config.titleHeight/2 - bbx.height/2;

				this.svgNode.select("g.text-container")
					.attr("transform", "translate(" + [x, y] + ")");
			},

			drawBody: function()
			{
				var propertiesContainer = this.svgNode.append("svg:g")
					.attr("transform", "translate(" + [0, 0] + ")")
					.attr("class", "properties-container");

//				var propertyElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
//				propertyElement.setAttribute("ng-repeat", "property in properties");
//				propertyElement.setAttribute("property", "");
//				propertyElement.setAttribute("class", "g-property");
//				propertyElement.setAttribute("data-name", "{{property.name}}");
//
//				var propertyRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//				propertyRect.setAttribute("x", 0);
//				propertyRect.setAttribute("y", 0);
//				propertyRect.setAttribute("width", 20);
//				propertyRect.setAttribute("height", 20);
//				propertyRect.setAttribute("style", "fill:yellowgreen");
//
//				propertyElement.appendChild(propertyRect);
//
////				var propertyTemplate = '<g ng-repeat="property in properties" property class="g-property"><rect x="20" y="20" width="20" height="20" style="fill:yellowgreen"></rect><text>{{property.name}}</text></g>';
////				var propertyElement = angular.element(propertyTemplate);
//				var compiledTemplate = $compile(propertyElement)(this.$scope);
//
//				debugger;
//				propertiesContainer[0][0].appendChild(compiledTemplate[0]);
//
//				this.$scope.properties["lol"] = {name: "lol"};
//				this.$scope.properties["cool"] = {name: "cool"};
			}

		});
	}]);
