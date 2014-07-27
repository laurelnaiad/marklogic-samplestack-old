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
    'appRoutingProvider',
    'statesHierarchy',
    function (
      appRoutingProvider,
      statesHierarchy
    ) {

      // Apply the statesHierarchy as configuration for the
      // appRoutingProvider/appRouting service.
      appRoutingProvider.configure(statesHierarchy);

    }

  ]);

  return appModule;

});
