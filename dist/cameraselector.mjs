var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
  cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
  cachedClearTimeout = clearTimeout;
}
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  }
  // if setTimeout wasn't available but was latter defined
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  }
  // if clearTimeout wasn't available but was latter defined
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
function nextTick(fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}
// v8 likes predictible objects
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};
function noop() {}
var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;
function binding(name) {
  throw new Error('process.binding is not supported');
}
function cwd() {
  return '/';
}
function chdir(dir) {
  throw new Error('process.chdir is not supported');
}
function umask() {
  return 0;
}

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
  return new Date().getTime();
};

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp) {
  var clocktime = performanceNow.call(performance) * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds, nanoseconds];
}
var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}
var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

var react_production_min = {};

var l = Symbol.for("react.element"),
  n = Symbol.for("react.portal"),
  p = Symbol.for("react.fragment"),
  q = Symbol.for("react.strict_mode"),
  r = Symbol.for("react.profiler"),
  t = Symbol.for("react.provider"),
  u = Symbol.for("react.context"),
  v = Symbol.for("react.forward_ref"),
  w = Symbol.for("react.suspense"),
  x = Symbol.for("react.memo"),
  y = Symbol.for("react.lazy"),
  z = Symbol.iterator;
function A(a) {
  if (null === a || "object" !== _typeof(a)) return null;
  a = z && a[z] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B = {
    isMounted: function isMounted() {
      return !1;
    },
    enqueueForceUpdate: function enqueueForceUpdate() {},
    enqueueReplaceState: function enqueueReplaceState() {},
    enqueueSetState: function enqueueSetState() {}
  },
  C = Object.assign,
  D = {};
function E(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D;
  this.updater = e || B;
}
E.prototype.isReactComponent = {};
E.prototype.setState = function (a, b) {
  if ("object" !== _typeof(a) && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E.prototype.forceUpdate = function (a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {}
F.prototype = E.prototype;
function G(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D;
  this.updater = e || B;
}
var H = G.prototype = new F();
H.constructor = G;
C(H, E.prototype);
H.isPureReactComponent = !0;
var I = Array.isArray,
  J = Object.prototype.hasOwnProperty,
  K = {
    current: null
  },
  L = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
  };
function M$1(a, b, e) {
  var d,
    c = {},
    k = null,
    h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b) J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;else if (1 < g) {
    for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
    c.children = f;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return {
    $$typeof: l,
    type: a,
    key: k,
    ref: h,
    props: c,
    _owner: K.current
  };
}
function N(a, b) {
  return {
    $$typeof: l,
    type: a.type,
    key: b,
    ref: a.ref,
    props: a.props,
    _owner: a._owner
  };
}
function O(a) {
  return "object" === _typeof(a) && null !== a && a.$$typeof === l;
}
function escape(a) {
  var b = {
    "=": "=0",
    ":": "=2"
  };
  return "$" + a.replace(/[=:]/g, function (a) {
    return b[a];
  });
}
var P = /\/+/g;
function Q(a, b) {
  return "object" === _typeof(a) && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R(a, b, e, d, c) {
  var k = _typeof(a);
  if ("undefined" === k || "boolean" === k) a = null;
  var h = !1;
  if (null === a) h = !0;else switch (k) {
    case "string":
    case "number":
      h = !0;
      break;
    case "object":
      switch (a.$$typeof) {
        case l:
        case n:
          h = !0;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function (a) {
    return a;
  })) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I(a)) for (var g = 0; g < a.length; g++) {
    k = a[g];
    var f = d + Q(k, g);
    h += R(k, b, e, f, c);
  } else if (f = A(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done;) k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S(a, b, e) {
  if (null == a) return a;
  var d = [],
    c = 0;
  R(a, d, "", "", function (a) {
    return b.call(e, a, c++);
  });
  return d;
}
function T(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function (b) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b;
    }, function (b) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U = {
    current: null
  },
  V = {
    transition: null
  },
  W = {
    ReactCurrentDispatcher: U,
    ReactCurrentBatchConfig: V,
    ReactCurrentOwner: K
  };
react_production_min.Children = {
  map: S,
  forEach: function forEach(a, b, e) {
    S(a, function () {
      b.apply(this, arguments);
    }, e);
  },
  count: function count(a) {
    var b = 0;
    S(a, function () {
      b++;
    });
    return b;
  },
  toArray: function toArray(a) {
    return S(a, function (a) {
      return a;
    }) || [];
  },
  only: function only(a) {
    if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
    return a;
  }
};
react_production_min.Component = E;
react_production_min.Fragment = p;
react_production_min.Profiler = r;
react_production_min.PureComponent = G;
react_production_min.StrictMode = q;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
react_production_min.cloneElement = function (a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C({}, a.props),
    c = a.key,
    k = a.ref,
    h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k = b.ref, h = K.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f in b) J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
  }
  var f = arguments.length - 2;
  if (1 === f) d.children = e;else if (1 < f) {
    g = Array(f);
    for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
    d.children = g;
  }
  return {
    $$typeof: l,
    type: a.type,
    key: c,
    ref: k,
    props: d,
    _owner: h
  };
};
react_production_min.createContext = function (a) {
  a = {
    $$typeof: u,
    _currentValue: a,
    _currentValue2: a,
    _threadCount: 0,
    Provider: null,
    Consumer: null,
    _defaultValue: null,
    _globalName: null
  };
  a.Provider = {
    $$typeof: t,
    _context: a
  };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function (a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function () {
  return {
    current: null
  };
};
react_production_min.forwardRef = function (a) {
  return {
    $$typeof: v,
    render: a
  };
};
react_production_min.isValidElement = O;
react_production_min.lazy = function (a) {
  return {
    $$typeof: y,
    _payload: {
      _status: -1,
      _result: a
    },
    _init: T
  };
};
react_production_min.memo = function (a, b) {
  return {
    $$typeof: x,
    type: a,
    compare: void 0 === b ? null : b
  };
};
react_production_min.startTransition = function (a) {
  var b = V.transition;
  V.transition = {};
  try {
    a();
  } finally {
    V.transition = b;
  }
};
react_production_min.unstable_act = function () {
  throw Error("act(...) is not supported in production builds of React.");
};
react_production_min.useCallback = function (a, b) {
  return U.current.useCallback(a, b);
};
react_production_min.useContext = function (a) {
  return U.current.useContext(a);
};
react_production_min.useDebugValue = function () {};
react_production_min.useDeferredValue = function (a) {
  return U.current.useDeferredValue(a);
};
react_production_min.useEffect = function (a, b) {
  return U.current.useEffect(a, b);
};
react_production_min.useId = function () {
  return U.current.useId();
};
react_production_min.useImperativeHandle = function (a, b, e) {
  return U.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function (a, b) {
  return U.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function (a, b) {
  return U.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function (a, b) {
  return U.current.useMemo(a, b);
};
react_production_min.useReducer = function (a, b, e) {
  return U.current.useReducer(a, b, e);
};
react_production_min.useRef = function (a) {
  return U.current.useRef(a);
};
react_production_min.useState = function (a) {
  return U.current.useState(a);
};
react_production_min.useSyncExternalStore = function (a, b, e) {
  return U.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function () {
  return U.current.useTransition();
};
react_production_min.version = "18.2.0";

var react_development = {exports: {}};

(function (module, exports) {

  if (process.env.NODE_ENV !== "production") {
    (function () {

      /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === 'function') {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      }
      var ReactVersion = '18.2.0';

      // ATTENTION
      // When adding new symbols to this file,
      // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
      // The Symbol used to tag the ReactElement-like types.
      var REACT_ELEMENT_TYPE = Symbol.for('react.element');
      var REACT_PORTAL_TYPE = Symbol.for('react.portal');
      var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
      var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
      var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
      var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
      var REACT_CONTEXT_TYPE = Symbol.for('react.context');
      var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
      var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
      var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
      var REACT_MEMO_TYPE = Symbol.for('react.memo');
      var REACT_LAZY_TYPE = Symbol.for('react.lazy');
      var REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = '@@iterator';
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || _typeof(maybeIterable) !== 'object') {
          return null;
        }
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof maybeIterator === 'function') {
          return maybeIterator;
        }
        return null;
      }

      /**
       * Keeps track of the current dispatcher.
       */
      var ReactCurrentDispatcher = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      };

      /**
       * Keeps track of the current batch's configuration such as how long an update
       * should suspend for if it needs to.
       */
      var ReactCurrentBatchConfig = {
        transition: null
      };
      var ReactCurrentActQueue = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false
      };

      /**
       * Keeps track of the current owner.
       *
       * The current owner is the component who should own any components that are
       * currently being constructed.
       */
      var ReactCurrentOwner = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      };
      var ReactDebugCurrentFrame = {};
      var currentExtraStackFrame = null;
      function setExtraStackFrame(stack) {
        {
          currentExtraStackFrame = stack;
        }
      }
      {
        ReactDebugCurrentFrame.setExtraStackFrame = function (stack) {
          {
            currentExtraStackFrame = stack;
          }
        }; // Stack implementation injected by the current renderer.

        ReactDebugCurrentFrame.getCurrentStack = null;
        ReactDebugCurrentFrame.getStackAddendum = function () {
          var stack = ''; // Add an extra top frame while an element is being validated

          if (currentExtraStackFrame) {
            stack += currentExtraStackFrame;
          } // Delegate to the injected renderer-specific implementation

          var impl = ReactDebugCurrentFrame.getCurrentStack;
          if (impl) {
            stack += impl() || '';
          }
          return stack;
        };
      }

      // -----------------------------------------------------------------------------

      var enableScopeAPI = false; // Experimental Create Event Handle API.
      var enableCacheElement = false;
      var enableTransitionTracing = false; // No known bugs, but needs performance testing

      var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
      // stuff. Intended to enable React core members to more easily debug scheduling
      // issues in DEV builds.

      var enableDebugTracing = false; // Track which Fiber(s) schedule render work.

      var ReactSharedInternals = {
        ReactCurrentDispatcher: ReactCurrentDispatcher,
        ReactCurrentBatchConfig: ReactCurrentBatchConfig,
        ReactCurrentOwner: ReactCurrentOwner
      };
      {
        ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
        ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
      }

      // by calls to these methods by a Babel plugin.
      //
      // In PROD (or in packages without access to React internals),
      // they are left as they are instead.

      function warn(format) {
        {
          {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            printWarning('warn', format, args);
          }
        }
      }
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning('error', format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        // When changing this logic, you might want to also
        // update consoleWithStackDev.www.js as well.
        {
          var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame.getStackAddendum();
          if (stack !== '') {
            format += '%s';
            args = args.concat([stack]);
          } // eslint-disable-next-line react-internal/safe-string-coercion

          var argsWithFormat = args.map(function (item) {
            return String(item);
          }); // Careful: RN currently depends on this prefix

          argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
          // breaks IE9: https://github.com/facebook/react/issues/13610
          // eslint-disable-next-line react-internal/no-production-logging

          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      var didWarnStateUpdateForUnmountedComponent = {};
      function warnNoop(publicInstance, callerName) {
        {
          var _constructor = publicInstance.constructor;
          var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
          var warningKey = componentName + "." + callerName;
          if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
            return;
          }
          error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
          didWarnStateUpdateForUnmountedComponent[warningKey] = true;
        }
      }
      /**
       * This is the abstract API for an update queue.
       */

      var ReactNoopUpdateQueue = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function isMounted(publicInstance) {
          return false;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function enqueueForceUpdate(publicInstance, callback, callerName) {
          warnNoop(publicInstance, 'forceUpdate');
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function enqueueReplaceState(publicInstance, completeState, callback, callerName) {
          warnNoop(publicInstance, 'replaceState');
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function enqueueSetState(publicInstance, partialState, callback, callerName) {
          warnNoop(publicInstance, 'setState');
        }
      };
      var assign = Object.assign;
      var emptyObject = {};
      {
        Object.freeze(emptyObject);
      }
      /**
       * Base class helpers for the updating state of a component.
       */

      function Component(props, context, updater) {
        this.props = props;
        this.context = context; // If a component has string refs, we will assign a different object later.

        this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
        // renderer.

        this.updater = updater || ReactNoopUpdateQueue;
      }
      Component.prototype.isReactComponent = {};
      /**
       * Sets a subset of the state. Always use this to mutate
       * state. You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * There is no guarantee that calls to `setState` will run synchronously,
       * as they may eventually be batched together.  You can provide an optional
       * callback that will be executed when the call to setState is actually
       * completed.
       *
       * When a function is provided to setState, it will be called at some point in
       * the future (not synchronously). It will be called with the up to date
       * component arguments (state, props, context). These values can be different
       * from this.* because your function may be called after receiveProps but before
       * shouldComponentUpdate, and this new state, props, and context will not yet be
       * assigned to this.
       *
       * @param {object|function} partialState Next partial state or function to
       *        produce next partial state to be merged with current state.
       * @param {?function} callback Called after state is updated.
       * @final
       * @protected
       */

      Component.prototype.setState = function (partialState, callback) {
        if (_typeof(partialState) !== 'object' && typeof partialState !== 'function' && partialState != null) {
          throw new Error('setState(...): takes an object of state variables to update or a ' + 'function which returns an object of state variables.');
        }
        this.updater.enqueueSetState(this, partialState, callback, 'setState');
      };
      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {?function} callback Called after update is complete.
       * @final
       * @protected
       */

      Component.prototype.forceUpdate = function (callback) {
        this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
      };
      /**
       * Deprecated APIs. These APIs used to exist on classic React classes but since
       * we would like to deprecate them, we're not going to move them over to this
       * modern base class. Instead, we define a getter that warns if it's accessed.
       */

      {
        var deprecatedAPIs = {
          isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
          replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
        };
        var defineDeprecationWarning = function defineDeprecationWarning(methodName, info) {
          Object.defineProperty(Component.prototype, methodName, {
            get: function get() {
              warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
              return undefined;
            }
          });
        };
        for (var fnName in deprecatedAPIs) {
          if (deprecatedAPIs.hasOwnProperty(fnName)) {
            defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
          }
        }
      }
      function ComponentDummy() {}
      ComponentDummy.prototype = Component.prototype;
      /**
       * Convenience component with default shallow equality check for sCU.
       */

      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context; // If a component has string refs, we will assign a different object later.

        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
      pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

      assign(pureComponentPrototype, Component.prototype);
      pureComponentPrototype.isPureReactComponent = true;

      // an immutable object with a single mutable value
      function createRef() {
        var refObject = {
          current: null
        };
        {
          Object.seal(refObject);
        }
        return refObject;
      }
      var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

      function isArray(a) {
        return isArrayImpl(a);
      }

      /*
       * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
       * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
       *
       * The functions in this module will throw an easier-to-understand,
       * easier-to-debug exception with a clear errors message message explaining the
       * problem. (Instead of a confusing exception thrown inside the implementation
       * of the `value` object).
       */
      // $FlowFixMe only called in DEV, so void return is not possible.
      function typeName(value) {
        {
          // toStringTag is needed for namespaced types like Temporal.Instant
          var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
          var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
          return type;
        }
      } // $FlowFixMe only called in DEV, so void return is not possible.

      function willCoercionThrow(value) {
        {
          try {
            testStringCoercion(value);
            return false;
          } catch (e) {
            return true;
          }
        }
      }
      function testStringCoercion(value) {
        // If you ended up here by following an exception call stack, here's what's
        // happened: you supplied an object or symbol value to React (as a prop, key,
        // DOM attribute, CSS property, string ref, etc.) and when React tried to
        // coerce it to a string using `'' + value`, an exception was thrown.
        //
        // The most common types that will cause this exception are `Symbol` instances
        // and Temporal objects like `Temporal.Instant`. But any object that has a
        // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
        // exception. (Library authors do this to prevent users from using built-in
        // numeric operators like `+` or comparison operators like `>=` because custom
        // methods are needed to perform accurate arithmetic or comparison.)
        //
        // To fix the problem, coerce this object or symbol value to a string before
        // passing it to React. The most reliable way is usually `String(value)`.
        //
        // To find which value is throwing, check the browser or debugger console.
        // Before this exception was thrown, there should be `console.error` output
        // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
        // problem and how that type was used: key, atrribute, input value prop, etc.
        // In most cases, this console output also shows the component and its
        // ancestor components where the exception happened.
        //
        // eslint-disable-next-line react-internal/safe-string-coercion
        return '' + value;
      }
      function checkKeyStringCoercion(value) {
        {
          if (willCoercionThrow(value)) {
            error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));
            return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
          }
        }
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var displayName = outerType.displayName;
        if (displayName) {
          return displayName;
        }
        var functionName = innerType.displayName || innerType.name || '';
        return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
      } // Keep in sync with react-reconciler/getComponentNameFromFiber

      function getContextName(type) {
        return type.displayName || 'Context';
      } // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.

      function getComponentNameFromType(type) {
        if (type == null) {
          // Host root, text node or just invalid type.
          return null;
        }
        {
          if (typeof type.tag === 'number') {
            error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
          }
        }
        if (typeof type === 'function') {
          return type.displayName || type.name || null;
        }
        if (typeof type === 'string') {
          return type;
        }
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return 'Fragment';
          case REACT_PORTAL_TYPE:
            return 'Portal';
          case REACT_PROFILER_TYPE:
            return 'Profiler';
          case REACT_STRICT_MODE_TYPE:
            return 'StrictMode';
          case REACT_SUSPENSE_TYPE:
            return 'Suspense';
          case REACT_SUSPENSE_LIST_TYPE:
            return 'SuspenseList';
        }
        if (_typeof(type) === 'object') {
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + '.Consumer';
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + '.Provider';
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, 'ForwardRef');
            case REACT_MEMO_TYPE:
              var outerName = type.displayName || null;
              if (outerName !== null) {
                return outerName;
              }
              return getComponentNameFromType(type.type) || 'Memo';
            case REACT_LAZY_TYPE:
              {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }

            // eslint-disable-next-line no-fallthrough
          }
        }
        return null;
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      };
      var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
      {
        didWarnAboutStringRefs = {};
      }
      function hasValidRef(config) {
        {
          if (hasOwnProperty.call(config, 'ref')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.ref !== undefined;
      }
      function hasValidKey(config) {
        {
          if (hasOwnProperty.call(config, 'key')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.key !== undefined;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        var warnAboutAccessingKey = function warnAboutAccessingKey() {
          {
            if (!specialPropKeyWarningShown) {
              specialPropKeyWarningShown = true;
              error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
            }
          }
        };
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, 'key', {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function defineRefPropWarningGetter(props, displayName) {
        var warnAboutAccessingRef = function warnAboutAccessingRef() {
          {
            if (!specialPropRefWarningShown) {
              specialPropRefWarningShown = true;
              error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
            }
          }
        };
        warnAboutAccessingRef.isReactWarning = true;
        Object.defineProperty(props, 'ref', {
          get: warnAboutAccessingRef,
          configurable: true
        });
      }
      function warnIfStringRefCannotBeAutoConverted(config) {
        {
          if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
            var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
            if (!didWarnAboutStringRefs[componentName]) {
              error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);
              didWarnAboutStringRefs[componentName] = true;
            }
          }
        }
      }
      /**
       * Factory method to create a new React element. This no longer adheres to
       * the class pattern, so do not use new to call it. Also, instanceof check
       * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
       * if something is a React Element.
       *
       * @param {*} type
       * @param {*} props
       * @param {*} key
       * @param {string|object} ref
       * @param {*} owner
       * @param {*} self A *temporary* helper to detect places where `this` is
       * different from the `owner` when React.createElement is called, so that we
       * can warn. We want to get rid of owner and replace string `ref`s with arrow
       * functions, and as long as `this` and owner are the same, there will be no
       * change in behavior.
       * @param {*} source An annotation object (added by a transpiler or otherwise)
       * indicating filename, line number, and/or other information.
       * @internal
       */

      var ReactElement = function ReactElement(type, key, ref, self, source, owner, props) {
        var element = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: REACT_ELEMENT_TYPE,
          // Built-in properties that belong on the element
          type: type,
          key: key,
          ref: ref,
          props: props,
          // Record the component responsible for creating this element.
          _owner: owner
        };
        {
          // The validation flag is currently mutative. We put it on
          // an external backing store so that we can freeze the whole object.
          // This can be replaced with a WeakMap once they are implemented in
          // commonly used development environments.
          element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
          // the validation flag non-enumerable (where possible, which should
          // include every environment we run tests in), so the test framework
          // ignores it.

          Object.defineProperty(element._store, 'validated', {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false
          }); // self and source are DEV only properties.

          Object.defineProperty(element, '_self', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self
          }); // Two elements created in two different places should be considered
          // equal for testing purposes and therefore we hide it from enumeration.

          Object.defineProperty(element, '_source', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source
          });
          if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
          }
        }
        return element;
      };
      /**
       * Create and return a new ReactElement of the given type.
       * See https://reactjs.org/docs/react-api.html#createelement
       */

      function createElement(type, config, children) {
        var propName; // Reserved names are extracted

        var props = {};
        var key = null;
        var ref = null;
        var self = null;
        var source = null;
        if (config != null) {
          if (hasValidRef(config)) {
            ref = config.ref;
            {
              warnIfStringRefCannotBeAutoConverted(config);
            }
          }
          if (hasValidKey(config)) {
            {
              checkKeyStringCoercion(config.key);
            }
            key = '' + config.key;
          }
          self = config.__self === undefined ? null : config.__self;
          source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              props[propName] = config[propName];
            }
          }
        } // Children can be more than one argument, and those are transferred onto
        // the newly allocated props object.

        var childrenLength = arguments.length - 2;
        if (childrenLength === 1) {
          props.children = children;
        } else if (childrenLength > 1) {
          var childArray = Array(childrenLength);
          for (var i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
          }
          {
            if (Object.freeze) {
              Object.freeze(childArray);
            }
          }
          props.children = childArray;
        } // Resolve default props

        if (type && type.defaultProps) {
          var defaultProps = type.defaultProps;
          for (propName in defaultProps) {
            if (props[propName] === undefined) {
              props[propName] = defaultProps[propName];
            }
          }
        }
        {
          if (key || ref) {
            var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
            if (key) {
              defineKeyPropWarningGetter(props, displayName);
            }
            if (ref) {
              defineRefPropWarningGetter(props, displayName);
            }
          }
        }
        return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
        return newElement;
      }
      /**
       * Clone and return a new ReactElement using element as the starting point.
       * See https://reactjs.org/docs/react-api.html#cloneelement
       */

      function cloneElement(element, config, children) {
        if (element === null || element === undefined) {
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
        }
        var propName; // Original props are copied

        var props = assign({}, element.props); // Reserved names are extracted

        var key = element.key;
        var ref = element.ref; // Self is preserved since the owner is preserved.

        var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
        // transpiler, and the original source is probably a better indicator of the
        // true owner.

        var source = element._source; // Owner will be preserved, unless ref is overridden

        var owner = element._owner;
        if (config != null) {
          if (hasValidRef(config)) {
            // Silently steal the ref from the parent.
            ref = config.ref;
            owner = ReactCurrentOwner.current;
          }
          if (hasValidKey(config)) {
            {
              checkKeyStringCoercion(config.key);
            }
            key = '' + config.key;
          } // Remaining properties override existing props

          var defaultProps;
          if (element.type && element.type.defaultProps) {
            defaultProps = element.type.defaultProps;
          }
          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              if (config[propName] === undefined && defaultProps !== undefined) {
                // Resolve default props
                props[propName] = defaultProps[propName];
              } else {
                props[propName] = config[propName];
              }
            }
          }
        } // Children can be more than one argument, and those are transferred onto
        // the newly allocated props object.

        var childrenLength = arguments.length - 2;
        if (childrenLength === 1) {
          props.children = children;
        } else if (childrenLength > 1) {
          var childArray = Array(childrenLength);
          for (var i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
          }
          props.children = childArray;
        }
        return ReactElement(element.type, key, ref, self, source, owner, props);
      }
      /**
       * Verifies the object is a ReactElement.
       * See https://reactjs.org/docs/react-api.html#isvalidelement
       * @param {?object} object
       * @return {boolean} True if `object` is a ReactElement.
       * @final
       */

      function isValidElement(object) {
        return _typeof(object) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      var SEPARATOR = '.';
      var SUBSEPARATOR = ':';
      /**
       * Escape and wrap key so it is safe to use as a reactid
       *
       * @param {string} key to be escaped.
       * @return {string} the escaped key.
       */

      function escape(key) {
        var escapeRegex = /[=:]/g;
        var escaperLookup = {
          '=': '=0',
          ':': '=2'
        };
        var escapedString = key.replace(escapeRegex, function (match) {
          return escaperLookup[match];
        });
        return '$' + escapedString;
      }
      /**
       * TODO: Test that a single child and an array with one item have the same key
       * pattern.
       */

      var didWarnAboutMaps = false;
      var userProvidedKeyEscapeRegex = /\/+/g;
      function escapeUserProvidedKey(text) {
        return text.replace(userProvidedKeyEscapeRegex, '$&/');
      }
      /**
       * Generate a key string that identifies a element within a set.
       *
       * @param {*} element A element that could contain a manual key.
       * @param {number} index Index that is used if a manual key is not provided.
       * @return {string}
       */

      function getElementKey(element, index) {
        // Do some typechecking here since we call this blindly. We want to ensure
        // that we don't block potential future ES APIs.
        if (_typeof(element) === 'object' && element !== null && element.key != null) {
          // Explicit key
          {
            checkKeyStringCoercion(element.key);
          }
          return escape('' + element.key);
        } // Implicit key determined by the index in the set

        return index.toString(36);
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = _typeof(children);
        if (type === 'undefined' || type === 'boolean') {
          // All of the above are perceived as null.
          children = null;
        }
        var invokeCallback = false;
        if (children === null) {
          invokeCallback = true;
        } else {
          switch (type) {
            case 'string':
            case 'number':
              invokeCallback = true;
              break;
            case 'object':
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
              }
          }
        }
        if (invokeCallback) {
          var _child = children;
          var mappedChild = callback(_child); // If it's the only child, treat the name as if it was wrapped in an array
          // so that it's consistent if the number of children grows:

          var childKey = nameSoFar === '' ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;
          if (isArray(mappedChild)) {
            var escapedChildKey = '';
            if (childKey != null) {
              escapedChildKey = escapeUserProvidedKey(childKey) + '/';
            }
            mapIntoArray(mappedChild, array, escapedChildKey, '', function (c) {
              return c;
            });
          } else if (mappedChild != null) {
            if (isValidElement(mappedChild)) {
              {
                // The `if` statement here prevents auto-disabling of the safe
                // coercion ESLint rule, so we must manually disable it below.
                // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
                if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
                  checkKeyStringCoercion(mappedChild.key);
                }
              }
              mappedChild = cloneAndReplaceKey(mappedChild,
              // Keep both the (mapped) and old keys if they differ, just as
              // traverseAllChildren used to do for objects as children
              escapedPrefix + (
              // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
              mappedChild.key && (!_child || _child.key !== mappedChild.key) ?
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              escapeUserProvidedKey('' + mappedChild.key) + '/' : '') + childKey);
            }
            array.push(mappedChild);
          }
          return 1;
        }
        var child;
        var nextName;
        var subtreeCount = 0; // Count of children found in the current subtree.

        var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;
        if (isArray(children)) {
          for (var i = 0; i < children.length; i++) {
            child = children[i];
            nextName = nextNamePrefix + getElementKey(child, i);
            subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
          }
        } else {
          var iteratorFn = getIteratorFn(children);
          if (typeof iteratorFn === 'function') {
            var iterableChildren = children;
            {
              // Warn about using Maps as children
              if (iteratorFn === iterableChildren.entries) {
                if (!didWarnAboutMaps) {
                  warn('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
                }
                didWarnAboutMaps = true;
              }
            }
            var iterator = iteratorFn.call(iterableChildren);
            var step;
            var ii = 0;
            while (!(step = iterator.next()).done) {
              child = step.value;
              nextName = nextNamePrefix + getElementKey(child, ii++);
              subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
            }
          } else if (type === 'object') {
            // eslint-disable-next-line react-internal/safe-string-coercion
            var childrenString = String(children);
            throw new Error("Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + "). " + 'If you meant to render a collection of children, use an array ' + 'instead.');
          }
        }
        return subtreeCount;
      }

      /**
       * Maps children that are typically specified as `props.children`.
       *
       * See https://reactjs.org/docs/react-api.html#reactchildrenmap
       *
       * The provided mapFunction(child, index) will be called for each
       * leaf child.
       *
       * @param {?*} children Children tree container.
       * @param {function(*, int)} func The map function.
       * @param {*} context Context for mapFunction.
       * @return {object} Object containing the ordered map of results.
       */
      function mapChildren(children, func, context) {
        if (children == null) {
          return children;
        }
        var result = [];
        var count = 0;
        mapIntoArray(children, result, '', '', function (child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      /**
       * Count the number of children that are typically specified as
       * `props.children`.
       *
       * See https://reactjs.org/docs/react-api.html#reactchildrencount
       *
       * @param {?*} children Children tree container.
       * @return {number} The number of children.
       */

      function countChildren(children) {
        var n = 0;
        mapChildren(children, function () {
          n++; // Don't return anything
        });
        return n;
      }

      /**
       * Iterates through children that are typically specified as `props.children`.
       *
       * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
       *
       * The provided forEachFunc(child, index) will be called for each
       * leaf child.
       *
       * @param {?*} children Children tree container.
       * @param {function(*, int)} forEachFunc
       * @param {*} forEachContext Context for forEachContext.
       */
      function forEachChildren(children, forEachFunc, forEachContext) {
        mapChildren(children, function () {
          forEachFunc.apply(this, arguments); // Don't return anything.
        }, forEachContext);
      }
      /**
       * Flatten a children object (typically specified as `props.children`) and
       * return an array with appropriately re-keyed children.
       *
       * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
       */

      function toArray(children) {
        return mapChildren(children, function (child) {
          return child;
        }) || [];
      }
      /**
       * Returns the first child in a collection of children and verifies that there
       * is only one child in the collection.
       *
       * See https://reactjs.org/docs/react-api.html#reactchildrenonly
       *
       * The current implementation of this function assumes that a single child gets
       * passed without a wrapper, but the purpose of this helper function is to
       * abstract away the particular structure of children.
       *
       * @param {?object} children Child collection structure.
       * @return {ReactElement} The first and only `ReactElement` contained in the
       * structure.
       */

      function onlyChild(children) {
        if (!isValidElement(children)) {
          throw new Error('React.Children.only expected to receive a single React element child.');
        }
        return children;
      }
      function createContext(defaultValue) {
        // TODO: Second argument used to be an optional `calculateChangedBits`
        // function. Warn to reserve for future use?
        var context = {
          $$typeof: REACT_CONTEXT_TYPE,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        context.Provider = {
          $$typeof: REACT_PROVIDER_TYPE,
          _context: context
        };
        var hasWarnedAboutUsingNestedContextConsumers = false;
        var hasWarnedAboutUsingConsumerProvider = false;
        var hasWarnedAboutDisplayNameOnConsumer = false;
        {
          // A separate object, but proxies back to the original context object for
          // backwards compatibility. It has a different $$typeof, so we can properly
          // warn for the incorrect usage of Context as a Consumer.
          var Consumer = {
            $$typeof: REACT_CONTEXT_TYPE,
            _context: context
          }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

          Object.defineProperties(Consumer, {
            Provider: {
              get: function get() {
                if (!hasWarnedAboutUsingConsumerProvider) {
                  hasWarnedAboutUsingConsumerProvider = true;
                  error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
                }
                return context.Provider;
              },
              set: function set(_Provider) {
                context.Provider = _Provider;
              }
            },
            _currentValue: {
              get: function get() {
                return context._currentValue;
              },
              set: function set(_currentValue) {
                context._currentValue = _currentValue;
              }
            },
            _currentValue2: {
              get: function get() {
                return context._currentValue2;
              },
              set: function set(_currentValue2) {
                context._currentValue2 = _currentValue2;
              }
            },
            _threadCount: {
              get: function get() {
                return context._threadCount;
              },
              set: function set(_threadCount) {
                context._threadCount = _threadCount;
              }
            },
            Consumer: {
              get: function get() {
                if (!hasWarnedAboutUsingNestedContextConsumers) {
                  hasWarnedAboutUsingNestedContextConsumers = true;
                  error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
                }
                return context.Consumer;
              }
            },
            displayName: {
              get: function get() {
                return context.displayName;
              },
              set: function set(displayName) {
                if (!hasWarnedAboutDisplayNameOnConsumer) {
                  warn('Setting `displayName` on Context.Consumer has no effect. ' + "You should set it directly on the context with Context.displayName = '%s'.", displayName);
                  hasWarnedAboutDisplayNameOnConsumer = true;
                }
              }
            }
          }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

          context.Consumer = Consumer;
        }
        {
          context._currentRenderer = null;
          context._currentRenderer2 = null;
        }
        return context;
      }
      var Uninitialized = -1;
      var Pending = 0;
      var Resolved = 1;
      var Rejected = 2;
      function lazyInitializer(payload) {
        if (payload._status === Uninitialized) {
          var ctor = payload._result;
          var thenable = ctor(); // Transition to the next state.
          // This might throw either because it's missing or throws. If so, we treat it
          // as still uninitialized and try again next time. Which is the same as what
          // happens if the ctor or any wrappers processing the ctor throws. This might
          // end up fixing it if the resolution was a concurrency bug.

          thenable.then(function (moduleObject) {
            if (payload._status === Pending || payload._status === Uninitialized) {
              // Transition to the next state.
              var resolved = payload;
              resolved._status = Resolved;
              resolved._result = moduleObject;
            }
          }, function (error) {
            if (payload._status === Pending || payload._status === Uninitialized) {
              // Transition to the next state.
              var rejected = payload;
              rejected._status = Rejected;
              rejected._result = error;
            }
          });
          if (payload._status === Uninitialized) {
            // In case, we're still uninitialized, then we're waiting for the thenable
            // to resolve. Set it as pending in the meantime.
            var pending = payload;
            pending._status = Pending;
            pending._result = thenable;
          }
        }
        if (payload._status === Resolved) {
          var moduleObject = payload._result;
          {
            if (moduleObject === undefined) {
              error('lazy: Expected the result of a dynamic imp' + 'ort() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' +
              // Break up imports to avoid accidentally parsing them as dependencies.
              'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))\n\n" + 'Did you accidentally put curly braces around the import?', moduleObject);
            }
          }
          {
            if (!('default' in moduleObject)) {
              error('lazy: Expected the result of a dynamic imp' + 'ort() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' +
              // Break up imports to avoid accidentally parsing them as dependencies.
              'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))", moduleObject);
            }
          }
          return moduleObject.default;
        } else {
          throw payload._result;
        }
      }
      function lazy(ctor) {
        var payload = {
          // We use these fields to store the result.
          _status: Uninitialized,
          _result: ctor
        };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: payload,
          _init: lazyInitializer
        };
        {
          // In production, this would just set it on the object.
          var defaultProps;
          var propTypes; // $FlowFixMe

          Object.defineProperties(lazyType, {
            defaultProps: {
              configurable: true,
              get: function get() {
                return defaultProps;
              },
              set: function set(newDefaultProps) {
                error('React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
                defaultProps = newDefaultProps; // Match production behavior more closely:
                // $FlowFixMe

                Object.defineProperty(lazyType, 'defaultProps', {
                  enumerable: true
                });
              }
            },
            propTypes: {
              configurable: true,
              get: function get() {
                return propTypes;
              },
              set: function set(newPropTypes) {
                error('React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
                propTypes = newPropTypes; // Match production behavior more closely:
                // $FlowFixMe

                Object.defineProperty(lazyType, 'propTypes', {
                  enumerable: true
                });
              }
            }
          });
        }
        return lazyType;
      }
      function forwardRef(render) {
        {
          if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
            error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
          } else if (typeof render !== 'function') {
            error('forwardRef requires a render function but was given %s.', render === null ? 'null' : _typeof(render));
          } else {
            if (render.length !== 0 && render.length !== 2) {
              error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
            }
          }
          if (render != null) {
            if (render.defaultProps != null || render.propTypes != null) {
              error('forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?');
            }
          }
        }
        var elementType = {
          $$typeof: REACT_FORWARD_REF_TYPE,
          render: render
        };
        {
          var ownName;
          Object.defineProperty(elementType, 'displayName', {
            enumerable: false,
            configurable: true,
            get: function get() {
              return ownName;
            },
            set: function set(name) {
              ownName = name; // The inner component shouldn't inherit this display name in most cases,
              // because the component may be used elsewhere.
              // But it's nice for anonymous functions to inherit the name,
              // so that our component-stack generation logic will display their frames.
              // An anonymous function generally suggests a pattern like:
              //   React.forwardRef((props, ref) => {...});
              // This kind of inner function is not used elsewhere so the side effect is okay.

              if (!render.name && !render.displayName) {
                render.displayName = name;
              }
            }
          });
        }
        return elementType;
      }
      var REACT_MODULE_REFERENCE;
      {
        REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
      }
      function isValidElementType(type) {
        if (typeof type === 'string' || typeof type === 'function') {
          return true;
        } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).

        if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
          return true;
        }
        if (_typeof(type) === 'object' && type !== null) {
          if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE ||
          // This needs to include all possible module reference object
          // types supported by any Flight configuration anywhere since
          // we don't know which Flight build this will end up being used
          // with.
          type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
            return true;
          }
        }
        return false;
      }
      function memo(type, compare) {
        {
          if (!isValidElementType(type)) {
            error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : _typeof(type));
          }
        }
        var elementType = {
          $$typeof: REACT_MEMO_TYPE,
          type: type,
          compare: compare === undefined ? null : compare
        };
        {
          var ownName;
          Object.defineProperty(elementType, 'displayName', {
            enumerable: false,
            configurable: true,
            get: function get() {
              return ownName;
            },
            set: function set(name) {
              ownName = name; // The inner component shouldn't inherit this display name in most cases,
              // because the component may be used elsewhere.
              // But it's nice for anonymous functions to inherit the name,
              // so that our component-stack generation logic will display their frames.
              // An anonymous function generally suggests a pattern like:
              //   React.memo((props) => {...});
              // This kind of inner function is not used elsewhere so the side effect is okay.

              if (!type.name && !type.displayName) {
                type.displayName = name;
              }
            }
          });
        }
        return elementType;
      }
      function resolveDispatcher() {
        var dispatcher = ReactCurrentDispatcher.current;
        {
          if (dispatcher === null) {
            error('Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' + ' one of the following reasons:\n' + '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' + '2. You might be breaking the Rules of Hooks\n' + '3. You might have more than one copy of React in the same app\n' + 'See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.');
          }
        } // Will result in a null access error if accessed outside render phase. We
        // intentionally don't throw our own error because this is in a hot path.
        // Also helps ensure this is inlined.

        return dispatcher;
      }
      function useContext(Context) {
        var dispatcher = resolveDispatcher();
        {
          // TODO: add a more generic warning for invalid values.
          if (Context._context !== undefined) {
            var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
            // and nobody should be using this in existing code.

            if (realContext.Consumer === Context) {
              error('Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
            } else if (realContext.Provider === Context) {
              error('Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
            }
          }
        }
        return dispatcher.useContext(Context);
      }
      function useState(initialState) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useState(initialState);
      }
      function useReducer(reducer, initialArg, init) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useReducer(reducer, initialArg, init);
      }
      function useRef(initialValue) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useRef(initialValue);
      }
      function useEffect(create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useEffect(create, deps);
      }
      function useInsertionEffect(create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useInsertionEffect(create, deps);
      }
      function useLayoutEffect(create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useLayoutEffect(create, deps);
      }
      function useCallback(callback, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useCallback(callback, deps);
      }
      function useMemo(create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useMemo(create, deps);
      }
      function useImperativeHandle(ref, create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useImperativeHandle(ref, create, deps);
      }
      function useDebugValue(value, formatterFn) {
        {
          var dispatcher = resolveDispatcher();
          return dispatcher.useDebugValue(value, formatterFn);
        }
      }
      function useTransition() {
        var dispatcher = resolveDispatcher();
        return dispatcher.useTransition();
      }
      function useDeferredValue(value) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useDeferredValue(value);
      }
      function useId() {
        var dispatcher = resolveDispatcher();
        return dispatcher.useId();
      }
      function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
      }

      // Helpers to patch console.logs to avoid logging during side-effect free
      // replaying on render function. This currently only patches the object
      // lazily which won't cover if the log function was extracted eagerly.
      // We could also eagerly patch the method.
      var disabledDepth = 0;
      var prevLog;
      var prevInfo;
      var prevWarn;
      var prevError;
      var prevGroup;
      var prevGroupCollapsed;
      var prevGroupEnd;
      function disabledLog() {}
      disabledLog.__reactDisabledLog = true;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            /* eslint-disable react-internal/no-production-logging */
            prevLog = console.log;
            prevInfo = console.info;
            prevWarn = console.warn;
            prevError = console.error;
            prevGroup = console.group;
            prevGroupCollapsed = console.groupCollapsed;
            prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

            var props = {
              configurable: true,
              enumerable: true,
              value: disabledLog,
              writable: true
            }; // $FlowFixMe Flow thinks console is immutable.

            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
            /* eslint-enable react-internal/no-production-logging */
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          disabledDepth--;
          if (disabledDepth === 0) {
            /* eslint-disable react-internal/no-production-logging */
            var props = {
              configurable: true,
              enumerable: true,
              writable: true
            }; // $FlowFixMe Flow thinks console is immutable.

            Object.defineProperties(console, {
              log: assign({}, props, {
                value: prevLog
              }),
              info: assign({}, props, {
                value: prevInfo
              }),
              warn: assign({}, props, {
                value: prevWarn
              }),
              error: assign({}, props, {
                value: prevError
              }),
              group: assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: assign({}, props, {
                value: prevGroupEnd
              })
            });
            /* eslint-enable react-internal/no-production-logging */
          }
          if (disabledDepth < 0) {
            error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
          }
        }
      }
      var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
      var prefix;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix === undefined) {
            // Extract the VM specific prefix used by each line.
            try {
              throw Error();
            } catch (x) {
              var match = x.stack.trim().match(/\n( *(at )?)/);
              prefix = match && match[1] || '';
            }
          } // We use the prefix to ensure our stacks line up with native stack frames.

          return '\n' + prefix + name;
        }
      }
      var reentry = false;
      var componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn, construct) {
        // If something asked for a stack inside a fake render, it should get ignored.
        if (!fn || reentry) {
          return '';
        }
        {
          var frame = componentFrameCache.get(fn);
          if (frame !== undefined) {
            return frame;
          }
        }
        var control;
        reentry = true;
        var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

        Error.prepareStackTrace = undefined;
        var previousDispatcher;
        {
          previousDispatcher = ReactCurrentDispatcher$1.current; // Set the dispatcher in DEV because this might be call in the render function
          // for warnings.

          ReactCurrentDispatcher$1.current = null;
          disableLogs();
        }
        try {
          // This should throw.
          if (construct) {
            // Something should be setting the props in the constructor.
            var Fake = function Fake() {
              throw Error();
            }; // $FlowFixMe

            Object.defineProperty(Fake.prototype, 'props', {
              set: function set() {
                // We use a throwing setter instead of frozen or non-writable props
                // because that won't throw in a non-strict mode function.
                throw Error();
              }
            });
            if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === 'object' && Reflect.construct) {
              // We construct a different control for this case to include any extra
              // frames added by the construct call.
              try {
                Reflect.construct(Fake, []);
              } catch (x) {
                control = x;
              }
              Reflect.construct(fn, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x) {
                control = x;
              }
              fn.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x) {
              control = x;
            }
            fn();
          }
        } catch (sample) {
          // This is inlined manually because closure doesn't do it for us.
          if (sample && control && typeof sample.stack === 'string') {
            // This extracts the first frame from the sample that isn't also in the control.
            // Skipping one frame that we assume is the frame that calls the two.
            var sampleLines = sample.stack.split('\n');
            var controlLines = control.stack.split('\n');
            var s = sampleLines.length - 1;
            var c = controlLines.length - 1;
            while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
              // We expect at least one stack frame to be shared.
              // Typically this will be the root most one. However, stack frames may be
              // cut off due to maximum stack limits. In this case, one maybe cut off
              // earlier than the other. We assume that the sample is longer or the same
              // and there for cut off earlier. So we should find the root most frame in
              // the sample somewhere in the control.
              c--;
            }
            for (; s >= 1 && c >= 0; s--, c--) {
              // Next we find the first one that isn't the same which should be the
              // frame that called our sample function and the control.
              if (sampleLines[s] !== controlLines[c]) {
                // In V8, the first line is describing the message but other VMs don't.
                // If we're about to return the first line, and the control is also on the same
                // line, that's a pretty good indicator that our sample threw at same line as
                // the control. I.e. before we entered the sample frame. So we ignore this result.
                // This can happen if you passed a class to function component, or non-function.
                if (s !== 1 || c !== 1) {
                  do {
                    s--;
                    c--; // We may still have similar intermediate frames from the construct call.
                    // The next one that isn't the same should be our match though.

                    if (c < 0 || sampleLines[s] !== controlLines[c]) {
                      // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                      var _frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
                      // but we have a user-provided "displayName"
                      // splice it in to make the stack more readable.

                      if (fn.displayName && _frame.includes('<anonymous>')) {
                        _frame = _frame.replace('<anonymous>', fn.displayName);
                      }
                      {
                        if (typeof fn === 'function') {
                          componentFrameCache.set(fn, _frame);
                        }
                      } // Return the line we found.

                      return _frame;
                    }
                  } while (s >= 1 && c >= 0);
                }
                break;
              }
            }
          }
        } finally {
          reentry = false;
          {
            ReactCurrentDispatcher$1.current = previousDispatcher;
            reenableLogs();
          }
          Error.prepareStackTrace = previousPrepareStackTrace;
        } // Fallback to just using the name if we couldn't make it throw.

        var name = fn ? fn.displayName || fn.name : '';
        var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';
        {
          if (typeof fn === 'function') {
            componentFrameCache.set(fn, syntheticFrame);
          }
        }
        return syntheticFrame;
      }
      function describeFunctionComponentFrame(fn, source, ownerFn) {
        {
          return describeNativeComponentFrame(fn, false);
        }
      }
      function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null) {
          return '';
        }
        if (typeof type === 'function') {
          {
            return describeNativeComponentFrame(type, shouldConstruct(type));
          }
        }
        if (typeof type === 'string') {
          return describeBuiltInComponentFrame(type);
        }
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame('Suspense');
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame('SuspenseList');
        }
        if (_typeof(type) === 'object') {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              // Memo may contain any component type so we recursively resolve it.
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_LAZY_TYPE:
              {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  // Lazy may contain any component type so we recursively resolve it.
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {}
              }
          }
        }
        return '';
      }
      var loggedTypeFailures = {};
      var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame$1.setExtraStackFrame(null);
          }
        }
      }
      function checkPropTypes(typeSpecs, values, location, componentName, element) {
        {
          // $FlowFixMe This is okay but Flow doesn't know it.
          var has = Function.call.bind(hasOwnProperty);
          for (var typeSpecName in typeSpecs) {
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
              // fail the render phase where it didn't fail before. So we log it.
              // After these have been cleaned up, we'll let them throw.

              try {
                // This is intentionally an invariant that gets caught. It's the same
                // behavior as without this statement except with a better message.
                if (typeof typeSpecs[typeSpecName] !== 'function') {
                  // eslint-disable-next-line react-internal/prod-error-codes
                  var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + _typeof(typeSpecs[typeSpecName]) + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
                  err.name = 'Invariant Violation';
                  throw err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
              } catch (ex) {
                error$1 = ex;
              }
              if (error$1 && !(error$1 instanceof Error)) {
                setCurrentlyValidatingElement(element);
                error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, _typeof(error$1));
                setCurrentlyValidatingElement(null);
              }
              if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                // Only monitor this failure once because there tends to be a lot of the
                // same error.
                loggedTypeFailures[error$1.message] = true;
                setCurrentlyValidatingElement(element);
                error('Failed %s type: %s', location, error$1.message);
                setCurrentlyValidatingElement(null);
              }
            }
          }
        }
      }
      function setCurrentlyValidatingElement$1(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            setExtraStackFrame(stack);
          } else {
            setExtraStackFrame(null);
          }
        }
      }
      var propTypesMisspellWarningShown;
      {
        propTypesMisspellWarningShown = false;
      }
      function getDeclarationErrorAddendum() {
        if (ReactCurrentOwner.current) {
          var name = getComponentNameFromType(ReactCurrentOwner.current.type);
          if (name) {
            return '\n\nCheck the render method of `' + name + '`.';
          }
        }
        return '';
      }
      function getSourceInfoErrorAddendum(source) {
        if (source !== undefined) {
          var fileName = source.fileName.replace(/^.*[\\\/]/, '');
          var lineNumber = source.lineNumber;
          return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
        }
        return '';
      }
      function getSourceInfoErrorAddendumForProps(elementProps) {
        if (elementProps !== null && elementProps !== undefined) {
          return getSourceInfoErrorAddendum(elementProps.__source);
        }
        return '';
      }
      /**
       * Warn if there's no key explicitly set on dynamic arrays of children or
       * object keys are not valid. This allows us to keep track of children between
       * updates.
       */

      var ownerHasKeyUseWarning = {};
      function getCurrentComponentErrorInfo(parentType) {
        var info = getDeclarationErrorAddendum();
        if (!info) {
          var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
          if (parentName) {
            info = "\n\nCheck the top-level render call using <" + parentName + ">.";
          }
        }
        return info;
      }
      /**
       * Warn if the element doesn't have an explicit key assigned to it.
       * This element is in an array. The array could grow and shrink or be
       * reordered. All children that haven't already been validated are required to
       * have a "key" property assigned to it. Error statuses are cached so a warning
       * will only be shown once.
       *
       * @internal
       * @param {ReactElement} element Element that requires a key.
       * @param {*} parentType element's parent's type.
       */

      function validateExplicitKey(element, parentType) {
        if (!element._store || element._store.validated || element.key != null) {
          return;
        }
        element._store.validated = true;
        var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
        if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
          return;
        }
        ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
        // property, it may be the creator of the child that's responsible for
        // assigning it a key.

        var childOwner = '';
        if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
          // Give the component that originally created this child.
          childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
        }
        {
          setCurrentlyValidatingElement$1(element);
          error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
          setCurrentlyValidatingElement$1(null);
        }
      }
      /**
       * Ensure that every element either is passed in a static location, in an
       * array with an explicit keys property defined, or in an object literal
       * with valid key property.
       *
       * @internal
       * @param {ReactNode} node Statically passed child of any type.
       * @param {*} parentType node's parent's type.
       */

      function validateChildKeys(node, parentType) {
        if (_typeof(node) !== 'object') {
          return;
        }
        if (isArray(node)) {
          for (var i = 0; i < node.length; i++) {
            var child = node[i];
            if (isValidElement(child)) {
              validateExplicitKey(child, parentType);
            }
          }
        } else if (isValidElement(node)) {
          // This element was passed in a valid location.
          if (node._store) {
            node._store.validated = true;
          }
        } else if (node) {
          var iteratorFn = getIteratorFn(node);
          if (typeof iteratorFn === 'function') {
            // Entry iterators used to provide implicit keys,
            // but now we print a separate warning for them later.
            if (iteratorFn !== node.entries) {
              var iterator = iteratorFn.call(node);
              var step;
              while (!(step = iterator.next()).done) {
                if (isValidElement(step.value)) {
                  validateExplicitKey(step.value, parentType);
                }
              }
            }
          }
        }
      }
      /**
       * Given an element, validate that its props follow the propTypes definition,
       * provided by the type.
       *
       * @param {ReactElement} element
       */

      function validatePropTypes(element) {
        {
          var type = element.type;
          if (type === null || type === undefined || typeof type === 'string') {
            return;
          }
          var propTypes;
          if (typeof type === 'function') {
            propTypes = type.propTypes;
          } else if (_typeof(type) === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE ||
          // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          type.$$typeof === REACT_MEMO_TYPE)) {
            propTypes = type.propTypes;
          } else {
            return;
          }
          if (propTypes) {
            // Intentionally inside to avoid triggering lazy initializers:
            var name = getComponentNameFromType(type);
            checkPropTypes(propTypes, element.props, 'prop', name, element);
          } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

            var _name = getComponentNameFromType(type);
            error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
          }
          if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
            error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
          }
        }
      }
      /**
       * Given a fragment, validate that it can only be provided with fragment props
       * @param {ReactElement} fragment
       */

      function validateFragmentProps(fragment) {
        {
          var keys = Object.keys(fragment.props);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key !== 'children' && key !== 'key') {
              setCurrentlyValidatingElement$1(fragment);
              error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
              setCurrentlyValidatingElement$1(null);
              break;
            }
          }
          if (fragment.ref !== null) {
            setCurrentlyValidatingElement$1(fragment);
            error('Invalid attribute `ref` supplied to `React.Fragment`.');
            setCurrentlyValidatingElement$1(null);
          }
        }
      }
      function createElementWithValidation(type, props, children) {
        var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
        // succeed and there will likely be errors in render.

        if (!validType) {
          var info = '';
          if (type === undefined || _typeof(type) === 'object' && type !== null && Object.keys(type).length === 0) {
            info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
          }
          var sourceInfo = getSourceInfoErrorAddendumForProps(props);
          if (sourceInfo) {
            info += sourceInfo;
          } else {
            info += getDeclarationErrorAddendum();
          }
          var typeString;
          if (type === null) {
            typeString = 'null';
          } else if (isArray(type)) {
            typeString = 'array';
          } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
            typeString = "<" + (getComponentNameFromType(type.type) || 'Unknown') + " />";
            info = ' Did you accidentally export a JSX literal instead of a component?';
          } else {
            typeString = _typeof(type);
          }
          {
            error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
          }
        }
        var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
        // TODO: Drop this when these are no longer allowed as the type argument.

        if (element == null) {
          return element;
        } // Skip key warning if the type isn't valid since our key validation logic
        // doesn't expect a non-string/function type and can throw confusing errors.
        // We don't want exception behavior to differ between dev and prod.
        // (Rendering will throw with a helpful message and as soon as the type is
        // fixed, the key warnings will appear.)

        if (validType) {
          for (var i = 2; i < arguments.length; i++) {
            validateChildKeys(arguments[i], type);
          }
        }
        if (type === REACT_FRAGMENT_TYPE) {
          validateFragmentProps(element);
        } else {
          validatePropTypes(element);
        }
        return element;
      }
      var didWarnAboutDeprecatedCreateFactory = false;
      function createFactoryWithValidation(type) {
        var validatedFactory = createElementWithValidation.bind(null, type);
        validatedFactory.type = type;
        {
          if (!didWarnAboutDeprecatedCreateFactory) {
            didWarnAboutDeprecatedCreateFactory = true;
            warn('React.createFactory() is deprecated and will be removed in ' + 'a future major release. Consider using JSX ' + 'or use React.createElement() directly instead.');
          } // Legacy hook: remove it

          Object.defineProperty(validatedFactory, 'type', {
            enumerable: false,
            get: function get() {
              warn('Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
              Object.defineProperty(this, 'type', {
                value: type
              });
              return type;
            }
          });
        }
        return validatedFactory;
      }
      function cloneElementWithValidation(element, props, children) {
        var newElement = cloneElement.apply(this, arguments);
        for (var i = 2; i < arguments.length; i++) {
          validateChildKeys(arguments[i], newElement.type);
        }
        validatePropTypes(newElement);
        return newElement;
      }
      function startTransition(scope, options) {
        var prevTransition = ReactCurrentBatchConfig.transition;
        ReactCurrentBatchConfig.transition = {};
        var currentTransition = ReactCurrentBatchConfig.transition;
        {
          ReactCurrentBatchConfig.transition._updatedFibers = new Set();
        }
        try {
          scope();
        } finally {
          ReactCurrentBatchConfig.transition = prevTransition;
          {
            if (prevTransition === null && currentTransition._updatedFibers) {
              var updatedFibersCount = currentTransition._updatedFibers.size;
              if (updatedFibersCount > 10) {
                warn('Detected a large number of updates inside startTransition. ' + 'If this is due to a subscription please re-write it to use React provided hooks. ' + 'Otherwise concurrent mode guarantees are off the table.');
              }
              currentTransition._updatedFibers.clear();
            }
          }
        }
      }
      var didWarnAboutMessageChannel = false;
      var enqueueTaskImpl = null;
      function enqueueTask(task) {
        if (enqueueTaskImpl === null) {
          try {
            // read require off the module object to get around the bundlers.
            // we don't want them to detect a require and bundle a Node polyfill.
            var requireString = ('require' + Math.random()).slice(0, 7);
            var nodeRequire = module && module[requireString]; // assuming we're in node, let's try to get node's
            // version of setImmediate, bypassing fake timers if any.

            enqueueTaskImpl = nodeRequire.call(module, 'timers').setImmediate;
          } catch (_err) {
            // we're in a browser
            // we can't use regular timers because they may still be faked
            // so we try MessageChannel+postMessage instead
            enqueueTaskImpl = function enqueueTaskImpl(callback) {
              {
                if (didWarnAboutMessageChannel === false) {
                  didWarnAboutMessageChannel = true;
                  if (typeof MessageChannel === 'undefined') {
                    error('This browser does not have a MessageChannel implementation, ' + 'so enqueuing tasks via await act(async () => ...) will fail. ' + 'Please file an issue at https://github.com/facebook/react/issues ' + 'if you encounter this warning.');
                  }
                }
              }
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(undefined);
            };
          }
        }
        return enqueueTaskImpl(task);
      }
      var actScopeDepth = 0;
      var didWarnNoAwaitAct = false;
      function act(callback) {
        {
          // `act` calls can be nested, so we track the depth. This represents the
          // number of `act` scopes on the stack.
          var prevActScopeDepth = actScopeDepth;
          actScopeDepth++;
          if (ReactCurrentActQueue.current === null) {
            // This is the outermost `act` scope. Initialize the queue. The reconciler
            // will detect the queue and use it instead of Scheduler.
            ReactCurrentActQueue.current = [];
          }
          var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
          var result;
          try {
            // Used to reproduce behavior of `batchedUpdates` in legacy mode. Only
            // set to `true` while the given callback is executed, not for updates
            // triggered during an async event, because this is how the legacy
            // implementation of `act` behaved.
            ReactCurrentActQueue.isBatchingLegacy = true;
            result = callback(); // Replicate behavior of original `act` implementation in legacy mode,
            // which flushed updates immediately after the scope function exits, even
            // if it's an async function.

            if (!prevIsBatchingLegacy && ReactCurrentActQueue.didScheduleLegacyUpdate) {
              var queue = ReactCurrentActQueue.current;
              if (queue !== null) {
                ReactCurrentActQueue.didScheduleLegacyUpdate = false;
                flushActQueue(queue);
              }
            }
          } catch (error) {
            popActScope(prevActScopeDepth);
            throw error;
          } finally {
            ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
          }
          if (result !== null && _typeof(result) === 'object' && typeof result.then === 'function') {
            var thenableResult = result; // The callback is an async function (i.e. returned a promise). Wait
            // for it to resolve before exiting the current scope.

            var wasAwaited = false;
            var thenable = {
              then: function then(resolve, reject) {
                wasAwaited = true;
                thenableResult.then(function (returnValue) {
                  popActScope(prevActScopeDepth);
                  if (actScopeDepth === 0) {
                    // We've exited the outermost act scope. Recursively flush the
                    // queue until there's no remaining work.
                    recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                  } else {
                    resolve(returnValue);
                  }
                }, function (error) {
                  // The callback threw an error.
                  popActScope(prevActScopeDepth);
                  reject(error);
                });
              }
            };
            {
              if (!didWarnNoAwaitAct && typeof Promise !== 'undefined') {
                // eslint-disable-next-line no-undef
                Promise.resolve().then(function () {}).then(function () {
                  if (!wasAwaited) {
                    didWarnNoAwaitAct = true;
                    error('You called act(async () => ...) without await. ' + 'This could lead to unexpected testing behaviour, ' + 'interleaving multiple act calls and mixing their ' + 'scopes. ' + 'You should - await act(async () => ...);');
                  }
                });
              }
            }
            return thenable;
          } else {
            var returnValue = result; // The callback is not an async function. Exit the current scope
            // immediately, without awaiting.

            popActScope(prevActScopeDepth);
            if (actScopeDepth === 0) {
              // Exiting the outermost act scope. Flush the queue.
              var _queue = ReactCurrentActQueue.current;
              if (_queue !== null) {
                flushActQueue(_queue);
                ReactCurrentActQueue.current = null;
              } // Return a thenable. If the user awaits it, we'll flush again in
              // case additional work was scheduled by a microtask.

              var _thenable = {
                then: function then(resolve, reject) {
                  // Confirm we haven't re-entered another `act` scope, in case
                  // the user does something weird like await the thenable
                  // multiple times.
                  if (ReactCurrentActQueue.current === null) {
                    // Recursively flush the queue until there's no remaining work.
                    ReactCurrentActQueue.current = [];
                    recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                  } else {
                    resolve(returnValue);
                  }
                }
              };
              return _thenable;
            } else {
              // Since we're inside a nested `act` scope, the returned thenable
              // immediately resolves. The outer scope will flush the queue.
              var _thenable2 = {
                then: function then(resolve, reject) {
                  resolve(returnValue);
                }
              };
              return _thenable2;
            }
          }
        }
      }
      function popActScope(prevActScopeDepth) {
        {
          if (prevActScopeDepth !== actScopeDepth - 1) {
            error('You seem to have overlapping act() calls, this is not supported. ' + 'Be sure to await previous act() calls before making a new one. ');
          }
          actScopeDepth = prevActScopeDepth;
        }
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        {
          var queue = ReactCurrentActQueue.current;
          if (queue !== null) {
            try {
              flushActQueue(queue);
              enqueueTask(function () {
                if (queue.length === 0) {
                  // No additional work was scheduled. Finish.
                  ReactCurrentActQueue.current = null;
                  resolve(returnValue);
                } else {
                  // Keep flushing work until there's none left.
                  recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                }
              });
            } catch (error) {
              reject(error);
            }
          } else {
            resolve(returnValue);
          }
        }
      }
      var isFlushing = false;
      function flushActQueue(queue) {
        {
          if (!isFlushing) {
            // Prevent re-entrance.
            isFlushing = true;
            var i = 0;
            try {
              for (; i < queue.length; i++) {
                var callback = queue[i];
                do {
                  callback = callback(true);
                } while (callback !== null);
              }
              queue.length = 0;
            } catch (error) {
              // If something throws, leave the remaining callbacks on the queue.
              queue = queue.slice(i + 1);
              throw error;
            } finally {
              isFlushing = false;
            }
          }
        }
      }
      var createElement$1 = createElementWithValidation;
      var cloneElement$1 = cloneElementWithValidation;
      var createFactory = createFactoryWithValidation;
      var Children = {
        map: mapChildren,
        forEach: forEachChildren,
        count: countChildren,
        toArray: toArray,
        only: onlyChild
      };
      exports.Children = Children;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
      exports.cloneElement = cloneElement$1;
      exports.createContext = createContext;
      exports.createElement = createElement$1;
      exports.createFactory = createFactory;
      exports.createRef = createRef;
      exports.forwardRef = forwardRef;
      exports.isValidElement = isValidElement;
      exports.lazy = lazy;
      exports.memo = memo;
      exports.startTransition = startTransition;
      exports.unstable_act = act;
      exports.useCallback = useCallback;
      exports.useContext = useContext;
      exports.useDebugValue = useDebugValue;
      exports.useDeferredValue = useDeferredValue;
      exports.useEffect = useEffect;
      exports.useId = useId;
      exports.useImperativeHandle = useImperativeHandle;
      exports.useInsertionEffect = useInsertionEffect;
      exports.useLayoutEffect = useLayoutEffect;
      exports.useMemo = useMemo;
      exports.useReducer = useReducer;
      exports.useRef = useRef;
      exports.useState = useState;
      exports.useSyncExternalStore = useSyncExternalStore;
      exports.useTransition = useTransition;
      exports.version = ReactVersion;
      /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === 'function') {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
      }
    })();
  }
})(react_development, react_development.exports);

var img$1 = "data:image/png;base64,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";

var img = "data:image/png;base64,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";

var _entry = {
  "name": "CameraSelector",
  "extensionId": "cameraselector",
  "extensionURL": "https://tfabworks.github.io/xcx-cameraselector/dist/cameraselector.mjs",
  "collaborator": "TFabWorks",
  "description": "Make the camera selectable. This is an extension to help with extensions that use all cameras.",
  "helpLink": "https://github.com/tfabworks/xcx-cameraselector",
  "featured": true,
  "disabled": false,
  "bluetoothRequired": false,
  "internetConnectionRequired": false,
  iconURL: img$1,
  insetIconURL: img
};
// const defaultLang = 'ja'
// const FormattedMessageFixed = (props) => (<FormattedMessage {...props} />)
// const makeFormatMessage = (key) => FormattedMessageFixed({
//     id: `${key}`,
//     defaultMessage: (entryJson[key] || translationsJson[defaultLang] || key),
//     description: `${key} for ${entryJson.name} Blocks`
// })

// const entryJsx = {
//     ...entryJson,
//     iconURL,
//     insetIconURL,
//     translationMap: translationsJson,
//     name: makeFormatMessage('name'),
//     description: makeFormatMessage('description'),
// }

// console.log("entry", entryJsx)

// export const entry = entryJsx; // loadable-extension needs this line.
// export default entry;
var entry = _entry;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : String(i);
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/**
 * Block argument types
 * @enum {string}
 */
var ArgumentType$1 = {
  /**
   * Numeric value with angle picker
   */
  ANGLE: 'angle',
  /**
   * Boolean value with hexagonal placeholder
   */
  BOOLEAN: 'Boolean',
  /**
   * Numeric value with color picker
   */
  COLOR: 'color',
  /**
   * Numeric value with text field
   */
  NUMBER: 'number',
  /**
   * String value with text field
   */
  STRING: 'string',
  /**
   * String value with matrix field
   */
  MATRIX: 'matrix',
  /**
   * MIDI note number with note picker (piano) field
   */
  NOTE: 'note',
  /**
   * Inline image on block (as part of the label)
   */
  IMAGE: 'image'
};
var argumentType = ArgumentType$1;

/**
 * Types of block
 * @enum {string}
 */
var BlockType$1 = {
  /**
   * Boolean reporter with hexagonal shape
   */
  BOOLEAN: 'Boolean',
  /**
   * A button (not an actual block) for some special action, like making a variable
   */
  BUTTON: 'button',
  /**
   * Command block
   */
  COMMAND: 'command',
  /**
   * Specialized command block which may or may not run a child branch
   * The thread continues with the next block whether or not a child branch ran.
   */
  CONDITIONAL: 'conditional',
  /**
   * Specialized hat block with no implementation function
   * This stack only runs if the corresponding event is emitted by other code.
   */
  EVENT: 'event',
  /**
   * Hat block which conditionally starts a block stack
   */
  HAT: 'hat',
  /**
   * Specialized command block which may or may not run a child branch
   * If a child branch runs, the thread evaluates the loop block again.
   */
  LOOP: 'loop',
  /**
   * General reporter with numeric or string value
   */
  REPORTER: 'reporter'
};
var blockType = BlockType$1;

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

var getUserMediaPromise = {exports: {}};

(function (module) {
  // loosely based on example code at https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  (function (root) {

    /**
     * Error thrown when any required feature is missing (Promises, navigator, getUserMedia)
     * @constructor
     */
    function NotSupportedError() {
      this.name = 'NotSupportedError';
      this.message = 'getUserMedia is not implemented in this browser';
    }
    NotSupportedError.prototype = Error.prototype;

    /**
     * Fake Promise instance that behaves like a Promise except that it always rejects with a NotSupportedError.
     * Used for situations where there is no global Promise constructor.
     *
     * The message will report that the getUserMedia API is not available.
     * This is technically true because every browser that supports getUserMedia also supports promises.
     **
     * @see http://caniuse.com/#feat=stream
     * @see http://caniuse.com/#feat=promises
     * @constructor
     */
    function FakePromise() {
      // make it chainable like a real promise
      this.then = function () {
        return this;
      };

      // but always reject with an error
      var err = new NotSupportedError();
      this.catch = function (cb) {
        setTimeout(function () {
          cb(err);
        });
      };
    }
    var isPromiseSupported = typeof Promise !== 'undefined';

    // checks for root.navigator to enable server-side rendering of things that depend on this
    // (will need to be updated on client, but at least doesn't throw this way)
    var navigatorExists = typeof navigator !== "undefined";
    // gump = mondern promise-based interface
    // gum = old callback-based interface
    var gump = navigatorExists && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    var gum = navigatorExists && (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    /**
     * Wrapper for navigator.mediaDevices.getUserMedia.
     * Always returns a Promise or Promise-like object, even in environments without a global Promise constructor
     *
     * @stream https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
     *
     * @param {Object} constraints - must include one or both of audio/video along with optional details for video
     * @param {Boolean} [constraints.audio] - include audio data in the stream
     * @param {Boolean|Object} [constraints.video] - include video data in the stream. May be a boolean or an object with additional constraints, see
     * @returns {Promise<MediaStream>} a promise that resolves to a MediaStream object
       */
    function getUserMedia(constraints) {
      // ensure that Promises are supported and we have a navigator object
      if (!isPromiseSupported) {
        return new FakePromise();
      }

      // Try the more modern, promise-based MediaDevices API first
      //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      if (gump) {
        return navigator.mediaDevices.getUserMedia(constraints);
      }

      // fall back to the older method second, wrap it in a promise.
      return new Promise(function (resolve, reject) {
        // if navigator doesn't exist, then we can't use the getUserMedia API. (And probably aren't even in a browser.)
        // assuming it does, try getUserMedia and then all of the prefixed versions

        if (!gum) {
          return reject(new NotSupportedError());
        }
        gum.call(navigator, constraints, resolve, reject);
      });
    }
    getUserMedia.NotSupportedError = NotSupportedError;

    // eslint-disable-next-line no-implicit-coercion
    getUserMedia.isSupported = !!(isPromiseSupported && (gump || gum));

    // UMD, loosely based on https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js
    if (module.exports) {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like enviroments that support module.exports,
      // like Node.
      module.exports = getUserMedia;
    } else {
      // Browser globals
      // polyfill the MediaDevices API if it does not exist.
      root.navigator || (root.navigator = {});
      root.navigator.mediaDevices || (root.navigator.mediaDevices = {});
      root.navigator.mediaDevices.getUserMedia || (root.navigator.mediaDevices.getUserMedia = getUserMedia);
    }
  })(commonjsGlobal);
})(getUserMediaPromise);
var getUserMedia = getUserMediaPromise.exports;

// Single Setup For All Video Streams used by the GUI
// While VideoProvider uses a private _singleSetup
// property to ensure that each instance of a VideoProvider
// use the same setup, this ensures that all instances
// of VideoProviders use a single stream. This way, closing a camera modal
// does not affect the video on the stage, and a program running and disabling
// video on the stage will not affect the camera modal's video.
var requestStack = [];
var requestVideoStream = function requestVideoStream(videoDesc) {
  var streamPromise;
  if (requestStack.length === 0) {
    streamPromise = getUserMedia({
      audio: false,
      video: videoDesc
    });
    requestStack.push(streamPromise);
  } else if (requestStack.length > 0) {
    streamPromise = requestStack[0];
    requestStack.push(true);
  }
  return streamPromise;
};
var requestDisableVideo = function requestDisableVideo() {
  requestStack.pop();
  if (requestStack.length > 0) return false;
  return true;
};

var web = {exports: {}};

var minilog$2 = {exports: {}};

function M() {
  this._events = {};
}
M.prototype = {
  on: function on(ev, cb) {
    this._events || (this._events = {});
    var e = this._events;
    (e[ev] || (e[ev] = [])).push(cb);
    return this;
  },
  removeListener: function removeListener(ev, cb) {
    var e = this._events[ev] || [],
      i;
    for (i = e.length - 1; i >= 0 && e[i]; i--) {
      if (e[i] === cb || e[i].cb === cb) {
        e.splice(i, 1);
      }
    }
  },
  removeAllListeners: function removeAllListeners(ev) {
    if (!ev) {
      this._events = {};
    } else {
      this._events[ev] && (this._events[ev] = []);
    }
  },
  listeners: function listeners(ev) {
    return this._events ? this._events[ev] || [] : [];
  },
  emit: function emit(ev) {
    this._events || (this._events = {});
    var args = Array.prototype.slice.call(arguments, 1),
      i,
      e = this._events[ev] || [];
    for (i = e.length - 1; i >= 0 && e[i]; i--) {
      e[i].apply(this, args);
    }
    return this;
  },
  when: function when(ev, cb) {
    return this.once(ev, cb, true);
  },
  once: function once(ev, cb, when) {
    if (!cb) return this;
    function c() {
      if (!when) this.removeListener(ev, c);
      if (cb.apply(this, arguments) && when) this.removeListener(ev, c);
    }
    c.cb = cb;
    this.on(ev, c);
    return this;
  }
};
M.mixin = function (dest) {
  var o = M.prototype,
    k;
  for (k in o) {
    o.hasOwnProperty(k) && (dest.prototype[k] = o[k]);
  }
};
var microee$1 = M;

var microee = microee$1;

// Implements a subset of Node's stream.Transform - in a cross-platform manner.
function Transform$7() {}
microee.mixin(Transform$7);

// The write() signature is different from Node's
// --> makes it much easier to work with objects in logs.
// One of the lessons from v1 was that it's better to target
// a good browser rather than the lowest common denominator
// internally.
// If you want to use external streams, pipe() to ./stringify.js first.
Transform$7.prototype.write = function (name, level, args) {
  this.emit('item', name, level, args);
};
Transform$7.prototype.end = function () {
  this.emit('end');
  this.removeAllListeners();
};
Transform$7.prototype.pipe = function (dest) {
  var s = this;
  // prevent double piping
  s.emit('unpipe', dest);
  // tell the dest that it's being piped to
  dest.emit('pipe', s);
  function onItem() {
    dest.write.apply(dest, Array.prototype.slice.call(arguments));
  }
  function onEnd() {
    !dest._isStdio && dest.end();
  }
  s.on('item', onItem);
  s.on('end', onEnd);
  s.when('unpipe', function (from) {
    var match = from === dest || typeof from == 'undefined';
    if (match) {
      s.removeListener('item', onItem);
      s.removeListener('end', onEnd);
      dest.emit('unpipe');
    }
    return match;
  });
  return dest;
};
Transform$7.prototype.unpipe = function (from) {
  this.emit('unpipe', from);
  return this;
};
Transform$7.prototype.format = function (dest) {
  throw new Error(['Warning: .format() is deprecated in Minilog v2! Use .pipe() instead. For example:', 'var Minilog = require(\'minilog\');', 'Minilog', '  .pipe(Minilog.backends.console.formatClean)', '  .pipe(Minilog.backends.console);'].join('\n'));
};
Transform$7.mixin = function (dest) {
  var o = Transform$7.prototype,
    k;
  for (k in o) {
    o.hasOwnProperty(k) && (dest.prototype[k] = o[k]);
  }
};
var transform = Transform$7;

// default filter
var Transform$6 = transform;
var levelMap = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};
function Filter() {
  this.enabled = true;
  this.defaultResult = true;
  this.clear();
}
Transform$6.mixin(Filter);

// allow all matching, with level >= given level
Filter.prototype.allow = function (name, level) {
  this._white.push({
    n: name,
    l: levelMap[level]
  });
  return this;
};

// deny all matching, with level <= given level
Filter.prototype.deny = function (name, level) {
  this._black.push({
    n: name,
    l: levelMap[level]
  });
  return this;
};
Filter.prototype.clear = function () {
  this._white = [];
  this._black = [];
  return this;
};
function test(rule, name) {
  // use .test for RegExps
  return rule.n.test ? rule.n.test(name) : rule.n == name;
}
Filter.prototype.test = function (name, level) {
  var i,
    len = Math.max(this._white.length, this._black.length);
  for (i = 0; i < len; i++) {
    if (this._white[i] && test(this._white[i], name) && levelMap[level] >= this._white[i].l) {
      return true;
    }
    if (this._black[i] && test(this._black[i], name) && levelMap[level] <= this._black[i].l) {
      return false;
    }
  }
  return this.defaultResult;
};
Filter.prototype.write = function (name, level, args) {
  if (!this.enabled || this.test(name, level)) {
    return this.emit('item', name, level, args);
  }
};
var filter = Filter;

(function (module, exports) {
  var Transform = transform,
    Filter = filter;
  var log = new Transform(),
    slice = Array.prototype.slice;
  exports = module.exports = function create(name) {
    var o = function o() {
      log.write(name, undefined, slice.call(arguments));
      return o;
    };
    o.debug = function () {
      log.write(name, 'debug', slice.call(arguments));
      return o;
    };
    o.info = function () {
      log.write(name, 'info', slice.call(arguments));
      return o;
    };
    o.warn = function () {
      log.write(name, 'warn', slice.call(arguments));
      return o;
    };
    o.error = function () {
      log.write(name, 'error', slice.call(arguments));
      return o;
    };
    o.log = o.debug; // for interface compliance with Node and browser consoles
    o.suggest = exports.suggest;
    o.format = log.format;
    return o;
  };

  // filled in separately
  exports.defaultBackend = exports.defaultFormatter = null;
  exports.pipe = function (dest) {
    return log.pipe(dest);
  };
  exports.end = exports.unpipe = exports.disable = function (from) {
    return log.unpipe(from);
  };
  exports.Transform = Transform;
  exports.Filter = Filter;
  // this is the default filter that's applied when .enable() is called normally
  // you can bypass it completely and set up your own pipes
  exports.suggest = new Filter();
  exports.enable = function () {
    if (exports.defaultFormatter) {
      return log.pipe(exports.suggest) // filter
      .pipe(exports.defaultFormatter) // formatter
      .pipe(exports.defaultBackend); // backend
    }
    return log.pipe(exports.suggest) // filter
    .pipe(exports.defaultBackend); // formatter
  };
})(minilog$2, minilog$2.exports);

var hex = {
  black: '#000',
  red: '#c23621',
  green: '#25bc26',
  yellow: '#bbbb00',
  blue: '#492ee1',
  magenta: '#d338d3',
  cyan: '#33bbc8',
  gray: '#808080',
  purple: '#708'
};
function color$2(fg, isInverse) {
  if (isInverse) {
    return 'color: #fff; background: ' + hex[fg] + ';';
  } else {
    return 'color: ' + hex[fg] + ';';
  }
}
var util = color$2;

var Transform$5 = transform,
  color$1 = util;
var colors$1 = {
    debug: ['cyan'],
    info: ['purple'],
    warn: ['yellow', true],
    error: ['red', true]
  },
  logger$4 = new Transform$5();
logger$4.write = function (name, level, args) {
  var fn = console.log;
  if (console[level] && console[level].apply) {
    fn = console[level];
    fn.apply(console, ['%c' + name + ' %c' + level, color$1('gray'), color$1.apply(color$1, colors$1[level])].concat(args));
  }
};

// NOP, because piping the formatted logs can only cause trouble.
logger$4.pipe = function () {};
var color_1 = logger$4;

var Transform$4 = transform,
  color = util,
  colors = {
    debug: ['gray'],
    info: ['purple'],
    warn: ['yellow', true],
    error: ['red', true]
  },
  logger$3 = new Transform$4();
logger$3.write = function (name, level, args) {
  var fn = console.log;
  if (level != 'debug' && console[level]) {
    fn = console[level];
  }
  var i = 0;
  if (level != 'info') {
    for (; i < args.length; i++) {
      if (typeof args[i] != 'string') break;
    }
    fn.apply(console, ['%c' + name + ' ' + args.slice(0, i).join(' '), color.apply(color, colors[level])].concat(args.slice(i)));
  } else {
    fn.apply(console, ['%c' + name, color.apply(color, colors[level])].concat(args));
  }
};

// NOP, because piping the formatted logs can only cause trouble.
logger$3.pipe = function () {};
var minilog$1 = logger$3;

var Transform$3 = transform;
var newlines = /\n+$/,
  logger$2 = new Transform$3();
logger$2.write = function (name, level, args) {
  var i = args.length - 1;
  if (typeof console === 'undefined' || !console.log) {
    return;
  }
  if (console.log.apply) {
    return console.log.apply(console, [name, level].concat(args));
  } else if (JSON && JSON.stringify) {
    // console.log.apply is undefined in IE8 and IE9
    // for IE8/9: make console.log at least a bit less awful
    if (args[i] && typeof args[i] == 'string') {
      args[i] = args[i].replace(newlines, '');
    }
    try {
      for (i = 0; i < args.length; i++) {
        args[i] = JSON.stringify(args[i]);
      }
    } catch (e) {}
    console.log(args.join(' '));
  }
};
logger$2.formatters = ['color', 'minilog'];
logger$2.color = color_1;
logger$2.minilog = minilog$1;
var console_1 = logger$2;

var Transform$2 = transform,
  cache$1 = [];
var logger$1 = new Transform$2();
logger$1.write = function (name, level, args) {
  cache$1.push([name, level, args]);
};

// utility functions
logger$1.get = function () {
  return cache$1;
};
logger$1.empty = function () {
  cache$1 = [];
};
var array = logger$1;

var Transform$1 = transform,
  cache = false;
var logger = new Transform$1();
logger.write = function (name, level, args) {
  if (typeof window == 'undefined' || typeof JSON == 'undefined' || !JSON.stringify || !JSON.parse) return;
  try {
    if (!cache) {
      cache = window.localStorage.minilog ? JSON.parse(window.localStorage.minilog) : [];
    }
    cache.push([new Date().toString(), name, level, args]);
    window.localStorage.minilog = JSON.stringify(cache);
  } catch (e) {}
};
var localstorage = logger;

var Transform = transform;
var cid = new Date().valueOf().toString(36);
function AjaxLogger(options) {
  this.url = options.url || '';
  this.cache = [];
  this.timer = null;
  this.interval = options.interval || 30 * 1000;
  this.enabled = true;
  this.jQuery = window.jQuery;
  this.extras = {};
}
Transform.mixin(AjaxLogger);
AjaxLogger.prototype.write = function (name, level, args) {
  if (!this.timer) {
    this.init();
  }
  this.cache.push([name, level].concat(args));
};
AjaxLogger.prototype.init = function () {
  if (!this.enabled || !this.jQuery) return;
  var self = this;
  this.timer = setTimeout(function () {
    var i,
      logs = [],
      ajaxData,
      url = self.url;
    if (self.cache.length == 0) return self.init();
    // Test each log line and only log the ones that are valid (e.g. don't have circular references).
    // Slight performance hit but benefit is we log all valid lines.
    for (i = 0; i < self.cache.length; i++) {
      try {
        JSON.stringify(self.cache[i]);
        logs.push(self.cache[i]);
      } catch (e) {}
    }
    if (self.jQuery.isEmptyObject(self.extras)) {
      ajaxData = JSON.stringify({
        logs: logs
      });
      url = self.url + '?client_id=' + cid;
    } else {
      ajaxData = JSON.stringify(self.jQuery.extend({
        logs: logs
      }, self.extras));
    }
    self.jQuery.ajax(url, {
      type: 'POST',
      cache: false,
      processData: false,
      data: ajaxData,
      contentType: 'application/json',
      timeout: 10000
    }).success(function (data, status, jqxhr) {
      if (data.interval) {
        self.interval = Math.max(1000, data.interval);
      }
    }).error(function () {
      self.interval = 30000;
    }).always(function () {
      self.init();
    });
    self.cache = [];
  }, this.interval);
};
AjaxLogger.prototype.end = function () {};

// wait until jQuery is defined. Useful if you don't control the load order.
AjaxLogger.jQueryWait = function (onDone) {
  if (typeof window !== 'undefined' && (window.jQuery || window.$)) {
    return onDone(window.jQuery || window.$);
  } else if (typeof window !== 'undefined') {
    setTimeout(function () {
      AjaxLogger.jQueryWait(onDone);
    }, 200);
  }
};
var jquery_simple = AjaxLogger;

(function (module, exports) {
  var Minilog = minilog$2.exports;
  var oldEnable = Minilog.enable,
    oldDisable = Minilog.disable,
    isChrome = typeof navigator != 'undefined' && /chrome/i.test(navigator.userAgent),
    console = console_1;

  // Use a more capable logging backend if on Chrome
  Minilog.defaultBackend = isChrome ? console.minilog : console;

  // apply enable inputs from localStorage and from the URL
  if (typeof window != 'undefined') {
    try {
      Minilog.enable(JSON.parse(window.localStorage['minilogSettings']));
    } catch (e) {}
    if (window.location && window.location.search) {
      var match = RegExp('[?&]minilog=([^&]*)').exec(window.location.search);
      match && Minilog.enable(decodeURIComponent(match[1]));
    }
  }

  // Make enable also add to localStorage
  Minilog.enable = function () {
    oldEnable.call(Minilog, true);
    try {
      window.localStorage['minilogSettings'] = JSON.stringify(true);
    } catch (e) {}
    return this;
  };
  Minilog.disable = function () {
    oldDisable.call(Minilog);
    try {
      delete window.localStorage.minilogSettings;
    } catch (e) {}
    return this;
  };
  exports = module.exports = Minilog;
  exports.backends = {
    array: array,
    browser: Minilog.defaultBackend,
    localStorage: localstorage,
    jQuery: jquery_simple
  };
})(web, web.exports);
var minilog = web.exports;

minilog.enable();
var log = minilog('gui');

/**
 * Video Manager for video extensions.
 */
var VideoProvider = /*#__PURE__*/function () {
  function VideoProvider() {
    var _this = this;
    _classCallCheck(this, VideoProvider);
    /**
     * Default value for mirrored frames.
     * @type boolean
     */
    this.mirror = true;

    /**
     * Cache frames for this many ms.
     * @type number
     */
    this._frameCacheTimeout = 16;

    /**
     * DOM Video element
     * @private
     */
    this._video = null;

    /**
     * Usermedia stream track
     * @private
     */
    this._track = null;

    /**
     * Stores some canvas/frame data per resolution/mirror states
     */
    this._workspace = [];

    /**
     * The video descriptor used in getUserMedia
     * @type {MediaStreamConstraints['video']}
     */
    this._videoDescriptor = {};

    /**
     * A list of available video devices.
     * This array remains empty until camera permission is granted.
     * @type {Array<MediaDeviceInfo>}
     */
    this._videoDevices = [];
    navigator.mediaDevices.addEventListener("devicechange", function () {
      return _this._updateVideoDevices();
    });
    this._updateVideoDevices();
  }
  _createClass(VideoProvider, [{
    key: "video",
    get:
    /**
     * Get the HTML video element containing the stream
     */
    function get() {
      return this._video;
    }

    /**
     * Get the list of available video devices.
     * This array remains empty until camera permission is granted.
     * @type {Array<MediaDeviceInfo>}
     */
  }, {
    key: "videoDevices",
    get: function get() {
      return this._videoDevices;
    }

    /**
     * Request video be enabled.  Sets up video, creates video skin and enables preview.
     *
     * @return {Promise.<Video>} resolves a promise to this video provider when video is ready.
     */
  }, {
    key: "enableVideo",
    value: function enableVideo() {
      this.enabled = true;
      return this._setupVideo();
    }

    /**
     * Disable video stream (turn video off)
     *
     * @return {Promise.<Video>} resolves a promise to this video provider when video is disabled.
     */
  }, {
    key: "disableVideo",
    value: function disableVideo() {
      var _this2 = this;
      this.enabled = false;
      // If we have begun a setup process, call _teardown after it completes
      if (this._singleSetup) {
        return this._singleSetup.then(this._teardown.bind(this)).catch(function (err) {
          return _this2.onError(err);
        });
      }
      return Promise.resolve();
    }

    /**
     * async part of disableVideo
     * @private
     */
  }, {
    key: "_teardown",
    value: function _teardown() {
      // we might be asked to re-enable before _teardown is called, just ignore it.
      if (this.enabled === false) {
        var disableTrack = requestDisableVideo();
        this._singleSetup = null;
        // by clearing refs to video and track, we should lose our hold over the camera
        this._video = null;
        if (this._track && disableTrack) {
          this._track.stop();
        }
        this._track = null;
      }
    }

    /**
     * Return frame data from the video feed in a specified dimensions, format, and mirroring.
     *
     * @param {object} frameInfo A descriptor of the frame you would like to receive.
     * @param {Array.<number>} frameInfo.dimensions [width, height] array of numbers.  Defaults to [480,360]
     * @param {boolean} frameInfo.mirror If you specificly want a mirror/non-mirror frame, defaults to true
     * @param {string} frameInfo.format Requested video format, available formats are 'image-data' and 'canvas'.
     * @param {number} frameInfo.cacheTimeout Will reuse previous image data if the time since capture is less than
     *                                        the cacheTimeout.  Defaults to 16ms.
     *
     * @return {ArrayBuffer|Canvas|string|null} Frame data in requested format, null when errors.
     */
  }, {
    key: "getFrame",
    value: function getFrame(_ref) {
      var _ref$dimensions = _ref.dimensions,
        dimensions = _ref$dimensions === void 0 ? VideoProvider.DIMENSIONS : _ref$dimensions,
        _ref$mirror = _ref.mirror,
        mirror = _ref$mirror === void 0 ? this.mirror : _ref$mirror,
        _ref$format = _ref.format,
        format = _ref$format === void 0 ? VideoProvider.FORMAT_IMAGE_DATA : _ref$format,
        _ref$cacheTimeout = _ref.cacheTimeout,
        cacheTimeout = _ref$cacheTimeout === void 0 ? this._frameCacheTimeout : _ref$cacheTimeout;
      if (!this.videoReady) {
        return null;
      }
      var _dimensions = _slicedToArray(dimensions, 2),
        width = _dimensions[0],
        height = _dimensions[1];
      var workspace = this._getWorkspace({
        dimensions: dimensions,
        mirror: Boolean(mirror)
      });
      var _this$_video = this._video,
        videoWidth = _this$_video.videoWidth,
        videoHeight = _this$_video.videoHeight;
      var canvas = workspace.canvas,
        context = workspace.context,
        lastUpdate = workspace.lastUpdate,
        cacheData = workspace.cacheData;
      var now = Date.now();

      // if the canvas hasn't been updated...
      if (lastUpdate + cacheTimeout < now) {
        if (mirror) {
          context.scale(-1, 1);
          context.translate(width * -1, 0);
        }
        context.drawImage(this._video,
        // source x, y, width, height
        0, 0, videoWidth, videoHeight,
        // dest x, y, width, height
        0, 0, width, height);

        // context.resetTransform() doesn't work on Edge but the following should
        context.setTransform(1, 0, 0, 1, 0, 0);
        workspace.lastUpdate = now;
      }

      // each data type has it's own data cache, but the canvas is the same
      if (!cacheData[format]) {
        cacheData[format] = {
          lastUpdate: 0
        };
      }
      var formatCache = cacheData[format];
      if (formatCache.lastUpdate + cacheTimeout < now) {
        if (format === VideoProvider.FORMAT_IMAGE_DATA) {
          formatCache.lastData = context.getImageData(0, 0, width, height);
        } else if (format === VideoProvider.FORMAT_CANVAS) {
          // this will never change
          formatCache.lastUpdate = Infinity;
          formatCache.lastData = canvas;
        } else {
          log.error("video io error - unimplemented format ".concat(format));
          // cache the null result forever, don't log about it again..
          formatCache.lastUpdate = Infinity;
          formatCache.lastData = null;
        }

        // rather than set to now, this data is as stale as it's canvas is
        formatCache.lastUpdate = Math.max(workspace.lastUpdate, formatCache.lastUpdate);
      }
      return formatCache.lastData;
    }

    /**
     * Method called when an error happens.  Default implementation is just to log error.
     *
     * @abstract
     * @param {Error} error An error object from getUserMedia or other source of error.
     */
  }, {
    key: "onError",
    value: function onError(error) {
      log.error('Unhandled video io device error', error);
    }

    /**
     * Create a video stream.
     * @private
     * @return {Promise} When video has been received, rejected if video is not received
     */
  }, {
    key: "_setupVideo",
    value: function _setupVideo() {
      var _this3 = this;
      // We cache the result of this setup so that we can only ever have a single
      // video/getUserMedia request happen at a time.
      if (this._singleSetup) {
        return this._singleSetup;
      }
      this._singleSetup = requestVideoStream(Object.assign({
        width: {
          min: 480,
          ideal: 640
        },
        height: {
          min: 360,
          ideal: 480
        }
      }, this._videoDescriptor)).then(function (stream) {
        _this3._video = document.createElement('video');

        // Use the new srcObject API, falling back to createObjectURL
        try {
          _this3._video.srcObject = stream;
        } catch (error) {
          _this3._video.src = window.URL.createObjectURL(stream);
        }
        // Hint to the stream that it should load. A standard way to do this
        // is add the video tag to the DOM. Since this extension wants to
        // hide the video tag and instead render a sample of the stream into
        // the webgl rendered Scratch canvas, another hint like this one is
        // needed.
        _this3._video.play(); // Needed for Safari/Firefox, Chrome auto-plays.
        _this3._track = stream.getTracks()[0];
        return _this3;
      }).catch(function (error) {
        _this3._singleSetup = null;
        _this3.onError(error);
      });
      return this._singleSetup;
    }
  }, {
    key: "videoReady",
    get: function get() {
      if (!this.enabled) {
        return false;
      }
      if (!this._video) {
        return false;
      }
      if (!this._track) {
        return false;
      }
      var _this$_video2 = this._video,
        videoWidth = _this$_video2.videoWidth,
        videoHeight = _this$_video2.videoHeight;
      if (typeof videoWidth !== 'number' || typeof videoHeight !== 'number') {
        return false;
      }
      if (videoWidth === 0 || videoHeight === 0) {
        return false;
      }
      return true;
    }

    /**
     * get an internal workspace for canvas/context/caches
     * this uses some document stuff to create a canvas and what not, probably needs abstraction
     * into the renderer layer?
     * @private
     * @return {object} A workspace for canvas/data storage.  Internal format not documented intentionally
     */
  }, {
    key: "_getWorkspace",
    value: function _getWorkspace(_ref2) {
      var dimensions = _ref2.dimensions,
        mirror = _ref2.mirror;
      var workspace = this._workspace.find(function (space) {
        return space.dimensions.join('-') === dimensions.join('-') && space.mirror === mirror;
      });
      if (!workspace) {
        workspace = {
          dimensions: dimensions,
          mirror: mirror,
          canvas: document.createElement('canvas'),
          lastUpdate: 0,
          cacheData: {}
        };
        workspace.canvas.width = dimensions[0];
        workspace.canvas.height = dimensions[1];
        workspace.context = workspace.canvas.getContext('2d');
        this._workspace.push(workspace);
      }
      return workspace;
    }

    /**
     * Set a new video descriptor and update the media stream if video is enabled.
     *
     * @param {MediaStreamConstraints['video']} videoDescriptor The new video descriptor to be set.
     * @returns {Promise<void>} A promise that resolves when the video source has been successfully updated,
     *                           or rejects with an error if the update fails.
     */
  }, {
    key: "setVideoDescriptor",
    value: function setVideoDescriptor(videoDescriptor) {
      var _this4 = this;
      if (JSON.stringify(videoDescriptor) === JSON.stringify(this._videoDescriptor)) {
        return Promise.resolve();
      }
      this._videoDescriptor = videoDescriptor;
      var currentVideoReady = this.videoReady;
      return this.disableVideo().then(function () {
        _this4._singleSetup = null;
        if (currentVideoReady) {
          return _this4.enableVideo();
        }
      });
    }

    /**
     * Updates the list of available video devices.
     * @private
     */
  }, {
    key: "_updateVideoDevices",
    value: function _updateVideoDevices() {
      var _this5 = this;
      console.log("_updateVideoDevices");
      navigator.mediaDevices.enumerateDevices().catch(function () {
        return [];
      }).then(function (devices) {
        _this5._videoDevices = devices.filter(function (d) {
          return d.deviceId && d.kind === 'videoinput';
        }).sort(function (a, b) {
          return b.label < a.label;
        });
      });
    }
  }], [{
    key: "FORMAT_IMAGE_DATA",
    get: function get() {
      return 'image-data';
    }
  }, {
    key: "FORMAT_CANVAS",
    get: function get() {
      return 'canvas';
    }

    /**
     * Dimensions the video stream is analyzed at after its rendered to the
     * sample canvas.
     * @type {Array.<number>}
     */
  }, {
    key: "DIMENSIONS",
    get: function get() {
      return [480, 360];
    }

    /**
     * Order preview drawable is inserted at in the renderer.
     * @type {number}
     */
  }, {
    key: "ORDER",
    get: function get() {
      return 1;
    }
  }]);
  return VideoProvider;
}();
/**
 * Replaces the current video provider in the runtime with a SelectableVideoProvider.
 * Preserves the video state and settings during the switch.
 *
 * @param {Object} runtime The runtime to inject the video provider into.
 * @returns {SelectableVideoProvider} The new or existing video provider.
 */
var setupSelectableVideoProvider$1 = function setupSelectableVideoProvider(runtime) {
  if (isSelectableVideoProvider$1(runtime.ioDevices.video.provider)) {
    return runtime.ioDevices.video.provider;
  }
  var newProvider = new SelectableVideoProvider();
  var oldProvider = runtime.ioDevices.video.provider;
  var oldVideoReady = oldProvider != null && oldProvider.videoReady;
  if (oldProvider != null) {
    newProvider.mirror = oldProvider.mirror;
    if (oldProvider.videoReady) {
      oldProvider.disableVideo();
    }
  }
  // New VideoProvider from here
  runtime.ioDevices.video.setProvider(newProvider);
  if (oldVideoReady) {
    runtime.ioDevices.video.enableVideo();
  }
  return newProvider;
};

/**
 * Checks if the provided videoProvider meets the criteria of a SelectableVideoProvider.
 * @param {Object} videoProvider - The video provider object to check.
 * @returns {boolean} - Returns true if videoProvider meets the criteria of a SelectableVideoProvider, false otherwise.
 */
var isSelectableVideoProvider$1 = function isSelectableVideoProvider(videoProvider) {
  return videoProvider && typeof videoProvider.videoDevices !== "undefined" && typeof videoProvider.setVideoDescriptor !== "undefined";
};
var SelectableVideoProvider = VideoProvider;

var selectableVideoProvider = /*#__PURE__*/Object.freeze({
            __proto__: null,
            setupSelectableVideoProvider: setupSelectableVideoProvider$1,
            isSelectableVideoProvider: isSelectableVideoProvider$1,
            SelectableVideoProvider: SelectableVideoProvider,
            'default': VideoProvider
});

var require$$2 = /*@__PURE__*/getAugmentedNamespace(selectableVideoProvider);

var formatMessage = {exports: {}};

var formatMessageParse = {exports: {}};

(function (module, exports) {

  /*::
  export type AST = Element[]
  export type Element = string | Placeholder
  export type Placeholder = Plural | Styled | Typed | Simple
  export type Plural = [ string, 'plural' | 'selectordinal', number, SubMessages ]
  export type Styled = [ string, string, string | SubMessages ]
  export type Typed = [ string, string ]
  export type Simple = [ string ]
  export type SubMessages = { [string]: AST }
  export type Token = [ TokenType, string ]
  export type TokenType = 'text' | 'space' | 'id' | 'type' | 'style' | 'offset' | 'number' | 'selector' | 'syntax'
  type Context = {|
    pattern: string,
    index: number,
    tagsType: ?string,
    tokens: ?Token[]
  |}
  */
  var ARG_OPN = '{';
  var ARG_CLS = '}';
  var ARG_SEP = ',';
  var NUM_ARG = '#';
  var TAG_OPN = '<';
  var TAG_CLS = '>';
  var TAG_END = '</';
  var TAG_SELF_CLS = '/>';
  var ESC = '\'';
  var OFFSET = 'offset:';
  var simpleTypes = ['number', 'date', 'time', 'ordinal', 'duration', 'spellout'];
  var submTypes = ['plural', 'select', 'selectordinal'];

  /**
   * parse
   *
   * Turns this:
   *  `You have { numBananas, plural,
   *       =0 {no bananas}
   *      one {a banana}
   *    other {# bananas}
   *  } for sale`
   *
   * into this:
   *  [ "You have ", [ "numBananas", "plural", 0, {
   *       "=0": [ "no bananas" ],
   *      "one": [ "a banana" ],
   *    "other": [ [ '#' ], " bananas" ]
   *  } ], " for sale." ]
   *
   * tokens:
   *  [
   *    [ "text", "You have " ],
   *    [ "syntax", "{" ],
   *    [ "space", " " ],
   *    [ "id", "numBananas" ],
   *    [ "syntax", ", " ],
   *    [ "space", " " ],
   *    [ "type", "plural" ],
   *    [ "syntax", "," ],
   *    [ "space", "\n     " ],
   *    [ "selector", "=0" ],
   *    [ "space", " " ],
   *    [ "syntax", "{" ],
   *    [ "text", "no bananas" ],
   *    [ "syntax", "}" ],
   *    [ "space", "\n    " ],
   *    [ "selector", "one" ],
   *    [ "space", " " ],
   *    [ "syntax", "{" ],
   *    [ "text", "a banana" ],
   *    [ "syntax", "}" ],
   *    [ "space", "\n  " ],
   *    [ "selector", "other" ],
   *    [ "space", " " ],
   *    [ "syntax", "{" ],
   *    [ "syntax", "#" ],
   *    [ "text", " bananas" ],
   *    [ "syntax", "}" ],
   *    [ "space", "\n" ],
   *    [ "syntax", "}" ],
   *    [ "text", " for sale." ]
   *  ]
   **/
  exports = module.exports = function parse(pattern /*: string */, options /*:: ?: { tagsType?: string, tokens?: Token[] } */) /*: AST */{
    return parseAST({
      pattern: String(pattern),
      index: 0,
      tagsType: options && options.tagsType || null,
      tokens: options && options.tokens || null
    }, '');
  };
  function parseAST(current /*: Context */, parentType /*: string */) /*: AST */{
    var pattern = current.pattern;
    var length = pattern.length;
    var elements /*: AST */ = [];
    var start = current.index;
    var text = parseText(current, parentType);
    if (text) elements.push(text);
    if (text && current.tokens) current.tokens.push(['text', pattern.slice(start, current.index)]);
    while (current.index < length) {
      if (pattern[current.index] === ARG_CLS) {
        if (!parentType) throw expected(current);
        break;
      }
      if (parentType && current.tagsType && pattern.slice(current.index, current.index + TAG_END.length) === TAG_END) break;
      elements.push(parsePlaceholder(current));
      start = current.index;
      text = parseText(current, parentType);
      if (text) elements.push(text);
      if (text && current.tokens) current.tokens.push(['text', pattern.slice(start, current.index)]);
    }
    return elements;
  }
  function parseText(current /*: Context */, parentType /*: string */) /*: string */{
    var pattern = current.pattern;
    var length = pattern.length;
    var isHashSpecial = parentType === 'plural' || parentType === 'selectordinal';
    var isAngleSpecial = !!current.tagsType;
    var isArgStyle = parentType === '{style}';
    var text = '';
    while (current.index < length) {
      var char = pattern[current.index];
      if (char === ARG_OPN || char === ARG_CLS || isHashSpecial && char === NUM_ARG || isAngleSpecial && char === TAG_OPN || isArgStyle && isWhitespace(char.charCodeAt(0))) {
        break;
      } else if (char === ESC) {
        char = pattern[++current.index];
        if (char === ESC) {
          // double is always 1 '
          text += char;
          ++current.index;
        } else if (
        // only when necessary
        char === ARG_OPN || char === ARG_CLS || isHashSpecial && char === NUM_ARG || isAngleSpecial && char === TAG_OPN || isArgStyle) {
          text += char;
          while (++current.index < length) {
            char = pattern[current.index];
            if (char === ESC && pattern[current.index + 1] === ESC) {
              // double is always 1 '
              text += ESC;
              ++current.index;
            } else if (char === ESC) {
              // end of quoted
              ++current.index;
              break;
            } else {
              text += char;
            }
          }
        } else {
          // lone ' is just a '
          text += ESC;
          // already incremented
        }
      } else {
        text += char;
        ++current.index;
      }
    }
    return text;
  }
  function isWhitespace(code /*: number */) /*: boolean */{
    return code >= 0x09 && code <= 0x0D || code === 0x20 || code === 0x85 || code === 0xA0 || code === 0x180E || code >= 0x2000 && code <= 0x200D || code === 0x2028 || code === 0x2029 || code === 0x202F || code === 0x205F || code === 0x2060 || code === 0x3000 || code === 0xFEFF;
  }
  function skipWhitespace(current /*: Context */) /*: void */{
    var pattern = current.pattern;
    var length = pattern.length;
    var start = current.index;
    while (current.index < length && isWhitespace(pattern.charCodeAt(current.index))) {
      ++current.index;
    }
    if (start < current.index && current.tokens) {
      current.tokens.push(['space', current.pattern.slice(start, current.index)]);
    }
  }
  function parsePlaceholder(current /*: Context */) /*: Placeholder */{
    var pattern = current.pattern;
    if (pattern[current.index] === NUM_ARG) {
      if (current.tokens) current.tokens.push(['syntax', NUM_ARG]);
      ++current.index; // move passed #
      return [NUM_ARG];
    }
    var tag = parseTag(current);
    if (tag) return tag;

    /* istanbul ignore if should be unreachable if parseAST and parseText are right */
    if (pattern[current.index] !== ARG_OPN) throw expected(current, ARG_OPN);
    if (current.tokens) current.tokens.push(['syntax', ARG_OPN]);
    ++current.index; // move passed {
    skipWhitespace(current);
    var id = parseId(current);
    if (!id) throw expected(current, 'placeholder id');
    if (current.tokens) current.tokens.push(['id', id]);
    skipWhitespace(current);
    var char = pattern[current.index];
    if (char === ARG_CLS) {
      // end placeholder
      if (current.tokens) current.tokens.push(['syntax', ARG_CLS]);
      ++current.index; // move passed }
      return [id];
    }
    if (char !== ARG_SEP) throw expected(current, ARG_SEP + ' or ' + ARG_CLS);
    if (current.tokens) current.tokens.push(['syntax', ARG_SEP]);
    ++current.index; // move passed ,
    skipWhitespace(current);
    var type = parseId(current);
    if (!type) throw expected(current, 'placeholder type');
    if (current.tokens) current.tokens.push(['type', type]);
    skipWhitespace(current);
    char = pattern[current.index];
    if (char === ARG_CLS) {
      // end placeholder
      if (current.tokens) current.tokens.push(['syntax', ARG_CLS]);
      if (type === 'plural' || type === 'selectordinal' || type === 'select') {
        throw expected(current, type + ' sub-messages');
      }
      ++current.index; // move passed }
      return [id, type];
    }
    if (char !== ARG_SEP) throw expected(current, ARG_SEP + ' or ' + ARG_CLS);
    if (current.tokens) current.tokens.push(['syntax', ARG_SEP]);
    ++current.index; // move passed ,
    skipWhitespace(current);
    var arg;
    if (type === 'plural' || type === 'selectordinal') {
      var offset = parsePluralOffset(current);
      skipWhitespace(current);
      arg = [id, type, offset, parseSubMessages(current, type)];
    } else if (type === 'select') {
      arg = [id, type, parseSubMessages(current, type)];
    } else if (simpleTypes.indexOf(type) >= 0) {
      arg = [id, type, parseSimpleFormat(current)];
    } else {
      // custom placeholder type
      var index = current.index;
      var format /*: string | SubMessages */ = parseSimpleFormat(current);
      skipWhitespace(current);
      if (pattern[current.index] === ARG_OPN) {
        current.index = index; // rewind, since should have been submessages
        format = parseSubMessages(current, type);
      }
      arg = [id, type, format];
    }
    skipWhitespace(current);
    if (pattern[current.index] !== ARG_CLS) throw expected(current, ARG_CLS);
    if (current.tokens) current.tokens.push(['syntax', ARG_CLS]);
    ++current.index; // move passed }
    return arg;
  }
  function parseTag(current /*: Context */) /*: ?Placeholder */{
    var tagsType = current.tagsType;
    if (!tagsType || current.pattern[current.index] !== TAG_OPN) return;
    if (current.pattern.slice(current.index, current.index + TAG_END.length) === TAG_END) {
      throw expected(current, null, 'closing tag without matching opening tag');
    }
    if (current.tokens) current.tokens.push(['syntax', TAG_OPN]);
    ++current.index; // move passed <

    var id = parseId(current, true);
    if (!id) throw expected(current, 'placeholder id');
    if (current.tokens) current.tokens.push(['id', id]);
    skipWhitespace(current);
    if (current.pattern.slice(current.index, current.index + TAG_SELF_CLS.length) === TAG_SELF_CLS) {
      if (current.tokens) current.tokens.push(['syntax', TAG_SELF_CLS]);
      current.index += TAG_SELF_CLS.length;
      return [id, tagsType];
    }
    if (current.pattern[current.index] !== TAG_CLS) throw expected(current, TAG_CLS);
    if (current.tokens) current.tokens.push(['syntax', TAG_CLS]);
    ++current.index; // move passed >

    var children = parseAST(current, tagsType);
    var end = current.index;
    if (current.pattern.slice(current.index, current.index + TAG_END.length) !== TAG_END) throw expected(current, TAG_END + id + TAG_CLS);
    if (current.tokens) current.tokens.push(['syntax', TAG_END]);
    current.index += TAG_END.length;
    var closeId = parseId(current, true);
    if (closeId && current.tokens) current.tokens.push(['id', closeId]);
    if (id !== closeId) {
      current.index = end; // rewind for better error message
      throw expected(current, TAG_END + id + TAG_CLS, TAG_END + closeId + TAG_CLS);
    }
    skipWhitespace(current);
    if (current.pattern[current.index] !== TAG_CLS) throw expected(current, TAG_CLS);
    if (current.tokens) current.tokens.push(['syntax', TAG_CLS]);
    ++current.index; // move passed >

    return [id, tagsType, {
      children: children
    }];
  }
  function parseId(current /*: Context */, isTag /*:: ?: boolean */) /*: string */{
    var pattern = current.pattern;
    var length = pattern.length;
    var id = '';
    while (current.index < length) {
      var char = pattern[current.index];
      if (char === ARG_OPN || char === ARG_CLS || char === ARG_SEP || char === NUM_ARG || char === ESC || isWhitespace(char.charCodeAt(0)) || isTag && (char === TAG_OPN || char === TAG_CLS || char === '/')) break;
      id += char;
      ++current.index;
    }
    return id;
  }
  function parseSimpleFormat(current /*: Context */) /*: string */{
    var start = current.index;
    var style = parseText(current, '{style}');
    if (!style) throw expected(current, 'placeholder style name');
    if (current.tokens) current.tokens.push(['style', current.pattern.slice(start, current.index)]);
    return style;
  }
  function parsePluralOffset(current /*: Context */) /*: number */{
    var pattern = current.pattern;
    var length = pattern.length;
    var offset = 0;
    if (pattern.slice(current.index, current.index + OFFSET.length) === OFFSET) {
      if (current.tokens) current.tokens.push(['offset', 'offset'], ['syntax', ':']);
      current.index += OFFSET.length; // move passed offset:
      skipWhitespace(current);
      var start = current.index;
      while (current.index < length && isDigit(pattern.charCodeAt(current.index))) {
        ++current.index;
      }
      if (start === current.index) throw expected(current, 'offset number');
      if (current.tokens) current.tokens.push(['number', pattern.slice(start, current.index)]);
      offset = +pattern.slice(start, current.index);
    }
    return offset;
  }
  function isDigit(code /*: number */) /*: boolean */{
    return code >= 0x30 && code <= 0x39;
  }
  function parseSubMessages(current /*: Context */, parentType /*: string */) /*: SubMessages */{
    var pattern = current.pattern;
    var length = pattern.length;
    var options /*: SubMessages */ = {};
    while (current.index < length && pattern[current.index] !== ARG_CLS) {
      var selector = parseId(current);
      if (!selector) throw expected(current, 'sub-message selector');
      if (current.tokens) current.tokens.push(['selector', selector]);
      skipWhitespace(current);
      options[selector] = parseSubMessage(current, parentType);
      skipWhitespace(current);
    }
    if (!options.other && submTypes.indexOf(parentType) >= 0) {
      throw expected(current, null, null, '"other" sub-message must be specified in ' + parentType);
    }
    return options;
  }
  function parseSubMessage(current /*: Context */, parentType /*: string */) /*: AST */{
    if (current.pattern[current.index] !== ARG_OPN) throw expected(current, ARG_OPN + ' to start sub-message');
    if (current.tokens) current.tokens.push(['syntax', ARG_OPN]);
    ++current.index; // move passed {
    var message = parseAST(current, parentType);
    if (current.pattern[current.index] !== ARG_CLS) throw expected(current, ARG_CLS + ' to end sub-message');
    if (current.tokens) current.tokens.push(['syntax', ARG_CLS]);
    ++current.index; // move passed }
    return message;
  }
  function expected(current /*: Context */, expected /*:: ?: ?string */, found /*:: ?: ?string */, message /*:: ?: string */) {
    var pattern = current.pattern;
    var lines = pattern.slice(0, current.index).split(/\r?\n/);
    var offset = current.index;
    var line = lines.length;
    var column = lines.slice(-1)[0].length;
    found = found || (current.index >= pattern.length ? 'end of message pattern' : parseId(current) || pattern[current.index]);
    if (!message) message = errorMessage(expected, found);
    message += ' in ' + pattern.replace(/\r?\n/g, '\n');
    return new SyntaxError(message, expected, found, offset, line, column);
  }
  function errorMessage(expected /*: ?string */, found /* string */) {
    if (!expected) return 'Unexpected ' + found + ' found';
    return 'Expected ' + expected + ' but found ' + found;
  }

  /**
   * SyntaxError
   *  Holds information about bad syntax found in a message pattern
   **/
  function SyntaxError(message /*: string */, expected /*: ?string */, found /*: ?string */, offset /*: number */, line /*: number */, column /*: number */) {
    Error.call(this, message);
    this.name = 'SyntaxError';
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.offset = offset;
    this.line = line;
    this.column = column;
  }
  SyntaxError.prototype = Object.create(Error.prototype);
  exports.SyntaxError = SyntaxError;
})(formatMessageParse, formatMessageParse.exports);

var formatMessageInterpret = {exports: {}};

// @flow
var LONG = 'long';
var SHORT = 'short';
var NARROW = 'narrow';
var NUMERIC = 'numeric';
var TWODIGIT = '2-digit';

/**
 * formatting information
 **/
var formatMessageFormats = {
  number: {
    decimal: {
      style: 'decimal'
    },
    integer: {
      style: 'decimal',
      maximumFractionDigits: 0
    },
    currency: {
      style: 'currency',
      currency: 'USD'
    },
    percent: {
      style: 'percent'
    },
    default: {
      style: 'decimal'
    }
  },
  date: {
    short: {
      month: NUMERIC,
      day: NUMERIC,
      year: TWODIGIT
    },
    medium: {
      month: SHORT,
      day: NUMERIC,
      year: NUMERIC
    },
    long: {
      month: LONG,
      day: NUMERIC,
      year: NUMERIC
    },
    full: {
      month: LONG,
      day: NUMERIC,
      year: NUMERIC,
      weekday: LONG
    },
    default: {
      month: SHORT,
      day: NUMERIC,
      year: NUMERIC
    }
  },
  time: {
    short: {
      hour: NUMERIC,
      minute: NUMERIC
    },
    medium: {
      hour: NUMERIC,
      minute: NUMERIC,
      second: NUMERIC
    },
    long: {
      hour: NUMERIC,
      minute: NUMERIC,
      second: NUMERIC,
      timeZoneName: SHORT
    },
    full: {
      hour: NUMERIC,
      minute: NUMERIC,
      second: NUMERIC,
      timeZoneName: SHORT
    },
    default: {
      hour: NUMERIC,
      minute: NUMERIC,
      second: NUMERIC
    }
  },
  duration: {
    default: {
      hours: {
        minimumIntegerDigits: 1,
        maximumFractionDigits: 0
      },
      minutes: {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 0
      },
      seconds: {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 3
      }
    }
  },
  parseNumberPattern: function parseNumberPattern(pattern /*: ?string */) {
    if (!pattern) return;
    var options = {};
    var currency = pattern.match(/\b[A-Z]{3}\b/i);
    var syms = pattern.replace(/[^¤]/g, '').length;
    if (!syms && currency) syms = 1;
    if (syms) {
      options.style = 'currency';
      options.currencyDisplay = syms === 1 ? 'symbol' : syms === 2 ? 'code' : 'name';
      options.currency = currency ? currency[0].toUpperCase() : 'USD';
    } else if (pattern.indexOf('%') >= 0) {
      options.style = 'percent';
    }
    if (!/[@#0]/.test(pattern)) return options.style ? options : undefined;
    options.useGrouping = pattern.indexOf(',') >= 0;
    if (/E\+?[@#0]+/i.test(pattern) || pattern.indexOf('@') >= 0) {
      var size = pattern.replace(/E\+?[@#0]+|[^@#0]/gi, '');
      options.minimumSignificantDigits = Math.min(Math.max(size.replace(/[^@0]/g, '').length, 1), 21);
      options.maximumSignificantDigits = Math.min(Math.max(size.length, 1), 21);
    } else {
      var parts = pattern.replace(/[^#0.]/g, '').split('.');
      var integer = parts[0];
      var n = integer.length - 1;
      while (integer[n] === '0') --n;
      options.minimumIntegerDigits = Math.min(Math.max(integer.length - 1 - n, 1), 21);
      var fraction = parts[1] || '';
      n = 0;
      while (fraction[n] === '0') ++n;
      options.minimumFractionDigits = Math.min(Math.max(n, 0), 20);
      while (fraction[n] === '#') ++n;
      options.maximumFractionDigits = Math.min(Math.max(n, 0), 20);
    }
    return options;
  },
  parseDatePattern: function parseDatePattern(pattern /*: ?string */) {
    if (!pattern) return;
    var options = {};
    for (var i = 0; i < pattern.length;) {
      var current = pattern[i];
      var n = 1;
      while (pattern[++i] === current) ++n;
      switch (current) {
        case 'G':
          options.era = n === 5 ? NARROW : n === 4 ? LONG : SHORT;
          break;
        case 'y':
        case 'Y':
          options.year = n === 2 ? TWODIGIT : NUMERIC;
          break;
        case 'M':
        case 'L':
          n = Math.min(Math.max(n - 1, 0), 4);
          options.month = [NUMERIC, TWODIGIT, SHORT, LONG, NARROW][n];
          break;
        case 'E':
        case 'e':
        case 'c':
          options.weekday = n === 5 ? NARROW : n === 4 ? LONG : SHORT;
          break;
        case 'd':
        case 'D':
          options.day = n === 2 ? TWODIGIT : NUMERIC;
          break;
        case 'h':
        case 'K':
          options.hour12 = true;
          options.hour = n === 2 ? TWODIGIT : NUMERIC;
          break;
        case 'H':
        case 'k':
          options.hour12 = false;
          options.hour = n === 2 ? TWODIGIT : NUMERIC;
          break;
        case 'm':
          options.minute = n === 2 ? TWODIGIT : NUMERIC;
          break;
        case 's':
        case 'S':
          options.second = n === 2 ? TWODIGIT : NUMERIC;
          break;
        case 'z':
        case 'Z':
        case 'v':
        case 'V':
          options.timeZoneName = n === 1 ? SHORT : LONG;
          break;
      }
    }
    return Object.keys(options).length ? options : undefined;
  }
};

// @flow
// "lookup" algorithm http://tools.ietf.org/html/rfc4647#section-3.4
// assumes normalized language tags, and matches in a case sensitive manner
var lookupClosestLocale = function lookupClosestLocale(locale /*: string | string[] | void */, available /*: { [string]: any } */) /*: ?string */{
  if (typeof locale === 'string' && available[locale]) return locale;
  var locales = [].concat(locale || []);
  for (var l = 0, ll = locales.length; l < ll; ++l) {
    var current = locales[l].split('-');
    while (current.length) {
      var candidate = current.join('-');
      if (available[candidate]) return candidate;
      current.pop();
    }
  }
};

/*:: export type Rule = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other' */
var zero = 'zero',
  one = 'one',
  two = 'two',
  few = 'few',
  many = 'many',
  other = 'other';
var f = [function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return 0 <= n && n <= 1 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var n = +s;
  return i === 0 || n === 1 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 0 ? zero : n === 1 ? one : n === 2 ? two : 3 <= n % 100 && n % 100 <= 10 ? few : 11 <= n % 100 && n % 100 <= 99 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  return i === 1 && v === 0 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n % 10 === 1 && n % 100 !== 11 ? one : 2 <= n % 10 && n % 10 <= 4 && (n % 100 < 12 || 14 < n % 100) ? few : n % 10 === 0 || 5 <= n % 10 && n % 10 <= 9 || 11 <= n % 100 && n % 100 <= 14 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n % 10 === 1 && n % 100 !== 11 && n % 100 !== 71 && n % 100 !== 91 ? one : n % 10 === 2 && n % 100 !== 12 && n % 100 !== 72 && n % 100 !== 92 ? two : (3 <= n % 10 && n % 10 <= 4 || n % 10 === 9) && (n % 100 < 10 || 19 < n % 100) && (n % 100 < 70 || 79 < n % 100) && (n % 100 < 90 || 99 < n % 100) ? few : n !== 0 && n % 1000000 === 0 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  var f = +(s + '.').split('.')[1];
  return v === 0 && i % 10 === 1 && i % 100 !== 11 || f % 10 === 1 && f % 100 !== 11 ? one : v === 0 && 2 <= i % 10 && i % 10 <= 4 && (i % 100 < 12 || 14 < i % 100) || 2 <= f % 10 && f % 10 <= 4 && (f % 100 < 12 || 14 < f % 100) ? few : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  return i === 1 && v === 0 ? one : 2 <= i && i <= 4 && v === 0 ? few : v !== 0 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 0 ? zero : n === 1 ? one : n === 2 ? two : n === 3 ? few : n === 6 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var t = +('' + s).replace(/^[^.]*.?|0+$/g, '');
  var n = +s;
  return n === 1 || t !== 0 && (i === 0 || i === 1) ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  var f = +(s + '.').split('.')[1];
  return v === 0 && i % 100 === 1 || f % 100 === 1 ? one : v === 0 && i % 100 === 2 || f % 100 === 2 ? two : v === 0 && 3 <= i % 100 && i % 100 <= 4 || 3 <= f % 100 && f % 100 <= 4 ? few : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  return i === 0 || i === 1 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  var f = +(s + '.').split('.')[1];
  return v === 0 && (i === 1 || i === 2 || i === 3) || v === 0 && i % 10 !== 4 && i % 10 !== 6 && i % 10 !== 9 || v !== 0 && f % 10 !== 4 && f % 10 !== 6 && f % 10 !== 9 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 ? one : n === 2 ? two : 3 <= n && n <= 6 ? few : 7 <= n && n <= 10 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 || n === 11 ? one : n === 2 || n === 12 ? two : 3 <= n && n <= 10 || 13 <= n && n <= 19 ? few : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  return v === 0 && i % 10 === 1 ? one : v === 0 && i % 10 === 2 ? two : v === 0 && (i % 100 === 0 || i % 100 === 20 || i % 100 === 40 || i % 100 === 60 || i % 100 === 80) ? few : v !== 0 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  var n = +s;
  return i === 1 && v === 0 ? one : i === 2 && v === 0 ? two : v === 0 && (n < 0 || 10 < n) && n % 10 === 0 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var t = +('' + s).replace(/^[^.]*.?|0+$/g, '');
  return t === 0 && i % 10 === 1 && i % 100 !== 11 || t !== 0 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 ? one : n === 2 ? two : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 0 ? zero : n === 1 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var n = +s;
  return n === 0 ? zero : (i === 0 || i === 1) && n !== 0 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var f = +(s + '.').split('.')[1];
  var n = +s;
  return n % 10 === 1 && (n % 100 < 11 || 19 < n % 100) ? one : 2 <= n % 10 && n % 10 <= 9 && (n % 100 < 11 || 19 < n % 100) ? few : f !== 0 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var v = (s + '.').split('.')[1].length;
  var f = +(s + '.').split('.')[1];
  var n = +s;
  return n % 10 === 0 || 11 <= n % 100 && n % 100 <= 19 || v === 2 && 11 <= f % 100 && f % 100 <= 19 ? zero : n % 10 === 1 && n % 100 !== 11 || v === 2 && f % 10 === 1 && f % 100 !== 11 || v !== 2 && f % 10 === 1 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  var f = +(s + '.').split('.')[1];
  return v === 0 && i % 10 === 1 && i % 100 !== 11 || f % 10 === 1 && f % 100 !== 11 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  var n = +s;
  return i === 1 && v === 0 ? one : v !== 0 || n === 0 || n !== 1 && 1 <= n % 100 && n % 100 <= 19 ? few : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 ? one : n === 0 || 2 <= n % 100 && n % 100 <= 10 ? few : 11 <= n % 100 && n % 100 <= 19 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  return i === 1 && v === 0 ? one : v === 0 && 2 <= i % 10 && i % 10 <= 4 && (i % 100 < 12 || 14 < i % 100) ? few : v === 0 && i !== 1 && 0 <= i % 10 && i % 10 <= 1 || v === 0 && 5 <= i % 10 && i % 10 <= 9 || v === 0 && 12 <= i % 100 && i % 100 <= 14 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  return 0 <= i && i <= 1 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  return v === 0 && i % 10 === 1 && i % 100 !== 11 ? one : v === 0 && 2 <= i % 10 && i % 10 <= 4 && (i % 100 < 12 || 14 < i % 100) ? few : v === 0 && i % 10 === 0 || v === 0 && 5 <= i % 10 && i % 10 <= 9 || v === 0 && 11 <= i % 100 && i % 100 <= 14 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var n = +s;
  return i === 0 || n === 1 ? one : 2 <= n && n <= 10 ? few : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var f = +(s + '.').split('.')[1];
  var n = +s;
  return n === 0 || n === 1 || i === 0 && f === 1 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  var v = (s + '.').split('.')[1].length;
  return v === 0 && i % 100 === 1 ? one : v === 0 && i % 100 === 2 ? two : v === 0 && 3 <= i % 100 && i % 100 <= 4 || v !== 0 ? few : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return 0 <= n && n <= 1 || 11 <= n && n <= 99 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 || n === 5 || n === 7 || n === 8 || n === 9 || n === 10 ? one : n === 2 || n === 3 ? two : n === 4 ? few : n === 6 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  return i % 10 === 1 || i % 10 === 2 || i % 10 === 5 || i % 10 === 7 || i % 10 === 8 || i % 100 === 20 || i % 100 === 50 || i % 100 === 70 || i % 100 === 80 ? one : i % 10 === 3 || i % 10 === 4 || i % 1000 === 100 || i % 1000 === 200 || i % 1000 === 300 || i % 1000 === 400 || i % 1000 === 500 || i % 1000 === 600 || i % 1000 === 700 || i % 1000 === 800 || i % 1000 === 900 ? few : i === 0 || i % 10 === 6 || i % 100 === 40 || i % 100 === 60 || i % 100 === 90 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return (n % 10 === 2 || n % 10 === 3) && n % 100 !== 12 && n % 100 !== 13 ? few : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 || n === 3 ? one : n === 2 ? two : n === 4 ? few : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 0 || n === 7 || n === 8 || n === 9 ? zero : n === 1 ? one : n === 2 ? two : n === 3 || n === 4 ? few : n === 5 || n === 6 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n % 10 === 1 && n % 100 !== 11 ? one : n % 10 === 2 && n % 100 !== 12 ? two : n % 10 === 3 && n % 100 !== 13 ? few : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 || n === 11 ? one : n === 2 || n === 12 ? two : n === 3 || n === 13 ? few : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 ? one : n === 2 || n === 3 ? two : n === 4 ? few : n === 6 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 || n === 5 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 11 || n === 8 || n === 80 || n === 800 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  return i === 1 ? one : i === 0 || 2 <= i % 100 && i % 100 <= 20 || i % 100 === 40 || i % 100 === 60 || i % 100 === 80 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n % 10 === 6 || n % 10 === 9 || n % 10 === 0 && n !== 0 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var i = Math.floor(Math.abs(+s));
  return i % 10 === 1 && i % 100 !== 11 ? one : i % 10 === 2 && i % 100 !== 12 ? two : (i % 10 === 7 || i % 10 === 8) && i % 100 !== 17 && i % 100 !== 18 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 ? one : n === 2 || n === 3 ? two : n === 4 ? few : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return 1 <= n && n <= 4 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 || n === 5 || 7 <= n && n <= 9 ? one : n === 2 || n === 3 ? two : n === 4 ? few : n === 6 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n === 1 ? one : n % 10 === 4 && n % 100 !== 14 ? many : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return (n % 10 === 1 || n % 10 === 2) && n % 100 !== 11 && n % 100 !== 12 ? one : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n % 10 === 6 || n % 10 === 9 || n === 10 ? few : other;
}, function (s /*: string | number */) /*: Rule */{
  var n = +s;
  return n % 10 === 3 && n % 100 !== 13 ? few : other;
}];
var plurals = {
  af: {
    cardinal: f[0]
  },
  ak: {
    cardinal: f[1]
  },
  am: {
    cardinal: f[2]
  },
  ar: {
    cardinal: f[3]
  },
  ars: {
    cardinal: f[3]
  },
  as: {
    cardinal: f[2],
    ordinal: f[34]
  },
  asa: {
    cardinal: f[0]
  },
  ast: {
    cardinal: f[4]
  },
  az: {
    cardinal: f[0],
    ordinal: f[35]
  },
  be: {
    cardinal: f[5],
    ordinal: f[36]
  },
  bem: {
    cardinal: f[0]
  },
  bez: {
    cardinal: f[0]
  },
  bg: {
    cardinal: f[0]
  },
  bh: {
    cardinal: f[1]
  },
  bn: {
    cardinal: f[2],
    ordinal: f[34]
  },
  br: {
    cardinal: f[6]
  },
  brx: {
    cardinal: f[0]
  },
  bs: {
    cardinal: f[7]
  },
  ca: {
    cardinal: f[4],
    ordinal: f[37]
  },
  ce: {
    cardinal: f[0]
  },
  cgg: {
    cardinal: f[0]
  },
  chr: {
    cardinal: f[0]
  },
  ckb: {
    cardinal: f[0]
  },
  cs: {
    cardinal: f[8]
  },
  cy: {
    cardinal: f[9],
    ordinal: f[38]
  },
  da: {
    cardinal: f[10]
  },
  de: {
    cardinal: f[4]
  },
  dsb: {
    cardinal: f[11]
  },
  dv: {
    cardinal: f[0]
  },
  ee: {
    cardinal: f[0]
  },
  el: {
    cardinal: f[0]
  },
  en: {
    cardinal: f[4],
    ordinal: f[39]
  },
  eo: {
    cardinal: f[0]
  },
  es: {
    cardinal: f[0]
  },
  et: {
    cardinal: f[4]
  },
  eu: {
    cardinal: f[0]
  },
  fa: {
    cardinal: f[2]
  },
  ff: {
    cardinal: f[12]
  },
  fi: {
    cardinal: f[4]
  },
  fil: {
    cardinal: f[13],
    ordinal: f[0]
  },
  fo: {
    cardinal: f[0]
  },
  fr: {
    cardinal: f[12],
    ordinal: f[0]
  },
  fur: {
    cardinal: f[0]
  },
  fy: {
    cardinal: f[4]
  },
  ga: {
    cardinal: f[14],
    ordinal: f[0]
  },
  gd: {
    cardinal: f[15],
    ordinal: f[40]
  },
  gl: {
    cardinal: f[4]
  },
  gsw: {
    cardinal: f[0]
  },
  gu: {
    cardinal: f[2],
    ordinal: f[41]
  },
  guw: {
    cardinal: f[1]
  },
  gv: {
    cardinal: f[16]
  },
  ha: {
    cardinal: f[0]
  },
  haw: {
    cardinal: f[0]
  },
  he: {
    cardinal: f[17]
  },
  hi: {
    cardinal: f[2],
    ordinal: f[41]
  },
  hr: {
    cardinal: f[7]
  },
  hsb: {
    cardinal: f[11]
  },
  hu: {
    cardinal: f[0],
    ordinal: f[42]
  },
  hy: {
    cardinal: f[12],
    ordinal: f[0]
  },
  ia: {
    cardinal: f[4]
  },
  io: {
    cardinal: f[4]
  },
  is: {
    cardinal: f[18]
  },
  it: {
    cardinal: f[4],
    ordinal: f[43]
  },
  iu: {
    cardinal: f[19]
  },
  iw: {
    cardinal: f[17]
  },
  jgo: {
    cardinal: f[0]
  },
  ji: {
    cardinal: f[4]
  },
  jmc: {
    cardinal: f[0]
  },
  ka: {
    cardinal: f[0],
    ordinal: f[44]
  },
  kab: {
    cardinal: f[12]
  },
  kaj: {
    cardinal: f[0]
  },
  kcg: {
    cardinal: f[0]
  },
  kk: {
    cardinal: f[0],
    ordinal: f[45]
  },
  kkj: {
    cardinal: f[0]
  },
  kl: {
    cardinal: f[0]
  },
  kn: {
    cardinal: f[2]
  },
  ks: {
    cardinal: f[0]
  },
  ksb: {
    cardinal: f[0]
  },
  ksh: {
    cardinal: f[20]
  },
  ku: {
    cardinal: f[0]
  },
  kw: {
    cardinal: f[19]
  },
  ky: {
    cardinal: f[0]
  },
  lag: {
    cardinal: f[21]
  },
  lb: {
    cardinal: f[0]
  },
  lg: {
    cardinal: f[0]
  },
  ln: {
    cardinal: f[1]
  },
  lt: {
    cardinal: f[22]
  },
  lv: {
    cardinal: f[23]
  },
  mas: {
    cardinal: f[0]
  },
  mg: {
    cardinal: f[1]
  },
  mgo: {
    cardinal: f[0]
  },
  mk: {
    cardinal: f[24],
    ordinal: f[46]
  },
  ml: {
    cardinal: f[0]
  },
  mn: {
    cardinal: f[0]
  },
  mo: {
    cardinal: f[25],
    ordinal: f[0]
  },
  mr: {
    cardinal: f[2],
    ordinal: f[47]
  },
  mt: {
    cardinal: f[26]
  },
  nah: {
    cardinal: f[0]
  },
  naq: {
    cardinal: f[19]
  },
  nb: {
    cardinal: f[0]
  },
  nd: {
    cardinal: f[0]
  },
  ne: {
    cardinal: f[0],
    ordinal: f[48]
  },
  nl: {
    cardinal: f[4]
  },
  nn: {
    cardinal: f[0]
  },
  nnh: {
    cardinal: f[0]
  },
  no: {
    cardinal: f[0]
  },
  nr: {
    cardinal: f[0]
  },
  nso: {
    cardinal: f[1]
  },
  ny: {
    cardinal: f[0]
  },
  nyn: {
    cardinal: f[0]
  },
  om: {
    cardinal: f[0]
  },
  or: {
    cardinal: f[0],
    ordinal: f[49]
  },
  os: {
    cardinal: f[0]
  },
  pa: {
    cardinal: f[1]
  },
  pap: {
    cardinal: f[0]
  },
  pl: {
    cardinal: f[27]
  },
  prg: {
    cardinal: f[23]
  },
  ps: {
    cardinal: f[0]
  },
  pt: {
    cardinal: f[28]
  },
  'pt-PT': {
    cardinal: f[4]
  },
  rm: {
    cardinal: f[0]
  },
  ro: {
    cardinal: f[25],
    ordinal: f[0]
  },
  rof: {
    cardinal: f[0]
  },
  ru: {
    cardinal: f[29]
  },
  rwk: {
    cardinal: f[0]
  },
  saq: {
    cardinal: f[0]
  },
  sc: {
    cardinal: f[4],
    ordinal: f[43]
  },
  scn: {
    cardinal: f[4],
    ordinal: f[43]
  },
  sd: {
    cardinal: f[0]
  },
  sdh: {
    cardinal: f[0]
  },
  se: {
    cardinal: f[19]
  },
  seh: {
    cardinal: f[0]
  },
  sh: {
    cardinal: f[7]
  },
  shi: {
    cardinal: f[30]
  },
  si: {
    cardinal: f[31]
  },
  sk: {
    cardinal: f[8]
  },
  sl: {
    cardinal: f[32]
  },
  sma: {
    cardinal: f[19]
  },
  smi: {
    cardinal: f[19]
  },
  smj: {
    cardinal: f[19]
  },
  smn: {
    cardinal: f[19]
  },
  sms: {
    cardinal: f[19]
  },
  sn: {
    cardinal: f[0]
  },
  so: {
    cardinal: f[0]
  },
  sq: {
    cardinal: f[0],
    ordinal: f[50]
  },
  sr: {
    cardinal: f[7]
  },
  ss: {
    cardinal: f[0]
  },
  ssy: {
    cardinal: f[0]
  },
  st: {
    cardinal: f[0]
  },
  sv: {
    cardinal: f[4],
    ordinal: f[51]
  },
  sw: {
    cardinal: f[4]
  },
  syr: {
    cardinal: f[0]
  },
  ta: {
    cardinal: f[0]
  },
  te: {
    cardinal: f[0]
  },
  teo: {
    cardinal: f[0]
  },
  ti: {
    cardinal: f[1]
  },
  tig: {
    cardinal: f[0]
  },
  tk: {
    cardinal: f[0],
    ordinal: f[52]
  },
  tl: {
    cardinal: f[13],
    ordinal: f[0]
  },
  tn: {
    cardinal: f[0]
  },
  tr: {
    cardinal: f[0]
  },
  ts: {
    cardinal: f[0]
  },
  tzm: {
    cardinal: f[33]
  },
  ug: {
    cardinal: f[0]
  },
  uk: {
    cardinal: f[29],
    ordinal: f[53]
  },
  ur: {
    cardinal: f[4]
  },
  uz: {
    cardinal: f[0]
  },
  ve: {
    cardinal: f[0]
  },
  vo: {
    cardinal: f[0]
  },
  vun: {
    cardinal: f[0]
  },
  wa: {
    cardinal: f[1]
  },
  wae: {
    cardinal: f[0]
  },
  xh: {
    cardinal: f[0]
  },
  xog: {
    cardinal: f[0]
  },
  yi: {
    cardinal: f[4]
  },
  zu: {
    cardinal: f[2]
  },
  lo: {
    ordinal: f[0]
  },
  ms: {
    ordinal: f[0]
  },
  vi: {
    ordinal: f[0]
  }
};

(function (module, exports) {

  var formats = formatMessageFormats;
  var lookupClosestLocale$1 = lookupClosestLocale;
  var plurals$1 = plurals;

  /*::
  import type {
    AST,
    SubMessages
  } from '../format-message-parse'
  type Locale = string
  type Locales = Locale | Locale[]
  type Placeholder = any[] // https://github.com/facebook/flow/issues/4050
  export type Type = (Placeholder, Locales) => (any, ?Object) => any
  export type Types = { [string]: Type }
  */

  exports = module.exports = function interpret(ast /*: AST */, locale /*:: ?: Locales */, types /*:: ?: Types */) /*: (args?: Object) => string */{
    return interpretAST(ast, null, locale || 'en', types || {}, true);
  };
  exports.toParts = function toParts(ast /*: AST */, locale /*:: ?: Locales */, types /*:: ?: Types */) /*: (args?: Object) => any[] */{
    return interpretAST(ast, null, locale || 'en', types || {}, false);
  };
  function interpretAST(elements /*: any[] */, parent /*: ?Placeholder */, locale /*: Locales */, types /*: Types */, join /*: boolean */) /*: Function */{
    var parts = elements.map(function (element) {
      return interpretElement(element, parent, locale, types, join);
    });
    if (!join) {
      return function format(args) {
        return parts.reduce(function (parts, part) {
          return parts.concat(part(args));
        }, []);
      };
    }
    if (parts.length === 1) return parts[0];
    return function format(args) {
      var message = '';
      for (var e = 0; e < parts.length; ++e) {
        message += parts[e](args);
      }
      return message;
    };
  }
  function interpretElement(element /*: Placeholder */, parent /*: ?Placeholder */, locale /*: Locales */, types /*: Types */, join /*: boolean */) /*: Function */{
    if (typeof element === 'string') {
      var value /*: string */ = element;
      return function format() {
        return value;
      };
    }
    var id = element[0];
    var type = element[1];
    if (parent && element[0] === '#') {
      id = parent[0];
      var offset = parent[2];
      var formatter = (types.number || defaults.number)([id, 'number'], locale);
      return function format(args) {
        return formatter(getArg(id, args) - offset, args);
      };
    }

    // pre-process children
    var children;
    if (type === 'plural' || type === 'selectordinal') {
      children = {};
      Object.keys(element[3]).forEach(function (key) {
        children[key] = interpretAST(element[3][key], element, locale, types, join);
      });
      element = [element[0], element[1], element[2], children];
    } else if (element[2] && _typeof(element[2]) === 'object') {
      children = {};
      Object.keys(element[2]).forEach(function (key) {
        children[key] = interpretAST(element[2][key], element, locale, types, join);
      });
      element = [element[0], element[1], children];
    }
    var getFrmt = type && (types[type] || defaults[type]);
    if (getFrmt) {
      var frmt = getFrmt(element, locale);
      return function format(args) {
        return frmt(getArg(id, args), args);
      };
    }
    return join ? function format(args) {
      return String(getArg(id, args));
    } : function format(args) {
      return getArg(id, args);
    };
  }
  function getArg(id /*: string */, args /*: ?Object */) /*: any */{
    if (args && id in args) return args[id];
    var parts = id.split('.');
    var a = args;
    for (var i = 0, ii = parts.length; a && i < ii; ++i) {
      a = a[parts[i]];
    }
    return a;
  }
  function interpretNumber(element /*: Placeholder */, locales /*: Locales */) {
    var style = element[2];
    var options = formats.number[style] || formats.parseNumberPattern(style) || formats.number.default;
    return new Intl.NumberFormat(locales, options).format;
  }
  function interpretDuration(element /*: Placeholder */, locales /*: Locales */) {
    var style = element[2];
    var options = formats.duration[style] || formats.duration.default;
    var fs = new Intl.NumberFormat(locales, options.seconds).format;
    var fm = new Intl.NumberFormat(locales, options.minutes).format;
    var fh = new Intl.NumberFormat(locales, options.hours).format;
    var sep = /^fi$|^fi-|^da/.test(String(locales)) ? '.' : ':';
    return function (s, args) {
      s = +s;
      if (!isFinite(s)) return fs(s);
      var h = ~~(s / 60 / 60); // ~~ acts much like Math.trunc
      var m = ~~(s / 60 % 60);
      var dur = (h ? fh(Math.abs(h)) + sep : '') + fm(Math.abs(m)) + sep + fs(Math.abs(s % 60));
      return s < 0 ? fh(-1).replace(fh(1), dur) : dur;
    };
  }
  function interpretDateTime(element /*: Placeholder */, locales /*: Locales */) {
    var type = element[1];
    var style = element[2];
    var options = formats[type][style] || formats.parseDatePattern(style) || formats[type].default;
    return new Intl.DateTimeFormat(locales, options).format;
  }
  function interpretPlural(element /*: Placeholder */, locales /*: Locales */) {
    var type = element[1];
    var pluralType = type === 'selectordinal' ? 'ordinal' : 'cardinal';
    var offset = element[2];
    var children = element[3];
    var pluralRules;
    if (Intl.PluralRules && Intl.PluralRules.supportedLocalesOf(locales).length > 0) {
      pluralRules = new Intl.PluralRules(locales, {
        type: pluralType
      });
    } else {
      var locale = lookupClosestLocale$1(locales, plurals$1);
      var select = locale && plurals$1[locale][pluralType] || returnOther;
      pluralRules = {
        select: select
      };
    }
    return function (value, args) {
      var clause = children['=' + +value] || children[pluralRules.select(value - offset)] || children.other;
      return clause(args);
    };
  }
  function returnOther( /*:: n:number */) {
    return 'other';
  }
  function interpretSelect(element /*: Placeholder */, locales /*: Locales */) {
    var children = element[2];
    return function (value, args) {
      var clause = children[value] || children.other;
      return clause(args);
    };
  }
  var defaults /*: Types */ = {
    number: interpretNumber,
    ordinal: interpretNumber,
    // TODO: support rbnf
    spellout: interpretNumber,
    // TODO: support rbnf
    duration: interpretDuration,
    date: interpretDateTime,
    time: interpretDateTime,
    plural: interpretPlural,
    selectordinal: interpretPlural,
    select: interpretSelect
  };
  exports.types = defaults;
})(formatMessageInterpret, formatMessageInterpret.exports);

(function (module, exports) {

  var parse = formatMessageParse.exports;
  var interpret = formatMessageInterpret.exports;
  var plurals$1 = plurals;
  var lookupClosestLocale$1 = lookupClosestLocale;
  var origFormats = formatMessageFormats;

  /*::
  import type { Types } from 'format-message-interpret'
  type Locale = string
  type Locales = Locale | Locale[]
  type Message = string | {|
    id?: string,
    default: string,
    description?: string
  |}
  type Translations = { [string]: ?{ [string]: string | Translation } }
  type Translation = {
    message: string,
    format?: (args?: Object) => string,
    toParts?: (args?: Object) => any[],
  }
  type Replacement = ?string | (string, string, locales?: Locales) => ?string
  type GenerateId = (string) => string
  type MissingTranslation = 'ignore' | 'warning' | 'error'
  type FormatObject = { [string]: * }
  type Options = {
    locale?: Locales,
    translations?: ?Translations,
    generateId?: GenerateId,
    missingReplacement?: Replacement,
    missingTranslation?: MissingTranslation,
    formats?: {
      number?: FormatObject,
      date?: FormatObject,
      time?: FormatObject
    },
    types?: Types
  }
  type Setup = {|
    locale: Locales,
    translations: Translations,
    generateId: GenerateId,
    missingReplacement: Replacement,
    missingTranslation: MissingTranslation,
    formats: {
      number: FormatObject,
      date: FormatObject,
      time: FormatObject
    },
    types: Types
  |}
  type FormatMessage = {
    (msg: Message, args?: Object, locales?: Locales): string,
    rich (msg: Message, args?: Object, locales?: Locales): any[],
    setup (opt?: Options): Setup,
    number (value: number, style?: string, locales?: Locales): string,
    date (value: number | Date, style?: string, locales?: Locales): string,
    time (value: number | Date, style?: string, locales?: Locales): string,
    select (value: any, options: Object): any,
    custom (placeholder: any[], locales: Locales, value: any, args: Object): any,
    plural (value: number, offset: any, options: any, locale: any): any,
    selectordinal (value: number, offset: any, options: any, locale: any): any,
    namespace (): FormatMessage
  }
  */

  function assign /*:: <T: Object> */(target /*: T */, source /*: Object */) {
    Object.keys(source).forEach(function (key) {
      target[key] = source[key];
    });
    return target;
  }
  function namespace() /*: FormatMessage */{
    var formats = assign({}, origFormats);
    var currentLocales /*: Locales */ = 'en';
    var translations /*: Translations */ = {};
    var generateId /*: GenerateId */ = function generateId(pattern) {
      return pattern;
    };
    var missingReplacement /*: Replacement */ = null;
    var missingTranslation /*: MissingTranslation */ = 'warning';
    var types /*: Types */ = {};
    function formatMessage(msg /*: Message */, args /*:: ?: Object */, locales /*:: ?: Locales */) {
      var pattern = typeof msg === 'string' ? msg : msg.default;
      var id = _typeof(msg) === 'object' && msg.id || generateId(pattern);
      var translated = translate(pattern, id, locales || currentLocales);
      var format = translated.format || (translated.format = interpret(parse(translated.message), locales || currentLocales, types));
      return format(args);
    }
    formatMessage.rich = function rich(msg /*: Message */, args /*:: ?: Object */, locales /*:: ?: Locales */) {
      var pattern = typeof msg === 'string' ? msg : msg.default;
      var id = _typeof(msg) === 'object' && msg.id || generateId(pattern);
      var translated = translate(pattern, id, locales || currentLocales);
      var format = translated.toParts || (translated.toParts = interpret.toParts(parse(translated.message, {
        tagsType: tagsType
      }), locales || currentLocales, types));
      return format(args);
    };
    var tagsType = '<>';
    function richType(node /*: any[] */, locales /*: Locales */) {
      var style = node[2];
      return function (fn, args) {
        var props = _typeof(style) === 'object' ? mapObject(style, args) : style;
        return typeof fn === 'function' ? fn(props) : fn;
      };
    }
    types[tagsType] = richType;
    function mapObject(object /* { [string]: (args?: Object) => any } */, args /*: ?Object */) {
      return Object.keys(object).reduce(function (mapped, key) {
        mapped[key] = object[key](args);
        return mapped;
      }, {});
    }
    function translate(pattern /*: string */, id /*: string */, locales /*: Locales */) /*: Translation */{
      var locale = lookupClosestLocale$1(locales, translations) || 'en';
      var messages = translations[locale] || (translations[locale] = {});
      var translated = messages[id];
      if (typeof translated === 'string') {
        translated = messages[id] = {
          message: translated
        };
      }
      if (!translated) {
        var message = 'Translation for "' + id + '" in "' + locale + '" is missing';
        if (missingTranslation === 'warning') {
          /* istanbul ignore else */
          if (typeof console !== 'undefined') console.warn(message);
        } else if (missingTranslation !== 'ignore') {
          // 'error'
          throw new Error(message);
        }
        var replacement = typeof missingReplacement === 'function' ? missingReplacement(pattern, id, locale) || pattern : missingReplacement || pattern;
        translated = messages[id] = {
          message: replacement
        };
      }
      return translated;
    }
    formatMessage.setup = function setup(opt /*:: ?: Options */) {
      opt = opt || {};
      if (opt.locale) currentLocales = opt.locale;
      if ('translations' in opt) translations = opt.translations || {};
      if (opt.generateId) generateId = opt.generateId;
      if ('missingReplacement' in opt) missingReplacement = opt.missingReplacement;
      if (opt.missingTranslation) missingTranslation = opt.missingTranslation;
      if (opt.formats) {
        if (opt.formats.number) assign(formats.number, opt.formats.number);
        if (opt.formats.date) assign(formats.date, opt.formats.date);
        if (opt.formats.time) assign(formats.time, opt.formats.time);
      }
      if (opt.types) {
        types = opt.types;
        types[tagsType] = richType;
      }
      return {
        locale: currentLocales,
        translations: translations,
        generateId: generateId,
        missingReplacement: missingReplacement,
        missingTranslation: missingTranslation,
        formats: formats,
        types: types
      };
    };
    formatMessage.number = function (value /*: number */, style /*:: ?: string */, locales /*:: ?: Locales */) {
      var options = style && formats.number[style] || formats.parseNumberPattern(style) || formats.number.default;
      return new Intl.NumberFormat(locales || currentLocales, options).format(value);
    };
    formatMessage.date = function (value /*:: ?: number | Date */, style /*:: ?: string */, locales /*:: ?: Locales */) {
      var options = style && formats.date[style] || formats.parseDatePattern(style) || formats.date.default;
      return new Intl.DateTimeFormat(locales || currentLocales, options).format(value);
    };
    formatMessage.time = function (value /*:: ?: number | Date */, style /*:: ?: string */, locales /*:: ?: Locales */) {
      var options = style && formats.time[style] || formats.parseDatePattern(style) || formats.time.default;
      return new Intl.DateTimeFormat(locales || currentLocales, options).format(value);
    };
    formatMessage.select = function (value /*: any */, options /*: Object */) {
      return options[value] || options.other;
    };
    formatMessage.custom = function (placeholder /*: any[] */, locales /*: Locales */, value /*: any */, args /*: Object */) {
      if (!(placeholder[1] in types)) return value;
      return types[placeholder[1]](placeholder, locales)(value, args);
    };
    formatMessage.plural = plural.bind(null, 'cardinal');
    formatMessage.selectordinal = plural.bind(null, 'ordinal');
    function plural(pluralType /*: 'cardinal' | 'ordinal' */, value /*: number */, offset /*: any */, options /*: any */, locale /*: any */) {
      if (_typeof(offset) === 'object' && _typeof(options) !== 'object') {
        // offset is optional
        locale = options;
        options = offset;
        offset = 0;
      }
      var closest = lookupClosestLocale$1(locale || currentLocales, plurals$1);
      var plural = closest && plurals$1[closest][pluralType] || returnOther;
      return options['=' + +value] || options[plural(value - offset)] || options.other;
    }
    function returnOther( /*:: n:number */) {
      return 'other';
    }
    formatMessage.namespace = namespace;
    return formatMessage;
  }
  module.exports = namespace();
})(formatMessage);

var ArgumentType = argumentType;
var BlockType = blockType;
// const Cast = require('../../util/cast');
// const log = require('../../util/log');
var setupSelectableVideoProvider = require$$2.setupSelectableVideoProvider,
  isSelectableVideoProvider = require$$2.isSelectableVideoProvider;

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
var extensionURL = 'https://tfabworks.github.io/cameraselector/dist/cameraselector.mjs';
var blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAkCAQAAABRNbCdAAAAAmJLR0QA/4ePzL8AAAAHdElNRQfnDB0MKA2K4MiqAAAEQUlEQVRIx+2VbVCUVRTHf8/ussDC7vAuIOJSqKCjvOTLooYEMmmgSEmWjDg56mS+M42OjdVobypTQwxEE02UNuMHpBpHU4ogEJnBkTEwnWiiKCfJRUCEQdaFPX0Alt1FpT7VB//32z3n/u695/6f88BDPdR/L8V1ogAtVfSPD9xjaRC/8S6xTrMa1zQtarVhro9RkfuBRgLKkEXbENje6xIdB6xFE11V1hvGfYH2syvRJfVbLtgmAN7CzdDj16u43lnF6MoMMrBhpYD+CNxslgmAAM7X9SaNVAz8xAmagRhysHGHE5ht4+9xT6Cj/MhjLTfpZRnryOVLjnIOwcZljPfInxD4ItkUUkwP8eRxhKu00DYSiwCEcrrwx8qakdLYVYPwBnonXCBrOMcBWrnJN+wnlOUuGyaoozxt+h7tLXutAbjEbM6goPcz6R3r4k8IFxi1RhOdTHPCXdIlH848W1zWEtlC8xjwK2JRCPBL2VJ85vRK9dDYgn76CbU/uD9edDvy5IZ7a+rPiQOGlOvdzOHUMPAkSSjMTigpqy/8dX6Pp9rhhO3UsoJ0FMCfHWioci3yELTP2nvEIzKINCrQwErCWL20uqTdKLijEUcnWHmPeEo5jZkE5lJAnQtPgB5D86bOBUt3KDUCsJncyVMbEURnmVm+ftoqk6EXGRtxckza5IY0yk7xFsdI/JkvJkU3hF7XCoKEX90UlQngS+pmD0EMt5fs+s4zlYyFeicg4iZTZYb4Cy4j/uzR0Ofyd8fOP6TvQzQyL1/QQDedj1qBiLrvCwsGdbgNahTnNjTI74Bra1JQLItvD+R/29bQtNDWuO8u5oXFvhoAr24VQ5ijNphK6/Zga5l+sGMygsCDupgbYace6cvvi0GRJ3oVQNR3VcAqch4L+gtRJKQt+aXDARA4XG71RF/RFN4mgs8NyTt9OxCVxH4sKqACUZbk6i0I4jlovJC4d2Pc116wYnnioVwjHMBEtdPI5iO2Ege8GZKWPb1SZ0WQkGvrFywD+JB3aNIm7Qo0K4IgWgnoiKxOeCvuE0+ZciV1c4lhHsc4ZD9XKxsp0m2LSs+aWxR+xcuKIIoE/5GWCQPDKQc5gpD9+Kxyn9vqkRfUyLAZdNYZFU8/me++m/oR4C/AU7uDb3gNqmQY5m2JOrXOBBUcH921lPOkUO+RlRz/QViLt0XjYA5FjOYN6fPswFa8SdrqNmIov86Zp9Of/dQ7ERvHsLevF7hIDJcGOqsaq1+b3BRnXtQV1zWnM1hwJ/hi1PvhNe72nqEiCd3lgK6hfp8fA2uMlTuuZN0xEc5l1o1/t+PU8gomQDTzd3nIpGuL9u8P9iWPfZy3Z73Oq/q1idsjf/CAZyghh6YHmeFP6rjJElIzF5RuiIHtQKVTxh5eJoNtfIbQMJG3RlVEia5Du5prY4X+R7rvL8CG9J9kMUM8/6+A/3/9DSQTr0bbrLc4AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTEyLTI5VDEyOjI3OjAxKzAwOjAwzOSVLQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0xMi0yOVQxMjoyNzowMSswMDowML25LZEAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjMtMTItMjlUMTI6NDA6MTMrMDA6MDC78MzDAAAAAElFTkSuQmCC';
var Message = {
  select_video_device: {
    ja: 'カメラを[LIST]に切り替える',
    'ja-Hira': 'かめらを[LIST]にきりかえる',
    en: 'Set camera to [LIST]',
    'zh-cn': '切换相机至[LIST]',
    'zh-tw': '切换相机至[LIST]'
  }
};
var Scratch3CameraSelectorBlocks = /*#__PURE__*/function () {
  function Scratch3CameraSelectorBlocks(runtime) {
    _classCallCheck(this, Scratch3CameraSelectorBlocks);
    this.runtime = runtime;
    window.runtime = runtime;
  }
  _createClass(Scratch3CameraSelectorBlocks, [{
    key: "getInfo",
    value: function getInfo() {
      var locale = 'ja';
      return {
        id: 'cameraselector',
        name: 'CameraSelector',
        extensionURL: extensionURL,
        blockIconURI: blockIconURI,
        blocks: [{
          opcode: 'selectCamera',
          blockType: BlockType.COMMAND,
          text: Message.select_video_device[locale],
          arguments: {
            LIST: {
              type: ArgumentType.STRING,
              defaultValue: 'default',
              menu: 'videoDevicesMenu'
            }
          }
        }],
        menus: {
          videoDevicesMenu: {
            acceptReporters: true,
            items: 'getVideoDevicesMenu'
          }
        }
      };
    }
  }, {
    key: "selectCamera",
    value: function selectCamera(args) {
      var deviceId = args.LIST || '';
      // 対応するデバイスが見つからない場合に OverconstrainedError が発生する事がありますが、その対応が実装できていない事に注意が必要です。
      // 例えば MacbookPro は背面カメラをサポートしていないので {facingMode:{exact:"environment"}} を指定するとエラーが発生し現状では他のカメラに切り替えても復帰できなくなります。
      if (deviceId == "USER") {
        this._getSelectableVideoProvider().setVideoDescriptor({
          facingMode: "user"
        });
        this.runtime.ioDevices.video.mirror = true;
      } else if (deviceId == "ENVIRONMENT") {
        this._getSelectableVideoProvider().setVideoDescriptor({
          facingMode: {
            exact: "environment"
          }
        });
        this.runtime.ioDevices.video.mirror = false;
      } else {
        this._getSelectableVideoProvider().mirror = this.runtime.ioDevices.video.mirror;
        this._getSelectableVideoProvider().setVideoDescriptor({
          deviceId: deviceId
        });
      }
    }
  }, {
    key: "getVideoDevicesMenu",
    value: function getVideoDevicesMenu() {
      var defaultValues = [{
        text: "default",
        value: ""
      }];
      // Constraints に対応するデバイスが見つからなかった場合に OverconstrainedError が発生する際の問題が未解決なので封印
      // if(navigator.mediaDevices.getSupportedConstraints().facingMode) {
      //   defaultValues.push(
      //     { text: "前面カメラ", value: "USER" },
      //     { text: "背面カメラ", value: "ENVIRONMENT" }
      //   )
      // }
      var deviceValues = this._getSelectableVideoProvider().videoDevices.map(function (dev) {
        return {
          text: dev.label,
          value: dev.deviceId
        };
      }).sort(function (a, b) {
        return b.text < a.text;
      });
      return defaultValues.concat(deviceValues);
    }
  }, {
    key: "_getSelectableVideoProvider",
    value: function _getSelectableVideoProvider() {
      if (isSelectableVideoProvider(this.runtime.ioDevices.video.provider)) {
        return this.runtime.ioDevices.video.provider;
      }
      return setupSelectableVideoProvider(this.runtime);
    }
  }]);
  return Scratch3CameraSelectorBlocks;
}();
var blockClass = Scratch3CameraSelectorBlocks; // loadable-extension needs this line.
blockClass = Scratch3CameraSelectorBlocks;

export { blockClass, entry };
