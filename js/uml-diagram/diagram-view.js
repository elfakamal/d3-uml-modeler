"use strict";

angular.module("d3-uml-modeler.uml-diagram")
	.factory("DiagramView", ["BaseView", "Constants", "_", function(BaseView, Constants, _){
		return BaseView.extend({

//DONE
//0-	implement a selection system, with a dictionary of registered
//		classifiers by GUIDs. it'll be based on selection events
//		and listeners

//DONE
//This scenario will allow us to select several classifiers :
//1-	notify children with this rect & the rawSVG.
//2-	check the intersection.
//3-	if it intersects with a classifier's rect, the classifier will be
//		selected.

//DONE
//resize a classifier
//1-	listen to mouseDown on each resizer handler.
//2-	fire an event to the diagram when the mouseDown event is triggered.
//3-	add the mouseMove listener in order the update the size of the resizer.
//4-	on the mouse up remove the mouseMove listener an notify the classifier
//		so it can resize itself to the resizer size.

//DONE
//this scenario will allow us to group the selected classifiers.
//0-	add a selection group in the svg above all classifiers.
//1-	listen for the selection events triggered by classifiers.
//2-	each time that a classifier is selected,
//		add it to the selection group (verify the coordinates)
//		- if the coordinates are wrong, use some math and fix it.
//3- remove all classifiers' individual drag behaviors.
//4- add a drag behavior on the selection group.

//ABANDONED
//this scenario will allow us to deselect a seleced classifier.
//1-	in the diagram, listen to the deselect event.
//2-	when a classifier is deselected, remove it from the selection group.
//3-	notify it so it can re-activate its drag behavior.
//4-	position it if its coordinates are wrong.

//DONE
//this scenario will allow us to deselect all selected classifiers
//(when the user clicks on the diagram white space)
//1-	fire an event "deselect-all" to all selected classifiers.
//2-	do the previous scenario.

			classifiersContainer	: null,
			rawSVG								: null,
			svg										: null,
			grid									: null,
			dragBehavior					: null,

			selector							: null,
			selectionGroup				: null,

			selectionGroupX1			: 0,
			selectionGroupY1			: 0,
			selectorX1						: 0,
			selectorY1						: 0,

			selectedClassifiers		: {},
			keyboardEventInitiated: false,


			init: function($scope, element, config)
			{
				BaseView.prototype.init.call(this, $scope, element, config);

				this.svg = d3.select(this.$el).select("svg");
				this.rawSVG = this.svg[0][0];
				this.svgNode = this.svg.select(".first-g");
				this.classifiersContainer = this.svgNode.select(".classifiers-container");
				this.selector = this.svgNode.select(".selector");
				this.selectionGroup = this.svgNode.select(".selectionGroup").datum({x:0,y:0});

				this.initListeners();
				this.initDragBehavior();
			},

			/**
			 * initializes listeners
			 */
			initListeners: function()
			{
				this.notifications.addEventListener("classifier-selected", this.onClassifierSelected, this);
				this.notifications.addEventListener("classifier-deselected", this.onClassifierDeselected, this);
				this.svgNode.on("mousedown", angular.bind(this, this.onDiagramMouseDown));
				this.notifications.addEventListener("show-resizer", this.showResizer, this);
			},

			/**
			 * this is a listener for the classifier-selected event.
			 */
			onClassifierSelected: function(modelClassifier)
			{
				if(typeof modelClassifier === "undefined" || modelClassifier === null)
					throw new Error("modelClassifier is undefined/null");

				if(!_.has(this.selectedClassifiers, modelClassifier.GUID)) {
					this.selectedClassifiers[modelClassifier.GUID] = modelClassifier;

					if(_.values(this.selectedClassifiers).length > 1)
						this.makeSelectedClassifiersDraggable();

					this.initKeyboardEvents();
				}
			},

			/**
			 * this is a listener for the classifier-selected event.
			 */
			onClassifierDeselected: function(modelClassifier)
			{
				if(typeof modelClassifier === "undefined" || modelClassifier === null)
					throw new Error("modelClassifier is undefined/null");

				if(_.has(this.selectedClassifiers, modelClassifier.GUID)) {
					this.selectedClassifiers[modelClassifier.GUID] = null;
					delete this.selectedClassifiers[modelClassifier.GUID];
					this.removeClassifierFromSelectionGroup(modelClassifier.GUID);
					this.removeKeyboardEvents();
				}
			},

			initKeyboardEvents: function()
			{
				if( !this.keyboardEventInitiated )
				{
					this.keyboardEventInitiated = true;
					var self = this;

					d3.select("body").on("keydown", function()
					{
						var key = d3.event.keyCode || d3.event.which;

						//DELETE
						if(key === 46) self.removeSelectedClassifiers();
					});
				}
			},

			removeKeyboardEvents: function()
			{
				if(_.isEmpty(this.selectedClassifiers) && this.keyboardEventInitiated )
				{
					d3.select("body").on("keydown", null);
					this.keyboardEventInitiated = false;
				}
			},

			removeSelectedClassifiers: function()
			{
				_.each(_.keys(this.selectedClassifiers), function(guid){
					this.$scope.removeClassifier(guid);
				}, this);

			},

			makeSelectedClassifiersDraggable: function()
			{
				var boxes = [];

				_.each(_.keys(this.selectedClassifiers), function(guid)
				{
					var classifier = this.classifiersContainer.select("#g-classifier-controller-" + guid);

					var classifierData = classifier.data()[0];
					classifierData.width = +classifier.attr("data-width");
					classifierData.height = +classifier.attr("data-height");

					boxes.push(classifierData);
					this.addClassifierToSelectionGroup(classifier, classifierData);

				}, this);

//				var rect = this.selectionGroup.select("#rect-selection-group")[0][0];
//				this.selectionGroup[0][0].appendChild(rect);
			},

			/**
			 * adds a view classifier to the selection group "selector"
			 */
			addClassifierToSelectionGroup: function(classifier, box)
			{
				//no need to continue if there no classifier in the container
				if(!classifier || !classifier[0] || !classifier[0][0]) return;

				//test if this classifier is in the selection group
				if(classifier[0][0].parentNode !== this.selectionGroup[0][0])
				{
					var oldX, oldY;
					oldX = classifier.data()[0].x;
					oldY = classifier.data()[0].y;

					this.selectionGroup[0][0].appendChild(classifier[0][0]);

					classifier
						.attr("data-x", oldX)
						.attr("data-y", oldY)
						.datum({x: oldX, y: oldY});

					this.selectionGroup.append("svg:rect")
						.attr("class", "selection-group-classifier-rect")
						.attr("x", box.x)
						.attr("y", box.y)
						.attr("width", box.width)
						.attr("height", box.height)
						.attr("style", "fill:rgba(255,127,0,.3);");
				}
			},

			/**
			 * adds a view classifier to the selection group "selector"
			 */
			removeClassifierFromSelectionGroup: function(guid)
			{
				var classifier = this.selectionGroup.select("#g-classifier-controller-" + guid);

				//no need to continue if there no classifier in the container
				if(!classifier || !classifier[0] || !classifier[0][0]) return;

				//test if this classifier is in the selection group
				if(classifier[0][0].parentNode === this.selectionGroup[0][0])
				{
					var newX, newY;

					//I use data-x here instead of data x because the datum coordiantes
					//are at the point (0, 0)
					newX = +classifier.attr("data-x") + this.selectionGroup.data()[0].x;
					newY = +classifier.attr("data-y") + this.selectionGroup.data()[0].y;

					this.classifiersContainer[0][0].appendChild(classifier[0][0]);

					classifier.attr("transform", "translate(" + [newX, newY] + ")")
						.datum({x: newX, y: newY});
				}
			},

			/**
			 * initializes the selector drag behavior.
			 */
			initDragBehavior: function()
			{
				var self = this;

				this.dragBehavior = d3.behavior.drag().origin(Object)
					.on("dragstart", angular.bind(this, this.onDragStart))
					.on("drag", angular.bind(this, this.onDragMove))
					.on("dragend", angular.bind(this, this.onDragEnd));

				this.selectorDragBehavior = d3.behavior.drag().origin(Object)
					.on("dragstart", function(d)
					{
						d3.event.sourceEvent.stopPropagation();
						self.selectionGroupX1 = d.x
						self.selectionGroupY1 = d.y;

						console.log("start");
						console.log([self.selectionGroupX1,self.selectionGroupY1]);
					})
					.on("drag", function(d)
					{
						d.x = d3.event.x;
						d.y = d3.event.y;

						console.log([d.x, d.y]);

						d3.select(this).attr("transform", "translate(" + [d.x, d.y] + ")");
					});

					this.selectionGroup.call(this.selectorDragBehavior);
			},

			onDragStart: function()
			{
				this.selectorX1 = d3.mouse(this.rawSVG)[0];
				this.selectorY1 = d3.mouse(this.rawSVG)[1];
			},

			onDragMove: function()
			{
				var mouseX = d3.mouse(this.rawSVG)[0];
				var mouseY = d3.mouse(this.rawSVG)[1];

				var width = Math.abs(mouseX - this.selectorX1);
				var height = Math.abs(mouseY - this.selectorY1);
				var x = Math.min(mouseX, this.selectorX1);
				var y = Math.min(mouseY, this.selectorY1);

				this.selector
					.attr("x", x).attr("y", y)
					.attr("width", width).attr("height", height);
			},

			onDragEnd: function()
			{
				this.checkIntersectedElements();
				this.hideSelector();
			},

			checkIntersectedElements: function()
			{
				var selectorRect = this.rawSVG.createSVGRect();

				selectorRect.x = this.selector.attr("x");
				selectorRect.y = this.selector.attr("y");
				selectorRect.width = this.selector.attr("width");
				selectorRect.height = this.selector.attr("height");

				//Notify children to test intersections.
				this.notifications.notify("hit-test", this.rawSVG, selectorRect);
			},

			onDiagramMouseDown: function()
			{
				console.log("DiagramView::onDiagramClick");

				this.hideResizers();
				this.hideSelector();

				this.selectionGroup
					.datum({x: 0, y: 0})
					.attr("transform", "translate(" + [0,0] + ")")
					.selectAll(".selection-group-classifier-rect")
					.remove();

//					.select("#rect-selection-group")
//						.attr("x", 0)
//						.attr("y", 0)
//						.attr("width", 0)
//						.attr("height", 0);
			},

			hideSelector: function()
			{
				//applying the drag behavior.
				this.svg.call(this.dragBehavior);

				this.selector
					.attr("x", d3.mouse(this.rawSVG)[0])
					.attr("y", d3.mouse(this.rawSVG)[1])
					.attr("width", 0).attr("height", 0);
			},

			/**
			 * this method triggers an event to all of the classifiers
			 * telling them to hide the resizer.
			 */
			hideResizers: function()
			{
				this.notifications.notify("hide-resizer");
			},

			drawBase: function()
			{
				this.svg
					.attr("width", this.config.width + this.marginLeft() + this.marginRight())
					.attr("height", this.config.height + this.marginTop() + this.marginBottom());

				this.svgNode
					.attr("width", this.config.width + this.marginLeft() + this.marginRight())
					.attr("height", this.config.height + this.marginTop() + this.marginBottom());

				this.svgNode.select(".diagram-bg")
					.attr("width", this.config.width)
					.attr("height", this.config.height);

				this.drawGrid();
			},

			drawGrid: function()
			{
				this.grid = this.svgNode.select(".grid");
				var i, lineCount = this.config.width / this.config.gridTicksPadding;

				//vertical lines
				for(i = 0; i < lineCount; i++)
					this.drawLine(i * this.config.gridTicksPadding, 0, i * this.config.gridTicksPadding, this.config.height);

				//horizontal lines
				for(i = 0; i < lineCount; i++)
					this.drawLine(0, i * this.config.gridTicksPadding, this.config.width, i * this.config.gridTicksPadding);
			},

			drawLine: function(x1, y1, x2, y2) {
				this.grid.append("svg:line")
					.attr("x1", x1).attr("y1", y1)
					.attr("x2", x2).attr("y2", y2);
			}


		});
	}]);

