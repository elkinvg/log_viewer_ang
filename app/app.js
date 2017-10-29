'use strict';

var app = angular.module('logViewerApp', ['ui.grid', 'ui.grid.pagination', 'ui.grid.emptyBaseLayer','ngMaterial']);
// , 'ngMaterial', 'ngMessages'
app.controller('tableCtrl',  function ($scope, $http, uiGridConstants) {
    var me = this;
    $scope.maxDate = new Date();

    $scope.logData = {
        showGridFooter: true,
        // enableFiltering: true,
        columnDefs: [
            { field: 'comm_timestamp', displayName: 'Время вызова', width: '10%'},
            // { field: 'device_name', displayName: 'Имя девайса'},
            { field: 'command_name', displayName: 'Команда', width: '15%'},
            // { field: 'alias', displayName: 'Псевдоним', width: '10%'},
            { field: 'user_ip', displayName: 'IP', width: '8%'},
            { field: 'description', displayName: 'Описание'}
        ],
        paginationPageSizes: [25, 50, 75, 100],
        paginationPageSize: 25
    };

    getLog_allPosts();

    function getLog_allPosts() {
        $http.get("/cr_conf/log_viewer/log_from_tango_web_auth.php",
            {params: {type_req: "all_posts"}})
            .then(function (response) {
                generateOut(response.data);
                $scope.logData.data = response.data.command_history;
                $scope.logData.firstData = $scope.logData.data;
            });

        function generateOut(inpData) {
            var command_history = inpData.command_history;
            var device_list = inpData.device_list;

            if (command_history.length) {
                var maxtime = command_history[0].comm_timestamp;
                var mintime = command_history[command_history.length -1].comm_timestamp;
                me.myDateBgn = new Date(mintime);
                me.myDateEnd = new Date(maxtime);
            }

            angular.forEach(command_history, function(array_out) {
                if (device_list[array_out.alias] !== undefined ) {
                    Object.assign(array_out, device_list[array_out.alias]);
                }
            });
        }
    }

    $scope.dateBgnChng = function () {
        filterDate(me.myDateBgn, me.myDateEnd);
    };

    $scope.dateEndChng = function () {
        filterDate(me.myDateBgn, me.myDateEnd);
    };

    function filterDate(bgnDt, endDt) {
        bgnDt.setHours(0,0,0);
        endDt.setHours(23,59,59);
        var newdt = [];
        angular.forEach($scope.logData.firstData, function (fromLogData) {
            var date = new Date(fromLogData.comm_timestamp);
            if (date > bgnDt && date < endDt) {
                newdt.push(fromLogData);
            }
        });
        $scope.logData.data = newdt;
    }
});

app.config(function($mdDateLocaleProvider) {

    $mdDateLocaleProvider.months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    $mdDateLocaleProvider.shortMonths = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл',
        'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    $mdDateLocaleProvider.days = ['Воскресение', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    $mdDateLocaleProvider.shortDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    // Can change week display to start on Monday.
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    // Optional.

    $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
        return 'Неделя ' + weekNumber;
    };
    $mdDateLocaleProvider.msgCalendar = 'Календарь';
    $mdDateLocaleProvider.msgOpenCalendar = 'Календарь';

    $mdDateLocaleProvider.formatDate = function(date) {
        return moment(date).format('DD-MM-YYYY');
    };
});