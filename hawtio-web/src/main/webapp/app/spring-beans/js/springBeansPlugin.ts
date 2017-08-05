/**
 * @module SpringBeans
 * @main SpringBeans
 */
/// <reference path="./springBeanHelpers.ts"/>
module SpringBeans {

  export var _module = angular.module('spring-beans', ['bootstrap', 'ngResource', 'ngGrid', 'datatable', 'hawtioCore', 'hawtio-ui']);

  _module.config(["$routeProvider", ($routeProvider) => {
    $routeProvider.
      when('/spring-beans', {templateUrl: 'app/spring-beans/html/spring-beans.html'});
  }]);

  _module.run(["$location", "workspace", "viewRegistry", "layoutFull", "helpRegistry", ($location:ng.ILocationService, workspace:Workspace, viewRegistry, layoutFull, helpRegistry) => {

    viewRegistry['spring-beans'] = layoutFull;

    workspace.topLevelTabs.push({
      id: "spring-beans",
      content: "Spring Beans",
      title: "Diagram of Spring Beans",
      isValid: (workspace:Workspace) => springBeansFolder(workspace),
      href: () => "#/spring-beans"
    });

  }]);

  hawtioPluginLoader.addModule('spring-beans');
}
