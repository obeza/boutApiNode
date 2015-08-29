app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/contenus");
  //
  // Now set up the states
  $stateProvider
    .state('contenus', {
      url: "/contenus",
      templateUrl: "comp/contenus/contenus-tpl.html"
    })
    .state('contenusAjouter', {
      url: "/contenus/ajouter",
      templateUrl: "comp/contenus-ajouter/contenus-ajouter-tpl.html",
      controller: "contenusAjouterCtrl"
    });
});