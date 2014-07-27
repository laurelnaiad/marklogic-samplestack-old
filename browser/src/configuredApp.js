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
    'mlAuthProvider',
    'appRoutingProvider',
    'statesHierarchy',
    function (
      mlHttpProvider,
      mlAuthProvider,
      appRoutingProvider,
      statesHierarchy
    ) {

      // mlHttpProvider.setBaseUrl('http://localhost:8090/v1/');

      mlAuthProvider.sessionModel = 'ssSession';

      // Apply the statesHierarchy as configuration for the
      // appRoutingProvider/appRouting service.
      appRoutingProvider.configure(statesHierarchy);

    }

  ]);

  return appModule;

});
