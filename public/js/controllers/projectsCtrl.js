angular.module('app').controller('projectsCtrl', function($scope, mainService, $rootScope, $location){

    function getUser() {
        // console.log('getUser function ran!');
        mainService.getUser().then((user) => {
            if (user) {
                $rootScope.currentUser = user;
                $rootScope.isLoggedIn = true;
                // $rootScope.userId = user.id;
                let userId = user.id;
                $scope.getProjects = () => {
                    mainService.getAllProjects(userId).then((response) => {
                        $scope.projects = response;
                    });
                }
                
                $scope.getProjects();

                $scope.updateFav = (isFav, index) => {
                    $scope.projects[index].fav_wf = !isFav.fav_wf;
                    isFav.fav_wf = !isFav.fav_wf;

                    mainService.updateFav(isFav).then((response) => {
                        $scope.newFav = response;
                    });
                }


                //Goes in Canvas Ctrl
                $scope.newProject = (projectData) => {
                    projectData.user_id = userId;
                    mainService.createProject(projectData).then((response) => {
                        $scope.newPro = response;
                    });
                }

                //Favoriting, deleting shapes, creating shapes, sync project, save existing project.
                $scope.updateProject = () => {
                    mainService.updateProject(newData).then((response) => {
                        $scope.updated = response;
                    });
                }

                $scope.deleteProject = (projectId) => {
                    mainService.deleteProject(projectId).then((response) => {
                        $scope.deleted = response;
                    });
                }

            } else {
                $rootScope.isLoggedIn = false;
                // $location.path('homeSplash');
                // console.log('Auth0 Error', err);
            }
        });
    }
    $scope.callUser = getUser();    


})