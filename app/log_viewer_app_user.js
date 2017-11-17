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
            // Входящие данные в колонках
            // command_json - команда в JSON с аргументами
            // command_name - имя команды
            // description - описание источника
            // device_name - имя девайса
            // timestamp - время вызова команды
            // user_ip - ip юзера
            // type_req - тип запроса
            // is_command - это команда или запись атрибута
            // status - статус выполнения запроса
            $scope.dataFromRow = row.entity;
            if ($scope.dataFromRow.is_command) {
              $scope.dataFromRow.class_comm_or_attr = "iscommand";
            }
            else {
              $scope.dataFromRow.class_comm_or_attr = "isattr";
            }

            if (angular.isArray($scope.dataFromRow.argin)) {
                var outargin = "["
                angular.forEach($scope.dataFromRow.argin, function(data) {
                    outargin+=" ";
                    outargin+=data;
                    outargin+=" ";
                });
                outargin += "]";
                $scope.dataFromRow.argin = outargin;
            }

        
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
            { 
              field: 'command_name', 
              // displayName: '<b>Команда</b>', 
              width: '15%',
              headerCellTemplate: '<div class="ui-grid-cell-contents" col-index="renderIndex"><span class="iscommand">Команда</span> / <span class="isattr">Атрибут</span></div>',
              cellTemplate : '<div ng-dblclick="grid.appScope.commandClicked(row,col)" class="ui-grid-cell-contents">{{COL_FIELD CUSTOM_FILTERS}}<md-tooltip class="ng-tool-tip">Кликните дважды для получения дополнительной информации</md-tooltip></div>',
              // Для выставления стиля в зависимости от типа данных
              cellClass: function(grid, row) 
              {
                if (row.entity.is_command) {
                  return 'iscommand';
                }
                return 'isattr';
              }
            },
              
            // { field: 'alias', displayName: 'Псевдоним', width: '10%'},
            { field: 'user_ip', displayName: 'IP', width: '8%'},
            { field: 'description', displayName: 'Адресат команды'}
        ],
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25
    };

    $scope.getLog_allPosts("command_history",me);
});