angular.module('app').controller('canvasCtrl', function ($scope, mainService, $document, $compile) {

  let canvas = angular.element(document.querySelector('#canvas'));
  let toolbar = angular.element(document.querySelector('#toolbar'));
  let shapeToolbar = angular.element(document.querySelector('#shapeToolbar'));

  $scope.elementColor = "white";

  $scope.myFunc = function (myE) {
    $scope.x = myE.clientX;
    $scope.y = myE.clientY;
  }

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
      }
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
  }

  function draw(event) {
    $scope.showShadow = true;
    $scope.showShadow2 = false;
    $scope.x1 = $scope.tempXLocation;
    $scope.y1 = $scope.tempYLocation;
    $scope.x2 = event.clientX;
    $scope.y2 = event.clientY;

    if ($scope.tempXLocation >= event.clientX) {
      $scope.xLocation = event.clientX
    } else {
      $scope.xLocation = $scope.tempXLocation;
    }

    if ($scope.tempYLocation >= event.clientY) {
      $scope.yLocation = event.clientY - 60
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
        $scope.shadowXLocation = event.clientX
      } else {
        $scope.shadowXLocation = $scope.tempXLocation;
      }

      if ($scope.tempYLocation >= event.clientY) {
        $scope.shadowYLocation = event.clientY - 60
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
      let shadowYtoolbar = $scope.shadowYLocation.toString() + "px";
      let shadowXtoolbar = $scope.shadowXLocation.toString() + "px";
      $scope.toolbarStyle = {
        "position": "absolute",
        "top": shadowYtoolbar,
        "left": shadowXtoolbar
      }

      $document.unbind("mousemove", draw);
      if ($scope.shadowX > 5 || $scope.shadowY > 5) {
        $scope.toolbarShow = true;
      }
    }

    $scope.allowDrawFunc();

  }

  $scope.createBox = function () {
    let template = ("<svg class='draggable' width='100%' height='100%'><rect ng-mousedown='disableDrawFunc($event)' ng-mousemove='dragRect($event)' ng-click='showRectToolbar($event)' x=" + $scope.shadowXLocation + " y=" + $scope.shadowYLocation + " width=" + $scope.shadowX + " height=" + $scope.shadowY + " ng-style='shapeStyle' id='dynamicId" + $scope.tempXLocation + $scope.tempYLocation + "' />  </svg>")
    let linkFn = $compile(template);
    let content = linkFn($scope);
    canvas.append(content);
    $scope.showShadow2 = false;
    $scope.toolbarShow = false;
  }


  $scope.createEllipse = function () {
    let template = ("<svg width='100%' height='100%'><ellipse ng-mousedown='disableDrawFunc($event)' ng-mousemove='dragEllipse($event)' ng-click='showEllipseToolbar($event)' cx=" + ($scope.shadowXLocation + ($scope.shadowX / 2)) + " cy=" + ($scope.shadowYLocation + ($scope.shadowY / 2)) + " rx=" + ($scope.shadowX / 2) + " ry=" + ($scope.shadowY / 2) + " ng-style='shapeStyle' id='dynamicId" + $scope.tempXLocation + $scope.tempYLocation + "' />    </svg>")
    let linkFn = $compile(template);
    let content = linkFn($scope);
    canvas.append(content);
    $scope.showShadow2 = false;
    $scope.toolbarShow = false;
  }

  $scope.createCircle = function () {
    let template = ("<svg width='100%' height='100%'><circle ng-mousedown='disableDrawFunc($event)' ng-mousemove='dragCircle($event)' ng-click='showCircleToolbar($event)' cx=" + ($scope.shadowXLocation + ($scope.shadowX / 2)) + " cy=" + ($scope.shadowYLocation + ($scope.shadowX / 2)) + " r=" + ($scope.shadowX / 2) + " ng-style='shapeStyle' id='dynamicId" + $scope.tempXLocation + $scope.tempYLocation + "' class='animated rollIn'/>    </svg>")
    let linkFn = $compile(template);
    let content = linkFn($scope);
    canvas.append(content);
    $scope.showShadow2 = false;
    $scope.toolbarShow = false;
  }

  $scope.createRoundedBox = function () {
    let template = ("<svg width='100%' height='100%'><rect ng-mousedown='disableDrawFunc($event)' ng-mousemove='dragRect($event)' ng-click='showRectToolbar($event)' x=" + $scope.shadowXLocation + " y=" + $scope.shadowYLocation + " rx='20' ry='20' width=" + $scope.shadowX + " height=" + $scope.shadowY + " ng-style='shapeStyle' id='dynamicId" + $scope.tempXLocation + $scope.tempYLocation + "' class='animated jello' />    </svg>");
    let linkFn = $compile(template);
    let content = linkFn($scope);
    canvas.append(content);
    $scope.showShadow2 = false;
    $scope.toolbarShow = false;
  }

  $scope.shapeStyle = {
    "fill": "white",
    "stroke": "black",
    "stroke-width": "1",
    "opacity": "0.8",
    "cursor": "move"
  }

  $scope.allowDrawFunc = function() {
    $scope.allowDraw = true;
  }

  $scope.disableDrawFunc = function(event) {
    $scope.shapeID = event.target.attributes.id.nodeValue;
    $scope.allowDrag = true;
    $scope.allowDraw = false;
    $document.on('mouseup', dropShape)
  }

  $scope.dragRect = function(event) {
    let moveRect = angular.element(document.querySelector('#' + $scope.shapeID));
    if ($scope.allowDrag) {
      $scope.shapeToolbarShow = false;
      moveRect.attr("x", event.clientX - (event.target.attributes.width.nodeValue / 2))
      moveRect.attr('y', event.clientY - 60 - (event.target.attributes.height.nodeValue / 2))
     }
  }

  $scope.dragEllipse = function(event) {
    let moveEllipse = angular.element(document.querySelector('#' + $scope.shapeID));
    if ($scope.allowDrag) {
      $scope.shapeToolbarShow = false;
      moveEllipse.attr("cx", event.clientX)
      moveEllipse.attr('cy', event.clientY - 60)
     }
  }
  $scope.dragCircle = function(event) {
    let moveCircle = angular.element(document.querySelector('#' + $scope.shapeID));
    if ($scope.allowDrag) {
      $scope.shapeToolbarShow = false;
      moveCircle.attr("cx", event.clientX)
      moveCircle.attr('cy', event.clientY - 60)
     }
  }

  function dropShape(event) {
    $scope.allowDrag = false;
    let moveShape = angular.element(document.querySelector('#' + $scope.shapeID));
    moveShape.attr("id", ("dynamicId" + event.clientX + event.clientY))
  }

  $scope.showRectToolbar = function(event) {
    console.log($scope.shapeID);
    $scope.shapeToolbarShow = true;
    let shapeToolbarY = event.target.attributes.y.nodeValue.toString() + "px";
    let shapeToolbarX = event.target.attributes.x.nodeValue.toString() + "px";
    $scope.shapeToolbarStyle = {
      "position": "absolute",
      "top": shapeToolbarY,
      "left": shapeToolbarX
    }
    $scope.shapeStyle = {
      "fill": $scope.elementColor,
      "stroke": "blue",
      "stroke-width": "2",
      "opacity": "0.8",
      "cursor": "move"
    }
    let shapeClass = angular.element(document.querySelector('#' + $scope.shapeID))
    console.log(shapeClass);
    shapeClass.addClass("button")

  }

  $scope.showCircleToolbar = function(event) {
    $scope.shapeToolbarShow = true;
    let shapeToolbarY = (event.target.attributes.cy.nodeValue - event.target.attributes.r.nodeValue) + "px";
    let shapeToolbarX = (event.target.attributes.cx.nodeValue - event.target.attributes.r.nodeValue) + "px";
    $scope.shapeToolbarStyle = {
      "position": "absolute",
      "top": shapeToolbarY,
      "left": shapeToolbarX
    }
    $scope.shapeStyle = {
      "fill": $scope.elementColor,
      "stroke": "blue",
      "stroke-width": "2",
      "opacity": "0.8",
      "cursor": "move"
    }
  }

  $scope.showEllipseToolbar = function(event) {
    $scope.shapeToolbarShow = true;
    let shapeToolbarY = (event.target.attributes.cy.nodeValue - event.target.attributes.ry.nodeValue) + "px";
    let shapeToolbarX = (event.target.attributes.cx.nodeValue - event.target.attributes.rx.nodeValue) + "px";
    $scope.shapeToolbarStyle = {
      "position": "absolute",
      "top": shapeToolbarY,
      "left": shapeToolbarX
    }
    $scope.shapeStyle = {
      "fill": $scope.elementColor,
      "stroke": "blue",
      "stroke-width": "2",
      "opacity": "0.8",
      "cursor": "move"
    }
  }





})
