#!/usr/bin/env node

var compressor = require('node-minify');
var buildConfig = require("../config/build-config.js");

// Using Google Closure Compressor for JS
new compressor.minify({
	type: 'gcc',
	fileIn: buildConfig.buildJSFiles,
	fileOut: 'public/js/d3.uml.modeler.js',

	callback: function(err, min)
	{
		console.log("Google Closure Compressor for JS Done !");
		if(err) console.log(err);
	}
});

// Using YUI Compressor for CSS
new compressor.minify({
	type: 'yui-css',
	fileIn: buildConfig.buildCSSFiles,
	fileOut: 'public/css/d3.uml.modeler.css',

	callback: function(err, min)
	{
		console.log("YUI Compressor for CSS Done !");
		if(err) console.log(err);
	}
});

