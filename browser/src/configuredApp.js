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

    'mlAuthProvider',
    'appRoutingProvider',
    'statesHierarchy',
    'markedProvider',
    function (
      mlAuthProvider,
      appRoutingProvider,
      statesHierarchy,
      markedProvider
    ) {

      mlAuthProvider.userService = 'SsContributorModel';

      // Apply the statesHierarchy as configuration for the
      // appRoutingProvider/appRouting service.
      appRoutingProvider.configure(statesHierarchy);

      // render github-flavored markdown
      // TODO: set up highlight.js
      markedProvider.setOptions({gfm: true});

    }

  ]);

  return appModule;

});
