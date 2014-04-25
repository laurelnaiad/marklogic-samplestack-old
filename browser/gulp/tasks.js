/**
 * Proto-tasks -- the objects exported are to be converted to tasks by a
 * gulpfile.  This module exists to allow for its tasks to be driven
 * from outside of this project (.e.g from a larger app that combines
 * a Node.js server with this browser app).
 * @type {Object}
 */
var tasks = module.exports = {};

var path = require('path');
var _ = require('lodash');
var lazypipe = require('lazypipe');
var fs = require('fs');
var chalk = require('chalk');
var glob = require('glob');
// var async = require('async');
var merge = require('event-stream').merge;

var h = require('./helper');
var buildParams = require('../buildParams');

// make it easier to get to plugins
var $ = h.$;

var bootstrapDir =
    'bower_components/bootstrap-sass-official/vendor/assets/stylesheets';
// this is a process-wide task, not file-type specific
tasks.clean = {
  deps: [],
  func: function() {
    return h.fs.src([
      path.join(h.targets.build),
      path.join(h.targets.unit)
    ], {read: false})
      .pipe($.rimraf());
  }
};

tasks['bower'] = {
  deps: ['clean'],
  func: function() {
    return h.fs.src('bower_components/**/*')
      .pipe(h.fs.dest(path.join(h.targets.build, 'js/bower_components')))
      .pipe(h.fs.dest(path.join(h.targets.unit, 'js/bower_components')));
  }
};

var buildStream = function(src) {
  // there are some things we can do before we diverge

  /***************
  JSHINT
  ****************/
  var jsFilt = $.filter('**/*.js');
  var srcDir = path.join(__dirname, '..', h.src);
  src = src.pipe(jsFilt)
    .pipe($.jshint(path.join(srcDir, '.jshintrc')))
    .pipe($.jshint.reporter('jshint-stylish'));
    // .pipe($.jscs(path.join(srcDir, '.jscsrc')));
  src = src.pipe(jsFilt.restore());

  /***************
  SASS
  ****************/
  var sassFilt = $.filter(['**/*.scss', '!**/_*.scss']);
  src = src.pipe(sassFilt).pipe($.sass({
    sourceComments: 'map',
    includePaths: [bootstrapDir]
  })).pipe(sassFilt.restore().pipe($.filter('!**/*.scss')));


  src = src.pipe($.filelog());


  return src; //.pipe($.filelog());

  // var targets = $.branchClones({ src: src, targets: h.targets });

  // var build = targets['build'].pipe($.rebase(h.targets.build));
  // var unit = targets['unit'].pipe($.rebase(h.targets.unit));
  // var dist = targets['dist'].pipe($.rebase(h.targets.dist));


};

tasks.build = {
  deps: ['clean', 'bower'],
  func: function() {
    var src = h.fs.src(path.join(h.src, '**/*'));

    return buildStream(src);
  }
};



// var buildServer;
// function startServer(path, port) {
//   var connect = require('connect');
//   var server = connect()
//     .use(require('connect-modrewrite')([
//       '!\\. /index.html [L]' // if lacking a dot, redirect to index.html
//     ]))
//     .use(connect.static(path, {redirect: false}))
//     .listen(port, '0.0.0.0');
//   return server;
// }


// tasks['unit-test'] = {
//   deps: ['build'],
//   func: function(cb) {
//     var tempServer = startServer(h.targts.unit, 3001);
//     return h.fs.src(path.join(h.targets.unit, 'unit-runner.html'))
//       .pipe($.mochaPhantomjs())
//       .pipe($.util.buffer(function(err, files) {
//         tempServer.close();
//         cb();
//       }));
//   }
// };

// tasks['watch'] = {
//   deps: ['build', 'unit-tests'],
//   func: function(cb) {
//     startServer(h.targets.build, 3000);

//     $.watch(
//       {
//         glob: path.join(h.src, '**/*'),
//         name: 'watch',
//         emitOnGlob: false,
//         emit: 'one'
//       }, function(file) {
//         return file
//           .pipe(buildPipe())
//           .pipe(h.fs.destsubtasks.html.build())
//           .pipe(subtasks.javascript.build())
//           .pipe(subtasks.sass.build());
//       }
//     );

//     var port = 35729;
//     var tinylr = require('tiny-lr-fork');
//     var buildLr = new tinylr.Server();
//     rlServer = buildLr.listen(port, function() {
//       $.watch({
//         glob: path.join(h.targets.build, '**/*'),
//         name: 'reload-watch',
//         emitOnGlob: false,
//         emit: 'one'
//       })
//       .on('data', function(file) {
//         file.base = path.resolve('./build');
//         // just say the "main" file has changed
//         buildLr.changed({body: { files: [file.relative]}});
//         return file;
//       });

//       cb();

//     });

//   }
// };

// tasks['lint'] = {
//   deps: [],
//   func: function() {
//     return h.fs.src(path.join(h.src, '**/*.js'))
//       .pipe($.jshint(path.join(__dirname, '../src/.jshintrc')))
//       .pipe($.jshint.reporter('jshint-stylish'))
//       .pipe($.jscs(path.join(__dirname, '../src/.jscsrc')));

//   }
// };


// // load specifics for each task... e.g.
// // the select function for sass goes to
// // { select: sass: {} }
// _.forEach(tasks, function(task, taskName) {
//   task.subtasks = [];
//   _.forEach(specificsModules, function(mod, modName) {
//     var subtask = mod[taskName]; // e.g. sass
//     if (subtask) {
//       subtask.name = modName;
//       task.subtasks.push(subtask);
//     }
//   });

//   task.func = function() {
//     if (task.msg) {
//       $.util.log('[' + chalk.cyan(taskName) + ']', task.msg);
//     }
//     var context = h.fs.src(path.join(h.src, '**/*'));
//     _.forEach(task.subtasks, function(subtask) {
//       if (subtask.msg) {
//         $.util.log(
//           '[' + chalk.cyan(subtask.name) + ']', subtask.msg
//         );
//       }
//       context = context.pipe(subtask.processor());
//     });
//     return context;
//   };
// });

// tasks['testy'].func = function(cb) {
//   h.fs.src(path.join(h.src, '**/*'));
//     .pipe(subtasks.sass.build())
//     .pipe($.callback(cb));
// };

// tasks['clean'].func = function() {
//   return h.fs.src([
//     path.join(h.targets.build, '**/*'),
//     path.join(h.targets.unit, '**/*')
//   ], {read: false})
//     .pipe($.rimraf());
//     // .pipe($.wait(2050));
// };


// setup watch
// need to construct a function that chains the functions from a few
// tasks together:
// 1. filter what's specified by watch.notice
// 2. call these tasks' funcs with their messages
// a-1) select
// a) validate
// b) build
// c) write-build
// d) unit-tests
// e) e2e-tests



      // if (incoming.event === 'deleted') {
      //   $.util.log(chalk.amber(
      //     'You may need to restart your wwatch session when you delete files.'
      //   ));
      //   return;
      // }

// var watchers = [];
// var applyIfPresent = function(
//   incomingStream,
//   subtaskMod,
//   modName,
//   taskName
// ) {
//   var specTask = subtaskMod[taskName];
//   if (specTask) {
//     // msgs dont make sense in this context
//     // if (specTask.msg) {
//     //   $.util.log('[' + chalk.cyan(modName) + ']', specTask.msg);
//     // }
//     return subtaskMod[taskName].func(incomingStream);
//   }
//   else {
//     return incomingStream;
//   }
// };

// var handlers = [];
// _.forEach(specificsModules, function(specMod, modName) {
//   if (specMod.watch) {
//     // module is set up for noticing files
//     var newHandler = function(incoming) {
//       var filter = $.filter(specMod.watch);
//       var selected = specMod['select'].func(incoming.pipe(filter));
//       var validated = applyIfPresent(selected, specMod, modName, 'validate');
//       var built = applyIfPresent(validated, specMod, modName, 'build');
//       var uted = applyIfPresent(built, specMod, modName, 'unit-test');
//       // var e2ed = applyIfPresent(uted, specMod, modName, 'e2e-tests');
//       return uted.pipe(filter.restore());
//     };

//     handlers.push(newHandler);
//   }
// });

// var w = tasks['watch'] = {
//   deps: ['build'],
//   unremarkable: true,
//   func: function() {

//     $.util.log(
//       '[' + chalk.cyan('watch') + ']',
//       chalk.green('watching for changes')
//     );
//     // return h.fs.src(path.join(h.src, '**/*')
//     //   .pipe($.watch(function file) {

//     //   });
//     $.watch(
//       {
//         glob: path.join(h.src, '**/*'),
//         name: 'watch',
//         emitOnGlob: false,
//         emit: 'one'
//       }, function(file) {
//         return file.pipe($.filelog('watched'));
//       }
//     );
//     // fileStream.pipe($.filelog('watched'));
//     // var res = fileStream;
//     // // _.forEach(handlers, function(handler) {
//     // //   res = handler(res);
//     // // });
//     return;
//   }
//     // if (file.event === '')
//     // fileStream.pipe
//     // );
//     // .pipe($.batch(function(events) {
//     //   console.log('batched ' + JSON.stringify(events, null, '  '));
//     // }));
//       // .pipe,
//       // function(file) {
//       //   if (file.event === 'deleted') {
//       //     $.util.log(chalk.amber(
//       //       'You may need to restart your wwatch session when you delete files.'
//       //     ));
//       //     return file;
//       //   }
//       //   else {
//       //     var res = file;
//       //     _.forEach(handlers, function(handler) {
//       //       res = handler(res);
//       //     });
//       //     return res;
//       //   }
//       // }
//     // );
//   // }
// };


