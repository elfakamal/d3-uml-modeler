'use strict';

/* Filters */

angular.module('d3-uml-modeler.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);

/**
 * this filter is a patch to allow regular 
 * filter notation on object collections
 */
angular.module('d3-uml-modeler.filters', []).
  filter('propertyTypeFilter', ["_", function(_) {
    return function(propertyCollection, needle) {
      return _.filter(propertyCollection, function(property){
        return _.isEqual(needle, _.pick(property, _.keys(needle)));
      });
    }
  }]);

