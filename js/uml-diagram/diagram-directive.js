'use strict';

angular.module('d3-uml-modeler.uml-diagram')
	.factory('DiagramDirective', [
		"DiagramView", "BaseDirective", "Constants", "Notifications",
		function(DiagramView, BaseDirective, Constants, Notifications)
		{
			return BaseDirective.extend(
			{
				init:function($scope, $element, $attributes)
				{
					BaseDirective.prototype.init.call(this, $scope, $element, $attributes);
					this.draw();
				},

				initListeners: function()
				{
					BaseDirective.prototype.initListeners.call(this);
				},

				draw: function()
				{
					var originalWidth = document.getElementById('section-content').clientWidth;
					var originalHeight = document.getElementById('section-content').clientHeight;
					var HoffsetAndMargin = Constants.DIAGRAM_MARGIN.LEFT + Constants.DIAGRAM_MARGIN.RIGHT;
//					var VoffsetAndMargin = Constants.MENU_HEIGHT + Constants.NAVBAR_HEIGHT + Constants.DIAGRAM_MARGIN.TOP + Constants.DIAGRAM_MARGIN.BOTTOM;
					var VoffsetAndMargin = Constants.DIAGRAM_MARGIN.TOP + Constants.DIAGRAM_MARGIN.BOTTOM;

					var config = {
						width : originalWidth - HoffsetAndMargin,
						height : originalHeight - VoffsetAndMargin,
						gridTicksPadding: 20,
						gridColor: "gray"
					};

					this.view = new DiagramView(this.$scope, this.$element[0], config);
					this.view.render();

					//free memory
					originalWidth = null;
					originalHeight = null;
					HoffsetAndMargin = null;
					VoffsetAndMargin = null;
					config = null;
					//TODO: view = null;
				},

				positionBase: function()
				{
					this.svgNode.attr("transform", "translate(" + this.marginLeft() + "," + this.marginTop() + ")");
				}

			});
		}]
	);

/* Directives */
angular.module('d3-uml-modeler.uml-diagram')
	.directive('diagram', ["DiagramDirective",
	function(DiagramDirective) {
		return {

			restrict: "E",
			templateUrl: "views/diagram.html",

			link: function($scope, $element, $attributes)
			{
				new DiagramDirective($scope, $element, $attributes);
			}

		};
	}]);
