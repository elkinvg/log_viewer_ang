/*global angular:true */
'use strict';

// var app = angular.module('logViewerApp', ['ui.grid', 'ui.grid.pagination', 'ui.grid.emptyBaseLayer','ngMaterial']);
// , 'ngMaterial', 'ngMessages'
app.controller('tableCtrl',  function ($scope, $http, $controller, uiGridConstants, $mdDialog /*, CommonFunctions*/) {

    angular.extend(this,$controller('CommonController', {$scope: $scope}));
    
    var me = this;
    $scope.maxDate = new Date();

    $scope.commandClicked = function (row, col){
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'dialog.tmp1.html',
            parent: angular.element(document.body),
            //targetEvent: ev,
            clickOutsideToClose:true,
            //fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals: {
                row: row
              },
          })
          .then(function(answer) {
            //$scope.status = 'You said the information was "' + answer + '".';
          }, function() {
            //$scope.status = 'You cancelled the dialog.';
          });

          function DialogController($scope, $mdDialog, row) {
            // command_json - команда в JSON с аргументами
            // command_name - имя команды
            // description - описание источника
            // device_name - имя девайса
            // timestamp - время вызова команды
            // user_ip - ip юзера
            $scope.dataFromRow = row.entity;

            var commandJson = angular.fromJson($scope.dataFromRow.command_json);

            $scope.dataFromRow.command_name = commandJson.command;
            $scope.dataFromRow.argin = commandJson.argin;
        
            // Просто закрыть диалоговое окно
            $scope.cancel = function() {
              $mdDialog.cancel();
            };
          }
    }
    

    $scope.logData = {
        showGridFooter: true,
        // enableFiltering: true,
        columnDefs: [
            { 
              field: 'timestamp', displayName: 'Время вызова', width: '10%', type: 'date',
              cellFilter: 'date:"dd-MM-yyyy HH:mm:ss"'
          },
            // { field: 'device_name', displayName: 'Имя девайса'},
            { field: 'command_name', displayName: 'Команда', width: '15%', cellTemplate : '<div ng-dblclick="grid.appScope.commandClicked(row,col)" class="ui-grid-cell-contents">{{COL_FIELD CUSTOM_FILTERS}}<md-tooltip class="ng-tool-tip">Кликните дважды для получения дополнительной информации</md-tooltip></div>'},
            // { field: 'alias', displayName: 'Псевдоним', width: '10%'},
            { field: 'user_ip', displayName: 'IP', width: '8%'},
            { field: 'description', displayName: 'Источник'}
        ],
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25
    };

    $scope.getLog_allPosts("command_history",me);
});