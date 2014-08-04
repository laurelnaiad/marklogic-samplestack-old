define(['app/module', 'app/components'], function (module) {

  // Each referenced component is responsible for defining itself and adding
  // itself to the module.
  //
  // It is thus sufficient to return the module now -- we have forced
  // all components to be defined and included.

  //read buildParams app settings into a variable via lodash template
  var appSettings = angular.fromJson('<%= JSON.stringify(appSettings) %>');

  module.config([
    'mlAuthProvider',
    'mlHttpInterceptorProvider',
    'appRoutingProvider',
    'statesHierarchy',
    function (
      mlAuthProvider,
      mlHttpInterceptorProvider,
      appRoutingProvider,
      statesHierarchy
    ) {

      mlAuthProvider.sessionModel = 'ssSession';
      mlHttpInterceptorProvider.disableCsrf = appSettings.disableCsrf;

      // Apply the statesHierarchy as configuration for the
      // appRoutingProvider/appRouting service.
      appRoutingProvider.configure(statesHierarchy);

      if (appSettings.html5Mode === false) {
        appRoutingProvider.forceHashMode();
      }

    }

  ]);

  return module;
});
