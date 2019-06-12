/*!
 * vue-mixin-store v1.1.6
 * (c) 2019 falstack <icesilt@outlook.com>
 * https://github.com/falstack/vue-mixin-store
 */
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),

/***/ "96cf":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "a34a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("96cf");


/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__("a34a");
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
var external_commonjs_vue_commonjs2_vue_root_Vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_);

// CONCATENATED MODULE: ./src/flow.js


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }


/* harmony default export */ var flow = (function (api) {
  var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var defaultListObj = {
    result: [],
    page: 0,
    noMore: false,
    nothing: false,
    loading: false,
    error: null,
    fetched: false,
    total: 0,
    extra: null
  };

  var printLog = function printLog(field, val) {
    return debug && console.log("[".concat(field, "]"), val);
  }; // eslint-disable-line


  var generateFieldName = function generateFieldName(func, type) {
    var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    printLog('generateFieldName - begin', {
      func: func,
      type: type,
      query: query
    });
    var result = "".concat(func, "-").concat(type);
    Object.keys(query).filter(function (_) {
      return _typeof(query[_]) !== 'object' && typeof query[_] !== 'function' && !~['page', 'changing', 'isUp', '__refresh__'].indexOf(_);
    }).sort().forEach(function (key) {
      result += "-".concat(key, "-").concat(query[key]);
    });
    printLog('generateFieldName - result', result);
    return result;
  };

  var parseDataUniqueId = function parseDataUniqueId(data, changing) {
    printLog('parseDataUniqueId - begin', {
      data: data,
      changing: changing
    });

    if (!/\./.test(changing)) {
      return data[changing];
    }

    var result = data;
    changing.split('.').forEach(function (key) {
      result = result[key];
    });
    printLog('parseDataUniqueId - result', result);
    return result;
  };

  var cacheNotExpired = function cacheNotExpired(fieldName, timeout) {
    try {
      localStorage.setItem('@@', 1);
      localStorage.removeItem('@@');
      var cacheSetAt = localStorage.getItem("vue-mixin-store-".concat(fieldName, "-timer"));

      if (!cacheSetAt) {
        return false;
      }

      var result = Date.now() - cacheSetAt < timeout;

      if (!result) {
        localStorage.removeItem("vue-mixin-store-".concat(fieldName));
        localStorage.removeItem("vue-mixin-store-".concat(fieldName, "-timer"));
      }

      return result;
    } catch (e) {
      return false;
    }
  };

  var readDataFromCache = function readDataFromCache(fieldName) {
    var cacheStr = localStorage.getItem("vue-mixin-store-".concat(fieldName));

    if (!cacheStr) {
      return null;
    }

    try {
      return JSON.parse(cacheStr);
    } catch (e) {
      return null;
    }
  };

  var setDataToCache = function setDataToCache(fieldName, dataObj) {
    try {
      localStorage.setItem("vue-mixin-store-".concat(fieldName), JSON.stringify(dataObj));
      localStorage.setItem("vue-mixin-store-".concat(fieldName, "-timer"), Date.now());
    } catch (e) {// do nothing
    }
  };

  return {
    namespaced: true,
    state: function state() {
      return {};
    },
    actions: {
      initData: function () {
        var _initData = _asyncToGenerator(
        /*#__PURE__*/
        regenerator_default.a.mark(function _callee(_ref, _ref2) {
          var state, commit, func, type, query, callback, cacheTimeout, fieldName, field, refresh, notFetch, params, args, data, fromLocal;
          return regenerator_default.a.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  state = _ref.state, commit = _ref.commit;
                  func = _ref2.func, type = _ref2.type, query = _ref2.query, callback = _ref2.callback, cacheTimeout = _ref2.cacheTimeout;
                  printLog('initData', {
                    func: func,
                    type: type,
                    query: query
                  });
                  fieldName = generateFieldName(func, type, query);
                  field = state[fieldName];
                  refresh = !!query.__refresh__; // 如果 error 了，就不再请求

                  if (!(field && field.error && !refresh)) {
                    _context.next = 8;
                    break;
                  }

                  return _context.abrupt("return");

                case 8:
                  if (!(field && field.loading)) {
                    _context.next = 10;
                    break;
                  }

                  return _context.abrupt("return");

                case 10:
                  // 这个 field 已经请求过了
                  notFetch = field && field.fetched && !refresh;

                  if (!notFetch) {
                    commit('INIT_STATE', {
                      func: func,
                      type: type,
                      query: query
                    });
                    commit('SET_LOADING', fieldName);
                  }

                  params = {
                    page: 1
                  };

                  if (type === 'page') {
                    params.page = 1;
                  } else if (type === 'jump') {
                    params.page = query.page || 1;
                  } else if (type === 'seenIds') {
                    params.seen_ids = '';
                  } else if (type === 'lastId') {
                    params.last_id = 0;
                  } else if (type === 'sinceId') {
                    params.since_id = query.sinceId || (query.isUp ? 999999999 : 0);
                    params.is_up = query.isUp ? 1 : 0;
                  }

                  args = Object.assign(params, query);

                  if (!notFetch) {
                    _context.next = 18;
                    break;
                  }

                  callback && callback({
                    args: args,
                    data: {
                      result: field.result,
                      total: field.total,
                      no_more: field.noMore
                    }
                  });
                  return _context.abrupt("return");

                case 18:
                  _context.prev = 18;
                  printLog('request', {
                    func: func,
                    params: args
                  });
                  fromLocal = false;

                  if (!(cacheTimeout && cacheNotExpired(fieldName, cacheTimeout))) {
                    _context.next = 32;
                    break;
                  }

                  data = readDataFromCache(fieldName);

                  if (!data) {
                    _context.next = 27;
                    break;
                  }

                  fromLocal = true;
                  _context.next = 30;
                  break;

                case 27:
                  _context.next = 29;
                  return api[func](args);

                case 29:
                  data = _context.sent;

                case 30:
                  _context.next = 35;
                  break;

                case 32:
                  _context.next = 34;
                  return api[func](args);

                case 34:
                  data = _context.sent;

                case 35:
                  commit('SET_DATA', {
                    data: data,
                    fieldName: fieldName,
                    type: type,
                    fromLocal: fromLocal,
                    cacheTimeout: cacheTimeout,
                    page: params.page,
                    insertBefore: query.isUp ? 1 : 0
                  });
                  callback && callback({
                    data: data,
                    args: args
                  });
                  return _context.abrupt("return", data);

                case 40:
                  _context.prev = 40;
                  _context.t0 = _context["catch"](18);
                  printLog('error', {
                    fieldName: fieldName,
                    error: _context.t0
                  });
                  debug && console.log(_context.t0); // eslint-disable-line

                  commit('SET_ERROR', {
                    fieldName: fieldName,
                    error: _context.t0
                  });
                  return _context.abrupt("return", null);

                case 46:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[18, 40]]);
        }));

        function initData(_x, _x2) {
          return _initData.apply(this, arguments);
        }

        return initData;
      }(),
      loadMore: function () {
        var _loadMore = _asyncToGenerator(
        /*#__PURE__*/
        regenerator_default.a.mark(function _callee2(_ref3, _ref4) {
          var state, commit, type, func, query, callback, cacheTimeout, fieldName, field, isSinceUpFetch, changing, params, args, data;
          return regenerator_default.a.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  state = _ref3.state, commit = _ref3.commit;
                  type = _ref4.type, func = _ref4.func, query = _ref4.query, callback = _ref4.callback, cacheTimeout = _ref4.cacheTimeout;
                  printLog('loadMore', {
                    type: type,
                    func: func,
                    query: query
                  });
                  fieldName = generateFieldName(func, type, query);
                  field = state[fieldName];
                  isSinceUpFetch = type === 'sinceId' && query && query.isUp;

                  if (!(field.loading || field.noMore && !isSinceUpFetch)) {
                    _context2.next = 8;
                    break;
                  }

                  return _context2.abrupt("return");

                case 8:
                  if (!(type === 'jump' && query.page === field.page)) {
                    _context2.next = 10;
                    break;
                  }

                  return _context2.abrupt("return");

                case 10:
                  commit('SET_LOADING', fieldName);
                  changing = query.changing || 'id';
                  params = {
                    page: field.page + 1
                  };

                  if (type === 'page') {
                    params.page = field.page + 1;
                  } else if (type === 'jump') {
                    commit('CLEAR_RESULT', fieldName);
                    params.page = query.page;
                  } else if (type === 'lastId') {
                    params.last_id = parseDataUniqueId(field.result[field.result.length - 1], changing);
                  } else if (type === 'seenIds') {
                    params.seen_ids = field.result.map(function (_) {
                      return parseDataUniqueId(_, changing);
                    }).join(',');
                  } else if (type === 'sinceId') {
                    params.since_id = parseDataUniqueId(query.isUp ? field.result[0] : field.result[field.result.length - 1], changing);
                    params.is_up = query.isUp ? 1 : 0;
                  }

                  args = Object.assign(params, query);
                  _context2.prev = 15;
                  printLog('request', {
                    func: func,
                    params: args
                  });
                  _context2.next = 19;
                  return api[func](args);

                case 19:
                  data = _context2.sent;
                  commit('SET_DATA', {
                    fromLocal: false,
                    data: data,
                    fieldName: fieldName,
                    type: type,
                    cacheTimeout: cacheTimeout,
                    page: params.page,
                    insertBefore: query.isUp ? 1 : 0
                  });
                  callback && callback({
                    data: data,
                    args: args
                  });
                  return _context2.abrupt("return", data);

                case 25:
                  _context2.prev = 25;
                  _context2.t0 = _context2["catch"](15);
                  printLog('error', {
                    fieldName: fieldName,
                    error: _context2.t0
                  });
                  debug && console.log(_context2.t0); // eslint-disable-line

                  commit('SET_ERROR', {
                    fieldName: fieldName,
                    error: _context2.t0
                  });
                  return _context2.abrupt("return", null);

                case 31:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[15, 25]]);
        }));

        function loadMore(_x3, _x4) {
          return _loadMore.apply(this, arguments);
        }

        return loadMore;
      }()
    },
    mutations: {
      SET_ERROR: function SET_ERROR(state, _ref5) {
        var fieldName = _ref5.fieldName,
            error = _ref5.error;
        state[fieldName].error = error;
        state[fieldName].loading = false;
      },
      INIT_STATE: function INIT_STATE(state, _ref6) {
        var func = _ref6.func,
            type = _ref6.type,
            query = _ref6.query;
        external_commonjs_vue_commonjs2_vue_root_Vue_default.a.set(state, generateFieldName(func, type, query), Object.assign({}, defaultListObj));
      },
      SET_LOADING: function SET_LOADING(state, fieldName) {
        state[fieldName].loading = true;
        state[fieldName].error = null;
      },
      CLEAR_RESULT: function CLEAR_RESULT(state, fieldName) {
        state[fieldName].result = [];
      },
      SET_DATA: function SET_DATA(state, _ref7) {
        var data = _ref7.data,
            fieldName = _ref7.fieldName,
            type = _ref7.type,
            page = _ref7.page,
            insertBefore = _ref7.insertBefore,
            fromLocal = _ref7.fromLocal,
            cacheTimeout = _ref7.cacheTimeout;
        printLog('SET_DATA - begin', {
          data: data,
          fieldName: fieldName,
          type: type,
          page: page,
          insertBefore: insertBefore
        });

        if (fromLocal) {
          external_commonjs_vue_commonjs2_vue_root_Vue_default.a.set(state, fieldName, data);
          return;
        }

        var result = data.result,
            extra = data.extra;
        var field = state[fieldName];

        if (!field) {
          return;
        }

        var objArr = Object.prototype.toString.call(result) !== '[object Array]';

        if (field.fetched) {
          if (type === 'jump' || objArr) {
            field.result = result;
          } else {
            field.result = insertBefore ? result.concat(field.result) : field.result.concat(result);
          }
        } else {
          field.fetched = true;
          field.result = result;
          var length = 0;

          if (objArr) {
            Object.keys(result).forEach(function (key) {
              length += result[key].length;
            });
          } else {
            length = result.length;
          }

          field.nothing = length === 0;
        }

        field.noMore = type === 'jump' ? false : data.no_more;
        field.total = data.total;
        field.page = page;
        extra && external_commonjs_vue_commonjs2_vue_root_Vue_default.a.set(field, 'extra', extra);
        field.loading = false;
        printLog('SET_DATA - result', field);

        if (cacheTimeout && !field.nothing) {
          setDataToCache(fieldName, state[fieldName]);
        }
      },
      UPDATE_DATA: function UPDATE_DATA(state, _ref8) {
        var type = _ref8.type,
            func = _ref8.func,
            query = _ref8.query,
            id = _ref8.id,
            method = _ref8.method,
            key = _ref8.key,
            value = _ref8.value,
            cacheTimeout = _ref8.cacheTimeout;
        var fieldName = generateFieldName(func, type, query);
        var field = state[fieldName];

        if (!field || !field.result.length) {
          return;
        }

        var modKeys = key ? key.split('.') : [];

        if (~['push', 'unshift', 'concat', 'merge', 'modify'].indexOf(method)) {
          var changeTotal = 0;

          switch (method) {
            case 'push':
              field.result.push(value);
              changeTotal = 1;
              break;

            case 'unshift':
              field.result.unshift(value);
              changeTotal = 1;
              break;

            case 'concat':
              field.result = field.result.concat(value);
              changeTotal = value.length;
              break;

            case 'merge':
              field.result = value.concat(field.result);
              changeTotal = value.length;
              break;

            case 'modify':
              var obj = state[fieldName]; // eslint-disable-line

              while (modKeys.length - 1 && (obj = obj[modKeys.shift()])) {// do nothing
              }

              obj[modKeys[0]] = value;
              break;
          }

          field.total += changeTotal;

          if (cacheTimeout) {
            setDataToCache(fieldName, state[fieldName]);
          }

          return;
        }

        var changing = query.changing || 'id';

        for (var i = 0; i < field.result.length; i++) {
          if (parseDataUniqueId(field.result[i], changing) === id) {
            if (method === 'delete') {
              field.result.splice(i, 1);
              field.total--;
              return;
            }

            if (method === 'insert-before') {
              field.result.splice(i, 0, value);
              field.total++;
              return;
            }

            if (method === 'insert-after') {
              field.result.splice(i + 1, 0, value);
              field.total++;
              return;
            }

            var _obj = field.result[i];

            while (modKeys.length - 1 && (_obj = _obj[modKeys.shift()])) {// do nothing
            }

            _obj[modKeys[0]] = value;
            break;
          }
        }

        if (cacheTimeout) {
          setDataToCache(fieldName, state[fieldName]);
        }
      }
    },
    getters: {
      getFlow: function getFlow(state) {
        return function (_ref9) {
          var func = _ref9.func,
              type = _ref9.type,
              query = _ref9.query;
          return state[generateFieldName(func, type, query)];
        };
      }
    }
  };
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"572ebcaa-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/FlowLoader.vue?vue&type=template&id=78b0c128&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"flow-render"},[(_vm.source)?[_vm._t("header",null,{"source":_vm.source}),_vm._t("default",null,{"flow":_vm.source.result}),_vm._t("footer",null,{"source":_vm.source})]:_vm._e(),_c('div',{ref:"state",staticClass:"flow-render-state"},[(_vm.source)?[(_vm.source.error)?_c('div',{on:{"click":_vm._retryData}},[(_vm.useFirstError && !_vm.source.result.length)?_vm._t("first-error",[_vm._m(0)],{"error":_vm.source.error}):_vm._t("error",[_vm._m(1)],{"error":_vm.source.error})],2):(_vm.source.loading)?_c('div',[(_vm.useFirstLoading && !_vm.source.result.length)?_vm._t("first-loading",[_c('div',{staticClass:"flow-render-state-loading"},[_vm._v("加载中…")])]):_vm._t("loading",[_c('div',{staticClass:"flow-render-state-loading"},[_vm._v("加载中…")])])],2):(_vm.source.nothing)?_c('div',[_vm._t("nothing",[_vm._m(2)])],2):(_vm.source.noMore)?_c('div',[_vm._t("no-more",[(_vm.displayNoMore)?_c('div',{staticClass:"flow-render-state-no-more"},[_c('span',[_vm._v("没有更多了")])]):_vm._e()])],2):[(_vm.isAuto && !_vm.isPagination)?_c('div',{staticClass:"flow-render-state-shim"}):(_vm.isPagination)?_c('div',{staticClass:"flow-render-state-load"},[_vm._t("load",[_vm._v("jump")])],2):_c('div',{staticClass:"flow-render-state-load",on:{"click":_vm.loadMore}},[_vm._t("load",[_vm._v("点击加载更多")])],2)]]:_vm._e()],2)],2)}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"flow-render-state-error"},[_c('span',[_vm._v("出错了，点击重试")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"flow-render-state-error"},[_c('span',[_vm._v("出错了，点击重试")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"flow-render-state-nothing"},[_c('span',[_vm._v("这里什么都没有")])])}]


// CONCATENATED MODULE: ./src/FlowLoader.vue?vue&type=template&id=78b0c128&

// CONCATENATED MODULE: ./node_modules/throttle-debounce/dist/index.esm.js
/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}   [noTrailing]   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
 *                                    the internal counter is reset)
 * @param  {Function}  callback       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {Boolean}   [debounceMode] If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @return {Function}  A new, throttled, function.
 */
function throttle (delay, noTrailing, callback, debounceMode) {
  /*
   * After wrapper has stopped being called, this timeout ensures that
   * `callback` is executed at the proper times in `throttle` and `end`
   * debounce modes.
   */
  var timeoutID;
  var cancelled = false; // Keep track of the last time `callback` was executed.

  var lastExec = 0; // Function to clear existing timeout

  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  } // Function to cancel next exec


  function cancel() {
    clearExistingTimeout();
    cancelled = true;
  } // `noTrailing` defaults to falsy.


  if (typeof noTrailing !== 'boolean') {
    debounceMode = callback;
    callback = noTrailing;
    noTrailing = undefined;
  }
  /*
   * The `wrapper` function encapsulates all of the throttling / debouncing
   * functionality and when executed will limit the rate at which `callback`
   * is executed.
   */


  function wrapper() {
    var self = this;
    var elapsed = Date.now() - lastExec;
    var args = arguments;

    if (cancelled) {
      return;
    } // Execute `callback` and update the `lastExec` timestamp.


    function exec() {
      lastExec = Date.now();
      callback.apply(self, args);
    }
    /*
     * If `debounceMode` is true (at begin) this is used to clear the flag
     * to allow future `callback` executions.
     */


    function clear() {
      timeoutID = undefined;
    }

    if (debounceMode && !timeoutID) {
      /*
       * Since `wrapper` is being called for the first time and
       * `debounceMode` is true (at begin), execute `callback`.
       */
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      /*
       * In throttle mode, if `delay` time has been exceeded, execute
       * `callback`.
       */
      exec();
    } else if (noTrailing !== true) {
      /*
       * In trailing throttle mode, since `delay` time has not been
       * exceeded, schedule `callback` to execute `delay` ms after most
       * recent execution.
       *
       * If `debounceMode` is true (at begin), schedule `clear` to execute
       * after `delay` ms.
       *
       * If `debounceMode` is false (at end), schedule `callback` to
       * execute after `delay` ms.
       */
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
    }
  }

  wrapper.cancel = cancel; // Return the wrapper function.

  return wrapper;
}

/* eslint-disable no-undefined */
/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {Number}   delay         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}  [atBegin]     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 * @param  {Function} callback      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                  to `callback` when the debounced-function is executed.
 *
 * @return {Function} A new, debounced function.
 */

function debounce (delay, atBegin, callback) {
  return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
}



// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/FlowLoader.vue?vue&type=script&lang=js&


function FlowLoadervue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function FlowLoadervue_type_script_lang_js_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { FlowLoadervue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { FlowLoadervue_type_script_lang_js_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var on = function on(elem, type, listener) {
  var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  elem.addEventListener(type, listener, useCapture);
};

var off = function off(elem, type, listener) {
  var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  elem.removeEventListener(type, listener, useCapture);
};

var checkInView = function checkInView(dom, preload) {
  if (!dom) {
    return false;
  }

  var rect = dom.getBoundingClientRect();
  return rect.top < window.innerHeight + preload && rect.bottom + preload > 0 && rect.left < window.innerWidth + preload && rect.right + preload > 0;
};

/* harmony default export */ var FlowLoadervue_type_script_lang_js_ = ({
  name: 'FlowLoader',
  props: {
    func: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String,
      validator: function validator(val) {
        return ~['page', 'jump', 'seenIds', 'lastId', 'sinceId'].indexOf(val);
      }
    },
    query: {
      type: Object,
      default: function _default() {}
    },
    auto: {
      type: Number,
      default: -1,
      validator: function validator(val) {
        return val >= -1;
      }
    },
    callback: {
      type: Function,
      validator: function validator(val) {
        return val === undefined || typeof val === 'function';
      }
    },
    displayNoMore: {
      type: Boolean,
      default: false
    },
    useFirstError: {
      type: Boolean,
      default: false
    },
    useFirstLoading: {
      type: Boolean,
      default: false
    },
    retryOnError: {
      type: Boolean,
      default: true
    },
    preload: {
      type: Number,
      default: 50,
      validator: function validator(val) {
        return val >= 0;
      }
    },
    cacheTimeout: {
      type: Number,
      default: 0,
      validator: function validator(val) {
        return val >= 0;
      }
    },
    sort: {
      type: String,
      default: 'desc',
      validator: function validator(val) {
        return ~['desc', 'asc'].indexOf(val);
      }
    }
  },
  computed: {
    source: function source() {
      return this.$store.getters['flow/getFlow'](this.params);
    },
    params: function params() {
      return {
        func: this.func,
        type: this.type,
        query: this.query,
        callback: this.callback,
        cacheTimeout: typeof window === 'undefined' ? 0 : this.cacheTimeout
      };
    },
    isAuto: function isAuto() {
      if (!this.source) {
        return this.auto === -1;
      }

      return this.auto === -1 || this.auto > this.source.page;
    },
    isPagination: function isPagination() {
      return this.type === 'jump';
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this._initFlowLoader();
    });
  },
  methods: {
    modify: function modify(_ref) {
      var key = _ref.key,
          value = _ref.value;
      this.$store.commit('flow/UPDATE_DATA', Object.assign({}, this.params, {
        method: 'modify',
        value: value,
        key: key
      }));
    },
    refresh: function () {
      var _refresh = FlowLoadervue_type_script_lang_js_asyncToGenerator(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee() {
        var query;
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                query = this.params.query;
                query.__refresh__ = true;
                _context.next = 4;
                return this.$store.dispatch('flow/initData', Object.assign({}, this.params, {
                  query: query
                }));

              case 4:
                this._initFlowLoader();

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function refresh() {
        return _refresh.apply(this, arguments);
      }

      return refresh;
    }(),
    jump: function () {
      var _jump = FlowLoadervue_type_script_lang_js_asyncToGenerator(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee2(page) {
        var query;
        return regenerator_default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                query = this.params.query;
                query.page = page;
                _context2.next = 4;
                return this.$store.dispatch('flow/loadMore', Object.assign({}, this.params, {
                  query: query
                }));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function jump(_x) {
        return _jump.apply(this, arguments);
      }

      return jump;
    }(),
    delete: function _delete(id) {
      this.$store.commit('flow/UPDATE_DATA', Object.assign({}, this.params, {
        method: 'delete',
        id: id
      }));
    },
    update: function update(_ref2) {
      var id = _ref2.id,
          key = _ref2.key,
          value = _ref2.value;
      this.$store.commit('flow/UPDATE_DATA', Object.assign({}, this.params, {
        id: id,
        key: key,
        value: value
      }));
    },
    prepend: function prepend(data) {
      this.$store.commit('flow/UPDATE_DATA', Object.assign({}, this.params, {
        method: Object.prototype.toString.call(data) === '[object Array]' ? 'merge' : 'unshift',
        value: data
      }));
    },
    append: function append(data) {
      this.$store.commit('flow/UPDATE_DATA', Object.assign({}, this.params, {
        method: Object.prototype.toString.call(data) === '[object Array]' ? 'concat' : 'push',
        value: data
      }));
    },
    loadBefore: function () {
      var _loadBefore = FlowLoadervue_type_script_lang_js_asyncToGenerator(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee3() {
        var query;
        return regenerator_default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                query = this.params.query;
                query.isUp = 1;
                _context3.next = 4;
                return this.$store.dispatch('flow/loadMore', Object.assign({}, this.params, {
                  query: query
                }));

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function loadBefore() {
        return _loadBefore.apply(this, arguments);
      }

      return loadBefore;
    }(),
    insertBefore: function insertBefore(_ref3) {
      var id = _ref3.id,
          value = _ref3.value;
      this.$store.commit('flow/UPDATE_DATA', Object.assign({}, this.params, {
        method: 'insert-before',
        id: id,
        value: value
      }));
    },
    insertAfter: function insertAfter(_ref4) {
      var id = _ref4.id,
          value = _ref4.value;
      this.$store.commit('flow/UPDATE_DATA', Object.assign({}, this.params, {
        method: 'insert-after',
        id: id,
        value: value
      }));
    },
    getResource: function getResource() {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'extra';
      return this.source[key];
    },
    _getTarget: function _getTarget() {
      var el = this.$el;

      if (!el) {
        return null;
      }

      while (el && el.tagName !== 'HTML' && el.tagName !== 'BOYD' && el.nodeType === 1) {
        var overflowY = window.getComputedStyle(el).overflowY;

        if (overflowY === 'scroll' || overflowY === 'auto') {
          return el;
        }

        el = el.parentNode;
      }

      return document;
    },
    initData: function () {
      var _initData = FlowLoadervue_type_script_lang_js_asyncToGenerator(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee4() {
        var query;
        return regenerator_default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                query = this.params.query;
                query.isUp = this.sort === 'desc' ? 0 : 1;
                _context4.next = 4;
                return this.$store.dispatch('flow/initData', Object.assign({}, this.params, {
                  query: query
                }));

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function initData() {
        return _initData.apply(this, arguments);
      }

      return initData;
    }(),
    loadMore: function () {
      var _loadMore = FlowLoadervue_type_script_lang_js_asyncToGenerator(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee5() {
        var query;
        return regenerator_default.a.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                query = this.params.query;
                query.isUp = 0;
                _context5.next = 4;
                return this.$store.dispatch('flow/loadMore', Object.assign({}, this.params, {
                  query: query
                }));

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function loadMore() {
        return _loadMore.apply(this, arguments);
      }

      return loadMore;
    }(),
    _initState: function _initState() {
      if (this.source) {
        return;
      }

      this.$store.commit('flow/INIT_STATE', this.params);
    },
    _initFlowLoader: function _initFlowLoader() {
      if (this.auto === 0) {
        this._initState();
      } else {
        checkInView(this.$refs.state, this.preload) ? this.initData() : this._initState();
        on(this._getTarget(), 'scroll', this._onScreenScroll);
      }
    },
    _retryData: function _retryData() {
      if (this.retryOnError) {
        if (this.source.fetched) {
          this.loadMore();
        } else {
          this.initData();
        }
      }
    },
    _onScreenScroll: throttle(200, function () {
      if (this.source.loading || this.source.nothing || this.source.error) {
        return;
      }

      if (!this.isAuto || this.source.noMore || this.isPagination && this.source.fetched) {
        off(this._getTarget(), 'scroll', this._onScreenScroll);
        return;
      }

      if (checkInView(this.$refs.state, this.preload)) {
        if (this.source.fetched) {
          this.loadMore();
        } else {
          this.initData();
        }
      }
    })
  }
});
// CONCATENATED MODULE: ./src/FlowLoader.vue?vue&type=script&lang=js&
 /* harmony default export */ var src_FlowLoadervue_type_script_lang_js_ = (FlowLoadervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/FlowLoader.vue





/* normalize component */

var component = normalizeComponent(
  src_FlowLoadervue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var FlowLoader = (component.exports);
// CONCATENATED MODULE: ./src/export.js


/* harmony default export */ var src_export = ({
  FlowStore: flow,
  FlowLoader: FlowLoader
});
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src_export);



/***/ })

/******/ });