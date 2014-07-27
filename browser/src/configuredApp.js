/*
config.js

Configure the application module and expose it..
 */

define([
  'app/assembledApp'
], function (
  appModule
) {

  appModule.config([
    'mlHttpProvider',
    'appRoutingProvider',
    'statesHierarchy',
    function (
      mlHttpProvider,
      appRoutingProvider,
      statesHierarchy
    ) {

      // mlHttpProvider.setBaseUrl('http://localhost:8090/v1/');
      // Apply the statesHierarchy as configuration for the
      // appRoutingProvider/appRouting service.
      appRoutingProvider.configure(statesHierarchy);

    }

  ]);

  return appModule;

});
