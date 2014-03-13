var jsFiles = [

	"app/lib/jquery.nestable.js",

	"app/lib/class.js",
	"app/lib/util.js",

	"app/js/base/BaseBootstrapModules.js",
	"app/js/base/BaseView.js",

	"app/js/base/underscore.js",
	"app/js/app.js",
	"app/js/empty-mocks.js",
	"app/js/constants.js",
	"app/js/base/EventDispatcher.js",
	"app/js/base/Notifications.js",
	"app/js/base/BaseController.js",
	"app/js/base/uml-model-abstract-factory.js",
	"app/js/base/BaseModelElement.js",
	"app/js/base/UmlController.js",
	"app/js/base/BaseDirective.js",
	"app/js/base/FirebaseSyncController.js",

	"app/js/login/login-controller.js",
	"app/js/login/user-model.js",

	"app/js/editor/property-editor.js",
	"app/js/editor/classifier-editor.js",
	"app/js/editor/editor-directive.js",

	"app/js/uml-property/property-model.js",
	"app/js/uml-property/property-directive.js",

	"app/js/uml-classifier/classifier-model.js",
	"app/js/uml-classifier/classifier-resizer.js",
	"app/js/uml-classifier/classifier-picker.js",
	"app/js/uml-classifier/classifier-view.js",
	"app/js/uml-classifier/classifier-directive.js",
	"app/js/uml-classifier/classifier-controller.js",

	"app/js/uml-diagram/diagram-model.js",
	"app/js/uml-diagram/diagram-controller.js",
	"app/js/uml-diagram/diagram-view.js",
	"app/js/uml-diagram/diagram-directive.js",

	"app/js/workspace/workspace-model.js",
	"app/js/workspace/workspace-navbar-directive.js",
	"app/js/workspace/workspace-tree-directive.js",
	"app/js/workspace/workspace-controller.js",

	"app/js/element-list/element-list-model.js",
	"app/js/element-list/element-list-controller.js",

	"app/js/filters.js",
	"app/js/directives.js"
];

var cssFiles = [
	"app/css/aside.css",
	"app/css/classifier.css",
	"app/css/collection.css",
	"app/css/content.css",
	"app/css/editor.css",
	"app/css/workspace.css",
	"app/css/workspace-tree.css",
	
	"app/css/diagram.css",
	"app/css/fonts.css",
	"app/css/footer.css",
	"app/css/icons.css",
	"app/css/main.css",
	"app/css/menu.css",
	"app/css/menu.icons.css",
	"app/css/search.css",
	"app/css/tour.css",
	"app/css/uml-element-list.css"
];

module.exports.buildJSFiles = jsFiles;
module.exports.buildCSSFiles = cssFiles;
