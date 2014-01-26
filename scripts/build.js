#!/usr/bin/env node

var compressor = require('node-minify');
var buildConfig = require("../config/build-config.js");

// Using Google Closure Compressor for JS
new compressor.minify({
	type: 'gcc',
	fileIn: buildConfig.buildJSFiles,
	fileOut: 'build/d3.uml.modeler.js',

	callback: function(err, min)
	{
		console.log("done !");
		console.log(err);
	}
});

// Using YUI Compressor for CSS
new compressor.minify({
	type: 'yui-css',
	fileIn: buildConfig.buildCSSFiles,
	fileOut: 'build/d3.uml.modeler.css',

	callback: function(err, min)
	{
		console.log(err);
	}
});

