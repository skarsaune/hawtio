/**
 * @module SpringBeans
 */
/// <reference path="../../baseIncludes.ts"/>
/// <reference path="../../core/js/coreHelpers.ts"/>
module SpringBeans {

  export var log:Logging.Logger = Logger.get("SpringBeans");
    
  export function springBeansFolder(workspace:Workspace) {
      for(var key in workspace.tree.children) {
          var folder:NodeSelection = workspace.tree.children[key];
          if(folder.domain && folder.domain.startsWith('spring@')) {
              return folder;
          } 
      }
      return null;
  }
    

}
