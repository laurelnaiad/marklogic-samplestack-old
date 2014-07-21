define(['app/module'], function (module) {

  module.factory('SsCredentialsModel', [
    'MlModel', 'mlSchema', 'MlCredentialsModel', 'SsContributorModel',
    function (
      MlModel, mlSchema, MlCredentialsModel, SsContributorModel
    ) {
      var SsCredentialsModel = function (spec) {
        MlCredentialsModel.call(this, spec);
      };
      SsCredentialsModel.prototype = MlCredentialsModel.prototype;
      SsCredentialsModel.prototype.operations.POST.expects = SsContributorModel;
      return SsCredentialsModel;
    }
  ]);
});
