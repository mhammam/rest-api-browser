// Generated by CoffeeScript 1.3.3
var ResourceMainController, ResourceSidebarController, ServiceSelectorController, services;

services = [
  {
    wadl: "jira.wadl",
    path: "https://api.bitbucket.org/1.0",
    version: "1.0",
    pluginCompleteKey: "jira",
    pluginName: "rab",
    pluginDescription: "some descr"
  }
];

angular.module('rab.directives', []).directive('rabScrollfix', [
  '$window', '$document', function($window, $document) {
    'use strict';
    return {
      link: function(scope, elem, attrs) {
        var calculateBoxes;
        calculateBoxes = function() {
          $(".rab-sidebar").height(function() {
            return $(window).height - 10;
          });
          return window.rabProps = {
            origSidebarTop: $(".rab-sidebar").scrollTop(),
            origSidebarOffsetTop: $(".rab-sidebar").offset().top,
            origSidebarWidth: $(".rab-sidebar").width(),
            winHeight: $(window).height()
          };
        };
        calculateBoxes();
        setTimeout(function() {
          var anchor;
          if (!location.hash) {
            return;
          }
          anchor = document.getElementById(location.hash.split('#')[1]);
          if (anchor) {
            return anchor.scrollIntoView();
          }
        }, 100);
        angular.element($window).on('resize', function() {
          return calculateBoxes();
        });
        return angular.element($window).on('scroll.rab-scrollfix', function() {
          var contentBottom, currPosn, elFromPoint, top, x;
          x = $(".rab-resources").position().left;
          top = $(window).scrollTop() - 15;
          elFromPoint = $(document.elementFromPoint(x, 5));
          if (elFromPoint.hasClass("rab-resource")) {
            $(".rab-resource-sb a").removeClass("rab-resource-sb-active");
            $("#rab-nav-" + elFromPoint.find('h3>a').data('id')).addClass("rab-resource-sb-active");
          }
          currPosn = top + window.rabProps.winHeight;
          if (top > window.rabProps.origSidebarOffsetTop) {
            contentBottom = this.origSidebarOffsetTop + $(".rab-content").height();
            if (currPosn > contentBottom) {
              return $(".rab-sidebar").css({
                top: contentBottom - currPosn
              });
            } else {
              $('.rab-sidebar').height(function() {
                return $(window).height();
              });
              $(".rab-sidebar").css({
                position: "fixed",
                top: 0,
                width: window.rabProps.origSidebarWidth
              });
              return $(".rab-content").css({
                marginLeft: "20%"
              });
            }
          } else {
            $('.rab-sidebar').height('auto');
            $(".rab-sidebar").css({
              position: "static",
              width: "20%"
            });
            return $(".rab-content").css({
              marginLeft: "0"
            });
          }
        });
      }
    };
  }
]);

angular.module('rab.service', ['ngSanitize']).value('helper', {
  slugify: function(str) {
    if (!this) {
      return;
    }
    return str.toLowerCase().replace(/[^-a-zA-Z0-9,&\s]+/ig, '-').replace(/\s/gi, "-").replace(/^-/, '').replace(/-$/, '');
  }
});

angular.module('rab', ['rab.service', 'rab.directives']);

ServiceSelectorController = (function() {

  function ServiceSelectorController($scope) {
    $scope.services = services;
    $scope.currentService = this.getCurrentService();
  }

  ServiceSelectorController.prototype.getCurrentService = function() {
    return services[0];
  };

  return ServiceSelectorController;

})();

ResourceSidebarController = (function() {

  function ResourceSidebarController($scope, helper) {
    $scope.resources = [];
    $scope.scrollToResource = this.scrollToResource;
    $scope.slugify = helper.slugify;
    processWADL(services[0].wadl).done(function(d) {
      return $scope.$apply(function() {
        return $scope.resources = d.resources;
      });
    });
  }

  return ResourceSidebarController;

})();

ResourceMainController = (function() {

  function ResourceMainController($scope, helper) {
    $scope.slugify = this.slugify;
    $scope.fullUrl = this.getFullUrl;
    $scope.slugify = helper.slugify;
  }

  ResourceMainController.prototype.getFullUrl = function(path) {
    var servicesScope;
    servicesScope = angular.element('.rab-service-selector.ng-scope').scope();
    return servicesScope.currentService.path + path;
  };

  return ResourceMainController;

})();
