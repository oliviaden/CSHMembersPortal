var app = angular.module("members", ['webicon']);

app.directive("navbar", function() {
  return {
    restrict: "E",
    templateUrl: "templates/navbar.html"
  }
});

app.directive("meetings", function() {
  return {
    restrict: "E",
    templateUrl: "templates/meetings.html",
    scope: {
      meetings: "=data"
    }
  };
});

app.controller("MembersController", ['$scope', '$http', function($scope, $http) {
  
  // Pull the user's sso info and grab their theme
  $http.get("https://members.csh.rit.edu/sso/redirect?info=json").success(function (response) {
    $scope.cdn = "https://themeswitcher.csh.rit.edu/api/" + response.id_token.preferred_username;
  }).error(function (error) { 
    $scope.cdn = "https://s3.csh.rit.edu/csh-material-bootstrap/4.0.0/dist/csh-material-bootstrap.min.css";
  });

  // Toggle showing the icons
  $scope.saveIconSetting = function() {
    window.localStorage.setItem("showIcons", $scope.showIcons);
  };

  // Get the meeting times
  $scope.meetings = [];
  $http.get("./data/meetings.json").success(function (response) {
    $scope.meetings = response;
  }).error(function (error) {
    console.error("Error getting meetings.json");
  });

  // Get all the links
  $scope.sections = [];
  $scope.popular = [];
  $http.get("./data/links.json").success(function (response) {
    $scope.sections = response;
    // Find the popular links
    for (var i = 0; i < $scope.sections.length; i++) {
      var section = $scope.sections[i]; 
      for (var j = 0; j < section.links.length; j++ ) {
        if (section.links[j].hasOwnProperty("popular")) {
          $scope.popular.push(section.links[j]);
        }
      }
    }
    if ($scope.popular.length === 0) $scope.popular = false;
  }).error(function (error) {
    console.error("Error getting links.json");
  });

  // Show/hide icons
  $scope.showIcons = true;
  if (window.localStorage) {
    var showIcons = window.localStorage.getItem("showIcons");
    if (showIcons === "false") {
      $scope.showIcons = false;
    }
    else if (showIcons === "true") {
      $scope.showIcons = true;
    }
    else {
      $scope.showIcons = true;
      $scope.saveIconSetting();
    }
  }

}]);
