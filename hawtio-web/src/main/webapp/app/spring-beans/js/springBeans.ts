/**
 * @module SpringBeans
 */
/// <reference path="./springBeanHelpers.ts"/>
/// <reference path="./springBeansPlugin.ts"/>
module SpringBeans {

    _module.controller("SpringBeans.SpringBeansController", ["$scope", "$location", "$routeParams", "workspace", "jolokia", ($scope, $location, $routeParams, workspace: Workspace, jolokia: Jolokia.IJolokia) => {

        var beanCount = 0;
        var beansHandled = 0;
        var connection = $routeParams.con;

        function parseName(mbeanReference: string) {
            var parsedName = /.+?:name=(.+)/.exec(mbeanReference);
            if (parsedName && parsedName[1]) {
                return parsedName[1];
            } else {
                return null;
            }
        }
        function addLinksAndDetails(response, nameToNode, graphBuilder) {
            var name = parseName(response.request.mbean);
            var node = nameToNode[name];

            for (var property in response.value) {
                var propertyValue = response.value[property]
                if (propertyValue && propertyValue.beanref) {
                    var referencedBeanName = parseName(propertyValue.beanref.objectName);
                    if (referencedBeanName) {
                        graphBuilder.addLink(name, referencedBeanName, 'uses');
                    }
                } else {
                    if (!node.popup) {
                        node.popup = { title: 'Spring bean[' + name + ']' };
                        node.popup.content = '';
                    }
                    node.popup.content += property + '=' + propertyValue + '<br>';
                }
            }
            beansHandled++;
            //only refresh after all callbacks are handled
            if (beansHandled == beanCount) {
                $scope.graph = graphBuilder.buildGraph();
                Core.$apply($scope);
            }

        }
    
        $scope.updateGraph = () => {

            var graphBuilder = new ForceGraph.GraphBuilder();
            var folder = springBeansFolder(workspace);
            if (folder) {
                var requests = [];
                var nameToNode = {};
                for (var i = 0; i < folder.children.length; i++) {
                    var childFolder = folder.children[i];
                    if (childFolder.objectName) {
                        var name = childFolder.entries.name;
                        var url = '#/jmx/attributes?nid=' + childFolder.key;
                        //workaround: for d3 the usual url handling of hawtio does not seem to be enforced
                        //therefore manually add con if required
                        if (connection) {
                            url += '&con=' + connection;
                        }
                        var node = { id: name, name: name, navUrl: url, image: { url: 'img/icons/spring/spring-logo.png' , width: 32, height:32} };
                        graphBuilder.addNode(node);
                        nameToNode[name] = node;
                        if (name.indexOf(':') == -1) {
                            requests.push({ type: 'read', mbean: childFolder.objectName, arguments: [] });
                        }
                    }
                }
                beanCount = requests.length;
                jolokia.request(requests, onSuccess((response) => addLinksAndDetails(response, nameToNode, graphBuilder)));
            }
        };


    $scope.updateGraph();
}]);
}
