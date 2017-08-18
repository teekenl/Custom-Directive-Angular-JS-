// Grid Screen Directive
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

// Grid Column Directive
angular.module("app").directive("gridColumns",function(){
    return{
        restrict: 'E',
        require: ['^gridScreen', 'gridColumns'],
        controller: function(){
            var column = [];
            this.addColumn = function(col){
                column.push(col);
            };
            this.getColumns  = function(){
                return column;
            }
        },
        link: function(scope, element, attr,controller) {
            var gridScreenController = controller[0];
            var gridColumnsController = controller[1];
            gridScreenController.setColumns(gridColumnsController.getColumns());
            console.log('linked Grid Columns');
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
           console.log("linked Column", attr.title);
       }
   };
});

angular.module("app").directive("grid",function(){
    return {
        restrict: 'E',
        templateUrl: "table.html",
        replace: true,
        controller: function ($scope) {
            $scope.$on('render', function (e, rows, cols) {
                $scope.rows = rows;
                $scope.cols = cols;
            });
        }
    };
});

// With Inline Editor Directive
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

// Editor link initializer directive
angular.module("app").directive("editorLink",function($compile,$templateCache){
    return{
        restrict: 'E',
        templateUrl: 'edit_link.html',
        controller: function($scope){
            $scope.editing = false;
            $scope.edit = function(row){
                $scope.$broadcast('edit',row);
            };
        },
        link: function(scope,element,attributes) {
            scope.$on("edit",function(e,row){
               scope.editing = !scope.editing;
               $(element.parents("tr")).toggleClass('editing',scope.editing);
               if(scope.editing){
                   scope.editor = scope.editor || $compile($templateCache.get('edit.html'))(scope);
                   $(scope.editor).insertAfter(element.parents("tr"));
               } else{
                   $(scope.editor).remove();
               }
            });
            console.log("linked edit_link ");
        }
    }
});