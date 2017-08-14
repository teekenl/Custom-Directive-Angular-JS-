angular.module("app").directive("gridScreen",function($http){
    return{
        restrict: 'E',
        controller: function($scope){
            this.setEditor = function(editor) {
                $scope.cols.unshift(editor);
            };
            this.setColumns = function(cols){
                $scope.cols = cols;
            };
        },
        link: function(scope,element,attr) {
            $http.get(attr.resource).success(function(response){
                scope.rows = response.data;
                scope.$broadcast('render',scope.rows,scope.cols);
            });
        }
    };
});

angular.module("app").directive("gridColumns",function(){
    return{
        restrict: 'E',
        require: ['^gridScreen', 'gridColumns'],
        controller: function(){
            var column = [];
            this.addColumn = function(col){
                column.push(col);
            };
            this.getColumn  = function(){
                return column;
            }
        },
        link: function(scope, element, attr,controller) {
            var gridScreenController = controller[0];
            var gridColumnsController = controller[1];
            gridScreenController.setColumns(gridColumnsController.getColumn();
        }
    };
});

angular.module("app").directive("gridColumn",function(){
   return{
       restrict: 'E',
       require: '^gridColumns',
       link: function(scope,element, attr, gridColumnsController){
           gridColumnsController.addColumn({
               title: attr.title,
               field: attr.field
           });
       }
   };
});

angular.module("app").directive("grid",function(){
    return {
        restrict: 'E',
        templateUrl: "/template/as_table.html",
        replace: true,
        controller: function ($scope) {
            $scope.$on('render', function (e, rows, cols) {
                $scope.rows = rows;
                $scope.cols = cols;
            });
        }
    };
});

angular.module("app").directive("withInlineEditor", function() {
    return {
        restrict: 'A',
        require: '^gridScreen',
        link: function(scope, element, attributes, gridScreenController) {
            gridScreenController.setEditor({
                title: "Edit",
                field: ""
            });
            console.log('linked withInlineEditor');
        }
    };
});