'use strict';

angular.module('app', ['ui.router', 'ngAnimate']).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: './views/homeSplash.html',
        controller: 'homeSplashCtrl',
        authenticate: false
    }).state('projects', {
        url: '/projects',
        templateUrl: './views/projects.html',
        controller: 'projectsCtrl',
        authenticate: true
    }).state('canvas', {
        url: '/canvas',
        templateUrl: './views/canvas.html',
        controller: 'canvasCtrl',
        authenticate: true
    }).state('mycanvas', {
        url: '/canvas/:id',
        templateUrl: './views/canvas.html',
        controller: 'canvasCtrl',
        authenticate: true
    });
    // console.log($urlRouterProvider)
    $urlRouterProvider.otherwise('/');
});

angular.module("app").run(function ($rootScope, $state, mainService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !mainService.getUser()) {
            // User isn’t authenticated
            $state.transitionTo("home");
            event.preventDefault();
        }
    });
});
'use strict';

angular.module('app').controller('canvasCtrl', function ($scope, mainService, $document, $compile) {

  var canvas = angular.element(document.querySelector('#canvas'));
  var toolbar = angular.element(document.querySelector('#toolbar'));
  var shapeToolbar = angular.element(document.querySelector('#shapeToolbar'));

  $scope.elementColor = "white";

  $scope.myFunc = function (myE) {
    $scope.x = myE.clientX;
    $scope.y = myE.clientY;
  };

  $scope.number = 1;

  $scope.allowDraw = true;

  $scope.startDraw = function (event) {
    if ($scope.allowDraw) {
      $scope.shapeStyle = {
        "fill": "white",
        "stroke": "black",
        "stroke-width": "1",
        "opacity": "0.8",
        "cursor": "move"
      };
      $scope.shapeToolbarShow = false;
      $scope.toolbarShow = false;
      $scope.x1 = 0;
      $scope.x2 = 0;
      $scope.y1 = 0;
      $scope.y2 = 0;
      $scope.tempXLocation = 0;
      $scope.tempYLocation = 0;
      $scope.shadowX = 0;
      $scope.shadowY = 0;
      $scope.shapeHeight = 0;
      $scope.shapeWidth = 0;
      $scope.showShadow = false;
      $scope.showShadow2 = false;
      $scope.tempXLocation = event.clientX;
      $scope.tempYLocation = event.clientY;
      $scope.toolbarShow = false;
      event.preventDefault();
      $document.on("mousemove", draw);
    }
  };

  function draw(event) {
    $scope.showShadow = true;
    $scope.showShadow2 = false;
    $scope.x1 = $scope.tempXLocation;
    $scope.y1 = $scope.tempYLocation;
    $scope.x2 = event.clientX;
    $scope.y2 = event.clientY;

    if ($scope.tempXLocation >= event.clientX) {
      $scope.xLocation = event.clientX;
    } else {
      $scope.xLocation = $scope.tempXLocation;
    }

    if ($scope.tempYLocation >= event.clientY) {
      $scope.yLocation = event.clientY - 60;
    } else {
      $scope.yLocation = $scope.tempYLocation - 60;
    }

    if ($scope.x2 >= $scope.x1) {
      $scope.shapeWidth = $scope.x2 - $scope.x1;
    } else {
      $scope.shapeWidth = $scope.x1 - $scope.x2;
    }
    if ($scope.y2 >= $scope.y1) {
      $scope.shapeHeight = $scope.y2 - $scope.y1;
    } else {
      $scope.shapeHeight = $scope.y1 - $scope.y2;
    }
  }

  $scope.endDraw = function (event) {
    if ($scope.allowDraw) {
      $scope.showShadow = false;
      $scope.showShadow2 = true;
      $scope.shadowX = event.clientX - $scope.tempXLocation;
      $scope.shadowY = event.clientY - $scope.tempYLocation;

      if ($scope.tempXLocation >= event.clientX) {
        $scope.shadowXLocation = event.clientX;
      } else {
        $scope.shadowXLocation = $scope.tempXLocation;
      }

      if ($scope.tempYLocation >= event.clientY) {
        $scope.shadowYLocation = event.clientY - 60;
      } else {
        $scope.shadowYLocation = $scope.tempYLocation - 60;
      }

      if ($scope.x2 >= $scope.x1) {
        $scope.shadowX = $scope.x2 - $scope.x1;
      } else {
        $scope.shadowX = $scope.x1 - $scope.x2;
      }
      if ($scope.y2 >= $scope.y1) {
        $scope.shadowY = $scope.y2 - $scope.y1;
      } else {
        $scope.shadowY = $scope.y1 - $scope.y2;
      }
      var shadowYtoolbar = $scope.shadowYLocation.toString() + "px";
      var shadowXtoolbar = $scope.shadowXLocation.toString() + "px";
      $scope.toolbarStyle = {
        "position": "absolute",
        "top": shadowYtoolbar,
        "left": shadowXtoolbar
      };

      $document.unbind("mousemove", draw);
      if ($scope.shadowX > 5 || $scope.shadowY > 5) {
        $scope.toolbarShow = true;
      }
    }

    $scope.allowDrawFunc();
  };

  $scope.createBox = function () {
    var template = "<svg class='draggable' width='100%' height='100%'><rect ng-mousedown='disableDrawFunc($event)' ng-mousemove='dragRect($event)' ng-click='showRectToolbar($event)' x=" + $scope.shadowXLocation + " y=" + $scope.shadowYLocation + " width=" + $scope.shadowX + " height=" + $scope.shadowY + " ng-style='shapeStyle' id='dynamicId" + $scope.tempXLocation + $scope.tempYLocation + "' />  </svg>";
    var linkFn = $compile(template);
    var content = linkFn($scope);
    canvas.append(content);
    $scope.showShadow2 = false;
    $scope.toolbarShow = false;
  };

  $scope.createEllipse = function () {
    var template = "<svg width='100%' height='100%'><ellipse ng-mousedown='disableDrawFunc($event)' ng-mousemove='dragEllipse($event)' ng-click='showEllipseToolbar($event)' cx=" + ($scope.shadowXLocation + $scope.shadowX / 2) + " cy=" + ($scope.shadowYLocation + $scope.shadowY / 2) + " rx=" + $scope.shadowX / 2 + " ry=" + $scope.shadowY / 2 + " ng-style='shapeStyle' id='dynamicId" + $scope.tempXLocation + $scope.tempYLocation + "' />    </svg>";
    var linkFn = $compile(template);
    var content = linkFn($scope);
    canvas.append(content);
    $scope.showShadow2 = false;
    $scope.toolbarShow = false;
  };

  $scope.createCircle = function () {
    var template = "<svg width='100%' height='100%'><circle ng-mousedown='disableDrawFunc($event)' ng-mousemove='dragCircle($event)' ng-click='showCircleToolbar($event)' cx=" + ($scope.shadowXLocation + $scope.shadowX / 2) + " cy=" + ($scope.shadowYLocation + $scope.shadowX / 2) + " r=" + $scope.shadowX / 2 + " ng-style='shapeStyle' id='dynamicId" + $scope.tempXLocation + $scope.tempYLocation + "' class='animated rollIn'/>    </svg>";
    var linkFn = $compile(template);
    var content = linkFn($scope);
    canvas.append(content);
    $scope.showShadow2 = false;
    $scope.toolbarShow = false;
  };

  $scope.createRoundedBox = function () {
    var template = "<svg width='100%' height='100%'><rect ng-mousedown='disableDrawFunc($event)' ng-mousemove='dragRect($event)' ng-click='showRectToolbar($event)' x=" + $scope.shadowXLocation + " y=" + $scope.shadowYLocation + " rx='20' ry='20' width=" + $scope.shadowX + " height=" + $scope.shadowY + " ng-style='shapeStyle' id='dynamicId" + $scope.tempXLocation + $scope.tempYLocation + "' class='animated jello' />    </svg>";
    var linkFn = $compile(template);
    var content = linkFn($scope);
    canvas.append(content);
    $scope.showShadow2 = false;
    $scope.toolbarShow = false;
  };

  $scope.shapeStyle = {
    "fill": "white",
    "stroke": "black",
    "stroke-width": "1",
    "opacity": "0.8",
    "cursor": "move"
  };

  $scope.allowDrawFunc = function () {
    $scope.allowDraw = true;
  };

  $scope.disableDrawFunc = function (event) {
    $scope.shapeID = event.target.attributes.id.nodeValue;
    $scope.allowDrag = true;
    $scope.allowDraw = false;
    $document.on('mouseup', dropShape);
  };

  $scope.dragRect = function (event) {
    var moveRect = angular.element(document.querySelector('#' + $scope.shapeID));
    if ($scope.allowDrag) {
      $scope.shapeToolbarShow = false;
      moveRect.attr("x", event.clientX - event.target.attributes.width.nodeValue / 2);
      moveRect.attr('y', event.clientY - 60 - event.target.attributes.height.nodeValue / 2);
    }
  };

  $scope.dragEllipse = function (event) {
    var moveEllipse = angular.element(document.querySelector('#' + $scope.shapeID));
    if ($scope.allowDrag) {
      $scope.shapeToolbarShow = false;
      moveEllipse.attr("cx", event.clientX);
      moveEllipse.attr('cy', event.clientY - 60);
    }
  };
  $scope.dragCircle = function (event) {
    var moveCircle = angular.element(document.querySelector('#' + $scope.shapeID));
    if ($scope.allowDrag) {
      $scope.shapeToolbarShow = false;
      moveCircle.attr("cx", event.clientX);
      moveCircle.attr('cy', event.clientY - 60);
    }
  };

  function dropShape(event) {
    $scope.allowDrag = false;
    var moveShape = angular.element(document.querySelector('#' + $scope.shapeID));
    moveShape.attr("id", "dynamicId" + event.clientX + event.clientY);
  }

  $scope.showRectToolbar = function (event) {
    console.log($scope.shapeID);
    $scope.shapeToolbarShow = true;
    var shapeToolbarY = event.target.attributes.y.nodeValue.toString() + "px";
    var shapeToolbarX = event.target.attributes.x.nodeValue.toString() + "px";
    $scope.shapeToolbarStyle = {
      "position": "absolute",
      "top": shapeToolbarY,
      "left": shapeToolbarX
    };
    $scope.shapeStyle = {
      "fill": $scope.elementColor,
      "stroke": "blue",
      "stroke-width": "2",
      "opacity": "0.8",
      "cursor": "move"
    };
    var shapeClass = angular.element(document.querySelector('#' + $scope.shapeID));
    console.log(shapeClass);
    shapeClass.addClass("button");
  };

  $scope.showCircleToolbar = function (event) {
    $scope.shapeToolbarShow = true;
    var shapeToolbarY = event.target.attributes.cy.nodeValue - event.target.attributes.r.nodeValue + "px";
    var shapeToolbarX = event.target.attributes.cx.nodeValue - event.target.attributes.r.nodeValue + "px";
    $scope.shapeToolbarStyle = {
      "position": "absolute",
      "top": shapeToolbarY,
      "left": shapeToolbarX
    };
    $scope.shapeStyle = {
      "fill": $scope.elementColor,
      "stroke": "blue",
      "stroke-width": "2",
      "opacity": "0.8",
      "cursor": "move"
    };
  };

  $scope.showEllipseToolbar = function (event) {
    $scope.shapeToolbarShow = true;
    var shapeToolbarY = event.target.attributes.cy.nodeValue - event.target.attributes.ry.nodeValue + "px";
    var shapeToolbarX = event.target.attributes.cx.nodeValue - event.target.attributes.rx.nodeValue + "px";
    $scope.shapeToolbarStyle = {
      "position": "absolute",
      "top": shapeToolbarY,
      "left": shapeToolbarX
    };
    $scope.shapeStyle = {
      "fill": $scope.elementColor,
      "stroke": "blue",
      "stroke-width": "2",
      "opacity": "0.8",
      "cursor": "move"
    };
  };
});
'use strict';

angular.module('app').controller('homeSplashCtrl', function ($scope, mainService) {
	console.log('homeSplashCTRL!!!!!');

	var waterfallCanvas = function waterfallCanvas(c, cw, ch) {

		var _this = this;
		this.c = c;
		this.ctx = c.getContext('2d');
		this.cw = cw;
		this.ch = ch;

		this.particles = [];
		this.particleRate = 6;
		this.gravity = .15;

		this.init = function () {
			this.loop();
		};

		this.reset = function () {
			this.ctx.clearRect(0, 0, this.cw, this.ch);
			this.particles = [];
		};

		this.rand = function (rMi, rMa) {
			return ~~(Math.random() * (rMa - rMi + 1) + rMi);
		};

		this.Particle = function () {
			var newWidth = _this.rand(1, 20);
			var newHeight = _this.rand(1, 45);
			this.x = _this.rand(10 + newWidth / 2, _this.cw - 10 - newWidth / 2);
			this.y = -newHeight;
			this.vx = 0;
			this.vy = 0;
			this.width = newWidth;
			this.height = newHeight;
			this.hue = _this.rand(200, 220);
			this.saturation = _this.rand(30, 60);
			this.lightness = _this.rand(30, 60);
		};

		this.Particle.prototype.update = function (i) {
			this.vx += this.vx;
			this.vy += _this.gravity;
			this.x += this.vx;
			this.y += this.vy;
		};

		this.Particle.prototype.render = function () {
			_this.ctx.strokeStyle = 'hsla(' + this.hue + ', ' + this.saturation + '%, ' + this.lightness + '%, .05)';
			_this.ctx.beginPath();
			_this.ctx.moveTo(this.x, this.y);
			_this.ctx.lineTo(this.x, this.y + this.height);
			_this.ctx.lineWidth = this.width / 2;
			_this.ctx.lineCap = 'round';
			_this.ctx.stroke();
		};

		this.Particle.prototype.renderBubble = function () {
			_this.ctx.fillStyle = 'hsla(' + this.hue + ', 40%, 40%, 1)';
			_this.ctx.fillStyle = 'hsla(' + this.hue + ', ' + this.saturation + '%, ' + this.lightness + '%, .3)';
			_this.ctx.beginPath();
			_this.ctx.arc(this.x + this.width / 2, _this.ch - 20 - _this.rand(0, 10), _this.rand(1, 8), 0, Math.PI * 2, false);
			_this.ctx.fill();
		};

		this.createParticles = function () {
			var i = this.particleRate;
			while (i--) {
				this.particles.push(new this.Particle());
			}
		};

		this.removeParticles = function () {
			var i = this.particleRate;
			while (i--) {
				var p = this.particles[i];
				if (p.y > _this.ch - 20 - p.height) {
					p.renderBubble();
					_this.particles.splice(i, 1);
				}
			}
		};

		this.updateParticles = function () {
			var i = this.particles.length;
			while (i--) {
				var p = this.particles[i];
				p.update(i);
			};
		};

		this.renderParticles = function () {
			var i = this.particles.length;
			while (i--) {
				var p = this.particles[i];
				p.render();
			};
		};

		this.clearCanvas = function () {
			this.ctx.globalCompositeOperation = 'destination-out';
			this.ctx.fillStyle = 'rgba(255,255,255,.06)';
			this.ctx.fillRect(0, 0, this.cw, this.ch);
			this.ctx.globalCompositeOperation = 'lighter';
		};

		this.loop = function () {
			var loopIt = function loopIt() {
				requestAnimationFrame(loopIt, _this.c);
				_this.clearCanvas();
				_this.createParticles();
				_this.updateParticles();
				_this.renderParticles();
				_this.removeParticles();
			};
			loopIt();
		};
	};

	var isCanvasSupported = function isCanvasSupported() {
		var elem = document.createElement('canvas');
		return !!(elem.getContext && elem.getContext('2d'));
	};

	var setupRAF = function setupRAF() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		};

		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = function (callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		};

		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = function (id) {
				clearTimeout(id);
			};
		};
	};

	if (isCanvasSupported()) {
		var c = document.getElementById('waterfall');
		var cw = c.width = 1920;
		var ch = c.height = 900;
		var waterfall = new waterfallCanvas(c, cw, ch);
		setupRAF();
		waterfall.init();
	}
});
'use strict';

angular.module('app').controller('mainCtrl', function ($scope, mainService, $location, $rootScope) {
  console.log('mainCTRL!!!!!!!');
});
'use strict';

angular.module('app').controller('projectsCtrl', function ($scope, mainService, $rootScope, $location) {

    function getUser() {
        // console.log('getUser function ran!');
        mainService.getUser().then(function (user) {
            if (user) {
                $rootScope.currentUser = user;
                $rootScope.isLoggedIn = true;
                // $rootScope.userId = user.id;
                var userId = user.id;
                $scope.getProjects = function () {
                    mainService.getAllProjects(userId).then(function (response) {
                        $scope.projects = response;
                    });
                };

                $scope.getProjects();

                $scope.updateFav = function (isFav, index) {
                    $scope.projects[index].fav_wf = !isFav.fav_wf;
                    isFav.fav_wf = !isFav.fav_wf;

                    mainService.updateFav(isFav).then(function (response) {
                        $scope.newFav = response;
                    });
                };

                //Goes in Canvas Ctrl
                $scope.newProject = function (projectData) {
                    projectData.user_id = userId;
                    mainService.createProject(projectData).then(function (response) {
                        $scope.newPro = response;
                    });
                };

                //Favoriting, deleting shapes, creating shapes, sync project, save existing project.
                $scope.updateProject = function () {
                    mainService.updateProject(newData).then(function (response) {
                        $scope.updated = response;
                    });
                };

                $scope.deleteProject = function (projectId) {
                    mainService.deleteProject(projectId).then(function (response) {
                        $scope.deleted = response;
                    });
                };
            } else {
                $rootScope.isLoggedIn = false;
                // $location.path('homeSplash');
                // console.log('Auth0 Error', err);
            }
        });
    }
    $scope.callUser = getUser();
});
'use strict';

angular.module('app').directive('navBar', function () {
    return {
        restrict: 'E',
        templateUrl: './views/directives/navBar.html',
        link: function link(scope, elem, attrs) {
            $('#save').hover(function () {
                $('tip-save').addClass('fadeIn');
            });
        },
        controller: function controller($scope, mainService) {
            $scope.logout = mainService.logout;
            if (!$scope.projectName) {
                $scope.projectName = 'Untitled';
            }
        }
    };
});
'use strict';

angular.module('app').service('mainService', function ($http) {

  var baseurl = 'http://localhost:3000/';

  this.getAllProjects = function (userId) {
    return $http({
      method: 'GET',
      url: baseurl + 'api/projects/' + userId
    }).then(function (response) {
      return response.data;
    });
  };

  this.createProject = function (projectData) {
    return $http({
      method: 'POST',
      url: baseurl + 'api/projects',
      data: projectData
    }).then(function (response) {
      return response;
    });
  };

  this.updateProject = function (newData) {
    return $http({
      method: 'PUT',
      url: baseurl + 'api/project/',
      data: newData
    }).then(function (response) {
      return response.data;
    });
  };

  this.updateFav = function (isFav) {
    return $http({
      method: 'PUT',
      url: baseurl + 'api/project/fav',
      data: isFav
    }).then(function (response) {
      return response.data;
    });
  };

  this.deleteProject = function (projectId) {
    return $http({
      method: 'DELETE',
      url: baseurl + 'api/projects/' + projectId
    }).then(function (response) {
      return response;
    });
  };

  this.getUser = function () {
    return $http({
      method: 'GET',
      url: '/auth/me'
    }).then(function (res) {
      return res.data;
    }).catch(function (err) {
      return err;
    });
  };

  this.logout = function () {
    return $http({
      method: 'GET',
      url: '/auth/logout'
    }).then(function (res) {
      return res.data;
    }).catch(function (err) {
      console.log(err);
    });
  };
});
//# sourceMappingURL=bundle.js.map
