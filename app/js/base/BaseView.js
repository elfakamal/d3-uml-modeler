'use strict';

angular.module("d3-uml-modeler.view")
	.factory("BaseView", ["EventDispatcher", "Notifications", function(EventDispatcher, Notifications){

		return EventDispatcher.extend(
		{
			notifications	: null,
			$scope				: null,
			config				: null,
			$el						: null,
			svgNode				: null,
			colorScale		: null,

			/**
			 *
			 * @returns {undefined}
			 */
			init: function ($scope, element, config)
			{
				this.$scope = $scope;
				this.$el = element;
				this.config = config;
				this.notifications = Notifications;
			},

			initListeners: function()
			{
				//Override
			},

			/**
			 *
			 * @returns {undefined}
			 */
			initParameters: function()
			{
				this.initColorScale();
			},

			/**
			 * this function needs to be overriden.
			 */
			initColorScale: function()
			{
				var colors = this.generateColors();
				this.colorScale = d3.scale.ordinal().range(colors);
			},

			render: function()
			{
				this.initParameters();
				this.drawChart();
			},

			drawChart: function()
			{
				this.drawBase();
			},

			/**
			 * Abstract Method
			 * @returns {undefined}
			 */
			drawBase: function()
			{
				throw new Error("This is an abstract method, you must override it.");
			},

			/**
			 * Abstract function
			 */
			update: function()
			{
				this.initParameters();
			},

			marginTop: function()
			{
				return 0;
			},

			marginRight: function()
			{
				return 0;
			},

			marginBottom: function()
			{
				return 0;
			},

			marginLeft: function()
			{
				return 0;
			},

			/**
			 * Abstract function
			 */
			generateColors: function(count)
			{
				if(typeof count === "undefined" && count === null)
					throw new Error("count is undefined");

				var colors = [];

				var iterator = function()
				{
					var R, G, B;

					R = Math.round(Math.random() * 255);
					G = Math.round(Math.random() * 255);
					B = Math.round(Math.random() * 255);

					var rgb = [R, G, B, .5];
					var strRGB = "rgba(" + rgb.join(",") + ")";
					colors.push(strRGB);

					//free memory
					rgb = null;
					strRGB = "";
				};

				for(var i = 0; i < count; i++) iterator();

				return colors;
			},

			/**
			 * Abstract function
			 */
			getChartIcon: function()
			{
				throw new Error("This is an abstract method, you must override it.");
			},

			show: function()
			{
				this.$el.css("display", "block").css("overflow", "auto");
			},

			hide: function()
			{
				this.$el.css("display", "none").css("overflow", "hidden");
			},

			/**
			 * free memory.
			 */
			dispose: function()
			{
				this.svgNode.remove();
				this.svgNode = null;
			}
		});}]);