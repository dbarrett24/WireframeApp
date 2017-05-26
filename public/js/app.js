angular.module('app', ['ui.router', 'ngAnimate'])
.config(function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: './views/homeSplash.html',
                controller: 'homeSplashCtrl',
                authenticate: false
            })
            .state('projects', {
                url: '/projects',
                templateUrl: './views/projects.html',
                controller: 'projectsCtrl',
                authenticate: true
            })
            .state('canvas', {
                url: '/canvas',
                templateUrl: './views/canvas.html',
                controller: 'canvasCtrl',
                authenticate: true
            })
            .state('mycanvas', {
                url: '/canvas/:id',
                templateUrl: './views/canvas.html',
                controller: 'canvasCtrl',
                authenticate: true
            })
            // console.log($urlRouterProvider)
            $urlRouterProvider.otherwise('/');
});


angular.module("app").run(function ($rootScope, $state, mainService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState,fromParams) {
        if (toState.authenticate && !mainService.getUser()) {
            // User isn’t authenticated
            $state.transitionTo("home");
            event.preventDefault();
        }
    });
});
