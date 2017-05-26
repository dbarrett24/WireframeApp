angular.module('app').directive('navBar', function(){
    return {
        restrict: 'E',
        templateUrl: './views/directives/navBar.html',
        link: function(scope, elem, attrs){
            $('#save').hover(
                function(){$('tip-save').addClass('fadeIn');
            })
            
        },
        controller: function($scope, mainService){
            $scope.logout = mainService.logout;
            if(!$scope.projectName){
            	$scope.projectName = 'Untitled';
            }
        }
    }
});