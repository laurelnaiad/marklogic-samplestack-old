define([
  'testHelper',
  'text!./_root.html',
  'text!./_layout.html'
], function (
  helper,
  root,
  layout
) {
  return function ($templateCache, path, html) {
    if (!$templateCache.get('/app/states/_root.html')) {
      $templateCache.put('/app/states/_root.html', root);
    }
    if (!$templateCache.get('/app/states/_layout.html')) {
      $templateCache.put('/app/states/_layout.html', root);
    }
    if (!$templateCache.get(path)) {
      $templateCache.put(path, html);
    }
  };
});
