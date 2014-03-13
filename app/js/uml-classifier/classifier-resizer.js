'use strict';

angular.module("d3-uml-modeler.uml-classifier")
  .factory("ClassifierResizer", ["BaseView", "Constants", "_", function(BaseView, Constants, _){

    return BaseView.extend({

      resizerHandlersDragBehavior : null,
      resizer                     : null,
      selectedResizerHandler      : null,

      init: function($scope, element, config)
      {
        BaseView.prototype.init.call(this, $scope, element, config);

        this.svgNode = d3.select(this.$el);

        this.resizer = d3.select(this.$el.parentNode).select(".resizer");
        this.resizerRect = d3.select(this.$el.parentNode).select(".resizer-bg");

        this.handlersCoordinates = [
          {x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0},
          {x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0}
        ];

        this.resizer.selectAll(".resizer-handler")
          .data(this.handlersCoordinates)
          .enter()
          .append("rect")
            .attr("class", function(d, i) {return "resizer-handler side-" + i;})
            .attr("side-index", function(d, i) {return i;})
            .attr("width", Constants.CLASSIFIER.VIEW.RESIZE_HANDLER_SIZE)
            .attr("height", Constants.CLASSIFIER.VIEW.RESIZE_HANDLER_SIZE);

        this.resizer.style("visibility", "hidden");

        this.initListeners();
      },

      initListeners: function()
      {
        this.initDragBehaviors();
      },

      /**
       * this function initializes the drag behaviors
       * (classifier & resizer handlers)
       */
      initDragBehaviors: function()
      {
        //creating the resizer handlers drag behavior.
        this.resizerHandlersDragBehavior = d3.behavior.drag()
          .origin(Object)
          .on("dragstart", this.onResizerHandlersDragStart())
          .on("drag", this.onResizerHandlersDragMove())
          .on("dragend", this.onResizerHandlersDragEnd());

        //assigning the resizer handlers drag behavior.
        this.resizer.selectAll(".resizer-handler")
          .call(this.resizerHandlersDragBehavior);
      },

      getBox: function()
      {
        var box = {};
        box.x = +this.resizerRect.attr("x");
        box.y = +this.resizerRect.attr("y");
        box.width = +this.resizerRect.attr("width");
        box.height = +this.resizerRect.attr("height");

        return box;
      },

      showResizer: function()
      {
        this.resizer.style("visibility", "visible");
        this.updateResizer();
      },

      hideResizer: function()
      {
        this.resizer.style("visibility", "hidden");
        this.updateResizer();
      },

      updateResizerRect: function(box)
      {
        var sideSize = Constants.CLASSIFIER.VIEW.RESIZE_HANDLER_SIZE;

        //position & size of the bg rect
        this.resizerRect
          .attr("x", function()
          {
            if(box.width < 0) return box.x + box.width + sideSize;
            else return box.x;
          })
          .attr("y", function()
          {
            if(box.height < 0) return box.y + box.height + sideSize;
            else return box.y;
          })
          .attr("width", function()
          {
            var w = Math.abs(box.width) - sideSize*2;
            if(box.width < 0) return w > 0 ? w : 0;
            else return box.width;
          })
          .attr("height", function()
          {
            var h = Math.abs(box.height) - sideSize*2;
            if(box.height < 0) return h > 0 ? h : 0;
            else return box.height;
          });
      },


      updateResizer: function(bbox)
      {
        var myBBox = bbox || this.$el.getBBox();
        var sideSize = Constants.CLASSIFIER.VIEW.RESIZE_HANDLER_SIZE;

        if(bbox) this.updateResizerRect(bbox);

        // if(bbox) 
          // this.updateResizerRect(myBBox);

        this.handlersCoordinates = [
          {x:-sideSize + myBBox.x,                    y:-sideSize + myBBox.y},
          {x:myBBox.width/2 - sideSize/2 + myBBox.x,  y:-sideSize + myBBox.y},
          {x:myBBox.width + myBBox.x,                 y:-sideSize + myBBox.y},
          {x:myBBox.width + myBBox.x,                 y:myBBox.height/2 - sideSize/2 + myBBox.y},
          {x:myBBox.width + myBBox.x,                 y:myBBox.height + myBBox.y},
          {x:myBBox.width/2 - sideSize/2 + myBBox.x,  y:myBBox.height + myBBox.y},
          {x:-sideSize + myBBox.x,                    y:myBBox.height + myBBox.y},
          {x:-sideSize + myBBox.x,                    y:myBBox.height/2 - sideSize/2 + myBBox.y}
        ];

        if(this.selectedResizerHandler !== null)
        {
          var selectedHandlerIndex = d3.select(this.selectedResizerHandler).attr("side-index");

          this.handlersCoordinates[selectedHandlerIndex] = {
            x: d3.select(this.selectedResizerHandler).attr("x"),
            y: d3.select(this.selectedResizerHandler).attr("y")
          };
        }

        this.resizer.selectAll(".resizer-handler")
          .data(this.handlersCoordinates)
          .attr("x", function(d, i) {return d.x;})
          .attr("y", function(d, i) {return d.y;});
      },

      updateResizerBoundingBox: function()
      {
        var masterIndex = +d3.select(this.selectedResizerHandler).attr("side-index");
        var boxX = 0, boxY = 0, boxW = 0, boxH = 0;

        if(masterIndex === 0 || masterIndex === 4)
        {
          boxX = +this.resizer.select(".side-0").attr("x");
          boxY = +this.resizer.select(".side-0").attr("y");
          boxW = +this.resizer.select(".side-4").attr("x");
          boxH = +this.resizer.select(".side-4").attr("y");
        }

        if(masterIndex === 1 || masterIndex === 5)
        {
          boxX = +this.resizer.select(".side-0").attr("x");
          boxY = +this.resizer.select(".side-1").attr("y");
          boxW = +this.resizer.select(".side-4").attr("x");
          boxH = +this.resizer.select(".side-5").attr("y");
        }

        if(masterIndex === 2 || masterIndex === 6)
        {
          boxX = +this.resizer.select(".side-6").attr("x");
          boxY = +this.resizer.select(".side-2").attr("y");
          boxW = +this.resizer.select(".side-2").attr("x");
          boxH = +this.resizer.select(".side-6").attr("y");
        }

        if(masterIndex === 3 || masterIndex === 7)
        {
          boxX = +this.resizer.select(".side-7").attr("x");
          boxY = +this.resizer.select(".side-0").attr("y");
          boxW = +this.resizer.select(".side-3").attr("x");
          boxH = +this.resizer.select(".side-4").attr("y");
        }

        var sideSize = Constants.CLASSIFIER.VIEW.RESIZE_HANDLER_SIZE;
        var box = {x:boxX + sideSize, y:boxY + sideSize, width:boxW, height:boxH};
        this.updateResizer(this.parseBoundingBox(box));
      },

      parseBoundingBox: function(bbox)
      {
        var rect = {};

        rect.x = bbox.x;
        rect.y = bbox.y;
        rect.width = bbox.width - bbox.x;
        rect.height = bbox.height - bbox.y;

        return rect;
      },

      widthLimit: 100,
      heightLimit: 60,

      onResizerHandlersDragStart: function()
      {
        var self = this;
        return function(d)
        {
          console.log("DiagramView::onResizerHandlersDragStart");
          self.selectedResizerHandler = this;
          d3.event.sourceEvent.stopPropagation();
        }
      },

      onResizerHandlersDragMove: function()
      {
        var self = this;
        return function(d)
        {
//          var widthLimitReached = false;
//          var heightLimitReached = false;
//          var resizerWidth = self.resizerRect.attr("width");
//          var resizerHeight = self.resizerRect.attr("height");
//
//          widthLimitReached = resizerWidth <= self.widthLimit;
//          heightLimitReached = resizerHeight <= self.heightLimit;

          var sideIndex = +d3.select(this).attr("side-index");

          if(sideIndex % 2 !== 0)
          {
            if(sideIndex === 3 || sideIndex === 7)
            {
              d.x = d3.event.x;
//              if(!widthLimitReached) d.x = d3.event.x;
//              else d.x = self.widthLimit;
            }

            if(sideIndex === 1 || sideIndex === 5)
            {
              d.y = d3.event.y;
//              if(!heightLimitReached) d.y = d3.event.y;
//              else d.y = self.heightLimit;
            }
          }
          else
          {
            d.x = d3.event.x;
            d.y = d3.event.y;

//            if(!widthLimitReached) d.x = d3.event.x;
//            else d.x = self.widthLimit;
//
//            if(!heightLimitReached) d.y = d3.event.y;
//            else d.y = self.heightLimit;
          }

          d3.select(this).attr("x", d.x).attr("y", d.y);
          //self.updateResizer();
          self.updateResizerBoundingBox();
          d3.event.sourceEvent.stopPropagation();
        }
      },

      onResizerHandlersDragEnd: function()
      {
        var self = this;
        return function(d)
        {
          self.updateResizerBoundingBox();
          self.selectedResizerHandler = null;

          //notify the classifier to resize itself
          self.dispatchEvent("resize-done-" + self.$scope.model.GUID);
          self.updateResizer();
        }
      },

      resetResizer: function()
      {
        var classifierWidth = this.svgNode.select(".classifier-foreign-object").attr("width");
        var classifierHeight = this.svgNode.select(".classifier-foreign-object").attr("height");

        this.resizerRect
          .attr("x", classifierWidth/2)
          .attr("y", classifierHeight/2)
          .attr("width", 0)
          .attr("height", 0);
      }

    });

  }]);