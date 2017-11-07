/*global angular:true */
'use strict';

// var app = angular.module('logViewerApp', ['ui.grid', 'ui.grid.pagination', 'ui.grid.emptyBaseLayer','ngMaterial']);
// , 'ngMaterial', 'ngMessages'
app.controller('tableCtrl',  function ($scope, $http, $controller, uiGridConstants /*, CommonFunctions*/) {

    angular.extend(this,$controller('CommonController', {$scope: $scope}));

    var me = this;
    $scope.maxDate = new Date();

    $scope.logData = {
        showGridFooter: true,
        // enableFiltering: true,
        columnDefs: [
            { field: 'timestamp', displayName: 'Время вызова', width: '10%'},
            // { field: 'device_name', displayName: 'Имя девайса'},
            { field: 'command_name', displayName: 'Команда', width: '15%'},
            // { field: 'alias', displayName: 'Псевдоним', width: '10%'},
            { field: 'user_ip', displayName: 'IP', width: '8%'},
            { field: 'description', displayName: 'Источник'}
        ],
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25
    };

    $scope.getLog_allPosts("command_history",me);
});