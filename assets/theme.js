(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/localforage/dist/localforage.js
  var require_localforage = __commonJS({
    "node_modules/localforage/dist/localforage.js"(exports, module) {
      /*!
          localForage -- Offline Storage, Improved
          Version 1.10.0
          https://localforage.github.io/localForage
          (c) 2013-2017 Mozilla, Apache License 2.0
      */
      (function(f) {
        if (typeof exports === "object" && typeof module !== "undefined") {
          module.exports = f();
        } else if (typeof define === "function" && define.amd) {
          define([], f);
        } else {
          var g;
          if (typeof window !== "undefined") {
            g = window;
          } else if (typeof global !== "undefined") {
            g = global;
          } else if (typeof self !== "undefined") {
            g = self;
          } else {
            g = this;
          }
          g.localforage = f();
        }
      })(function() {
        var define2, module2, exports2;
        return function e(t, n, r) {
          function s(o2, u) {
            if (!n[o2]) {
              if (!t[o2]) {
                var a = typeof __require == "function" && __require;
                if (!u && a)
                  return a(o2, true);
                if (i)
                  return i(o2, true);
                var f = new Error("Cannot find module '" + o2 + "'");
                throw f.code = "MODULE_NOT_FOUND", f;
              }
              var l = n[o2] = { exports: {} };
              t[o2][0].call(l.exports, function(e2) {
                var n2 = t[o2][1][e2];
                return s(n2 ? n2 : e2);
              }, l, l.exports, e, t, n, r);
            }
            return n[o2].exports;
          }
          var i = typeof __require == "function" && __require;
          for (var o = 0; o < r.length; o++)
            s(r[o]);
          return s;
        }({ 1: [function(_dereq_, module3, exports3) {
          (function(global2) {
            "use strict";
            var Mutation = global2.MutationObserver || global2.WebKitMutationObserver;
            var scheduleDrain;
            {
              if (Mutation) {
                var called = 0;
                var observer = new Mutation(nextTick);
                var element = global2.document.createTextNode("");
                observer.observe(element, {
                  characterData: true
                });
                scheduleDrain = function() {
                  element.data = called = ++called % 2;
                };
              } else if (!global2.setImmediate && typeof global2.MessageChannel !== "undefined") {
                var channel = new global2.MessageChannel();
                channel.port1.onmessage = nextTick;
                scheduleDrain = function() {
                  channel.port2.postMessage(0);
                };
              } else if ("document" in global2 && "onreadystatechange" in global2.document.createElement("script")) {
                scheduleDrain = function() {
                  var scriptEl = global2.document.createElement("script");
                  scriptEl.onreadystatechange = function() {
                    nextTick();
                    scriptEl.onreadystatechange = null;
                    scriptEl.parentNode.removeChild(scriptEl);
                    scriptEl = null;
                  };
                  global2.document.documentElement.appendChild(scriptEl);
                };
              } else {
                scheduleDrain = function() {
                  setTimeout(nextTick, 0);
                };
              }
            }
            var draining;
            var queue = [];
            function nextTick() {
              draining = true;
              var i, oldQueue;
              var len = queue.length;
              while (len) {
                oldQueue = queue;
                queue = [];
                i = -1;
                while (++i < len) {
                  oldQueue[i]();
                }
                len = queue.length;
              }
              draining = false;
            }
            module3.exports = immediate;
            function immediate(task) {
              if (queue.push(task) === 1 && !draining) {
                scheduleDrain();
              }
            }
          }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {}], 2: [function(_dereq_, module3, exports3) {
          "use strict";
          var immediate = _dereq_(1);
          function INTERNAL() {
          }
          var handlers = {};
          var REJECTED = ["REJECTED"];
          var FULFILLED = ["FULFILLED"];
          var PENDING = ["PENDING"];
          module3.exports = Promise2;
          function Promise2(resolver) {
            if (typeof resolver !== "function") {
              throw new TypeError("resolver must be a function");
            }
            this.state = PENDING;
            this.queue = [];
            this.outcome = void 0;
            if (resolver !== INTERNAL) {
              safelyResolveThenable(this, resolver);
            }
          }
          Promise2.prototype["catch"] = function(onRejected) {
            return this.then(null, onRejected);
          };
          Promise2.prototype.then = function(onFulfilled, onRejected) {
            if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) {
              return this;
            }
            var promise = new this.constructor(INTERNAL);
            if (this.state !== PENDING) {
              var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
              unwrap(promise, resolver, this.outcome);
            } else {
              this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
            }
            return promise;
          };
          function QueueItem(promise, onFulfilled, onRejected) {
            this.promise = promise;
            if (typeof onFulfilled === "function") {
              this.onFulfilled = onFulfilled;
              this.callFulfilled = this.otherCallFulfilled;
            }
            if (typeof onRejected === "function") {
              this.onRejected = onRejected;
              this.callRejected = this.otherCallRejected;
            }
          }
          QueueItem.prototype.callFulfilled = function(value) {
            handlers.resolve(this.promise, value);
          };
          QueueItem.prototype.otherCallFulfilled = function(value) {
            unwrap(this.promise, this.onFulfilled, value);
          };
          QueueItem.prototype.callRejected = function(value) {
            handlers.reject(this.promise, value);
          };
          QueueItem.prototype.otherCallRejected = function(value) {
            unwrap(this.promise, this.onRejected, value);
          };
          function unwrap(promise, func, value) {
            immediate(function() {
              var returnValue;
              try {
                returnValue = func(value);
              } catch (e) {
                return handlers.reject(promise, e);
              }
              if (returnValue === promise) {
                handlers.reject(promise, new TypeError("Cannot resolve promise with itself"));
              } else {
                handlers.resolve(promise, returnValue);
              }
            });
          }
          handlers.resolve = function(self2, value) {
            var result = tryCatch(getThen, value);
            if (result.status === "error") {
              return handlers.reject(self2, result.value);
            }
            var thenable = result.value;
            if (thenable) {
              safelyResolveThenable(self2, thenable);
            } else {
              self2.state = FULFILLED;
              self2.outcome = value;
              var i = -1;
              var len = self2.queue.length;
              while (++i < len) {
                self2.queue[i].callFulfilled(value);
              }
            }
            return self2;
          };
          handlers.reject = function(self2, error) {
            self2.state = REJECTED;
            self2.outcome = error;
            var i = -1;
            var len = self2.queue.length;
            while (++i < len) {
              self2.queue[i].callRejected(error);
            }
            return self2;
          };
          function getThen(obj) {
            var then = obj && obj.then;
            if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") {
              return function appyThen() {
                then.apply(obj, arguments);
              };
            }
          }
          function safelyResolveThenable(self2, thenable) {
            var called = false;
            function onError(value) {
              if (called) {
                return;
              }
              called = true;
              handlers.reject(self2, value);
            }
            function onSuccess(value) {
              if (called) {
                return;
              }
              called = true;
              handlers.resolve(self2, value);
            }
            function tryToUnwrap() {
              thenable(onSuccess, onError);
            }
            var result = tryCatch(tryToUnwrap);
            if (result.status === "error") {
              onError(result.value);
            }
          }
          function tryCatch(func, value) {
            var out = {};
            try {
              out.value = func(value);
              out.status = "success";
            } catch (e) {
              out.status = "error";
              out.value = e;
            }
            return out;
          }
          Promise2.resolve = resolve;
          function resolve(value) {
            if (value instanceof this) {
              return value;
            }
            return handlers.resolve(new this(INTERNAL), value);
          }
          Promise2.reject = reject;
          function reject(reason) {
            var promise = new this(INTERNAL);
            return handlers.reject(promise, reason);
          }
          Promise2.all = all;
          function all(iterable) {
            var self2 = this;
            if (Object.prototype.toString.call(iterable) !== "[object Array]") {
              return this.reject(new TypeError("must be an array"));
            }
            var len = iterable.length;
            var called = false;
            if (!len) {
              return this.resolve([]);
            }
            var values = new Array(len);
            var resolved = 0;
            var i = -1;
            var promise = new this(INTERNAL);
            while (++i < len) {
              allResolver(iterable[i], i);
            }
            return promise;
            function allResolver(value, i2) {
              self2.resolve(value).then(resolveFromAll, function(error) {
                if (!called) {
                  called = true;
                  handlers.reject(promise, error);
                }
              });
              function resolveFromAll(outValue) {
                values[i2] = outValue;
                if (++resolved === len && !called) {
                  called = true;
                  handlers.resolve(promise, values);
                }
              }
            }
          }
          Promise2.race = race;
          function race(iterable) {
            var self2 = this;
            if (Object.prototype.toString.call(iterable) !== "[object Array]") {
              return this.reject(new TypeError("must be an array"));
            }
            var len = iterable.length;
            var called = false;
            if (!len) {
              return this.resolve([]);
            }
            var i = -1;
            var promise = new this(INTERNAL);
            while (++i < len) {
              resolver(iterable[i]);
            }
            return promise;
            function resolver(value) {
              self2.resolve(value).then(function(response) {
                if (!called) {
                  called = true;
                  handlers.resolve(promise, response);
                }
              }, function(error) {
                if (!called) {
                  called = true;
                  handlers.reject(promise, error);
                }
              });
            }
          }
        }, { "1": 1 }], 3: [function(_dereq_, module3, exports3) {
          (function(global2) {
            "use strict";
            if (typeof global2.Promise !== "function") {
              global2.Promise = _dereq_(2);
            }
          }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, { "2": 2 }], 4: [function(_dereq_, module3, exports3) {
          "use strict";
          var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
          } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function getIDB() {
            try {
              if (typeof indexedDB !== "undefined") {
                return indexedDB;
              }
              if (typeof webkitIndexedDB !== "undefined") {
                return webkitIndexedDB;
              }
              if (typeof mozIndexedDB !== "undefined") {
                return mozIndexedDB;
              }
              if (typeof OIndexedDB !== "undefined") {
                return OIndexedDB;
              }
              if (typeof msIndexedDB !== "undefined") {
                return msIndexedDB;
              }
            } catch (e) {
              return;
            }
          }
          var idb = getIDB();
          function isIndexedDBValid() {
            try {
              if (!idb || !idb.open) {
                return false;
              }
              var isSafari = typeof openDatabase !== "undefined" && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);
              var hasFetch = typeof fetch === "function" && fetch.toString().indexOf("[native code") !== -1;
              return (!isSafari || hasFetch) && typeof indexedDB !== "undefined" && // some outdated implementations of IDB that appear on Samsung
              // and HTC Android devices <4.4 are missing IDBKeyRange
              // See: https://github.com/mozilla/localForage/issues/128
              // See: https://github.com/mozilla/localForage/issues/272
              typeof IDBKeyRange !== "undefined";
            } catch (e) {
              return false;
            }
          }
          function createBlob(parts, properties) {
            parts = parts || [];
            properties = properties || {};
            try {
              return new Blob(parts, properties);
            } catch (e) {
              if (e.name !== "TypeError") {
                throw e;
              }
              var Builder = typeof BlobBuilder !== "undefined" ? BlobBuilder : typeof MSBlobBuilder !== "undefined" ? MSBlobBuilder : typeof MozBlobBuilder !== "undefined" ? MozBlobBuilder : WebKitBlobBuilder;
              var builder = new Builder();
              for (var i = 0; i < parts.length; i += 1) {
                builder.append(parts[i]);
              }
              return builder.getBlob(properties.type);
            }
          }
          if (typeof Promise === "undefined") {
            _dereq_(3);
          }
          var Promise$1 = Promise;
          function executeCallback(promise, callback) {
            if (callback) {
              promise.then(function(result) {
                callback(null, result);
              }, function(error) {
                callback(error);
              });
            }
          }
          function executeTwoCallbacks(promise, callback, errorCallback) {
            if (typeof callback === "function") {
              promise.then(callback);
            }
            if (typeof errorCallback === "function") {
              promise["catch"](errorCallback);
            }
          }
          function normalizeKey(key2) {
            if (typeof key2 !== "string") {
              console.warn(key2 + " used as a key, but it is not a string.");
              key2 = String(key2);
            }
            return key2;
          }
          function getCallback() {
            if (arguments.length && typeof arguments[arguments.length - 1] === "function") {
              return arguments[arguments.length - 1];
            }
          }
          var DETECT_BLOB_SUPPORT_STORE = "local-forage-detect-blob-support";
          var supportsBlobs = void 0;
          var dbContexts = {};
          var toString = Object.prototype.toString;
          var READ_ONLY = "readonly";
          var READ_WRITE = "readwrite";
          function _binStringToArrayBuffer(bin) {
            var length2 = bin.length;
            var buf = new ArrayBuffer(length2);
            var arr = new Uint8Array(buf);
            for (var i = 0; i < length2; i++) {
              arr[i] = bin.charCodeAt(i);
            }
            return buf;
          }
          function _checkBlobSupportWithoutCaching(idb2) {
            return new Promise$1(function(resolve) {
              var txn = idb2.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
              var blob = createBlob([""]);
              txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, "key");
              txn.onabort = function(e) {
                e.preventDefault();
                e.stopPropagation();
                resolve(false);
              };
              txn.oncomplete = function() {
                var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
                var matchedEdge = navigator.userAgent.match(/Edge\//);
                resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
              };
            })["catch"](function() {
              return false;
            });
          }
          function _checkBlobSupport(idb2) {
            if (typeof supportsBlobs === "boolean") {
              return Promise$1.resolve(supportsBlobs);
            }
            return _checkBlobSupportWithoutCaching(idb2).then(function(value) {
              supportsBlobs = value;
              return supportsBlobs;
            });
          }
          function _deferReadiness(dbInfo) {
            var dbContext = dbContexts[dbInfo.name];
            var deferredOperation = {};
            deferredOperation.promise = new Promise$1(function(resolve, reject) {
              deferredOperation.resolve = resolve;
              deferredOperation.reject = reject;
            });
            dbContext.deferredOperations.push(deferredOperation);
            if (!dbContext.dbReady) {
              dbContext.dbReady = deferredOperation.promise;
            } else {
              dbContext.dbReady = dbContext.dbReady.then(function() {
                return deferredOperation.promise;
              });
            }
          }
          function _advanceReadiness(dbInfo) {
            var dbContext = dbContexts[dbInfo.name];
            var deferredOperation = dbContext.deferredOperations.pop();
            if (deferredOperation) {
              deferredOperation.resolve();
              return deferredOperation.promise;
            }
          }
          function _rejectReadiness(dbInfo, err) {
            var dbContext = dbContexts[dbInfo.name];
            var deferredOperation = dbContext.deferredOperations.pop();
            if (deferredOperation) {
              deferredOperation.reject(err);
              return deferredOperation.promise;
            }
          }
          function _getConnection(dbInfo, upgradeNeeded) {
            return new Promise$1(function(resolve, reject) {
              dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();
              if (dbInfo.db) {
                if (upgradeNeeded) {
                  _deferReadiness(dbInfo);
                  dbInfo.db.close();
                } else {
                  return resolve(dbInfo.db);
                }
              }
              var dbArgs = [dbInfo.name];
              if (upgradeNeeded) {
                dbArgs.push(dbInfo.version);
              }
              var openreq = idb.open.apply(idb, dbArgs);
              if (upgradeNeeded) {
                openreq.onupgradeneeded = function(e) {
                  var db = openreq.result;
                  try {
                    db.createObjectStore(dbInfo.storeName);
                    if (e.oldVersion <= 1) {
                      db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                    }
                  } catch (ex) {
                    if (ex.name === "ConstraintError") {
                      console.warn('The database "' + dbInfo.name + '" has been upgraded from version ' + e.oldVersion + " to version " + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                    } else {
                      throw ex;
                    }
                  }
                };
              }
              openreq.onerror = function(e) {
                e.preventDefault();
                reject(openreq.error);
              };
              openreq.onsuccess = function() {
                var db = openreq.result;
                db.onversionchange = function(e) {
                  e.target.close();
                };
                resolve(db);
                _advanceReadiness(dbInfo);
              };
            });
          }
          function _getOriginalConnection(dbInfo) {
            return _getConnection(dbInfo, false);
          }
          function _getUpgradedConnection(dbInfo) {
            return _getConnection(dbInfo, true);
          }
          function _isUpgradeNeeded(dbInfo, defaultVersion) {
            if (!dbInfo.db) {
              return true;
            }
            var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
            var isDowngrade = dbInfo.version < dbInfo.db.version;
            var isUpgrade = dbInfo.version > dbInfo.db.version;
            if (isDowngrade) {
              if (dbInfo.version !== defaultVersion) {
                console.warn('The database "' + dbInfo.name + `" can't be downgraded from version ` + dbInfo.db.version + " to version " + dbInfo.version + ".");
              }
              dbInfo.version = dbInfo.db.version;
            }
            if (isUpgrade || isNewStore) {
              if (isNewStore) {
                var incVersion = dbInfo.db.version + 1;
                if (incVersion > dbInfo.version) {
                  dbInfo.version = incVersion;
                }
              }
              return true;
            }
            return false;
          }
          function _encodeBlob(blob) {
            return new Promise$1(function(resolve, reject) {
              var reader = new FileReader();
              reader.onerror = reject;
              reader.onloadend = function(e) {
                var base64 = btoa(e.target.result || "");
                resolve({
                  __local_forage_encoded_blob: true,
                  data: base64,
                  type: blob.type
                });
              };
              reader.readAsBinaryString(blob);
            });
          }
          function _decodeBlob(encodedBlob) {
            var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
            return createBlob([arrayBuff], { type: encodedBlob.type });
          }
          function _isEncodedBlob(value) {
            return value && value.__local_forage_encoded_blob;
          }
          function _fullyReady(callback) {
            var self2 = this;
            var promise = self2._initReady().then(function() {
              var dbContext = dbContexts[self2._dbInfo.name];
              if (dbContext && dbContext.dbReady) {
                return dbContext.dbReady;
              }
            });
            executeTwoCallbacks(promise, callback, callback);
            return promise;
          }
          function _tryReconnect(dbInfo) {
            _deferReadiness(dbInfo);
            var dbContext = dbContexts[dbInfo.name];
            var forages = dbContext.forages;
            for (var i = 0; i < forages.length; i++) {
              var forage = forages[i];
              if (forage._dbInfo.db) {
                forage._dbInfo.db.close();
                forage._dbInfo.db = null;
              }
            }
            dbInfo.db = null;
            return _getOriginalConnection(dbInfo).then(function(db) {
              dbInfo.db = db;
              if (_isUpgradeNeeded(dbInfo)) {
                return _getUpgradedConnection(dbInfo);
              }
              return db;
            }).then(function(db) {
              dbInfo.db = dbContext.db = db;
              for (var i2 = 0; i2 < forages.length; i2++) {
                forages[i2]._dbInfo.db = db;
              }
            })["catch"](function(err) {
              _rejectReadiness(dbInfo, err);
              throw err;
            });
          }
          function createTransaction(dbInfo, mode, callback, retries) {
            if (retries === void 0) {
              retries = 1;
            }
            try {
              var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
              callback(null, tx);
            } catch (err) {
              if (retries > 0 && (!dbInfo.db || err.name === "InvalidStateError" || err.name === "NotFoundError")) {
                return Promise$1.resolve().then(function() {
                  if (!dbInfo.db || err.name === "NotFoundError" && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                    if (dbInfo.db) {
                      dbInfo.version = dbInfo.db.version + 1;
                    }
                    return _getUpgradedConnection(dbInfo);
                  }
                }).then(function() {
                  return _tryReconnect(dbInfo).then(function() {
                    createTransaction(dbInfo, mode, callback, retries - 1);
                  });
                })["catch"](callback);
              }
              callback(err);
            }
          }
          function createDbContext() {
            return {
              // Running localForages sharing a database.
              forages: [],
              // Shared database.
              db: null,
              // Database readiness (promise).
              dbReady: null,
              // Deferred operations on the database.
              deferredOperations: []
            };
          }
          function _initStorage(options) {
            var self2 = this;
            var dbInfo = {
              db: null
            };
            if (options) {
              for (var i in options) {
                dbInfo[i] = options[i];
              }
            }
            var dbContext = dbContexts[dbInfo.name];
            if (!dbContext) {
              dbContext = createDbContext();
              dbContexts[dbInfo.name] = dbContext;
            }
            dbContext.forages.push(self2);
            if (!self2._initReady) {
              self2._initReady = self2.ready;
              self2.ready = _fullyReady;
            }
            var initPromises = [];
            function ignoreErrors() {
              return Promise$1.resolve();
            }
            for (var j = 0; j < dbContext.forages.length; j++) {
              var forage = dbContext.forages[j];
              if (forage !== self2) {
                initPromises.push(forage._initReady()["catch"](ignoreErrors));
              }
            }
            var forages = dbContext.forages.slice(0);
            return Promise$1.all(initPromises).then(function() {
              dbInfo.db = dbContext.db;
              return _getOriginalConnection(dbInfo);
            }).then(function(db) {
              dbInfo.db = db;
              if (_isUpgradeNeeded(dbInfo, self2._defaultConfig.version)) {
                return _getUpgradedConnection(dbInfo);
              }
              return db;
            }).then(function(db) {
              dbInfo.db = dbContext.db = db;
              self2._dbInfo = dbInfo;
              for (var k = 0; k < forages.length; k++) {
                var forage2 = forages[k];
                if (forage2 !== self2) {
                  forage2._dbInfo.db = dbInfo.db;
                  forage2._dbInfo.version = dbInfo.version;
                }
              }
            });
          }
          function getItem(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.get(key2);
                    req.onsuccess = function() {
                      var value = req.result;
                      if (value === void 0) {
                        value = null;
                      }
                      if (_isEncodedBlob(value)) {
                        value = _decodeBlob(value);
                      }
                      resolve(value);
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function iterate(iterator, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.openCursor();
                    var iterationNumber = 1;
                    req.onsuccess = function() {
                      var cursor = req.result;
                      if (cursor) {
                        var value = cursor.value;
                        if (_isEncodedBlob(value)) {
                          value = _decodeBlob(value);
                        }
                        var result = iterator(value, cursor.key, iterationNumber++);
                        if (result !== void 0) {
                          resolve(result);
                        } else {
                          cursor["continue"]();
                        }
                      } else {
                        resolve();
                      }
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function setItem(key2, value, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              var dbInfo;
              self2.ready().then(function() {
                dbInfo = self2._dbInfo;
                if (toString.call(value) === "[object Blob]") {
                  return _checkBlobSupport(dbInfo.db).then(function(blobSupport) {
                    if (blobSupport) {
                      return value;
                    }
                    return _encodeBlob(value);
                  });
                }
                return value;
              }).then(function(value2) {
                createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    if (value2 === null) {
                      value2 = void 0;
                    }
                    var req = store.put(value2, key2);
                    transaction.oncomplete = function() {
                      if (value2 === void 0) {
                        value2 = null;
                      }
                      resolve(value2);
                    };
                    transaction.onabort = transaction.onerror = function() {
                      var err2 = req.error ? req.error : req.transaction.error;
                      reject(err2);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function removeItem(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store["delete"](key2);
                    transaction.oncomplete = function() {
                      resolve();
                    };
                    transaction.onerror = function() {
                      reject(req.error);
                    };
                    transaction.onabort = function() {
                      var err2 = req.error ? req.error : req.transaction.error;
                      reject(err2);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function clear(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.clear();
                    transaction.oncomplete = function() {
                      resolve();
                    };
                    transaction.onabort = transaction.onerror = function() {
                      var err2 = req.error ? req.error : req.transaction.error;
                      reject(err2);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function length(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.count();
                    req.onsuccess = function() {
                      resolve(req.result);
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function key(n, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              if (n < 0) {
                resolve(null);
                return;
              }
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var advanced = false;
                    var req = store.openKeyCursor();
                    req.onsuccess = function() {
                      var cursor = req.result;
                      if (!cursor) {
                        resolve(null);
                        return;
                      }
                      if (n === 0) {
                        resolve(cursor.key);
                      } else {
                        if (!advanced) {
                          advanced = true;
                          cursor.advance(n);
                        } else {
                          resolve(cursor.key);
                        }
                      }
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function keys(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                  if (err) {
                    return reject(err);
                  }
                  try {
                    var store = transaction.objectStore(self2._dbInfo.storeName);
                    var req = store.openKeyCursor();
                    var keys2 = [];
                    req.onsuccess = function() {
                      var cursor = req.result;
                      if (!cursor) {
                        resolve(keys2);
                        return;
                      }
                      keys2.push(cursor.key);
                      cursor["continue"]();
                    };
                    req.onerror = function() {
                      reject(req.error);
                    };
                  } catch (e) {
                    reject(e);
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function dropInstance(options, callback) {
            callback = getCallback.apply(this, arguments);
            var currentConfig = this.config();
            options = typeof options !== "function" && options || {};
            if (!options.name) {
              options.name = options.name || currentConfig.name;
              options.storeName = options.storeName || currentConfig.storeName;
            }
            var self2 = this;
            var promise;
            if (!options.name) {
              promise = Promise$1.reject("Invalid arguments");
            } else {
              var isCurrentDb = options.name === currentConfig.name && self2._dbInfo.db;
              var dbPromise = isCurrentDb ? Promise$1.resolve(self2._dbInfo.db) : _getOriginalConnection(options).then(function(db) {
                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;
                dbContext.db = db;
                for (var i = 0; i < forages.length; i++) {
                  forages[i]._dbInfo.db = db;
                }
                return db;
              });
              if (!options.storeName) {
                promise = dbPromise.then(function(db) {
                  _deferReadiness(options);
                  var dbContext = dbContexts[options.name];
                  var forages = dbContext.forages;
                  db.close();
                  for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                  }
                  var dropDBPromise = new Promise$1(function(resolve, reject) {
                    var req = idb.deleteDatabase(options.name);
                    req.onerror = function() {
                      var db2 = req.result;
                      if (db2) {
                        db2.close();
                      }
                      reject(req.error);
                    };
                    req.onblocked = function() {
                      console.warn('dropInstance blocked for database "' + options.name + '" until all open connections are closed');
                    };
                    req.onsuccess = function() {
                      var db2 = req.result;
                      if (db2) {
                        db2.close();
                      }
                      resolve(db2);
                    };
                  });
                  return dropDBPromise.then(function(db2) {
                    dbContext.db = db2;
                    for (var i2 = 0; i2 < forages.length; i2++) {
                      var _forage = forages[i2];
                      _advanceReadiness(_forage._dbInfo);
                    }
                  })["catch"](function(err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function() {
                    });
                    throw err;
                  });
                });
              } else {
                promise = dbPromise.then(function(db) {
                  if (!db.objectStoreNames.contains(options.storeName)) {
                    return;
                  }
                  var newVersion = db.version + 1;
                  _deferReadiness(options);
                  var dbContext = dbContexts[options.name];
                  var forages = dbContext.forages;
                  db.close();
                  for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                    forage._dbInfo.version = newVersion;
                  }
                  var dropObjectPromise = new Promise$1(function(resolve, reject) {
                    var req = idb.open(options.name, newVersion);
                    req.onerror = function(err) {
                      var db2 = req.result;
                      db2.close();
                      reject(err);
                    };
                    req.onupgradeneeded = function() {
                      var db2 = req.result;
                      db2.deleteObjectStore(options.storeName);
                    };
                    req.onsuccess = function() {
                      var db2 = req.result;
                      db2.close();
                      resolve(db2);
                    };
                  });
                  return dropObjectPromise.then(function(db2) {
                    dbContext.db = db2;
                    for (var j = 0; j < forages.length; j++) {
                      var _forage2 = forages[j];
                      _forage2._dbInfo.db = db2;
                      _advanceReadiness(_forage2._dbInfo);
                    }
                  })["catch"](function(err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function() {
                    });
                    throw err;
                  });
                });
              }
            }
            executeCallback(promise, callback);
            return promise;
          }
          var asyncStorage = {
            _driver: "asyncStorage",
            _initStorage,
            _support: isIndexedDBValid(),
            iterate,
            getItem,
            setItem,
            removeItem,
            clear,
            length,
            key,
            keys,
            dropInstance
          };
          function isWebSQLValid() {
            return typeof openDatabase === "function";
          }
          var BASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          var BLOB_TYPE_PREFIX = "~~local_forage_type~";
          var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;
          var SERIALIZED_MARKER = "__lfsc__:";
          var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;
          var TYPE_ARRAYBUFFER = "arbf";
          var TYPE_BLOB = "blob";
          var TYPE_INT8ARRAY = "si08";
          var TYPE_UINT8ARRAY = "ui08";
          var TYPE_UINT8CLAMPEDARRAY = "uic8";
          var TYPE_INT16ARRAY = "si16";
          var TYPE_INT32ARRAY = "si32";
          var TYPE_UINT16ARRAY = "ur16";
          var TYPE_UINT32ARRAY = "ui32";
          var TYPE_FLOAT32ARRAY = "fl32";
          var TYPE_FLOAT64ARRAY = "fl64";
          var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;
          var toString$1 = Object.prototype.toString;
          function stringToBuffer(serializedString) {
            var bufferLength = serializedString.length * 0.75;
            var len = serializedString.length;
            var i;
            var p = 0;
            var encoded1, encoded2, encoded3, encoded4;
            if (serializedString[serializedString.length - 1] === "=") {
              bufferLength--;
              if (serializedString[serializedString.length - 2] === "=") {
                bufferLength--;
              }
            }
            var buffer = new ArrayBuffer(bufferLength);
            var bytes = new Uint8Array(buffer);
            for (i = 0; i < len; i += 4) {
              encoded1 = BASE_CHARS.indexOf(serializedString[i]);
              encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
              encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
              encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);
              bytes[p++] = encoded1 << 2 | encoded2 >> 4;
              bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
              bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
            }
            return buffer;
          }
          function bufferToString(buffer) {
            var bytes = new Uint8Array(buffer);
            var base64String = "";
            var i;
            for (i = 0; i < bytes.length; i += 3) {
              base64String += BASE_CHARS[bytes[i] >> 2];
              base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
              base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
              base64String += BASE_CHARS[bytes[i + 2] & 63];
            }
            if (bytes.length % 3 === 2) {
              base64String = base64String.substring(0, base64String.length - 1) + "=";
            } else if (bytes.length % 3 === 1) {
              base64String = base64String.substring(0, base64String.length - 2) + "==";
            }
            return base64String;
          }
          function serialize(value, callback) {
            var valueType = "";
            if (value) {
              valueType = toString$1.call(value);
            }
            if (value && (valueType === "[object ArrayBuffer]" || value.buffer && toString$1.call(value.buffer) === "[object ArrayBuffer]")) {
              var buffer;
              var marker = SERIALIZED_MARKER;
              if (value instanceof ArrayBuffer) {
                buffer = value;
                marker += TYPE_ARRAYBUFFER;
              } else {
                buffer = value.buffer;
                if (valueType === "[object Int8Array]") {
                  marker += TYPE_INT8ARRAY;
                } else if (valueType === "[object Uint8Array]") {
                  marker += TYPE_UINT8ARRAY;
                } else if (valueType === "[object Uint8ClampedArray]") {
                  marker += TYPE_UINT8CLAMPEDARRAY;
                } else if (valueType === "[object Int16Array]") {
                  marker += TYPE_INT16ARRAY;
                } else if (valueType === "[object Uint16Array]") {
                  marker += TYPE_UINT16ARRAY;
                } else if (valueType === "[object Int32Array]") {
                  marker += TYPE_INT32ARRAY;
                } else if (valueType === "[object Uint32Array]") {
                  marker += TYPE_UINT32ARRAY;
                } else if (valueType === "[object Float32Array]") {
                  marker += TYPE_FLOAT32ARRAY;
                } else if (valueType === "[object Float64Array]") {
                  marker += TYPE_FLOAT64ARRAY;
                } else {
                  callback(new Error("Failed to get type for BinaryArray"));
                }
              }
              callback(marker + bufferToString(buffer));
            } else if (valueType === "[object Blob]") {
              var fileReader = new FileReader();
              fileReader.onload = function() {
                var str = BLOB_TYPE_PREFIX + value.type + "~" + bufferToString(this.result);
                callback(SERIALIZED_MARKER + TYPE_BLOB + str);
              };
              fileReader.readAsArrayBuffer(value);
            } else {
              try {
                callback(JSON.stringify(value));
              } catch (e) {
                console.error("Couldn't convert value into a JSON string: ", value);
                callback(null, e);
              }
            }
          }
          function deserialize(value) {
            if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
              return JSON.parse(value);
            }
            var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
            var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
            var blobType;
            if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
              var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
              blobType = matcher[1];
              serializedString = serializedString.substring(matcher[0].length);
            }
            var buffer = stringToBuffer(serializedString);
            switch (type) {
              case TYPE_ARRAYBUFFER:
                return buffer;
              case TYPE_BLOB:
                return createBlob([buffer], { type: blobType });
              case TYPE_INT8ARRAY:
                return new Int8Array(buffer);
              case TYPE_UINT8ARRAY:
                return new Uint8Array(buffer);
              case TYPE_UINT8CLAMPEDARRAY:
                return new Uint8ClampedArray(buffer);
              case TYPE_INT16ARRAY:
                return new Int16Array(buffer);
              case TYPE_UINT16ARRAY:
                return new Uint16Array(buffer);
              case TYPE_INT32ARRAY:
                return new Int32Array(buffer);
              case TYPE_UINT32ARRAY:
                return new Uint32Array(buffer);
              case TYPE_FLOAT32ARRAY:
                return new Float32Array(buffer);
              case TYPE_FLOAT64ARRAY:
                return new Float64Array(buffer);
              default:
                throw new Error("Unkown type: " + type);
            }
          }
          var localforageSerializer = {
            serialize,
            deserialize,
            stringToBuffer,
            bufferToString
          };
          function createDbTable(t, dbInfo, callback, errorCallback) {
            t.executeSql("CREATE TABLE IF NOT EXISTS " + dbInfo.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], callback, errorCallback);
          }
          function _initStorage$1(options) {
            var self2 = this;
            var dbInfo = {
              db: null
            };
            if (options) {
              for (var i in options) {
                dbInfo[i] = typeof options[i] !== "string" ? options[i].toString() : options[i];
              }
            }
            var dbInfoPromise = new Promise$1(function(resolve, reject) {
              try {
                dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
              } catch (e) {
                return reject(e);
              }
              dbInfo.db.transaction(function(t) {
                createDbTable(t, dbInfo, function() {
                  self2._dbInfo = dbInfo;
                  resolve();
                }, function(t2, error) {
                  reject(error);
                });
              }, reject);
            });
            dbInfo.serializer = localforageSerializer;
            return dbInfoPromise;
          }
          function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
            t.executeSql(sqlStatement, args, callback, function(t2, error) {
              if (error.code === error.SYNTAX_ERR) {
                t2.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [dbInfo.storeName], function(t3, results) {
                  if (!results.rows.length) {
                    createDbTable(t3, dbInfo, function() {
                      t3.executeSql(sqlStatement, args, callback, errorCallback);
                    }, errorCallback);
                  } else {
                    errorCallback(t3, error);
                  }
                }, errorCallback);
              } else {
                errorCallback(t2, error);
              }
            }, errorCallback);
          }
          function getItem$1(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName + " WHERE key = ? LIMIT 1", [key2], function(t2, results) {
                    var result = results.rows.length ? results.rows.item(0).value : null;
                    if (result) {
                      result = dbInfo.serializer.deserialize(result);
                    }
                    resolve(result);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function iterate$1(iterator, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName, [], function(t2, results) {
                    var rows = results.rows;
                    var length2 = rows.length;
                    for (var i = 0; i < length2; i++) {
                      var item = rows.item(i);
                      var result = item.value;
                      if (result) {
                        result = dbInfo.serializer.deserialize(result);
                      }
                      result = iterator(result, item.key, i + 1);
                      if (result !== void 0) {
                        resolve(result);
                        return;
                      }
                    }
                    resolve();
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function _setItem(key2, value, callback, retriesLeft) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                if (value === void 0) {
                  value = null;
                }
                var originalValue = value;
                var dbInfo = self2._dbInfo;
                dbInfo.serializer.serialize(value, function(value2, error) {
                  if (error) {
                    reject(error);
                  } else {
                    dbInfo.db.transaction(function(t) {
                      tryExecuteSql(t, dbInfo, "INSERT OR REPLACE INTO " + dbInfo.storeName + " (key, value) VALUES (?, ?)", [key2, value2], function() {
                        resolve(originalValue);
                      }, function(t2, error2) {
                        reject(error2);
                      });
                    }, function(sqlError) {
                      if (sqlError.code === sqlError.QUOTA_ERR) {
                        if (retriesLeft > 0) {
                          resolve(_setItem.apply(self2, [key2, originalValue, callback, retriesLeft - 1]));
                          return;
                        }
                        reject(sqlError);
                      }
                    });
                  }
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function setItem$1(key2, value, callback) {
            return _setItem.apply(this, [key2, value, callback, 1]);
          }
          function removeItem$1(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName + " WHERE key = ?", [key2], function() {
                    resolve();
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function clear$1(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName, [], function() {
                    resolve();
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function length$1(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT COUNT(key) as c FROM " + dbInfo.storeName, [], function(t2, results) {
                    var result = results.rows.item(0).c;
                    resolve(result);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function key$1(n, callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName + " WHERE id = ? LIMIT 1", [n + 1], function(t2, results) {
                    var result = results.rows.length ? results.rows.item(0).key : null;
                    resolve(result);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function keys$1(callback) {
            var self2 = this;
            var promise = new Promise$1(function(resolve, reject) {
              self2.ready().then(function() {
                var dbInfo = self2._dbInfo;
                dbInfo.db.transaction(function(t) {
                  tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName, [], function(t2, results) {
                    var keys2 = [];
                    for (var i = 0; i < results.rows.length; i++) {
                      keys2.push(results.rows.item(i).key);
                    }
                    resolve(keys2);
                  }, function(t2, error) {
                    reject(error);
                  });
                });
              })["catch"](reject);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function getAllStoreNames(db) {
            return new Promise$1(function(resolve, reject) {
              db.transaction(function(t) {
                t.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function(t2, results) {
                  var storeNames = [];
                  for (var i = 0; i < results.rows.length; i++) {
                    storeNames.push(results.rows.item(i).name);
                  }
                  resolve({
                    db,
                    storeNames
                  });
                }, function(t2, error) {
                  reject(error);
                });
              }, function(sqlError) {
                reject(sqlError);
              });
            });
          }
          function dropInstance$1(options, callback) {
            callback = getCallback.apply(this, arguments);
            var currentConfig = this.config();
            options = typeof options !== "function" && options || {};
            if (!options.name) {
              options.name = options.name || currentConfig.name;
              options.storeName = options.storeName || currentConfig.storeName;
            }
            var self2 = this;
            var promise;
            if (!options.name) {
              promise = Promise$1.reject("Invalid arguments");
            } else {
              promise = new Promise$1(function(resolve) {
                var db;
                if (options.name === currentConfig.name) {
                  db = self2._dbInfo.db;
                } else {
                  db = openDatabase(options.name, "", "", 0);
                }
                if (!options.storeName) {
                  resolve(getAllStoreNames(db));
                } else {
                  resolve({
                    db,
                    storeNames: [options.storeName]
                  });
                }
              }).then(function(operationInfo) {
                return new Promise$1(function(resolve, reject) {
                  operationInfo.db.transaction(function(t) {
                    function dropTable(storeName) {
                      return new Promise$1(function(resolve2, reject2) {
                        t.executeSql("DROP TABLE IF EXISTS " + storeName, [], function() {
                          resolve2();
                        }, function(t2, error) {
                          reject2(error);
                        });
                      });
                    }
                    var operations = [];
                    for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                      operations.push(dropTable(operationInfo.storeNames[i]));
                    }
                    Promise$1.all(operations).then(function() {
                      resolve();
                    })["catch"](function(e) {
                      reject(e);
                    });
                  }, function(sqlError) {
                    reject(sqlError);
                  });
                });
              });
            }
            executeCallback(promise, callback);
            return promise;
          }
          var webSQLStorage = {
            _driver: "webSQLStorage",
            _initStorage: _initStorage$1,
            _support: isWebSQLValid(),
            iterate: iterate$1,
            getItem: getItem$1,
            setItem: setItem$1,
            removeItem: removeItem$1,
            clear: clear$1,
            length: length$1,
            key: key$1,
            keys: keys$1,
            dropInstance: dropInstance$1
          };
          function isLocalStorageValid() {
            try {
              return typeof localStorage !== "undefined" && "setItem" in localStorage && // in IE8 typeof localStorage.setItem === 'object'
              !!localStorage.setItem;
            } catch (e) {
              return false;
            }
          }
          function _getKeyPrefix(options, defaultConfig) {
            var keyPrefix = options.name + "/";
            if (options.storeName !== defaultConfig.storeName) {
              keyPrefix += options.storeName + "/";
            }
            return keyPrefix;
          }
          function checkIfLocalStorageThrows() {
            var localStorageTestKey = "_localforage_support_test";
            try {
              localStorage.setItem(localStorageTestKey, true);
              localStorage.removeItem(localStorageTestKey);
              return false;
            } catch (e) {
              return true;
            }
          }
          function _isLocalStorageUsable() {
            return !checkIfLocalStorageThrows() || localStorage.length > 0;
          }
          function _initStorage$2(options) {
            var self2 = this;
            var dbInfo = {};
            if (options) {
              for (var i in options) {
                dbInfo[i] = options[i];
              }
            }
            dbInfo.keyPrefix = _getKeyPrefix(options, self2._defaultConfig);
            if (!_isLocalStorageUsable()) {
              return Promise$1.reject();
            }
            self2._dbInfo = dbInfo;
            dbInfo.serializer = localforageSerializer;
            return Promise$1.resolve();
          }
          function clear$2(callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var keyPrefix = self2._dbInfo.keyPrefix;
              for (var i = localStorage.length - 1; i >= 0; i--) {
                var key2 = localStorage.key(i);
                if (key2.indexOf(keyPrefix) === 0) {
                  localStorage.removeItem(key2);
                }
              }
            });
            executeCallback(promise, callback);
            return promise;
          }
          function getItem$2(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var result = localStorage.getItem(dbInfo.keyPrefix + key2);
              if (result) {
                result = dbInfo.serializer.deserialize(result);
              }
              return result;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function iterate$2(iterator, callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var keyPrefix = dbInfo.keyPrefix;
              var keyPrefixLength = keyPrefix.length;
              var length2 = localStorage.length;
              var iterationNumber = 1;
              for (var i = 0; i < length2; i++) {
                var key2 = localStorage.key(i);
                if (key2.indexOf(keyPrefix) !== 0) {
                  continue;
                }
                var value = localStorage.getItem(key2);
                if (value) {
                  value = dbInfo.serializer.deserialize(value);
                }
                value = iterator(value, key2.substring(keyPrefixLength), iterationNumber++);
                if (value !== void 0) {
                  return value;
                }
              }
            });
            executeCallback(promise, callback);
            return promise;
          }
          function key$2(n, callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var result;
              try {
                result = localStorage.key(n);
              } catch (error) {
                result = null;
              }
              if (result) {
                result = result.substring(dbInfo.keyPrefix.length);
              }
              return result;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function keys$2(callback) {
            var self2 = this;
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              var length2 = localStorage.length;
              var keys2 = [];
              for (var i = 0; i < length2; i++) {
                var itemKey = localStorage.key(i);
                if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                  keys2.push(itemKey.substring(dbInfo.keyPrefix.length));
                }
              }
              return keys2;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function length$2(callback) {
            var self2 = this;
            var promise = self2.keys().then(function(keys2) {
              return keys2.length;
            });
            executeCallback(promise, callback);
            return promise;
          }
          function removeItem$2(key2, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              localStorage.removeItem(dbInfo.keyPrefix + key2);
            });
            executeCallback(promise, callback);
            return promise;
          }
          function setItem$2(key2, value, callback) {
            var self2 = this;
            key2 = normalizeKey(key2);
            var promise = self2.ready().then(function() {
              if (value === void 0) {
                value = null;
              }
              var originalValue = value;
              return new Promise$1(function(resolve, reject) {
                var dbInfo = self2._dbInfo;
                dbInfo.serializer.serialize(value, function(value2, error) {
                  if (error) {
                    reject(error);
                  } else {
                    try {
                      localStorage.setItem(dbInfo.keyPrefix + key2, value2);
                      resolve(originalValue);
                    } catch (e) {
                      if (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
                        reject(e);
                      }
                      reject(e);
                    }
                  }
                });
              });
            });
            executeCallback(promise, callback);
            return promise;
          }
          function dropInstance$2(options, callback) {
            callback = getCallback.apply(this, arguments);
            options = typeof options !== "function" && options || {};
            if (!options.name) {
              var currentConfig = this.config();
              options.name = options.name || currentConfig.name;
              options.storeName = options.storeName || currentConfig.storeName;
            }
            var self2 = this;
            var promise;
            if (!options.name) {
              promise = Promise$1.reject("Invalid arguments");
            } else {
              promise = new Promise$1(function(resolve) {
                if (!options.storeName) {
                  resolve(options.name + "/");
                } else {
                  resolve(_getKeyPrefix(options, self2._defaultConfig));
                }
              }).then(function(keyPrefix) {
                for (var i = localStorage.length - 1; i >= 0; i--) {
                  var key2 = localStorage.key(i);
                  if (key2.indexOf(keyPrefix) === 0) {
                    localStorage.removeItem(key2);
                  }
                }
              });
            }
            executeCallback(promise, callback);
            return promise;
          }
          var localStorageWrapper = {
            _driver: "localStorageWrapper",
            _initStorage: _initStorage$2,
            _support: isLocalStorageValid(),
            iterate: iterate$2,
            getItem: getItem$2,
            setItem: setItem$2,
            removeItem: removeItem$2,
            clear: clear$2,
            length: length$2,
            key: key$2,
            keys: keys$2,
            dropInstance: dropInstance$2
          };
          var sameValue = function sameValue2(x, y) {
            return x === y || typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y);
          };
          var includes = function includes2(array, searchElement) {
            var len = array.length;
            var i = 0;
            while (i < len) {
              if (sameValue(array[i], searchElement)) {
                return true;
              }
              i++;
            }
            return false;
          };
          var isArray = Array.isArray || function(arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
          };
          var DefinedDrivers = {};
          var DriverSupport = {};
          var DefaultDrivers = {
            INDEXEDDB: asyncStorage,
            WEBSQL: webSQLStorage,
            LOCALSTORAGE: localStorageWrapper
          };
          var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];
          var OptionalDriverMethods = ["dropInstance"];
          var LibraryMethods = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"].concat(OptionalDriverMethods);
          var DefaultConfig = {
            description: "",
            driver: DefaultDriverOrder.slice(),
            name: "localforage",
            // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
            // we can use without a prompt.
            size: 4980736,
            storeName: "keyvaluepairs",
            version: 1
          };
          function callWhenReady(localForageInstance, libraryMethod) {
            localForageInstance[libraryMethod] = function() {
              var _args = arguments;
              return localForageInstance.ready().then(function() {
                return localForageInstance[libraryMethod].apply(localForageInstance, _args);
              });
            };
          }
          function extend() {
            for (var i = 1; i < arguments.length; i++) {
              var arg = arguments[i];
              if (arg) {
                for (var _key in arg) {
                  if (arg.hasOwnProperty(_key)) {
                    if (isArray(arg[_key])) {
                      arguments[0][_key] = arg[_key].slice();
                    } else {
                      arguments[0][_key] = arg[_key];
                    }
                  }
                }
              }
            }
            return arguments[0];
          }
          var LocalForage = function() {
            function LocalForage2(options) {
              _classCallCheck(this, LocalForage2);
              for (var driverTypeKey in DefaultDrivers) {
                if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                  var driver = DefaultDrivers[driverTypeKey];
                  var driverName = driver._driver;
                  this[driverTypeKey] = driverName;
                  if (!DefinedDrivers[driverName]) {
                    this.defineDriver(driver);
                  }
                }
              }
              this._defaultConfig = extend({}, DefaultConfig);
              this._config = extend({}, this._defaultConfig, options);
              this._driverSet = null;
              this._initDriver = null;
              this._ready = false;
              this._dbInfo = null;
              this._wrapLibraryMethodsWithReady();
              this.setDriver(this._config.driver)["catch"](function() {
              });
            }
            LocalForage2.prototype.config = function config(options) {
              if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === "object") {
                if (this._ready) {
                  return new Error("Can't call config() after localforage has been used.");
                }
                for (var i in options) {
                  if (i === "storeName") {
                    options[i] = options[i].replace(/\W/g, "_");
                  }
                  if (i === "version" && typeof options[i] !== "number") {
                    return new Error("Database version must be a number.");
                  }
                  this._config[i] = options[i];
                }
                if ("driver" in options && options.driver) {
                  return this.setDriver(this._config.driver);
                }
                return true;
              } else if (typeof options === "string") {
                return this._config[options];
              } else {
                return this._config;
              }
            };
            LocalForage2.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
              var promise = new Promise$1(function(resolve, reject) {
                try {
                  var driverName = driverObject._driver;
                  var complianceError = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                  if (!driverObject._driver) {
                    reject(complianceError);
                    return;
                  }
                  var driverMethods = LibraryMethods.concat("_initStorage");
                  for (var i = 0, len = driverMethods.length; i < len; i++) {
                    var driverMethodName = driverMethods[i];
                    var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                    if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== "function") {
                      reject(complianceError);
                      return;
                    }
                  }
                  var configureMissingMethods = function configureMissingMethods2() {
                    var methodNotImplementedFactory = function methodNotImplementedFactory2(methodName) {
                      return function() {
                        var error = new Error("Method " + methodName + " is not implemented by the current driver");
                        var promise2 = Promise$1.reject(error);
                        executeCallback(promise2, arguments[arguments.length - 1]);
                        return promise2;
                      };
                    };
                    for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                      var optionalDriverMethod = OptionalDriverMethods[_i];
                      if (!driverObject[optionalDriverMethod]) {
                        driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                      }
                    }
                  };
                  configureMissingMethods();
                  var setDriverSupport = function setDriverSupport2(support) {
                    if (DefinedDrivers[driverName]) {
                      console.info("Redefining LocalForage driver: " + driverName);
                    }
                    DefinedDrivers[driverName] = driverObject;
                    DriverSupport[driverName] = support;
                    resolve();
                  };
                  if ("_support" in driverObject) {
                    if (driverObject._support && typeof driverObject._support === "function") {
                      driverObject._support().then(setDriverSupport, reject);
                    } else {
                      setDriverSupport(!!driverObject._support);
                    }
                  } else {
                    setDriverSupport(true);
                  }
                } catch (e) {
                  reject(e);
                }
              });
              executeTwoCallbacks(promise, callback, errorCallback);
              return promise;
            };
            LocalForage2.prototype.driver = function driver() {
              return this._driver || null;
            };
            LocalForage2.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
              var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error("Driver not found."));
              executeTwoCallbacks(getDriverPromise, callback, errorCallback);
              return getDriverPromise;
            };
            LocalForage2.prototype.getSerializer = function getSerializer(callback) {
              var serializerPromise = Promise$1.resolve(localforageSerializer);
              executeTwoCallbacks(serializerPromise, callback);
              return serializerPromise;
            };
            LocalForage2.prototype.ready = function ready(callback) {
              var self2 = this;
              var promise = self2._driverSet.then(function() {
                if (self2._ready === null) {
                  self2._ready = self2._initDriver();
                }
                return self2._ready;
              });
              executeTwoCallbacks(promise, callback, callback);
              return promise;
            };
            LocalForage2.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
              var self2 = this;
              if (!isArray(drivers)) {
                drivers = [drivers];
              }
              var supportedDrivers = this._getSupportedDrivers(drivers);
              function setDriverToConfig() {
                self2._config.driver = self2.driver();
              }
              function extendSelfWithDriver(driver) {
                self2._extend(driver);
                setDriverToConfig();
                self2._ready = self2._initStorage(self2._config);
                return self2._ready;
              }
              function initDriver(supportedDrivers2) {
                return function() {
                  var currentDriverIndex = 0;
                  function driverPromiseLoop() {
                    while (currentDriverIndex < supportedDrivers2.length) {
                      var driverName = supportedDrivers2[currentDriverIndex];
                      currentDriverIndex++;
                      self2._dbInfo = null;
                      self2._ready = null;
                      return self2.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                    }
                    setDriverToConfig();
                    var error = new Error("No available storage method found.");
                    self2._driverSet = Promise$1.reject(error);
                    return self2._driverSet;
                  }
                  return driverPromiseLoop();
                };
              }
              var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function() {
                return Promise$1.resolve();
              }) : Promise$1.resolve();
              this._driverSet = oldDriverSetDone.then(function() {
                var driverName = supportedDrivers[0];
                self2._dbInfo = null;
                self2._ready = null;
                return self2.getDriver(driverName).then(function(driver) {
                  self2._driver = driver._driver;
                  setDriverToConfig();
                  self2._wrapLibraryMethodsWithReady();
                  self2._initDriver = initDriver(supportedDrivers);
                });
              })["catch"](function() {
                setDriverToConfig();
                var error = new Error("No available storage method found.");
                self2._driverSet = Promise$1.reject(error);
                return self2._driverSet;
              });
              executeTwoCallbacks(this._driverSet, callback, errorCallback);
              return this._driverSet;
            };
            LocalForage2.prototype.supports = function supports(driverName) {
              return !!DriverSupport[driverName];
            };
            LocalForage2.prototype._extend = function _extend(libraryMethodsAndProperties) {
              extend(this, libraryMethodsAndProperties);
            };
            LocalForage2.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
              var supportedDrivers = [];
              for (var i = 0, len = drivers.length; i < len; i++) {
                var driverName = drivers[i];
                if (this.supports(driverName)) {
                  supportedDrivers.push(driverName);
                }
              }
              return supportedDrivers;
            };
            LocalForage2.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
              for (var i = 0, len = LibraryMethods.length; i < len; i++) {
                callWhenReady(this, LibraryMethods[i]);
              }
            };
            LocalForage2.prototype.createInstance = function createInstance(options) {
              return new LocalForage2(options);
            };
            return LocalForage2;
          }();
          var localforage_js = new LocalForage();
          module3.exports = localforage_js;
        }, { "3": 3 }] }, {}, [4])(4);
      });
    }
  });

  // node_modules/fastclick/lib/fastclick.js
  var require_fastclick = __commonJS({
    "node_modules/fastclick/lib/fastclick.js"(exports, module) {
      (function() {
        "use strict";
        /**
         * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
         *
         * @codingstandard ftlabs-jsv2
         * @copyright The Financial Times Limited [All Rights Reserved]
         * @license MIT License (see LICENSE.txt)
         */
        function FastClick2(layer, options) {
          var oldOnClick;
          options = options || {};
          this.trackingClick = false;
          this.trackingClickStart = 0;
          this.targetElement = null;
          this.touchStartX = 0;
          this.touchStartY = 0;
          this.lastTouchIdentifier = 0;
          this.touchBoundary = options.touchBoundary || 10;
          this.layer = layer;
          this.tapDelay = options.tapDelay || 200;
          this.tapTimeout = options.tapTimeout || 700;
          if (FastClick2.notNeeded(layer)) {
            return;
          }
          function bind(method, context2) {
            return function() {
              return method.apply(context2, arguments);
            };
          }
          var methods = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"];
          var context = this;
          for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
          }
          if (deviceIsAndroid) {
            layer.addEventListener("mouseover", this.onMouse, true);
            layer.addEventListener("mousedown", this.onMouse, true);
            layer.addEventListener("mouseup", this.onMouse, true);
          }
          layer.addEventListener("click", this.onClick, true);
          layer.addEventListener("touchstart", this.onTouchStart, false);
          layer.addEventListener("touchmove", this.onTouchMove, false);
          layer.addEventListener("touchend", this.onTouchEnd, false);
          layer.addEventListener("touchcancel", this.onTouchCancel, false);
          if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function(type, callback, capture) {
              var rmv = Node.prototype.removeEventListener;
              if (type === "click") {
                rmv.call(layer, type, callback.hijacked || callback, capture);
              } else {
                rmv.call(layer, type, callback, capture);
              }
            };
            layer.addEventListener = function(type, callback, capture) {
              var adv = Node.prototype.addEventListener;
              if (type === "click") {
                adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                  if (!event.propagationStopped) {
                    callback(event);
                  }
                }), capture);
              } else {
                adv.call(layer, type, callback, capture);
              }
            };
          }
          if (typeof layer.onclick === "function") {
            oldOnClick = layer.onclick;
            layer.addEventListener("click", function(event) {
              oldOnClick(event);
            }, false);
            layer.onclick = null;
          }
        }
        var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
        var deviceIsAndroid = navigator.userAgent.indexOf("Android") > 0 && !deviceIsWindowsPhone;
        var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
        var deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);
        var deviceIsIOSWithBadTarget = deviceIsIOS && /OS [6-7]_\d/.test(navigator.userAgent);
        var deviceIsBlackBerry10 = navigator.userAgent.indexOf("BB10") > 0;
        FastClick2.prototype.needsClick = function(target) {
          switch (target.nodeName.toLowerCase()) {
            case "button":
            case "select":
            case "textarea":
              if (target.disabled) {
                return true;
              }
              break;
            case "input":
              if (deviceIsIOS && target.type === "file" || target.disabled) {
                return true;
              }
              break;
            case "label":
            case "iframe":
            case "video":
              return true;
          }
          return /\bneedsclick\b/.test(target.className);
        };
        FastClick2.prototype.needsFocus = function(target) {
          switch (target.nodeName.toLowerCase()) {
            case "textarea":
              return true;
            case "select":
              return !deviceIsAndroid;
            case "input":
              switch (target.type) {
                case "button":
                case "checkbox":
                case "file":
                case "image":
                case "radio":
                case "submit":
                  return false;
              }
              return !target.disabled && !target.readOnly;
            default:
              return /\bneedsfocus\b/.test(target.className);
          }
        };
        FastClick2.prototype.sendClick = function(targetElement, event) {
          var clickEvent, touch;
          if (document.activeElement && document.activeElement !== targetElement) {
            document.activeElement.blur();
          }
          touch = event.changedTouches[0];
          clickEvent = document.createEvent("MouseEvents");
          clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
          clickEvent.forwardedTouchEvent = true;
          targetElement.dispatchEvent(clickEvent);
        };
        FastClick2.prototype.determineEventType = function(targetElement) {
          if (deviceIsAndroid && targetElement.tagName.toLowerCase() === "select") {
            return "mousedown";
          }
          return "click";
        };
        FastClick2.prototype.focus = function(targetElement) {
          var length;
          if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf("date") !== 0 && targetElement.type !== "time" && targetElement.type !== "month") {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
          } else {
            targetElement.focus();
          }
        };
        FastClick2.prototype.updateScrollParent = function(targetElement) {
          var scrollParent, parentElement;
          scrollParent = targetElement.fastClickScrollParent;
          if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
              if (parentElement.scrollHeight > parentElement.offsetHeight) {
                scrollParent = parentElement;
                targetElement.fastClickScrollParent = parentElement;
                break;
              }
              parentElement = parentElement.parentElement;
            } while (parentElement);
          }
          if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
          }
        };
        FastClick2.prototype.getTargetElementFromEventTarget = function(eventTarget) {
          if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
          }
          return eventTarget;
        };
        FastClick2.prototype.onTouchStart = function(event) {
          var targetElement, touch, selection;
          if (event.targetTouches.length > 1) {
            return true;
          }
          targetElement = this.getTargetElementFromEventTarget(event.target);
          touch = event.targetTouches[0];
          if (deviceIsIOS) {
            selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
              return true;
            }
            if (!deviceIsIOS4) {
              if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                event.preventDefault();
                return false;
              }
              this.lastTouchIdentifier = touch.identifier;
              this.updateScrollParent(targetElement);
            }
          }
          this.trackingClick = true;
          this.trackingClickStart = event.timeStamp;
          this.targetElement = targetElement;
          this.touchStartX = touch.pageX;
          this.touchStartY = touch.pageY;
          if (event.timeStamp - this.lastClickTime < this.tapDelay) {
            event.preventDefault();
          }
          return true;
        };
        FastClick2.prototype.touchHasMoved = function(event) {
          var touch = event.changedTouches[0], boundary = this.touchBoundary;
          if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
            return true;
          }
          return false;
        };
        FastClick2.prototype.onTouchMove = function(event) {
          if (!this.trackingClick) {
            return true;
          }
          if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
            this.trackingClick = false;
            this.targetElement = null;
          }
          return true;
        };
        FastClick2.prototype.findControl = function(labelElement) {
          if (labelElement.control !== void 0) {
            return labelElement.control;
          }
          if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
          }
          return labelElement.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea");
        };
        FastClick2.prototype.onTouchEnd = function(event) {
          var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;
          if (!this.trackingClick) {
            return true;
          }
          if (event.timeStamp - this.lastClickTime < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
          }
          if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
            return true;
          }
          this.cancelNextClick = false;
          this.lastClickTime = event.timeStamp;
          trackingClickStart = this.trackingClickStart;
          this.trackingClick = false;
          this.trackingClickStart = 0;
          if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];
            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
          }
          targetTagName = targetElement.tagName.toLowerCase();
          if (targetTagName === "label") {
            forElement = this.findControl(targetElement);
            if (forElement) {
              this.focus(targetElement);
              if (deviceIsAndroid) {
                return false;
              }
              targetElement = forElement;
            }
          } else if (this.needsFocus(targetElement)) {
            if (event.timeStamp - trackingClickStart > 100 || deviceIsIOS && window.top !== window && targetTagName === "input") {
              this.targetElement = null;
              return false;
            }
            this.focus(targetElement);
            this.sendClick(targetElement, event);
            if (!deviceIsIOS || targetTagName !== "select") {
              this.targetElement = null;
              event.preventDefault();
            }
            return false;
          }
          if (deviceIsIOS && !deviceIsIOS4) {
            scrollParent = targetElement.fastClickScrollParent;
            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
              return true;
            }
          }
          if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
          }
          return false;
        };
        FastClick2.prototype.onTouchCancel = function() {
          this.trackingClick = false;
          this.targetElement = null;
        };
        FastClick2.prototype.onMouse = function(event) {
          if (!this.targetElement) {
            return true;
          }
          if (event.forwardedTouchEvent) {
            return true;
          }
          if (!event.cancelable) {
            return true;
          }
          if (!this.needsClick(this.targetElement) || this.cancelNextClick) {
            if (event.stopImmediatePropagation) {
              event.stopImmediatePropagation();
            } else {
              event.propagationStopped = true;
            }
            event.stopPropagation();
            event.preventDefault();
            return false;
          }
          return true;
        };
        FastClick2.prototype.onClick = function(event) {
          var permitted;
          if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
          }
          if (event.target.type === "submit" && event.detail === 0) {
            return true;
          }
          permitted = this.onMouse(event);
          if (!permitted) {
            this.targetElement = null;
          }
          return permitted;
        };
        FastClick2.prototype.destroy = function() {
          var layer = this.layer;
          if (deviceIsAndroid) {
            layer.removeEventListener("mouseover", this.onMouse, true);
            layer.removeEventListener("mousedown", this.onMouse, true);
            layer.removeEventListener("mouseup", this.onMouse, true);
          }
          layer.removeEventListener("click", this.onClick, true);
          layer.removeEventListener("touchstart", this.onTouchStart, false);
          layer.removeEventListener("touchmove", this.onTouchMove, false);
          layer.removeEventListener("touchend", this.onTouchEnd, false);
          layer.removeEventListener("touchcancel", this.onTouchCancel, false);
        };
        FastClick2.notNeeded = function(layer) {
          var metaViewport;
          var chromeVersion;
          var blackberryVersion;
          var firefoxVersion;
          if (typeof window.ontouchstart === "undefined") {
            return true;
          }
          chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
          if (chromeVersion) {
            if (deviceIsAndroid) {
              metaViewport = document.querySelector("meta[name=viewport]");
              if (metaViewport) {
                if (metaViewport.content.indexOf("user-scalable=no") !== -1) {
                  return true;
                }
                if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                  return true;
                }
              }
            } else {
              return true;
            }
          }
          if (deviceIsBlackBerry10) {
            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);
            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
              metaViewport = document.querySelector("meta[name=viewport]");
              if (metaViewport) {
                if (metaViewport.content.indexOf("user-scalable=no") !== -1) {
                  return true;
                }
                if (document.documentElement.scrollWidth <= window.outerWidth) {
                  return true;
                }
              }
            }
          }
          if (layer.style.msTouchAction === "none" || layer.style.touchAction === "manipulation") {
            return true;
          }
          firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];
          if (firefoxVersion >= 27) {
            metaViewport = document.querySelector("meta[name=viewport]");
            if (metaViewport && (metaViewport.content.indexOf("user-scalable=no") !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
              return true;
            }
          }
          if (layer.style.touchAction === "none" || layer.style.touchAction === "manipulation") {
            return true;
          }
          return false;
        };
        FastClick2.attach = function(layer, options) {
          return new FastClick2(layer, options);
        };
        if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
          define(function() {
            return FastClick2;
          });
        } else if (typeof module !== "undefined" && module.exports) {
          module.exports = FastClick2.attach;
          module.exports.FastClick = FastClick2;
        } else {
          window.FastClick = FastClick2;
        }
      })();
    }
  });

  // app/scripts/utils/localStorage.js
  var import_localforage = __toESM(require_localforage(), 1);
  var storage = {
    get: function(key) {
      const item = localStorage.getItem(key);
      if (!item)
        return null;
      const { value, expiry } = JSON.parse(item);
      if (expiry && Date.now() > expiry) {
        this.delete(key);
        return null;
      }
      return value;
    },
    set: function(key, value, expiryDays = 1) {
      const expiry = expiryDays ? Date.now() + expiryDays * 24 * 60 * 60 * 1e3 : null;
      const item = JSON.stringify({ value, expiry });
      localStorage.setItem(key, item);
    },
    delete: function(key) {
      localStorage.removeItem(key);
    }
  };
  var localStorage_default = storage;

  // app/scripts/utils/addEvent.js
  function addEvent(evt, selector, handler) {
    evt.split(" ").forEach((event) => {
      document.addEventListener(
        event,
        function(event2) {
          if (event2.target.matches(selector + ", " + selector + " *")) {
            handler.apply(event2.target.closest(selector), arguments);
          }
        },
        false
      );
    });
  }

  // app/scripts/utils/debounceTime.js
  function debounceTime(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // app/scripts/utils/resizeObserver.js
  function resizeObserver(selector, callback, debounceTimeout = 300) {
    const { debounceTime: debounceTime2 } = theme;
    let lastWidth = selector.clientWidth;
    const debounce = debounceTime2((e) => {
      let newestWidth = selector.clientWidth;
      if (newestWidth == lastWidth)
        return;
      callback.apply(selector);
      lastWidth = newestWidth;
    }, debounceTimeout);
    if ("ResizeObserver" in window) {
      const resizeObserver2 = new ResizeObserver((entries) => {
        debounce.call(selector);
      });
      resizeObserver2.observe(selector);
    } else {
      window.addEventListener("resize", () => debounce.bind(selector));
    }
  }

  // app/scripts/utils/inViewPort.js
  function inViewPort(el, callback, once = false) {
    if (!el || typeof callback !== "function")
      return;
    const options = {
      root: null,
      // viewport
      rootMargin: "0px",
      threshold: 0
      // trigger when element first appears in viewport
    };
    const observer = new IntersectionObserver((entries) => {
      const isIntersecting = entries[0].isIntersecting;
      callback(isIntersecting, entries);
      if (isIntersecting && once) {
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }

  // app/scripts/utils/index.js
  window.theme = Object.assign(window.theme, {
    addEvent,
    storage: localStorage_default,
    debounceTime,
    resizeObserver,
    inViewPort
  });

  // app/scripts/theme.js
  var import_fastclick = __toESM(require_fastclick(), 1);

  // app/scripts/components/lazyScript.js
  var customElementsName = "lazy-script";
  !window.customElements.get(customElementsName) && window.customElements.define(
    customElementsName,
    class extends HTMLElement {
      constructor() {
        super();
        if (!("IntersectionObserver" in window) && !("IntersectionObserverEntry" in window) && !("intersectionRatio" in window.IntersectionObserverEntry.prototype)) {
          this.inVisible();
          return;
        }
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.inVisible();
                observer.disconnect();
              }
            });
          },
          { rootMargin: "400px 0px 400px 0px" }
        );
        observer.observe(this);
      }
      inVisible() {
        setTimeout(() => {
          this.loadFiles();
          this.changeTag();
        }, 100);
      }
      loadFiles() {
        const { file: files } = this.dataset;
        if (!files)
          return;
        this.removeAttribute("data-file");
        files.split(",").forEach((file) => {
          if (file.includes(".js")) {
            const parts = file.split("/");
            const fileName = parts[parts.length - 1].split(".js")[0];
            if (document.querySelector(`script[data-uniq="${fileName}"]`))
              return;
            const script = document.createElement("script");
            script.setAttribute("data-uniq", fileName);
            script.src = file;
            document.head.insertAdjacentElement("beforeend", script);
          } else {
            const parts = file.split("/");
            const fileName = parts[parts.length - 1].split(".css")[0];
            if (document.querySelector(`link[data-uniq="${fileName}"]`))
              return;
            const stylesheet = document.createElement("link");
            stylesheet.href = file;
            stylesheet.rel = "stylesheet";
            stylesheet.type = "text/css";
            stylesheet.media = "all";
            stylesheet.setAttribute("data-uniq", fileName);
            document.head.insertAdjacentElement("beforeend", stylesheet);
          }
        });
      }
      changeTag() {
        const { tag = "div" } = this.dataset;
        if (!tag)
          return;
        const el = document.createElement(tag || "div");
        this.removeAttribute("data-tag");
        Array.from(this.attributes).forEach((attr, i) => {
          el.setAttribute(this.attributes[i].name, this.attributes[i].value);
        });
        Array.from(this.children)?.forEach((child) => {
          console.log("child::", child);
          el.insertAdjacentElement("beforeend", child);
        });
        this.insertAdjacentElement("beforebegin", el);
        this.remove();
      }
    }
  );

  // app/scripts/utils/calculateScrollBarWidth.js
  function scrollBarWidth() {
    return window.innerWidth - document.documentElement.offsetWidth;
  }
  document.body.style.setProperty("--scrollbar-width", scrollBarWidth() + "px");
  window.addEventListener("resize", () => {
    document.body.style.setProperty("--scrollbar-width", scrollBarWidth() + "px");
  });

  // app/scripts/utils/toggleClass.js
  var { addEvent: addEvent2 } = theme;
  addEvent2("click", ".jsToggleClass", (e) => {
    const el = e.target.closest(".jsToggleClass");
    const target = document.querySelectorAll(el.dataset.target || null);
    if (!target.length)
      return;
    let { className, classRemove, classRule, classEvent } = el.dataset;
    if (classEvent == "none") {
      e.preventDefault();
      e.stopPropagation();
    }
    target.forEach((i) => {
      switch (classRule) {
        case "add":
          i.classList.add(...className.split(","));
          break;
        case "remove":
          i.classList.remove(...className.split(","));
          break;
        default:
          className.split(",").forEach((c) => i.classList.toggle(c));
      }
      if (classRemove) {
        i.classList.remove(...classRemove.split(","));
      }
      i.className.includes("header-search") && document.querySelector("header predictive-search")?.focusSearch();
    });
  });

  // app/scripts/utils/togglePopup.js
  var { addEvent: addEvent3, loadTemplate } = theme;
  addEvent3("click", ".jsTogglePopup", (e) => {
    const el = e.target.closest(".jsTogglePopup");
    const { control: popupControlId, id: popupId } = el.dataset;
    let popup = null;
    if (popupControlId)
      popup = document.querySelector(`.popup-component[data-control="${popupControlId}"],${popupControlId}`);
    else if (popupId)
      popup = document.querySelector(`.popup-component[id="${popupId}"],${popupId}`);
    if (!popup)
      return;
    if (popupControlId == "#cartDrawer" && theme.settings.cartStyle == "drawer_desktop" && !window.matchMedia("(min-width: 750px)").matches || popupControlId == "#filterPopup") {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    el.classList.toggle("active");
    popup.isOpen ? popup.close() : popup.open();
  });
  addEvent3("click", ".jsPopupClose", (e) => {
    e.preventDefault();
    const el = e.target;
    const popup = el.closest(".popup-component");
    if (!popup)
      return;
    popup.close();
    document.querySelectorAll(`.jsTogglePopup[data-control="${popup.dataset.control}"]`)?.forEach((el2) => el2.classList.remove("active"));
  });

  // app/scripts/utils/loadTemplate.js
  var { addEvent: addEvent4 } = theme;
  addEvent4("click", ".jsTemplate", (e) => {
    const node = e.target.closest(".jsTemplate");
    const template = document.querySelector(node.dataset.template);
    e.preventDefault();
    e.stopPropagation();
    template.tagName == "TEMPLATE" && Array.from(template.content.children)?.forEach((child) => {
      template.insertAdjacentElement("beforebegin", child);
    });
    if (template.tagName == "NOSCRIPT") {
      const div = document.createElement("div");
      div.innerHTML = template.innerHTML;
      template.insertAdjacentElement("beforebegin", div);
    }
    template.remove();
    node.classList.remove("jsTemplate");
    node.removeAttribute("data-template");
    setTimeout(() => {
      node.click();
    }, 300);
  });

  // app/scripts/utils/keyEvents.js
  document.addEventListener("keyup", (e) => {
    e.key == `Escape` && document.querySelectorAll("details[open]")?.forEach((item) => item.removeAttribute("open"));
  });

  // app/scripts/utils/currencies.js
  var multiCurrency = {};
  var moneyFormat = theme.settings.moneyFormat;
  multiCurrency.moneyFormats = {
    USD: {
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}} USD"
    },
    EUR: {
      money_format: "&euro;{{amount}}",
      money_with_currency_format: "&euro;{{amount}} EUR"
    },
    GBP: {
      money_format: "&pound;{{amount}}",
      money_with_currency_format: "&pound;{{amount}} GBP"
    },
    CAD: {
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}} CAD"
    },
    ALL: {
      money_format: "Lek {{amount}}",
      money_with_currency_format: "Lek {{amount}} ALL"
    },
    DZD: {
      money_format: "DA {{amount}}",
      money_with_currency_format: "DA {{amount}} DZD"
    },
    AOA: {
      money_format: "Kz{{amount}}",
      money_with_currency_format: "Kz{{amount}} AOA"
    },
    ARS: {
      money_format: "${{amount_with_comma_separator}}",
      money_with_currency_format: "${{amount_with_comma_separator}} ARS"
    },
    AMD: {
      money_format: "{{amount}} AMD",
      money_with_currency_format: "{{amount}} AMD"
    },
    AWG: {
      money_format: "Afl{{amount}}",
      money_with_currency_format: "Afl{{amount}} AWG"
    },
    AUD: {
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}} AUD"
    },
    BBD: {
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}} Bds"
    },
    AZN: {
      money_format: "m.{{amount}}",
      money_with_currency_format: "m.{{amount}} AZN"
    },
    BDT: {
      money_format: "Tk {{amount}}",
      money_with_currency_format: "Tk {{amount}} BDT"
    },
    BSD: {
      money_format: "BS${{amount}}",
      money_with_currency_format: "BS${{amount}} BSD"
    },
    BHD: {
      money_format: "{{amount}}0 BD",
      money_with_currency_format: "{{amount}}0 BHD"
    },
    BYR: {
      money_format: "Br {{amount}}",
      money_with_currency_format: "Br {{amount}} BYR"
    },
    BZD: {
      money_format: "BZ${{amount}}",
      money_with_currency_format: "BZ${{amount}} BZD"
    },
    BTN: {
      money_format: "Nu {{amount}}",
      money_with_currency_format: "Nu {{amount}} BTN"
    },
    BAM: {
      money_format: "KM {{amount_with_comma_separator}}",
      money_with_currency_format: "KM {{amount_with_comma_separator}} BAM"
    },
    BRL: {
      money_format: "R$ {{amount_with_comma_separator}}",
      money_with_currency_format: "R$ {{amount_with_comma_separator}} BRL"
    },
    BOB: {
      money_format: "Bs{{amount_with_comma_separator}}",
      money_with_currency_format: "Bs{{amount_with_comma_separator}} BOB"
    },
    BWP: {
      money_format: "P{{amount}}",
      money_with_currency_format: "P{{amount}} BWP"
    },
    BND: {
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}} BND"
    },
    BGN: {
      money_format: "{{amount}} \u043B\u0432",
      money_with_currency_format: "{{amount}} \u043B\u0432 BGN"
    },
    MMK: {
      money_format: "K{{amount}}",
      money_with_currency_format: "K{{amount}} MMK"
    },
    KHR: {
      money_format: "KHR{{amount}}",
      money_with_currency_format: "KHR{{amount}}"
    },
    KYD: {
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}} KYD"
    },
    XAF: {
      money_format: "FCFA{{amount}}",
      money_with_currency_format: "FCFA{{amount}} XAF"
    },
    CLP: {
      money_format: "${{amount_no_decimals}}",
      money_with_currency_format: "${{amount_no_decimals}} CLP"
    },
    CNY: {
      money_format: "&#165;{{amount}}",
      money_with_currency_format: "&#165;{{amount}} CNY"
    },
    COP: {
      money_format: "${{amount_with_comma_separator}}",
      money_with_currency_format: "${{amount_with_comma_separator}} COP"
    },
    CRC: {
      money_format: "&#8353; {{amount_with_comma_separator}}",
      money_with_currency_format: "&#8353; {{amount_with_comma_separator}} CRC"
    },
    HRK: {
      money_format: "{{amount_with_comma_separator}} kn",
      money_with_currency_format: "{{amount_with_comma_separator}} kn HRK"
    },
    CZK: {
      money_format: "{{amount_with_comma_separator}} K&#269;",
      money_with_currency_format: "{{amount_with_comma_separator}} K&#269;"
    },
    DKK: {
      money_format: "{{amount_with_comma_separator}}",
      money_with_currency_format: "kr.{{amount_with_comma_separator}}"
    },
    DOP: {
      money_format: "RD$ {{amount}}",
      money_with_currency_format: "RD$ {{amount}}"
    },
    XCD: {
      money_format: "${{amount}}",
      money_with_currency_format: "EC${{amount}}"
    },
    EGP: {
      money_format: "LE {{amount}}",
      money_with_currency_format: "LE {{amount}} EGP"
    },
    ETB: {
      money_format: "Br{{amount}}",
      money_with_currency_format: "Br{{amount}} ETB"
    },
    XPF: {
      money_format: "{{amount_no_decimals_with_comma_separator}} XPF",
      money_with_currency_format: "{{amount_no_decimals_with_comma_separator}} XPF"
    },
    FJD: {
      money_format: "${{amount}}",
      money_with_currency_format: "FJ${{amount}}"
    },
    GMD: {
      money_format: "D {{amount}}",
      money_with_currency_format: "D {{amount}} GMD"
    },
    GHS: {
      money_format: "GH&#8373;{{amount}}",
      money_with_currency_format: "GH&#8373;{{amount}}"
    },
    GTQ: {
      money_format: "Q{{amount}}",
      money_with_currency_format: "{{amount}} GTQ"
    },
    GYD: {
      money_format: "G${{amount}}",
      money_with_currency_format: "${{amount}} GYD"
    },
    GEL: {
      money_format: "{{amount}} GEL",
      money_with_currency_format: "{{amount}} GEL"
    },
    HNL: {
      money_format: "L {{amount}}",
      money_with_currency_format: "L {{amount}} HNL"
    },
    HKD: {
      money_format: "${{amount}}",
      money_with_currency_format: "HK${{amount}}"
    },
    HUF: {
      money_format: "{{amount_no_decimals_with_comma_separator}}",
      money_with_currency_format: "{{amount_no_decimals_with_comma_separator}} Ft"
    },
    ISK: {
      money_format: "{{amount_no_decimals}} kr",
      money_with_currency_format: "{{amount_no_decimals}} kr ISK"
    },
    INR: {
      money_format: "Rs. {{amount}}",
      money_with_currency_format: "Rs. {{amount}}"
    },
    IDR: {
      money_format: "{{amount_with_comma_separator}}",
      money_with_currency_format: "Rp {{amount_with_comma_separator}}"
    },
    ILS: {
      money_format: "{{amount}} NIS",
      money_with_currency_format: "{{amount}} NIS"
    },
    JMD: {
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}} JMD"
    },
    JPY: {
      money_format: "&#165;{{amount_no_decimals}}",
      money_with_currency_format: "&#165;{{amount_no_decimals}} JPY"
    },
    JEP: {
      money_format: "&pound;{{amount}}",
      money_with_currency_format: "&pound;{{amount}} JEP"
    },
    JOD: {
      money_format: "{{amount}}0 JD",
      money_with_currency_format: "{{amount}}0 JOD"
    },
    KZT: {
      money_format: "{{amount}} KZT",
      money_with_currency_format: "{{amount}} KZT"
    },
    KES: {
      money_format: "KSh{{amount}}",
      money_with_currency_format: "KSh{{amount}}"
    },
    KWD: {
      money_format: "{{amount}}0 KD",
      money_with_currency_format: "{{amount}}0 KWD"
    },
    KGS: {
      money_format: "\u043B\u0432{{amount}}",
      money_with_currency_format: "\u043B\u0432{{amount}}"
    },
    LVL: {
      money_format: "Ls {{amount}}",
      money_with_currency_format: "Ls {{amount}} LVL"
    },
    LBP: {
      money_format: "L&pound;{{amount}}",
      money_with_currency_format: "L&pound;{{amount}} LBP"
    },
    LTL: {
      money_format: "{{amount}} Lt",
      money_with_currency_format: "{{amount}} Lt"
    },
    MGA: {
      money_format: "Ar {{amount}}",
      money_with_currency_format: "Ar {{amount}} MGA"
    },
    MKD: {
      money_format: "\u0434\u0435\u043D {{amount}}",
      money_with_currency_format: "\u0434\u0435\u043D {{amount}} MKD"
    },
    MOP: {
      money_format: "MOP${{amount}}",
      money_with_currency_format: "MOP${{amount}}"
    },
    MVR: {
      money_format: "Rf{{amount}}",
      money_with_currency_format: "Rf{{amount}} MRf"
    },
    MXN: {
      money_format: "$ {{amount}}",
      money_with_currency_format: "$ {{amount}} MXN"
    },
    MYR: {
      money_format: "RM{{amount}} MYR",
      money_with_currency_format: "RM{{amount}} MYR"
    },
    MUR: {
      money_format: "Rs {{amount}}",
      money_with_currency_format: "Rs {{amount}} MUR"
    },
    MDL: {
      money_format: "{{amount}} MDL",
      money_with_currency_format: "{{amount}} MDL"
    },
    MAD: {
      money_format: "{{amount}} dh",
      money_with_currency_format: "Dh {{amount}} MAD"
    },
    MNT: {
      money_format: "{{amount_no_decimals}} &#8366",
      money_with_currency_format: "{{amount_no_decimals}} MNT"
    },
    MZN: {
      money_format: "{{amount}} Mt",
      money_with_currency_format: "Mt {{amount}} MZN"
    },
    NAD: {
      money_format: "N${{amount}}",
      money_with_currency_format: "N${{amount}} NAD"
    },
    NPR: {
      money_format: "Rs{{amount}}",
      money_with_currency_format: "Rs{{amount}} NPR"
    },
    ANG: {
      money_format: "&fnof;{{amount}}",
      money_with_currency_format: "{{amount}} NA&fnof;"
    },
    NZD: {
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}} NZD"
    },
    NIO: {
      money_format: "C${{amount}}",
      money_with_currency_format: "C${{amount}} NIO"
    },
    NGN: {
      money_format: "&#8358;{{amount}}",
      money_with_currency_format: "&#8358;{{amount}} NGN"
    },
    NOK: {
      money_format: "kr {{amount_with_comma_separator}}",
      money_with_currency_format: "kr {{amount_with_comma_separator}} NOK"
    },
    OMR: {
      money_format: "{{amount_with_comma_separator}} OMR",
      money_with_currency_format: "{{amount_with_comma_separator}} OMR"
    },
    PKR: {
      money_format: "Rs.{{amount}}",
      money_with_currency_format: "Rs.{{amount}} PKR"
    },
    PGK: {
      money_format: "K {{amount}}",
      money_with_currency_format: "K {{amount}} PGK"
    },
    PYG: {
      money_format: "Gs. {{amount_no_decimals_with_comma_separator}}",
      money_with_currency_format: "Gs. {{amount_no_decimals_with_comma_separator}} PYG"
    },
    PEN: {
      money_format: "S/. {{amount}}",
      money_with_currency_format: "S/. {{amount}} PEN"
    },
    PHP: {
      money_format: "&#8369;{{amount}}",
      money_with_currency_format: "&#8369;{{amount}} PHP"
    },
    PLN: {
      money_format: "{{amount_with_comma_separator}} zl",
      money_with_currency_format: "{{amount_with_comma_separator}} zl PLN"
    },
    QAR: {
      money_format: "QAR {{amount_with_comma_separator}}",
      money_with_currency_format: "QAR {{amount_with_comma_separator}}"
    },
    RON: {
      money_format: "{{amount_with_comma_separator}} lei",
      money_with_currency_format: "{{amount_with_comma_separator}} lei RON"
    },
    RUB: {
      money_format: "&#1088;&#1091;&#1073;{{amount_with_comma_separator}}",
      money_with_currency_format: "&#1088;&#1091;&#1073;{{amount_with_comma_separator}} RUB"
    },
    RWF: {
      money_format: "{{amount_no_decimals}} RF",
      money_with_currency_format: "{{amount_no_decimals}} RWF"
    },
    WST: {
      money_format: "WS$ {{amount}}",
      money_with_currency_format: "WS$ {{amount}} WST"
    },
    SAR: {
      money_format: "{{amount}} SR",
      money_with_currency_format: "{{amount}} SAR"
    },
    STD: {
      money_format: "Db {{amount}}",
      money_with_currency_format: "Db {{amount}} STD"
    },
    RSD: {
      money_format: "{{amount}} RSD",
      money_with_currency_format: "{{amount}} RSD"
    },
    SCR: {
      money_format: "Rs {{amount}}",
      money_with_currency_format: "Rs {{amount}} SCR"
    },
    SGD: {
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}} SGD"
    },
    SYP: {
      money_format: "S&pound;{{amount}}",
      money_with_currency_format: "S&pound;{{amount}} SYP"
    },
    ZAR: {
      money_format: "R {{amount}}",
      money_with_currency_format: "R {{amount}} ZAR"
    },
    KRW: {
      money_format: "&#8361;{{amount_no_decimals}}",
      money_with_currency_format: "&#8361;{{amount_no_decimals}} KRW"
    },
    LKR: {
      money_format: "Rs {{amount}}",
      money_with_currency_format: "Rs {{amount}} LKR"
    },
    SEK: {
      money_format: "{{amount_no_decimals}} kr",
      money_with_currency_format: "{{amount_no_decimals}} kr SEK"
    },
    CHF: {
      money_format: "SFr. {{amount}}",
      money_with_currency_format: "SFr. {{amount}} CHF"
    },
    TWD: {
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}} TWD"
    },
    THB: {
      money_format: "{{amount}} &#xe3f;",
      money_with_currency_format: "{{amount}} &#xe3f; THB"
    },
    TZS: {
      money_format: "{{amount}} TZS",
      money_with_currency_format: "{{amount}} TZS"
    },
    TTD: {
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}} TTD"
    },
    TND: {
      money_format: "{{amount}}",
      money_with_currency_format: "{{amount}} DT"
    },
    TRY: {
      money_format: "{{amount}}TL",
      money_with_currency_format: "{{amount}}TL"
    },
    UGX: {
      money_format: "Ush {{amount_no_decimals}}",
      money_with_currency_format: "Ush {{amount_no_decimals}} UGX"
    },
    UAH: {
      money_format: "\u20B4{{amount}}",
      money_with_currency_format: "\u20B4{{amount}} UAH"
    },
    AED: {
      money_format: "Dhs. {{amount}}",
      money_with_currency_format: "Dhs. {{amount}} AED"
    },
    UYU: {
      money_format: "${{amount_with_comma_separator}}",
      money_with_currency_format: "${{amount_with_comma_separator}} UYU"
    },
    VUV: {
      money_format: "${{amount}}",
      money_with_currency_format: "${{amount}}VT"
    },
    VEF: {
      money_format: "Bs. {{amount_with_comma_separator}}",
      money_with_currency_format: "Bs. {{amount_with_comma_separator}} VEF"
    },
    VND: {
      money_format: "{{amount_no_decimals_with_comma_separator}}&#8363;",
      money_with_currency_format: "{{amount_no_decimals_with_comma_separator}} VND"
    },
    XBT: {
      money_format: "{{amount_no_decimals}} BTC",
      money_with_currency_format: "{{amount_no_decimals}} BTC"
    },
    XOF: {
      money_format: "CFA{{amount}}",
      money_with_currency_format: "CFA{{amount}} XOF"
    },
    ZMW: {
      money_format: "K{{amount_no_decimals_with_comma_separator}}",
      money_with_currency_format: "ZMW{{amount_no_decimals_with_comma_separator}}"
    }
  };
  multiCurrency.formatMoney = function(cents, format) {
    if (typeof cents === "string") {
      cents = cents.replace(".", "");
    }
    let value = "";
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || moneyFormat;
    function formatWithDelimiters(number, precision = 2, thousands = ",", decimal = ".") {
      if (isNaN(number) || number == null) {
        return 0;
      }
      number = (number / 100).toFixed(precision);
      const parts = number.split(".");
      const dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        `$1${thousands}`
      );
      const centsAmount = parts[1] ? decimal + parts[1] : "";
      return dollarsAmount + centsAmount;
    }
    switch (formatString.match(placeholderRegex)[1]) {
      case "amount":
        value = formatWithDelimiters(cents, 2);
        break;
      case "amount_no_decimals":
        value = formatWithDelimiters(cents, 0);
        break;
      case "amount_with_comma_separator":
        value = formatWithDelimiters(cents, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        value = formatWithDelimiters(cents, 0, ".", ",");
        break;
    }
    return formatString.replace(placeholderRegex, value);
  };
  Object.assign(Number.prototype, {
    toCurrency: function() {
      return multiCurrency.formatMoney(this, moneyFormat);
    }
  });
  Object.assign(String.prototype, {
    toCurrency: function() {
      return multiCurrency.formatMoney(this, moneyFormat);
    }
  });

  // app/scripts/utils/cart.js
  window.cartForm = class extends HTMLElement {
    constructor() {
      super();
      this.sections = [
        {
          key: "section",
          section: "cart-section"
        },
        {
          key: "count",
          section: "cart-live-region-text"
        }
      ];
    }
    sectionList(section) {
      if (section) {
        const callSection = section.split(",");
        return this.sections.filter((i) => callSection.includes(i.key)).map((i) => i.section).join(",");
      }
      return this.sections.map((i) => i.section).join(",");
    }
    getHeader(formData) {
      if (!(formData instanceof FormData)) {
        return { "Content-Type": "application/json" };
      } else
        return { "X-Requested-With": "XMLHttpRequest" };
    }
    async postCart(type, data, callback = null, effect = "default") {
      type != "update" && window.addEventListener("cart:update", this.update.bind(this), { once: true });
      let status = true;
      let response = await fetch(`${theme.routes.cartUrl}/${type}.js`, {
        method: "POST",
        headers: this.getHeader(data),
        body: data
      });
      response = await response.json();
      if (type == "update") {
        return;
      }
      if (response.status) {
        console.error(response);
        this.notify(response.description || response.message);
        status = false;
        response.sections = await this.refresh();
      }
      const { sections } = response;
      window.dispatchEvent(new CustomEvent("cart:update", {
        detail: {
          sections,
          status,
          cart: response,
          effect
        }
      }));
      callback != null && callback(response);
    }
    async refresh() {
      let response = await fetch(`${location.pathname}?sections=${this.sectionList()}`);
      response = await response.json();
      return response;
    }
    update(evt) {
      const { detail: { sections } } = evt;
      for (const [section, html] of Object.entries(sections)) {
        const key = this.sections.find((i) => i.section == section)?.key || section;
        switch (key) {
          case "count":
            this.updateCartCount = html.split("<!-- split -->")[1];
            break;
          default:
            let div = document.createElement("div");
            div.innerHTML = html;
            div.querySelectorAll(".jsCartUpdate").forEach((newItem) => {
              const currentItem = document.querySelector(`[class="${newItem.className}"]`);
              if (currentItem) {
                currentItem.innerHTML = newItem.innerHTML;
              }
            });
        }
      }
    }
    async notify(msg) {
      const cartNotify = "cart-notify";
      let response = await fetch(`${theme.routes.searchUrl}?q=${encodeURI(msg)}&section_id=${cartNotify}`);
      response = await response.text();
      let div = document.createElement("div");
      div.innerHTML = response;
      Array.from(div.querySelector(".shopify-section").children).forEach((el) => {
        document.body.insertAdjacentElement("beforeend", el);
      });
    }
    set loadingState(bool) {
      const buttons = Array.from(this.form.elements).filter((button) => button.type === "submit");
      if (bool) {
        buttons.forEach((button) => {
          button.setAttribute("aria-busy", true);
          button.classList.add("disabled");
          button.HTMLTemp = button.innerHTML;
          button.innerHTML = document.querySelector("#svg_loading").innerHTML;
        });
      } else {
        buttons.forEach((button) => {
          button.removeAttribute("aria-busy");
          button.classList.remove("disabled");
          button.innerHTML = button.HTMLTemp;
          button.HTMLTemp = null;
        });
      }
    }
    set updateCartCount(value) {
      document.querySelectorAll(".jsCartCount")?.forEach((item) => item.setAttribute("data-count", value));
    }
  };

  // app/scripts/components/pictureComponent.js
  var customElementsName2 = "picture-component";
  !window.customElements.get(customElementsName2) && window.customElements.define(
    customElementsName2,
    class extends HTMLElement {
      connectedCallback() {
        return;
        if (!("IntersectionObserver" in window) && !("IntersectionObserverEntry" in window) && !("intersectionRatio" in window.IntersectionObserverEntry.prototype)) {
          this.inVisible();
          return;
        }
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.inVisible();
                observer.disconnect();
              }
            });
          },
          {
            rootMargin: "0px 0px 400px 0px"
          }
        );
        observer.observe(this);
        this.querySelector("img").onerror = this.onError.bind(this);
        const preloadEl = this.querySelector('[rel="preload"]');
        if (preloadEl) {
          document.head.insertAdjacentElement("beforeend", preloadEl);
        }
      }
      onError(event) {
        console.log("onError", event);
      }
      inVisible() {
        if (this.closest("lazy-script") || this.closest("slider-component") && !this.closest("slider-component")?.classList.contains("ready"))
          return;
        this.classList.add("loaded");
      }
    }
  );

  // app/scripts/components/popupComponent.js
  var { inViewPort: inViewPort2, addEvent: addEvent5 } = theme;
  var customElementsName3 = "popup-component";
  !window.customElements.get(customElementsName3) && window.customElements.define(customElementsName3, class extends HTMLElement {
    constructor() {
      super();
      this.isOpen = false;
      this.config = {
        activeClass: ["active", "show"],
        bodyClass: ["show-popup", "overflow-hidden"]
      };
      if (this.hasAttribute("data-body-class")) {
        this.config.customBodyClass = this.getAttribute("data-body-class").split(",");
      }
    }
    connectedCallback() {
      this.addEventListener("click", (e) => {
        const currentTarget = e.target;
        if (!currentTarget.closest(".popup-content") || currentTarget.closest(".jsClose")) {
          this.close();
          e.stopPropagation();
        }
      });
      window.addEventListener("resize", () => {
        if (!this.isOpen)
          return;
        const popupContent = this.querySelector(".popup-content");
        if (!popupContent)
          return;
        inViewPort2(popupContent, (isVisible) => {
          if (!isVisible) {
            this.close();
          }
        });
      });
      this.autoAppend();
      this.autoShow();
    }
    close() {
      this.classList.remove(...this.config.activeClass);
      this.querySelectorAll("video-component").forEach((item) => item.videoStop?.());
      if (this.config.customBodyClass)
        document.body.classList.remove(...this.config.customBodyClass);
      this.removeAttribute("role");
      this.removeAttribute("aria-modal");
      const visibilityCheck = () => {
        const isVisible = window.getComputedStyle(this).opacity;
        if (isVisible != "0")
          requestAnimationFrame(visibilityCheck);
        else {
          this.isOpen = false;
          if (Array.from(document.querySelectorAll("popup-component")).some((i) => i.isOpen == true))
            return;
          document.body.classList.remove(...this.config.bodyClass);
        }
      };
      requestAnimationFrame(visibilityCheck);
    }
    open(callback = null) {
      this.setAttribute("role", "dialog");
      this.setAttribute("aria-modal", "true");
      this.classList.add(...this.config.activeClass);
      document.body.classList.add(...this.config.bodyClass);
      if (this.config.customBodyClass)
        document.body.classList.add(...this.config.customBodyClass);
      const visibilityCheck = () => {
        const isVisible = window.getComputedStyle(this).opacity;
        if (isVisible != "0") {
          this.isOpen = true;
          this.autoHide();
          setTimeout(() => {
            this.querySelector("[auto-focus]")?.focus();
          }, 100);
          callback && callback();
        } else {
          requestAnimationFrame(visibilityCheck);
        }
      };
      requestAnimationFrame(visibilityCheck);
    }
    autoAppend() {
      if (!this.hasAttribute("auto-append"))
        return;
      this.removeAttribute("auto-append");
      const existingNode = document.getElementById(this.id);
      if (existingNode && existingNode !== this) {
        existingNode.after(this);
        existingNode.remove();
      }
    }
    autoShow() {
      if (!this.hasAttribute("auto-show"))
        return;
      this.removeAttribute("auto-show");
      setTimeout(() => {
        this.open();
      }, 300);
    }
    autoHide() {
      if (!this.hasAttribute("auto-hide"))
        return;
      if (this.isHiding != null)
        clearTimeout(this.isHiding);
      this.isHiding = setTimeout(() => {
        this.close();
        this.isHiding = null;
      }, +this.getAttribute("auto-hide"));
    }
  });

  // app/scripts/components/quantity.js
  var QuantityInput = class extends HTMLElement {
    constructor() {
      super();
      this.changeEvent = new Event("change", { bubbles: true });
      this.input = this.querySelector("input");
      if (this.input) {
        this.querySelectorAll("button")?.forEach((button) => {
          button.addEventListener("click", this.onButtonClick.bind(this));
        });
      } else {
        this.querySelector("select")?.addEventListener("change", (e) => {
          this.dispatchEvent(this.changeEvent);
        });
      }
    }
    onButtonClick(event) {
      event.preventDefault();
      const previousValue = this.input.value;
      event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown();
      if (previousValue !== this.input.value)
        this.input.dispatchEvent(this.changeEvent);
    }
  };
  customElements.define("quantity-input", QuantityInput);

  // app/scripts/components/foreignMarkets.js
  var foreignMarkets = class extends HTMLElement {
    constructor() {
      super();
      this.querySelectorAll(".js-multi-shop")?.forEach((item) => {
        item.addEventListener("click", (e) => {
          const element = item;
          const type = element.className.includes("languages") ? "language_code" : "country_code";
          const target = this.querySelector(`[name="${type}"]`);
          target.value = element.dataset.value;
          this.querySelector("form").submit();
        });
      });
      this.querySelectorAll("details").forEach((item) => {
        item.addEventListener("click", (e) => {
          this.querySelectorAll("details").forEach((detail) => {
            if (detail != item) {
              detail.removeAttribute("open");
            }
          });
        });
      });
      this.addEventListener("change", ({ target }) => {
        if (!target.hasAttribute("auto-submit"))
          return;
        this.querySelector("form").submit();
      });
    }
  };
  customElements.define("foreign-markets", foreignMarkets);

  // app/scripts/components/productCart.js
  var productCartForm = class extends cartForm {
    constructor() {
      super();
      if (theme.settings.cartStyle == "page")
        return;
      this.form = this.querySelector("form");
      this.form.addEventListener("submit", this.onSubmit.bind(this));
    }
    onSubmit(event) {
      event.preventDefault();
      if (!this.form.checkValidity()) {
        this.form.reportValidity();
        return;
      }
      const formData = new FormData(this.form);
      formData.append("sections", this.sectionList());
      formData.append("sections_url", this.dataset.url || location.pathname);
      const bundleItemchecked = this.closest("product-container")?.querySelector(".jsBFDAddOns:checked");
      const effect = !!bundleItemchecked ? "none" : "default";
      this.postCart("add", formData, () => {
        this.closest("popup-component")?.close();
        if (!formData.get("_hidden-price-add-ons"))
          return;
        const cartCookie = document.cookie.split("; ").find((row) => row.startsWith("cart="))?.split("=")[1];
        console.log("cartCookie :>> ", cartCookie);
        fetch(`/apps/options-3/v1/draft-order/${cartCookie}`).then((response) => response.json()).then((data) => {
          if (data.draftOrderCreate?.draftOrder?.invoiceUrl) {
            const shouldProceed = confirm("B\u1EA1n c\xF3 mu\u1ED1n ti\u1EBFp t\u1EE5c \u0111\u1EBFn trang thanh to\xE1n kh\xF4ng?");
            if (!shouldProceed)
              return;
            window.location.href = data.draftOrderCreate.draftOrder.invoiceUrl;
          }
        }).catch((error) => {
          console.error("L\u1ED7i khi t\u1EA1o draft order:", error);
        });
      }, effect);
    }
    addBundlesToCart(data, callback) {
      if (!data.sections)
        data.sections = this.sectionList();
      if (!data.sections_url)
        data.sections_url = this.dataset.url || location.pathname;
      this.postCart("add", JSON.stringify(data), callback, "default");
    }
  };
  !customElements.get("product-cart-form") && customElements.define("product-cart-form", productCartForm);

  // app/scripts/theme.js
  document.addEventListener("click", function(e) {
    const { target } = e;
    const el = target.closest(".jsClipboard");
    if (el) {
      el.classList.add("copied");
      navigator.clipboard.writeText(el.dataset.value);
    }
  });
  document.body.addEventListener("keyup", (e) => {
    e.code == "Escape" && document.querySelectorAll("popup-component.active").forEach((popup) => {
      popup.close();
    });
  });
  window.addEventListener("resize", () => {
    document.body.classList.add("is-resizing");
    if (theme.isResize)
      clearTimeout(theme.isResize);
    theme.isResize = setTimeout(() => {
      document.body.classList.remove("is-resizing");
      theme.isResize = null;
    }, 300);
  });
  (0, import_fastclick.default)?.(document.body);
})();
