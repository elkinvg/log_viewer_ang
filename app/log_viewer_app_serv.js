/*global angular:true */
'use strict';

// var app = angular.module('logViewerServApp', ['ui.grid', 'ui.grid.pagination', 'ui.grid.emptyBaseLayer', 'ngMaterial']);

app.controller('tableServCtrl', function ($scope, $http, $controller, uiGridConstants /*, CommonFunctions*/) {
    angular.extend(this, $controller('CommonController', { $scope: $scope }));

    var me = this;

    me.type_mess = me.type_mess_last =  "ВСЕ";
    // Пока максимальный индекс 2  "ВСЕ"
    me.types_mess = ["INFO", "WARNING", "ALARM","ВСЕ"];

    $scope.maxDate = new Date();

    $scope.logData = {
        showGridFooter: true,
        // enableFiltering: true,
        columnDefs: [
            { field: 'timestamp', displayName: 'Время записи', width: '10%', type: 'date',
            cellFilter: 'date:"dd-MM-yyyy HH:mm:ss"'},
            // { field: 'device_name', displayName: 'Имя девайса'},
            {
                field: 'type', displayName: 'Тип', width: '8%',

                cellTemplate: '<div ng-switch on="grid.getCellValue(row, col)" style="height: 100%;">\
                <div class="ui-grid-cell-contents" ng-switch-when="2" style="background-color: rgba(255, 60, 0, 0.877) !important;text-align:center;">ALARM</div>\
                <div class="ui-grid-cell-contents" ng-switch-when="1" style="background-color: rgb(255, 174, 0) !important;text-align:center">WARNING</div>\
                <div class="ui-grid-cell-contents" ng-switch-when="0" style="background-color: rgb(104, 221, 54) !important;text-align:center">INFO</div>\
                <div ng-switch-default style="text-align:center">{{COL_FIELD}}</div>\
                </div>'
            },
            { field: 'logging', displayName: 'Запись' },

            // { field: 'alias', displayName: 'Псевдоним', width: '10%'},
            { field: 'description', displayName: 'Источник', width: '15%' }
        ],
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25
    };


    $scope.getLog_allPosts("tangodev_log", me);

    $scope.getSelectedType = function () {

        if (me.type_mess !== undefined) {
            if ($scope.logData.firstData === undefined) {
                // Данные ещё не загружены
                return me.type_mess;
            }

            // Иначе идёт фильтрация по типу сообщения
            // typeFilter(index);
            $scope.runFilters();

            /*
            if (me.type_mess == me.types_mess[3]) {
                return me.type_mess;
            }

            // Получение индекса принятого me.type_mess
            var index = me.types_mess.indexOf(me.type_mess);

            // Пока максимальный индекс 2
            // Если не выбран один из промежуточных показываются все сообщения
            if ( index < 0 && index > 2) {
                return me.type_mess;
            }
            */
            return me.type_mess;

        } else {
            return "Выберете тип";
        }
    }

    $scope.otherFilters = function () {
        var index = me.types_mess.indexOf(me.type_mess);
        typeFilter(index);

        function typeFilter(index) {
            if (me.types_mess[index] === "ВСЕ") {
                return;
            }
            var newdt = [];
            angular.forEach($scope.logData.data, function (fromLogData) {
                if (fromLogData.type == index) {
                    newdt.push(fromLogData);
                }
            });
    
            $scope.logData.data = newdt;
        }
    }
});