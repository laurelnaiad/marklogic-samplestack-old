/**
 * A task in gulp (an orchestrator task, technially) is something that has a
 * *name*, a set of *dependencies* -- other named tasks that must be run and
 * completed prior to the task being run -- and an *implementating function*
 * that must return a stream or a promise or must call a callback with a
 * potential error condition.
 *
 * In this project, we extend the requirements for a task to enable tighter,
 * faster task composition and more code reuse, so the build process is easier
 * to implement and understand. In the process, we **may** also redefine
 * "dependency" (TBD)
 */

/**
 * [_ description]
 * @private
 */
var _ = require('lodash');
var lazypipe = require('lazypipe');
var $ = require('./util');
var through2 = require('through2');
var duplexer = require('duplexer');

/**
 * How to handle unhandled errors.
 * @typedef {('passthrough'|'swallow'|Function')} OnErrorHandlerType
 * * `'propogate'`: the error will be propogated (thrown if stream-type task,
 * via callback if callack-type task, `reject`ed if promise-type task.
 *
 * * `'swallow'`: the error will be ignored (though the underlying error may
 * also have resulted in broken input data -- this must be hanlded by the task
 * on its own.
 */

/**
 * How to log unhandled errors.
 * @typedef {('warn'|'error'|'none')} OnErrorLogType
 */

/**
 * Specifies a {@link TaskImplemntationType} that is used to define a
 * lazypipe-based implementation
 * @typedef {Object} LazyPipeTaskImplementationType TODO -- specify what's in
 * here.
 */
/**
 * Specifies the implementation of a task.
 * @typedef {(LazyPipeTaskImplementationType|Function)} TaskImplementationType
 */

/**
 * @typedef TaskSpecType
 * @property {OnErrorHandlerType} [onIncomingErrorHandler='propogate']
 * @property {OnErrorLogType} [onIncomingErrorLog='error']
 * @property {OnErrorHandlerType} [onErrorHandler='propogate']
 * @property {OnErrorLogType} [onErrorLog='error']
 * @property {TaskImplementationType} implementation
 * If passthrough the
 */
/**
 * TODO
 * @constructor
 * @param  {[type]} name [description]
 * @param  {[type]} spec [description]
 */
function BaseTask(name, spec) {
  _.defaults(spec, {
    onIncomingErrorHandler: 'propogate',
    onIncomingErrorLog: 'error',
    onErrorHandler: 'propogate',
    onErrorLog: 'error',
    implementation: $.noop,
    // whether this task operates on an array of files rather than as a stream
    batch: false,
    // whether this task should "go" only when it sees the first file, not
    // on subsequent files
    once: false,
    // default is to notice no flies
    noticeMatch: null,
    // default is to act on noticed files
    // if actionMatch is present, the first noticed file triggers
    // us to begin using the actionMatch.  THus noticeMatch should be a superset
    // of actionmatch or else results will be "funky"
    actionMatch: null,
    // default is to discard anything that is acted upon **or** noticed
    // (with the semi-obvious exception that the implemntation-emitted
    // fies are never discarded).  If additional discards are needed,
    // specify them here
    discardMatcher: null,

    // event handlers
    onPipeIn: null,
    onPipeOut: null,

    onFirstSee: null,
    onSee: null,
    onSeeEnd: null,

    onFirstNotice: null,
    onNotice: null,

    onFirstAction: null,
    onAction: null,

    // supporting the following would probably require more streams
    // to distinguish why things are arriving in the outgoing
    // stream.  Way too much work until there's a demonstrated need

    // onNoticeEnd: null,
    // on ActionEnd: null,

    // onPostFirstAction: null,
    // onPostAction: null,
    // onPostActionEnd: null,

    onFirstDiscard: null,
    onDiscard: null,
    onEndDiscard: null,

    //in ms... how long this task should take after beginning to act
    //until completion.  TimeoutError is thrown on violation.
    //this is really more complicated than a single number
    timeout: 100

  });

  _.merge(this, spec);

  this._implFunc = this.createImplFunc(spec);


}


BaseTask.prototype.statusMessage = function(eventName, file, once) {
  if (!once || !this.status[eventName]) {
    this.status[eventName] = true;
    this[eventName].call(this, file);
  }
};

BaseTask.prototype.wrapStream = function(stream) {
  this.status = {};
  var myStream = stream;

  if (typeof myStream === 'function' && !this.batch && !this.once) {
    // this is a proto-stream, e.g. a lazypipe or a function that
    // returns a stream -- we want the actual stream
    myStream = myStream(this.params);
  }

  var outgoing = through2.obj(); // nothing special here until more logging
  var incoming = through2.obj(
    function incomingTransform(file, enc, cb) {
      this.statusMessage('onFirstSee', file, true);
      this.statusMessage('onSee', file, false);

      if (this.noticeMatch && $.match(this.noticeMatch, file)) {
        this.statusMessage('onFirstNotice', file, true);
        this.statusMessage('onNotice', file, false);

        if (!this.actionMatch || $.match(this.actionMatch, file)) {
          this.statusMessage('onFirstAction', file, true);
          this.statusMessage('onAction', file, false);

          // now do the "thing"
          // TODO: batch and once
          myStream.write(file, enc, cb);

        }
        else {
          // noticed but didn't match -- discard
          // TODO
          // discard.write(file, enc, cb);
        }
      }
      else {
        // unonticed && unacted
        if (this.discardMatch && $.match(this.discardMatch, file)) {
          // TODO
          // discard.write(file, enc, cb);
        }
        else {
          // pass this through to the outgoing stream -- no touchy pooh pooh
          // god help us if the world collapses because there is no
          // logging opportunity here!!!!  Seriously.  Literally.
          outgoing.write(file, enc, cb);
        }

      }
    },
    function incomingEnd(cb) {
      this.statusMessage('onSeeEnd');
      // there will be no more files
      // tell everyone!
      // TODO is this right?  Do we need to handle callbacks/etc differently?
      // discard.end();
      myStream.end();
      cb();
    }
  );

  myStream.pipe(outgoing);

  return duplexer(incoming, outgoing);

};

/**
 * [logMessage description]
 * @param  {[type]} messageImpl  [description]
 * @param  {[type]} params       [description]
 * @param  {[type]} incomingTask [description]
 * @param  {[type]} file         [description]
 */
function logMessage(messageImpl, params, incomingTask, file) {
  // if/else on string/function in messageImpl
}

/**
 * Uses lazypipe to construct an implementation function if the spec
 * is not already a function.
 * @param  {[type]} spec [description]
 * @return {[type]}      [description]
 */
BaseTask.prototype.createImplFunc = function(spec) {
  var func;

  if (typeof spec === 'function') {
    func = spec;
  }
  else {
    func = 'create the lazypipe here';
  }

  // use a through obj to gain some control of the situation and enable
  // some logging
  var wrappedFunc = through2.obj(function(file, enc, cb) {
    if (spec.perFileMessage) {
      logMessage(this.spec.perFileMessage, this._params(file));
    }
  },
  function(cb) {

  });


  }

  return function(incomingTask) {
    logMessage(pipeMessage(incomingTask))



  };

};


helper.pipewrap = function(task, step, domain, lazySteps) {
  // if a file matches the domain
  return $.if(domain, (function() {
    // then it enters this stream
    // $.tasklog(task, step); // we've entered the stream, so ay somthing nice
    var lp = lazypipe(); // initialize a lazypipe
    var movingStep = lp; // keep track of the steps we add to the LP
    _.forEach(lazySteps, function(lazyStep) {
      // loop over the step to add
      // apply the contents of the lazyStep array to the LP pipe function
      movingStep = movingStep.pipe.apply(this, lazyStep);
    });
    // invoke and return the stream back to the $.if branch
    return movingStep();
  })());
  // pipe to noop to colect the files back from the $.if branch
  // .pipe($.debug({title: 'testy'}));
  // util.noop());
};

BaseTask.prototype.pipe = function(toTask) {
  // technically not piping here but we're connecting this task to another
  //  task.
};

