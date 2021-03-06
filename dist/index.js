(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // node_modules/airtable/lib/airtable.umd.js
  var require_airtable_umd = __commonJS({
    "node_modules/airtable/lib/airtable.umd.js"(exports, module) {
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
          g.Airtable = f();
        }
      })(function() {
        var define2, module2, exports2;
        return function() {
          function r(e, n, t) {
            function o(i2, f) {
              if (!n[i2]) {
                if (!e[i2]) {
                  var c = typeof __require == "function" && __require;
                  if (!f && c)
                    return c(i2, true);
                  if (u)
                    return u(i2, true);
                  var a = new Error("Cannot find module '" + i2 + "'");
                  throw a.code = "MODULE_NOT_FOUND", a;
                }
                var p = n[i2] = { exports: {} };
                e[i2][0].call(p.exports, function(r2) {
                  var n2 = e[i2][1][r2];
                  return o(n2 || r2);
                }, p, p.exports, r, e, n, t);
              }
              return n[i2].exports;
            }
            for (var u = typeof __require == "function" && __require, i = 0; i < t.length; i++)
              o(t[i]);
            return o;
          }
          return r;
        }()({ 1: [function(require2, module3, exports3) {
          "use strict";
          var AbortController;
          if (typeof window === "undefined") {
            AbortController = require2("abort-controller");
          } else if ("signal" in new Request("")) {
            AbortController = window.AbortController;
          } else {
            var polyfill = require2("abortcontroller-polyfill/dist/cjs-ponyfill");
            AbortController = polyfill.AbortController;
          }
          module3.exports = AbortController;
        }, { "abort-controller": 20, "abortcontroller-polyfill/dist/cjs-ponyfill": 19 }], 2: [function(require2, module3, exports3) {
          "use strict";
          var AirtableError = function() {
            function AirtableError2(error, message, statusCode) {
              this.error = error;
              this.message = message;
              this.statusCode = statusCode;
            }
            AirtableError2.prototype.toString = function() {
              return [
                this.message,
                "(",
                this.error,
                ")",
                this.statusCode ? "[Http code " + this.statusCode + "]" : ""
              ].join("");
            };
            return AirtableError2;
          }();
          module3.exports = AirtableError;
        }, {}], 3: [function(require2, module3, exports3) {
          "use strict";
          var __assign = this && this.__assign || function() {
            __assign = Object.assign || function(t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                  if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
              }
              return t;
            };
            return __assign.apply(this, arguments);
          };
          var __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : { "default": mod };
          };
          var get_1 = __importDefault(require2("lodash/get"));
          var isPlainObject_1 = __importDefault(require2("lodash/isPlainObject"));
          var keys_1 = __importDefault(require2("lodash/keys"));
          var fetch_1 = __importDefault(require2("./fetch"));
          var abort_controller_1 = __importDefault(require2("./abort-controller"));
          var object_to_query_param_string_1 = __importDefault(require2("./object_to_query_param_string"));
          var airtable_error_1 = __importDefault(require2("./airtable_error"));
          var table_1 = __importDefault(require2("./table"));
          var http_headers_1 = __importDefault(require2("./http_headers"));
          var run_action_1 = __importDefault(require2("./run_action"));
          var package_version_1 = __importDefault(require2("./package_version"));
          var exponential_backoff_with_jitter_1 = __importDefault(require2("./exponential_backoff_with_jitter"));
          var userAgent = "Airtable.js/" + package_version_1.default;
          var Base = function() {
            function Base2(airtable, baseId) {
              this._airtable = airtable;
              this._id = baseId;
            }
            Base2.prototype.table = function(tableName) {
              return new table_1.default(this, null, tableName);
            };
            Base2.prototype.makeRequest = function(options) {
              var _this = this;
              var _a;
              if (options === void 0) {
                options = {};
              }
              var method = get_1.default(options, "method", "GET").toUpperCase();
              var url = this._airtable._endpointUrl + "/v" + this._airtable._apiVersionMajor + "/" + this._id + get_1.default(options, "path", "/") + "?" + object_to_query_param_string_1.default(get_1.default(options, "qs", {}));
              var controller = new abort_controller_1.default();
              var headers = this._getRequestHeaders(Object.assign({}, this._airtable._customHeaders, (_a = options.headers) !== null && _a !== void 0 ? _a : {}));
              var requestOptions = {
                method,
                headers,
                signal: controller.signal
              };
              if ("body" in options && _canRequestMethodIncludeBody(method)) {
                requestOptions.body = JSON.stringify(options.body);
              }
              var timeout = setTimeout(function() {
                controller.abort();
              }, this._airtable._requestTimeout);
              return new Promise(function(resolve, reject) {
                fetch_1.default(url, requestOptions).then(function(resp) {
                  clearTimeout(timeout);
                  if (resp.status === 429 && !_this._airtable._noRetryIfRateLimited) {
                    var numAttempts_1 = get_1.default(options, "_numAttempts", 0);
                    var backoffDelayMs = exponential_backoff_with_jitter_1.default(numAttempts_1);
                    setTimeout(function() {
                      var newOptions = __assign(__assign({}, options), { _numAttempts: numAttempts_1 + 1 });
                      _this.makeRequest(newOptions).then(resolve).catch(reject);
                    }, backoffDelayMs);
                  } else {
                    resp.json().then(function(body) {
                      var err = _this._checkStatusForError(resp.status, body) || _getErrorForNonObjectBody(resp.status, body);
                      if (err) {
                        reject(err);
                      } else {
                        resolve({
                          statusCode: resp.status,
                          headers: resp.headers,
                          body
                        });
                      }
                    }).catch(function() {
                      var err = _getErrorForNonObjectBody(resp.status);
                      reject(err);
                    });
                  }
                }).catch(function(err) {
                  clearTimeout(timeout);
                  err = new airtable_error_1.default("CONNECTION_ERROR", err.message, null);
                  reject(err);
                });
              });
            };
            Base2.prototype.runAction = function(method, path, queryParams, bodyData, callback) {
              run_action_1.default(this, method, path, queryParams, bodyData, callback, 0);
            };
            Base2.prototype._getRequestHeaders = function(headers) {
              var result = new http_headers_1.default();
              result.set("Authorization", "Bearer " + this._airtable._apiKey);
              result.set("User-Agent", userAgent);
              result.set("Content-Type", "application/json");
              for (var _i = 0, _a = keys_1.default(headers); _i < _a.length; _i++) {
                var headerKey = _a[_i];
                result.set(headerKey, headers[headerKey]);
              }
              return result.toJSON();
            };
            Base2.prototype._checkStatusForError = function(statusCode, body) {
              var _a = (body !== null && body !== void 0 ? body : { error: {} }).error, error = _a === void 0 ? {} : _a;
              var type = error.type, message = error.message;
              if (statusCode === 401) {
                return new airtable_error_1.default("AUTHENTICATION_REQUIRED", "You should provide valid api key to perform this operation", statusCode);
              } else if (statusCode === 403) {
                return new airtable_error_1.default("NOT_AUTHORIZED", "You are not authorized to perform this operation", statusCode);
              } else if (statusCode === 404) {
                return new airtable_error_1.default("NOT_FOUND", message !== null && message !== void 0 ? message : "Could not find what you are looking for", statusCode);
              } else if (statusCode === 413) {
                return new airtable_error_1.default("REQUEST_TOO_LARGE", "Request body is too large", statusCode);
              } else if (statusCode === 422) {
                return new airtable_error_1.default(type !== null && type !== void 0 ? type : "UNPROCESSABLE_ENTITY", message !== null && message !== void 0 ? message : "The operation cannot be processed", statusCode);
              } else if (statusCode === 429) {
                return new airtable_error_1.default("TOO_MANY_REQUESTS", "You have made too many requests in a short period of time. Please retry your request later", statusCode);
              } else if (statusCode === 500) {
                return new airtable_error_1.default("SERVER_ERROR", "Try again. If the problem persists, contact support.", statusCode);
              } else if (statusCode === 503) {
                return new airtable_error_1.default("SERVICE_UNAVAILABLE", "The service is temporarily unavailable. Please retry shortly.", statusCode);
              } else if (statusCode >= 400) {
                return new airtable_error_1.default(type !== null && type !== void 0 ? type : "UNEXPECTED_ERROR", message !== null && message !== void 0 ? message : "An unexpected error occurred", statusCode);
              } else {
                return null;
              }
            };
            Base2.prototype.doCall = function(tableName) {
              return this.table(tableName);
            };
            Base2.prototype.getId = function() {
              return this._id;
            };
            Base2.createFunctor = function(airtable, baseId) {
              var base = new Base2(airtable, baseId);
              var baseFn = function(tableName) {
                return base.doCall(tableName);
              };
              baseFn._base = base;
              baseFn.table = base.table.bind(base);
              baseFn.makeRequest = base.makeRequest.bind(base);
              baseFn.runAction = base.runAction.bind(base);
              baseFn.getId = base.getId.bind(base);
              return baseFn;
            };
            return Base2;
          }();
          function _canRequestMethodIncludeBody(method) {
            return method !== "GET" && method !== "DELETE";
          }
          function _getErrorForNonObjectBody(statusCode, body) {
            if (isPlainObject_1.default(body)) {
              return null;
            } else {
              return new airtable_error_1.default("UNEXPECTED_ERROR", "The response from Airtable was invalid JSON. Please try again soon.", statusCode);
            }
          }
          module3.exports = Base;
        }, { "./abort-controller": 1, "./airtable_error": 2, "./exponential_backoff_with_jitter": 6, "./fetch": 7, "./http_headers": 9, "./object_to_query_param_string": 11, "./package_version": 12, "./run_action": 16, "./table": 17, "lodash/get": 77, "lodash/isPlainObject": 89, "lodash/keys": 93 }], 4: [function(require2, module3, exports3) {
          "use strict";
          function callbackToPromise(fn, context, callbackArgIndex) {
            if (callbackArgIndex === void 0) {
              callbackArgIndex = void 0;
            }
            return function() {
              var callArgs = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                callArgs[_i] = arguments[_i];
              }
              var thisCallbackArgIndex;
              if (callbackArgIndex === void 0) {
                thisCallbackArgIndex = callArgs.length > 0 ? callArgs.length - 1 : 0;
              } else {
                thisCallbackArgIndex = callbackArgIndex;
              }
              var callbackArg = callArgs[thisCallbackArgIndex];
              if (typeof callbackArg === "function") {
                fn.apply(context, callArgs);
                return void 0;
              } else {
                var args_1 = [];
                var argLen = Math.max(callArgs.length, thisCallbackArgIndex);
                for (var i = 0; i < argLen; i++) {
                  args_1.push(callArgs[i]);
                }
                return new Promise(function(resolve, reject) {
                  args_1.push(function(err, result) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(result);
                    }
                  });
                  fn.apply(context, args_1);
                });
              }
            };
          }
          module3.exports = callbackToPromise;
        }, {}], 5: [function(require2, module3, exports3) {
          "use strict";
          var didWarnForDeprecation = {};
          function deprecate(fn, key, message) {
            return function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              if (!didWarnForDeprecation[key]) {
                didWarnForDeprecation[key] = true;
                console.warn(message);
              }
              fn.apply(this, args);
            };
          }
          module3.exports = deprecate;
        }, {}], 6: [function(require2, module3, exports3) {
          "use strict";
          var __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : { "default": mod };
          };
          var internal_config_json_1 = __importDefault(require2("./internal_config.json"));
          function exponentialBackoffWithJitter(numberOfRetries) {
            var rawBackoffTimeMs = internal_config_json_1.default.INITIAL_RETRY_DELAY_IF_RATE_LIMITED * Math.pow(2, numberOfRetries);
            var clippedBackoffTimeMs = Math.min(internal_config_json_1.default.MAX_RETRY_DELAY_IF_RATE_LIMITED, rawBackoffTimeMs);
            var jitteredBackoffTimeMs = Math.random() * clippedBackoffTimeMs;
            return jitteredBackoffTimeMs;
          }
          module3.exports = exponentialBackoffWithJitter;
        }, { "./internal_config.json": 10 }], 7: [function(require2, module3, exports3) {
          "use strict";
          var __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : { "default": mod };
          };
          var node_fetch_1 = __importDefault(require2("node-fetch"));
          module3.exports = typeof window === "undefined" ? node_fetch_1.default : window.fetch.bind(window);
        }, { "node-fetch": 20 }], 8: [function(require2, module3, exports3) {
          "use strict";
          function has(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
          }
          module3.exports = has;
        }, {}], 9: [function(require2, module3, exports3) {
          "use strict";
          var __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : { "default": mod };
          };
          var keys_1 = __importDefault(require2("lodash/keys"));
          var isBrowser = typeof window !== "undefined";
          var HttpHeaders = function() {
            function HttpHeaders2() {
              this._headersByLowercasedKey = {};
            }
            HttpHeaders2.prototype.set = function(headerKey, headerValue) {
              var lowercasedKey = headerKey.toLowerCase();
              if (lowercasedKey === "x-airtable-user-agent") {
                lowercasedKey = "user-agent";
                headerKey = "User-Agent";
              }
              this._headersByLowercasedKey[lowercasedKey] = {
                headerKey,
                headerValue
              };
            };
            HttpHeaders2.prototype.toJSON = function() {
              var result = {};
              for (var _i = 0, _a = keys_1.default(this._headersByLowercasedKey); _i < _a.length; _i++) {
                var lowercasedKey = _a[_i];
                var headerDefinition = this._headersByLowercasedKey[lowercasedKey];
                var headerKey = void 0;
                if (isBrowser && lowercasedKey === "user-agent") {
                  headerKey = "X-Airtable-User-Agent";
                } else {
                  headerKey = headerDefinition.headerKey;
                }
                result[headerKey] = headerDefinition.headerValue;
              }
              return result;
            };
            return HttpHeaders2;
          }();
          module3.exports = HttpHeaders;
        }, { "lodash/keys": 93 }], 10: [function(require2, module3, exports3) {
          module3.exports = {
            "INITIAL_RETRY_DELAY_IF_RATE_LIMITED": 5e3,
            "MAX_RETRY_DELAY_IF_RATE_LIMITED": 6e5
          };
        }, {}], 11: [function(require2, module3, exports3) {
          "use strict";
          var __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : { "default": mod };
          };
          var isArray_1 = __importDefault(require2("lodash/isArray"));
          var isNil_1 = __importDefault(require2("lodash/isNil"));
          var keys_1 = __importDefault(require2("lodash/keys"));
          function buildParams(prefix, obj, addFn) {
            if (isArray_1.default(obj)) {
              for (var index = 0; index < obj.length; index++) {
                var value = obj[index];
                if (/\[\]$/.test(prefix)) {
                  addFn(prefix, value);
                } else {
                  buildParams(prefix + "[" + (typeof value === "object" && value !== null ? index : "") + "]", value, addFn);
                }
              }
            } else if (typeof obj === "object") {
              for (var _i = 0, _a = keys_1.default(obj); _i < _a.length; _i++) {
                var key = _a[_i];
                var value = obj[key];
                buildParams(prefix + "[" + key + "]", value, addFn);
              }
            } else {
              addFn(prefix, obj);
            }
          }
          function objectToQueryParamString(obj) {
            var parts = [];
            var addFn = function(key2, value2) {
              value2 = isNil_1.default(value2) ? "" : value2;
              parts.push(encodeURIComponent(key2) + "=" + encodeURIComponent(value2));
            };
            for (var _i = 0, _a = keys_1.default(obj); _i < _a.length; _i++) {
              var key = _a[_i];
              var value = obj[key];
              buildParams(key, value, addFn);
            }
            return parts.join("&").replace(/%20/g, "+");
          }
          module3.exports = objectToQueryParamString;
        }, { "lodash/isArray": 79, "lodash/isNil": 85, "lodash/keys": 93 }], 12: [function(require2, module3, exports3) {
          "use strict";
          module3.exports = "0.11.4";
        }, {}], 13: [function(require2, module3, exports3) {
          "use strict";
          var __assign = this && this.__assign || function() {
            __assign = Object.assign || function(t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                  if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
              }
              return t;
            };
            return __assign.apply(this, arguments);
          };
          var __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : { "default": mod };
          };
          var isFunction_1 = __importDefault(require2("lodash/isFunction"));
          var keys_1 = __importDefault(require2("lodash/keys"));
          var record_1 = __importDefault(require2("./record"));
          var callback_to_promise_1 = __importDefault(require2("./callback_to_promise"));
          var has_1 = __importDefault(require2("./has"));
          var query_params_1 = require2("./query_params");
          var Query = function() {
            function Query2(table, params) {
              this._table = table;
              this._params = params;
              this.firstPage = callback_to_promise_1.default(firstPage, this);
              this.eachPage = callback_to_promise_1.default(eachPage, this, 1);
              this.all = callback_to_promise_1.default(all, this);
            }
            Query2.validateParams = function(params) {
              var validParams = {};
              var ignoredKeys = [];
              var errors = [];
              for (var _i = 0, _a = keys_1.default(params); _i < _a.length; _i++) {
                var key = _a[_i];
                var value = params[key];
                if (has_1.default(Query2.paramValidators, key)) {
                  var validator = Query2.paramValidators[key];
                  var validationResult = validator(value);
                  if (validationResult.pass) {
                    validParams[key] = value;
                  } else {
                    errors.push(validationResult.error);
                  }
                } else {
                  ignoredKeys.push(key);
                }
              }
              return {
                validParams,
                ignoredKeys,
                errors
              };
            };
            Query2.paramValidators = query_params_1.paramValidators;
            return Query2;
          }();
          function firstPage(done) {
            if (!isFunction_1.default(done)) {
              throw new Error("The first parameter to `firstPage` must be a function");
            }
            this.eachPage(function(records) {
              done(null, records);
            }, function(error) {
              done(error, null);
            });
          }
          function eachPage(pageCallback, done) {
            var _this = this;
            if (!isFunction_1.default(pageCallback)) {
              throw new Error("The first parameter to `eachPage` must be a function");
            }
            if (!isFunction_1.default(done) && done !== void 0) {
              throw new Error("The second parameter to `eachPage` must be a function or undefined");
            }
            var path = "/" + this._table._urlEncodedNameOrId();
            var params = __assign({}, this._params);
            var inner = function() {
              _this._table._base.runAction("get", path, params, null, function(err, response, result) {
                if (err) {
                  done(err, null);
                } else {
                  var next = void 0;
                  if (result.offset) {
                    params.offset = result.offset;
                    next = inner;
                  } else {
                    next = function() {
                      done(null);
                    };
                  }
                  var records = result.records.map(function(recordJson) {
                    return new record_1.default(_this._table, null, recordJson);
                  });
                  pageCallback(records, next);
                }
              });
            };
            inner();
          }
          function all(done) {
            if (!isFunction_1.default(done)) {
              throw new Error("The first parameter to `all` must be a function");
            }
            var allRecords = [];
            this.eachPage(function(pageRecords, fetchNextPage) {
              allRecords.push.apply(allRecords, pageRecords);
              fetchNextPage();
            }, function(err) {
              if (err) {
                done(err, null);
              } else {
                done(null, allRecords);
              }
            });
          }
          module3.exports = Query;
        }, { "./callback_to_promise": 4, "./has": 8, "./query_params": 14, "./record": 15, "lodash/isFunction": 83, "lodash/keys": 93 }], 14: [function(require2, module3, exports3) {
          "use strict";
          var __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : { "default": mod };
          };
          Object.defineProperty(exports3, "__esModule", { value: true });
          exports3.paramValidators = void 0;
          var typecheck_1 = __importDefault(require2("./typecheck"));
          var isString_1 = __importDefault(require2("lodash/isString"));
          var isNumber_1 = __importDefault(require2("lodash/isNumber"));
          var isPlainObject_1 = __importDefault(require2("lodash/isPlainObject"));
          var isBoolean_1 = __importDefault(require2("lodash/isBoolean"));
          exports3.paramValidators = {
            fields: typecheck_1.default(typecheck_1.default.isArrayOf(isString_1.default), "the value for `fields` should be an array of strings"),
            filterByFormula: typecheck_1.default(isString_1.default, "the value for `filterByFormula` should be a string"),
            maxRecords: typecheck_1.default(isNumber_1.default, "the value for `maxRecords` should be a number"),
            pageSize: typecheck_1.default(isNumber_1.default, "the value for `pageSize` should be a number"),
            offset: typecheck_1.default(isNumber_1.default, "the value for `offset` should be a number"),
            sort: typecheck_1.default(typecheck_1.default.isArrayOf(function(obj) {
              return isPlainObject_1.default(obj) && isString_1.default(obj.field) && (obj.direction === void 0 || ["asc", "desc"].includes(obj.direction));
            }), 'the value for `sort` should be an array of sort objects. Each sort object must have a string `field` value, and an optional `direction` value that is "asc" or "desc".'),
            view: typecheck_1.default(isString_1.default, "the value for `view` should be a string"),
            cellFormat: typecheck_1.default(function(cellFormat) {
              return isString_1.default(cellFormat) && ["json", "string"].includes(cellFormat);
            }, 'the value for `cellFormat` should be "json" or "string"'),
            timeZone: typecheck_1.default(isString_1.default, "the value for `timeZone` should be a string"),
            userLocale: typecheck_1.default(isString_1.default, "the value for `userLocale` should be a string"),
            returnFieldsByFieldId: typecheck_1.default(isBoolean_1.default, "the value for `returnFieldsByFieldId` should be a boolean")
          };
        }, { "./typecheck": 18, "lodash/isBoolean": 81, "lodash/isNumber": 86, "lodash/isPlainObject": 89, "lodash/isString": 90 }], 15: [function(require2, module3, exports3) {
          "use strict";
          var __assign = this && this.__assign || function() {
            __assign = Object.assign || function(t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                  if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
              }
              return t;
            };
            return __assign.apply(this, arguments);
          };
          var __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : { "default": mod };
          };
          var callback_to_promise_1 = __importDefault(require2("./callback_to_promise"));
          var Record = function() {
            function Record2(table, recordId, recordJson) {
              this._table = table;
              this.id = recordId || recordJson.id;
              this.setRawJson(recordJson);
              this.save = callback_to_promise_1.default(save, this);
              this.patchUpdate = callback_to_promise_1.default(patchUpdate, this);
              this.putUpdate = callback_to_promise_1.default(putUpdate, this);
              this.destroy = callback_to_promise_1.default(destroy, this);
              this.fetch = callback_to_promise_1.default(fetch, this);
              this.updateFields = this.patchUpdate;
              this.replaceFields = this.putUpdate;
            }
            Record2.prototype.getId = function() {
              return this.id;
            };
            Record2.prototype.get = function(columnName) {
              return this.fields[columnName];
            };
            Record2.prototype.set = function(columnName, columnValue) {
              this.fields[columnName] = columnValue;
            };
            Record2.prototype.setRawJson = function(rawJson) {
              this._rawJson = rawJson;
              this.fields = this._rawJson && this._rawJson.fields || {};
            };
            return Record2;
          }();
          function save(done) {
            this.putUpdate(this.fields, done);
          }
          function patchUpdate(cellValuesByName, opts, done) {
            var _this = this;
            if (!done) {
              done = opts;
              opts = {};
            }
            var updateBody = __assign({ fields: cellValuesByName }, opts);
            this._table._base.runAction("patch", "/" + this._table._urlEncodedNameOrId() + "/" + this.id, {}, updateBody, function(err, response, results) {
              if (err) {
                done(err);
                return;
              }
              _this.setRawJson(results);
              done(null, _this);
            });
          }
          function putUpdate(cellValuesByName, opts, done) {
            var _this = this;
            if (!done) {
              done = opts;
              opts = {};
            }
            var updateBody = __assign({ fields: cellValuesByName }, opts);
            this._table._base.runAction("put", "/" + this._table._urlEncodedNameOrId() + "/" + this.id, {}, updateBody, function(err, response, results) {
              if (err) {
                done(err);
                return;
              }
              _this.setRawJson(results);
              done(null, _this);
            });
          }
          function destroy(done) {
            var _this = this;
            this._table._base.runAction("delete", "/" + this._table._urlEncodedNameOrId() + "/" + this.id, {}, null, function(err) {
              if (err) {
                done(err);
                return;
              }
              done(null, _this);
            });
          }
          function fetch(done) {
            var _this = this;
            this._table._base.runAction("get", "/" + this._table._urlEncodedNameOrId() + "/" + this.id, {}, null, function(err, response, results) {
              if (err) {
                done(err);
                return;
              }
              _this.setRawJson(results);
              done(null, _this);
            });
          }
          module3.exports = Record;
        }, { "./callback_to_promise": 4 }], 16: [function(require2, module3, exports3) {
          "use strict";
          var __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : { "default": mod };
          };
          var exponential_backoff_with_jitter_1 = __importDefault(require2("./exponential_backoff_with_jitter"));
          var object_to_query_param_string_1 = __importDefault(require2("./object_to_query_param_string"));
          var package_version_1 = __importDefault(require2("./package_version"));
          var fetch_1 = __importDefault(require2("./fetch"));
          var abort_controller_1 = __importDefault(require2("./abort-controller"));
          var userAgent = "Airtable.js/" + package_version_1.default;
          function runAction(base, method, path, queryParams, bodyData, callback, numAttempts) {
            var url = base._airtable._endpointUrl + "/v" + base._airtable._apiVersionMajor + "/" + base._id + path + "?" + object_to_query_param_string_1.default(queryParams);
            var headers = {
              authorization: "Bearer " + base._airtable._apiKey,
              "x-api-version": base._airtable._apiVersion,
              "x-airtable-application-id": base.getId(),
              "content-type": "application/json"
            };
            var isBrowser = typeof window !== "undefined";
            if (isBrowser) {
              headers["x-airtable-user-agent"] = userAgent;
            } else {
              headers["User-Agent"] = userAgent;
            }
            var controller = new abort_controller_1.default();
            var normalizedMethod = method.toUpperCase();
            var options = {
              method: normalizedMethod,
              headers,
              signal: controller.signal
            };
            if (bodyData !== null) {
              if (normalizedMethod === "GET" || normalizedMethod === "HEAD") {
                console.warn("body argument to runAction are ignored with GET or HEAD requests");
              } else {
                options.body = JSON.stringify(bodyData);
              }
            }
            var timeout = setTimeout(function() {
              controller.abort();
            }, base._airtable._requestTimeout);
            fetch_1.default(url, options).then(function(resp) {
              clearTimeout(timeout);
              if (resp.status === 429 && !base._airtable._noRetryIfRateLimited) {
                var backoffDelayMs = exponential_backoff_with_jitter_1.default(numAttempts);
                setTimeout(function() {
                  runAction(base, method, path, queryParams, bodyData, callback, numAttempts + 1);
                }, backoffDelayMs);
              } else {
                resp.json().then(function(body) {
                  var error = base._checkStatusForError(resp.status, body);
                  var r = {};
                  Object.keys(resp).forEach(function(property) {
                    r[property] = resp[property];
                  });
                  r.body = body;
                  r.statusCode = resp.status;
                  callback(error, r, body);
                }).catch(function() {
                  callback(base._checkStatusForError(resp.status));
                });
              }
            }).catch(function(error) {
              clearTimeout(timeout);
              callback(error);
            });
          }
          module3.exports = runAction;
        }, { "./abort-controller": 1, "./exponential_backoff_with_jitter": 6, "./fetch": 7, "./object_to_query_param_string": 11, "./package_version": 12 }], 17: [function(require2, module3, exports3) {
          "use strict";
          var __assign = this && this.__assign || function() {
            __assign = Object.assign || function(t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                  if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
              }
              return t;
            };
            return __assign.apply(this, arguments);
          };
          var __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : { "default": mod };
          };
          var isPlainObject_1 = __importDefault(require2("lodash/isPlainObject"));
          var deprecate_1 = __importDefault(require2("./deprecate"));
          var query_1 = __importDefault(require2("./query"));
          var record_1 = __importDefault(require2("./record"));
          var callback_to_promise_1 = __importDefault(require2("./callback_to_promise"));
          var Table = function() {
            function Table2(base, tableId, tableName) {
              if (!tableId && !tableName) {
                throw new Error("Table name or table ID is required");
              }
              this._base = base;
              this.id = tableId;
              this.name = tableName;
              this.find = callback_to_promise_1.default(this._findRecordById, this);
              this.select = this._selectRecords.bind(this);
              this.create = callback_to_promise_1.default(this._createRecords, this);
              this.update = callback_to_promise_1.default(this._updateRecords.bind(this, false), this);
              this.replace = callback_to_promise_1.default(this._updateRecords.bind(this, true), this);
              this.destroy = callback_to_promise_1.default(this._destroyRecord, this);
              this.list = deprecate_1.default(this._listRecords.bind(this), "table.list", "Airtable: `list()` is deprecated. Use `select()` instead.");
              this.forEach = deprecate_1.default(this._forEachRecord.bind(this), "table.forEach", "Airtable: `forEach()` is deprecated. Use `select()` instead.");
            }
            Table2.prototype._findRecordById = function(recordId, done) {
              var record = new record_1.default(this, recordId);
              record.fetch(done);
            };
            Table2.prototype._selectRecords = function(params) {
              if (params === void 0) {
                params = {};
              }
              if (arguments.length > 1) {
                console.warn("Airtable: `select` takes only one parameter, but it was given " + arguments.length + " parameters. Use `eachPage` or `firstPage` to fetch records.");
              }
              if (isPlainObject_1.default(params)) {
                var validationResults = query_1.default.validateParams(params);
                if (validationResults.errors.length) {
                  var formattedErrors = validationResults.errors.map(function(error) {
                    return "  * " + error;
                  });
                  throw new Error("Airtable: invalid parameters for `select`:\n" + formattedErrors.join("\n"));
                }
                if (validationResults.ignoredKeys.length) {
                  console.warn("Airtable: the following parameters to `select` will be ignored: " + validationResults.ignoredKeys.join(", "));
                }
                return new query_1.default(this, validationResults.validParams);
              } else {
                throw new Error("Airtable: the parameter for `select` should be a plain object or undefined.");
              }
            };
            Table2.prototype._urlEncodedNameOrId = function() {
              return this.id || encodeURIComponent(this.name);
            };
            Table2.prototype._createRecords = function(recordsData, optionalParameters, done) {
              var _this = this;
              var isCreatingMultipleRecords = Array.isArray(recordsData);
              if (!done) {
                done = optionalParameters;
                optionalParameters = {};
              }
              var requestData;
              if (isCreatingMultipleRecords) {
                requestData = __assign({ records: recordsData }, optionalParameters);
              } else {
                requestData = __assign({ fields: recordsData }, optionalParameters);
              }
              this._base.runAction("post", "/" + this._urlEncodedNameOrId() + "/", {}, requestData, function(err, resp, body) {
                if (err) {
                  done(err);
                  return;
                }
                var result;
                if (isCreatingMultipleRecords) {
                  result = body.records.map(function(record) {
                    return new record_1.default(_this, record.id, record);
                  });
                } else {
                  result = new record_1.default(_this, body.id, body);
                }
                done(null, result);
              });
            };
            Table2.prototype._updateRecords = function(isDestructiveUpdate, recordsDataOrRecordId, recordDataOrOptsOrDone, optsOrDone, done) {
              var _this = this;
              var opts;
              if (Array.isArray(recordsDataOrRecordId)) {
                var recordsData = recordsDataOrRecordId;
                opts = isPlainObject_1.default(recordDataOrOptsOrDone) ? recordDataOrOptsOrDone : {};
                done = optsOrDone || recordDataOrOptsOrDone;
                var method = isDestructiveUpdate ? "put" : "patch";
                var requestData = __assign({ records: recordsData }, opts);
                this._base.runAction(method, "/" + this._urlEncodedNameOrId() + "/", {}, requestData, function(err, resp, body) {
                  if (err) {
                    done(err);
                    return;
                  }
                  var result = body.records.map(function(record2) {
                    return new record_1.default(_this, record2.id, record2);
                  });
                  done(null, result);
                });
              } else {
                var recordId = recordsDataOrRecordId;
                var recordData = recordDataOrOptsOrDone;
                opts = isPlainObject_1.default(optsOrDone) ? optsOrDone : {};
                done = done || optsOrDone;
                var record = new record_1.default(this, recordId);
                if (isDestructiveUpdate) {
                  record.putUpdate(recordData, opts, done);
                } else {
                  record.patchUpdate(recordData, opts, done);
                }
              }
            };
            Table2.prototype._destroyRecord = function(recordIdsOrId, done) {
              var _this = this;
              if (Array.isArray(recordIdsOrId)) {
                var queryParams = { records: recordIdsOrId };
                this._base.runAction("delete", "/" + this._urlEncodedNameOrId(), queryParams, null, function(err, response, results) {
                  if (err) {
                    done(err);
                    return;
                  }
                  var records = results.records.map(function(_a) {
                    var id = _a.id;
                    return new record_1.default(_this, id, null);
                  });
                  done(null, records);
                });
              } else {
                var record = new record_1.default(this, recordIdsOrId);
                record.destroy(done);
              }
            };
            Table2.prototype._listRecords = function(limit, offset, opts, done) {
              var _this = this;
              if (!done) {
                done = opts;
                opts = {};
              }
              var listRecordsParameters = __assign({
                limit,
                offset
              }, opts);
              this._base.runAction("get", "/" + this._urlEncodedNameOrId() + "/", listRecordsParameters, null, function(err, response, results) {
                if (err) {
                  done(err);
                  return;
                }
                var records = results.records.map(function(recordJson) {
                  return new record_1.default(_this, null, recordJson);
                });
                done(null, records, results.offset);
              });
            };
            Table2.prototype._forEachRecord = function(opts, callback, done) {
              var _this = this;
              if (arguments.length === 2) {
                done = callback;
                callback = opts;
                opts = {};
              }
              var limit = Table2.__recordsPerPageForIteration || 100;
              var offset = null;
              var nextPage = function() {
                _this._listRecords(limit, offset, opts, function(err, page, newOffset) {
                  if (err) {
                    done(err);
                    return;
                  }
                  for (var index = 0; index < page.length; index++) {
                    callback(page[index]);
                  }
                  if (newOffset) {
                    offset = newOffset;
                    nextPage();
                  } else {
                    done();
                  }
                });
              };
              nextPage();
            };
            return Table2;
          }();
          module3.exports = Table;
        }, { "./callback_to_promise": 4, "./deprecate": 5, "./query": 13, "./record": 15, "lodash/isPlainObject": 89 }], 18: [function(require2, module3, exports3) {
          "use strict";
          function check(fn, error) {
            return function(value) {
              if (fn(value)) {
                return { pass: true };
              } else {
                return { pass: false, error };
              }
            };
          }
          check.isOneOf = function isOneOf(options) {
            return options.includes.bind(options);
          };
          check.isArrayOf = function(itemValidator) {
            return function(value) {
              return Array.isArray(value) && value.every(itemValidator);
            };
          };
          module3.exports = check;
        }, {}], 19: [function(require2, module3, exports3) {
          "use strict";
          Object.defineProperty(exports3, "__esModule", { value: true });
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            return Constructor;
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, {
              constructor: {
                value: subClass,
                writable: true,
                configurable: true
              }
            });
            if (superClass)
              _setPrototypeOf(subClass, superClass);
          }
          function _getPrototypeOf(o) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
              return o2.__proto__ || Object.getPrototypeOf(o2);
            };
            return _getPrototypeOf(o);
          }
          function _setPrototypeOf(o, p) {
            _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
              o2.__proto__ = p2;
              return o2;
            };
            return _setPrototypeOf(o, p);
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (typeof call === "object" || typeof call === "function")) {
              return call;
            }
            return _assertThisInitialized(self2);
          }
          function _superPropBase(object, property) {
            while (!Object.prototype.hasOwnProperty.call(object, property)) {
              object = _getPrototypeOf(object);
              if (object === null)
                break;
            }
            return object;
          }
          function _get(target, property, receiver) {
            if (typeof Reflect !== "undefined" && Reflect.get) {
              _get = Reflect.get;
            } else {
              _get = function _get2(target2, property2, receiver2) {
                var base = _superPropBase(target2, property2);
                if (!base)
                  return;
                var desc = Object.getOwnPropertyDescriptor(base, property2);
                if (desc.get) {
                  return desc.get.call(receiver2);
                }
                return desc.value;
              };
            }
            return _get(target, property, receiver || target);
          }
          var Emitter = /* @__PURE__ */ function() {
            function Emitter2() {
              _classCallCheck(this, Emitter2);
              Object.defineProperty(this, "listeners", {
                value: {},
                writable: true,
                configurable: true
              });
            }
            _createClass(Emitter2, [{
              key: "addEventListener",
              value: function addEventListener(type, callback) {
                if (!(type in this.listeners)) {
                  this.listeners[type] = [];
                }
                this.listeners[type].push(callback);
              }
            }, {
              key: "removeEventListener",
              value: function removeEventListener(type, callback) {
                if (!(type in this.listeners)) {
                  return;
                }
                var stack = this.listeners[type];
                for (var i = 0, l = stack.length; i < l; i++) {
                  if (stack[i] === callback) {
                    stack.splice(i, 1);
                    return;
                  }
                }
              }
            }, {
              key: "dispatchEvent",
              value: function dispatchEvent(event) {
                var _this = this;
                if (!(event.type in this.listeners)) {
                  return;
                }
                var debounce = function debounce2(callback) {
                  setTimeout(function() {
                    return callback.call(_this, event);
                  });
                };
                var stack = this.listeners[event.type];
                for (var i = 0, l = stack.length; i < l; i++) {
                  debounce(stack[i]);
                }
                return !event.defaultPrevented;
              }
            }]);
            return Emitter2;
          }();
          var AbortSignal = /* @__PURE__ */ function(_Emitter) {
            _inherits(AbortSignal2, _Emitter);
            function AbortSignal2() {
              var _this2;
              _classCallCheck(this, AbortSignal2);
              _this2 = _possibleConstructorReturn(this, _getPrototypeOf(AbortSignal2).call(this));
              if (!_this2.listeners) {
                Emitter.call(_assertThisInitialized(_this2));
              }
              Object.defineProperty(_assertThisInitialized(_this2), "aborted", {
                value: false,
                writable: true,
                configurable: true
              });
              Object.defineProperty(_assertThisInitialized(_this2), "onabort", {
                value: null,
                writable: true,
                configurable: true
              });
              return _this2;
            }
            _createClass(AbortSignal2, [{
              key: "toString",
              value: function toString() {
                return "[object AbortSignal]";
              }
            }, {
              key: "dispatchEvent",
              value: function dispatchEvent(event) {
                if (event.type === "abort") {
                  this.aborted = true;
                  if (typeof this.onabort === "function") {
                    this.onabort.call(this, event);
                  }
                }
                _get(_getPrototypeOf(AbortSignal2.prototype), "dispatchEvent", this).call(this, event);
              }
            }]);
            return AbortSignal2;
          }(Emitter);
          var AbortController = /* @__PURE__ */ function() {
            function AbortController2() {
              _classCallCheck(this, AbortController2);
              Object.defineProperty(this, "signal", {
                value: new AbortSignal(),
                writable: true,
                configurable: true
              });
            }
            _createClass(AbortController2, [{
              key: "abort",
              value: function abort() {
                var event;
                try {
                  event = new Event("abort");
                } catch (e) {
                  if (typeof document !== "undefined") {
                    if (!document.createEvent) {
                      event = document.createEventObject();
                      event.type = "abort";
                    } else {
                      event = document.createEvent("Event");
                      event.initEvent("abort", false, false);
                    }
                  } else {
                    event = {
                      type: "abort",
                      bubbles: false,
                      cancelable: false
                    };
                  }
                }
                this.signal.dispatchEvent(event);
              }
            }, {
              key: "toString",
              value: function toString() {
                return "[object AbortController]";
              }
            }]);
            return AbortController2;
          }();
          if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            AbortController.prototype[Symbol.toStringTag] = "AbortController";
            AbortSignal.prototype[Symbol.toStringTag] = "AbortSignal";
          }
          function polyfillNeeded(self2) {
            if (self2.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL) {
              console.log("__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill");
              return true;
            }
            return typeof self2.Request === "function" && !self2.Request.prototype.hasOwnProperty("signal") || !self2.AbortController;
          }
          function abortableFetchDecorator(patchTargets) {
            if (typeof patchTargets === "function") {
              patchTargets = {
                fetch: patchTargets
              };
            }
            var _patchTargets = patchTargets, fetch = _patchTargets.fetch, _patchTargets$Request = _patchTargets.Request, NativeRequest = _patchTargets$Request === void 0 ? fetch.Request : _patchTargets$Request, NativeAbortController = _patchTargets.AbortController, _patchTargets$__FORCE = _patchTargets.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL, __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL = _patchTargets$__FORCE === void 0 ? false : _patchTargets$__FORCE;
            if (!polyfillNeeded({
              fetch,
              Request: NativeRequest,
              AbortController: NativeAbortController,
              __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL
            })) {
              return {
                fetch,
                Request: Request2
              };
            }
            var Request2 = NativeRequest;
            if (Request2 && !Request2.prototype.hasOwnProperty("signal") || __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL) {
              Request2 = function Request3(input, init) {
                var signal;
                if (init && init.signal) {
                  signal = init.signal;
                  delete init.signal;
                }
                var request = new NativeRequest(input, init);
                if (signal) {
                  Object.defineProperty(request, "signal", {
                    writable: false,
                    enumerable: false,
                    configurable: true,
                    value: signal
                  });
                }
                return request;
              };
              Request2.prototype = NativeRequest.prototype;
            }
            var realFetch = fetch;
            var abortableFetch = function abortableFetch2(input, init) {
              var signal = Request2 && Request2.prototype.isPrototypeOf(input) ? input.signal : init ? init.signal : void 0;
              if (signal) {
                var abortError;
                try {
                  abortError = new DOMException("Aborted", "AbortError");
                } catch (err) {
                  abortError = new Error("Aborted");
                  abortError.name = "AbortError";
                }
                if (signal.aborted) {
                  return Promise.reject(abortError);
                }
                var cancellation = new Promise(function(_, reject) {
                  signal.addEventListener("abort", function() {
                    return reject(abortError);
                  }, {
                    once: true
                  });
                });
                if (init && init.signal) {
                  delete init.signal;
                }
                return Promise.race([cancellation, realFetch(input, init)]);
              }
              return realFetch(input, init);
            };
            return {
              fetch: abortableFetch,
              Request: Request2
            };
          }
          exports3.AbortController = AbortController;
          exports3.AbortSignal = AbortSignal;
          exports3.abortableFetch = abortableFetchDecorator;
        }, {}], 20: [function(require2, module3, exports3) {
        }, {}], 21: [function(require2, module3, exports3) {
          var hashClear = require2("./_hashClear"), hashDelete = require2("./_hashDelete"), hashGet = require2("./_hashGet"), hashHas = require2("./_hashHas"), hashSet = require2("./_hashSet");
          function Hash(entries) {
            var index = -1, length = entries == null ? 0 : entries.length;
            this.clear();
            while (++index < length) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          Hash.prototype.clear = hashClear;
          Hash.prototype["delete"] = hashDelete;
          Hash.prototype.get = hashGet;
          Hash.prototype.has = hashHas;
          Hash.prototype.set = hashSet;
          module3.exports = Hash;
        }, { "./_hashClear": 46, "./_hashDelete": 47, "./_hashGet": 48, "./_hashHas": 49, "./_hashSet": 50 }], 22: [function(require2, module3, exports3) {
          var listCacheClear = require2("./_listCacheClear"), listCacheDelete = require2("./_listCacheDelete"), listCacheGet = require2("./_listCacheGet"), listCacheHas = require2("./_listCacheHas"), listCacheSet = require2("./_listCacheSet");
          function ListCache(entries) {
            var index = -1, length = entries == null ? 0 : entries.length;
            this.clear();
            while (++index < length) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          ListCache.prototype.clear = listCacheClear;
          ListCache.prototype["delete"] = listCacheDelete;
          ListCache.prototype.get = listCacheGet;
          ListCache.prototype.has = listCacheHas;
          ListCache.prototype.set = listCacheSet;
          module3.exports = ListCache;
        }, { "./_listCacheClear": 56, "./_listCacheDelete": 57, "./_listCacheGet": 58, "./_listCacheHas": 59, "./_listCacheSet": 60 }], 23: [function(require2, module3, exports3) {
          var getNative = require2("./_getNative"), root = require2("./_root");
          var Map = getNative(root, "Map");
          module3.exports = Map;
        }, { "./_getNative": 42, "./_root": 72 }], 24: [function(require2, module3, exports3) {
          var mapCacheClear = require2("./_mapCacheClear"), mapCacheDelete = require2("./_mapCacheDelete"), mapCacheGet = require2("./_mapCacheGet"), mapCacheHas = require2("./_mapCacheHas"), mapCacheSet = require2("./_mapCacheSet");
          function MapCache(entries) {
            var index = -1, length = entries == null ? 0 : entries.length;
            this.clear();
            while (++index < length) {
              var entry = entries[index];
              this.set(entry[0], entry[1]);
            }
          }
          MapCache.prototype.clear = mapCacheClear;
          MapCache.prototype["delete"] = mapCacheDelete;
          MapCache.prototype.get = mapCacheGet;
          MapCache.prototype.has = mapCacheHas;
          MapCache.prototype.set = mapCacheSet;
          module3.exports = MapCache;
        }, { "./_mapCacheClear": 61, "./_mapCacheDelete": 62, "./_mapCacheGet": 63, "./_mapCacheHas": 64, "./_mapCacheSet": 65 }], 25: [function(require2, module3, exports3) {
          var root = require2("./_root");
          var Symbol2 = root.Symbol;
          module3.exports = Symbol2;
        }, { "./_root": 72 }], 26: [function(require2, module3, exports3) {
          var baseTimes = require2("./_baseTimes"), isArguments = require2("./isArguments"), isArray = require2("./isArray"), isBuffer = require2("./isBuffer"), isIndex = require2("./_isIndex"), isTypedArray = require2("./isTypedArray");
          var objectProto = Object.prototype;
          var hasOwnProperty = objectProto.hasOwnProperty;
          function arrayLikeKeys(value, inherited) {
            var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
            for (var key in value) {
              if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
                result.push(key);
              }
            }
            return result;
          }
          module3.exports = arrayLikeKeys;
        }, { "./_baseTimes": 35, "./_isIndex": 51, "./isArguments": 78, "./isArray": 79, "./isBuffer": 82, "./isTypedArray": 92 }], 27: [function(require2, module3, exports3) {
          function arrayMap(array, iteratee) {
            var index = -1, length = array == null ? 0 : array.length, result = Array(length);
            while (++index < length) {
              result[index] = iteratee(array[index], index, array);
            }
            return result;
          }
          module3.exports = arrayMap;
        }, {}], 28: [function(require2, module3, exports3) {
          var eq = require2("./eq");
          function assocIndexOf(array, key) {
            var length = array.length;
            while (length--) {
              if (eq(array[length][0], key)) {
                return length;
              }
            }
            return -1;
          }
          module3.exports = assocIndexOf;
        }, { "./eq": 76 }], 29: [function(require2, module3, exports3) {
          var castPath = require2("./_castPath"), toKey = require2("./_toKey");
          function baseGet(object, path) {
            path = castPath(path, object);
            var index = 0, length = path.length;
            while (object != null && index < length) {
              object = object[toKey(path[index++])];
            }
            return index && index == length ? object : void 0;
          }
          module3.exports = baseGet;
        }, { "./_castPath": 38, "./_toKey": 74 }], 30: [function(require2, module3, exports3) {
          var Symbol2 = require2("./_Symbol"), getRawTag = require2("./_getRawTag"), objectToString = require2("./_objectToString");
          var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
          var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
          function baseGetTag(value) {
            if (value == null) {
              return value === void 0 ? undefinedTag : nullTag;
            }
            return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
          }
          module3.exports = baseGetTag;
        }, { "./_Symbol": 25, "./_getRawTag": 44, "./_objectToString": 70 }], 31: [function(require2, module3, exports3) {
          var baseGetTag = require2("./_baseGetTag"), isObjectLike = require2("./isObjectLike");
          var argsTag = "[object Arguments]";
          function baseIsArguments(value) {
            return isObjectLike(value) && baseGetTag(value) == argsTag;
          }
          module3.exports = baseIsArguments;
        }, { "./_baseGetTag": 30, "./isObjectLike": 88 }], 32: [function(require2, module3, exports3) {
          var isFunction = require2("./isFunction"), isMasked = require2("./_isMasked"), isObject = require2("./isObject"), toSource = require2("./_toSource");
          var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
          var reIsHostCtor = /^\[object .+?Constructor\]$/;
          var funcProto = Function.prototype, objectProto = Object.prototype;
          var funcToString = funcProto.toString;
          var hasOwnProperty = objectProto.hasOwnProperty;
          var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
          function baseIsNative(value) {
            if (!isObject(value) || isMasked(value)) {
              return false;
            }
            var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
            return pattern.test(toSource(value));
          }
          module3.exports = baseIsNative;
        }, { "./_isMasked": 54, "./_toSource": 75, "./isFunction": 83, "./isObject": 87 }], 33: [function(require2, module3, exports3) {
          var baseGetTag = require2("./_baseGetTag"), isLength = require2("./isLength"), isObjectLike = require2("./isObjectLike");
          var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]";
          var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
          var typedArrayTags = {};
          typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
          typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
          function baseIsTypedArray(value) {
            return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
          }
          module3.exports = baseIsTypedArray;
        }, { "./_baseGetTag": 30, "./isLength": 84, "./isObjectLike": 88 }], 34: [function(require2, module3, exports3) {
          var isPrototype = require2("./_isPrototype"), nativeKeys = require2("./_nativeKeys");
          var objectProto = Object.prototype;
          var hasOwnProperty = objectProto.hasOwnProperty;
          function baseKeys(object) {
            if (!isPrototype(object)) {
              return nativeKeys(object);
            }
            var result = [];
            for (var key in Object(object)) {
              if (hasOwnProperty.call(object, key) && key != "constructor") {
                result.push(key);
              }
            }
            return result;
          }
          module3.exports = baseKeys;
        }, { "./_isPrototype": 55, "./_nativeKeys": 68 }], 35: [function(require2, module3, exports3) {
          function baseTimes(n, iteratee) {
            var index = -1, result = Array(n);
            while (++index < n) {
              result[index] = iteratee(index);
            }
            return result;
          }
          module3.exports = baseTimes;
        }, {}], 36: [function(require2, module3, exports3) {
          var Symbol2 = require2("./_Symbol"), arrayMap = require2("./_arrayMap"), isArray = require2("./isArray"), isSymbol = require2("./isSymbol");
          var INFINITY = 1 / 0;
          var symbolProto = Symbol2 ? Symbol2.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
          function baseToString(value) {
            if (typeof value == "string") {
              return value;
            }
            if (isArray(value)) {
              return arrayMap(value, baseToString) + "";
            }
            if (isSymbol(value)) {
              return symbolToString ? symbolToString.call(value) : "";
            }
            var result = value + "";
            return result == "0" && 1 / value == -INFINITY ? "-0" : result;
          }
          module3.exports = baseToString;
        }, { "./_Symbol": 25, "./_arrayMap": 27, "./isArray": 79, "./isSymbol": 91 }], 37: [function(require2, module3, exports3) {
          function baseUnary(func) {
            return function(value) {
              return func(value);
            };
          }
          module3.exports = baseUnary;
        }, {}], 38: [function(require2, module3, exports3) {
          var isArray = require2("./isArray"), isKey = require2("./_isKey"), stringToPath = require2("./_stringToPath"), toString = require2("./toString");
          function castPath(value, object) {
            if (isArray(value)) {
              return value;
            }
            return isKey(value, object) ? [value] : stringToPath(toString(value));
          }
          module3.exports = castPath;
        }, { "./_isKey": 52, "./_stringToPath": 73, "./isArray": 79, "./toString": 96 }], 39: [function(require2, module3, exports3) {
          var root = require2("./_root");
          var coreJsData = root["__core-js_shared__"];
          module3.exports = coreJsData;
        }, { "./_root": 72 }], 40: [function(require2, module3, exports3) {
          (function(global2) {
            var freeGlobal = typeof global2 == "object" && global2 && global2.Object === Object && global2;
            module3.exports = freeGlobal;
          }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, {}], 41: [function(require2, module3, exports3) {
          var isKeyable = require2("./_isKeyable");
          function getMapData(map, key) {
            var data = map.__data__;
            return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
          }
          module3.exports = getMapData;
        }, { "./_isKeyable": 53 }], 42: [function(require2, module3, exports3) {
          var baseIsNative = require2("./_baseIsNative"), getValue = require2("./_getValue");
          function getNative(object, key) {
            var value = getValue(object, key);
            return baseIsNative(value) ? value : void 0;
          }
          module3.exports = getNative;
        }, { "./_baseIsNative": 32, "./_getValue": 45 }], 43: [function(require2, module3, exports3) {
          var overArg = require2("./_overArg");
          var getPrototype = overArg(Object.getPrototypeOf, Object);
          module3.exports = getPrototype;
        }, { "./_overArg": 71 }], 44: [function(require2, module3, exports3) {
          var Symbol2 = require2("./_Symbol");
          var objectProto = Object.prototype;
          var hasOwnProperty = objectProto.hasOwnProperty;
          var nativeObjectToString = objectProto.toString;
          var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
          function getRawTag(value) {
            var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
            try {
              value[symToStringTag] = void 0;
              var unmasked = true;
            } catch (e) {
            }
            var result = nativeObjectToString.call(value);
            if (unmasked) {
              if (isOwn) {
                value[symToStringTag] = tag;
              } else {
                delete value[symToStringTag];
              }
            }
            return result;
          }
          module3.exports = getRawTag;
        }, { "./_Symbol": 25 }], 45: [function(require2, module3, exports3) {
          function getValue(object, key) {
            return object == null ? void 0 : object[key];
          }
          module3.exports = getValue;
        }, {}], 46: [function(require2, module3, exports3) {
          var nativeCreate = require2("./_nativeCreate");
          function hashClear() {
            this.__data__ = nativeCreate ? nativeCreate(null) : {};
            this.size = 0;
          }
          module3.exports = hashClear;
        }, { "./_nativeCreate": 67 }], 47: [function(require2, module3, exports3) {
          function hashDelete(key) {
            var result = this.has(key) && delete this.__data__[key];
            this.size -= result ? 1 : 0;
            return result;
          }
          module3.exports = hashDelete;
        }, {}], 48: [function(require2, module3, exports3) {
          var nativeCreate = require2("./_nativeCreate");
          var HASH_UNDEFINED = "__lodash_hash_undefined__";
          var objectProto = Object.prototype;
          var hasOwnProperty = objectProto.hasOwnProperty;
          function hashGet(key) {
            var data = this.__data__;
            if (nativeCreate) {
              var result = data[key];
              return result === HASH_UNDEFINED ? void 0 : result;
            }
            return hasOwnProperty.call(data, key) ? data[key] : void 0;
          }
          module3.exports = hashGet;
        }, { "./_nativeCreate": 67 }], 49: [function(require2, module3, exports3) {
          var nativeCreate = require2("./_nativeCreate");
          var objectProto = Object.prototype;
          var hasOwnProperty = objectProto.hasOwnProperty;
          function hashHas(key) {
            var data = this.__data__;
            return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
          }
          module3.exports = hashHas;
        }, { "./_nativeCreate": 67 }], 50: [function(require2, module3, exports3) {
          var nativeCreate = require2("./_nativeCreate");
          var HASH_UNDEFINED = "__lodash_hash_undefined__";
          function hashSet(key, value) {
            var data = this.__data__;
            this.size += this.has(key) ? 0 : 1;
            data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
            return this;
          }
          module3.exports = hashSet;
        }, { "./_nativeCreate": 67 }], 51: [function(require2, module3, exports3) {
          var MAX_SAFE_INTEGER = 9007199254740991;
          var reIsUint = /^(?:0|[1-9]\d*)$/;
          function isIndex(value, length) {
            var type = typeof value;
            length = length == null ? MAX_SAFE_INTEGER : length;
            return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
          }
          module3.exports = isIndex;
        }, {}], 52: [function(require2, module3, exports3) {
          var isArray = require2("./isArray"), isSymbol = require2("./isSymbol");
          var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
          function isKey(value, object) {
            if (isArray(value)) {
              return false;
            }
            var type = typeof value;
            if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
              return true;
            }
            return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
          }
          module3.exports = isKey;
        }, { "./isArray": 79, "./isSymbol": 91 }], 53: [function(require2, module3, exports3) {
          function isKeyable(value) {
            var type = typeof value;
            return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
          }
          module3.exports = isKeyable;
        }, {}], 54: [function(require2, module3, exports3) {
          var coreJsData = require2("./_coreJsData");
          var maskSrcKey = function() {
            var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
            return uid ? "Symbol(src)_1." + uid : "";
          }();
          function isMasked(func) {
            return !!maskSrcKey && maskSrcKey in func;
          }
          module3.exports = isMasked;
        }, { "./_coreJsData": 39 }], 55: [function(require2, module3, exports3) {
          var objectProto = Object.prototype;
          function isPrototype(value) {
            var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
            return value === proto;
          }
          module3.exports = isPrototype;
        }, {}], 56: [function(require2, module3, exports3) {
          function listCacheClear() {
            this.__data__ = [];
            this.size = 0;
          }
          module3.exports = listCacheClear;
        }, {}], 57: [function(require2, module3, exports3) {
          var assocIndexOf = require2("./_assocIndexOf");
          var arrayProto = Array.prototype;
          var splice = arrayProto.splice;
          function listCacheDelete(key) {
            var data = this.__data__, index = assocIndexOf(data, key);
            if (index < 0) {
              return false;
            }
            var lastIndex = data.length - 1;
            if (index == lastIndex) {
              data.pop();
            } else {
              splice.call(data, index, 1);
            }
            --this.size;
            return true;
          }
          module3.exports = listCacheDelete;
        }, { "./_assocIndexOf": 28 }], 58: [function(require2, module3, exports3) {
          var assocIndexOf = require2("./_assocIndexOf");
          function listCacheGet(key) {
            var data = this.__data__, index = assocIndexOf(data, key);
            return index < 0 ? void 0 : data[index][1];
          }
          module3.exports = listCacheGet;
        }, { "./_assocIndexOf": 28 }], 59: [function(require2, module3, exports3) {
          var assocIndexOf = require2("./_assocIndexOf");
          function listCacheHas(key) {
            return assocIndexOf(this.__data__, key) > -1;
          }
          module3.exports = listCacheHas;
        }, { "./_assocIndexOf": 28 }], 60: [function(require2, module3, exports3) {
          var assocIndexOf = require2("./_assocIndexOf");
          function listCacheSet(key, value) {
            var data = this.__data__, index = assocIndexOf(data, key);
            if (index < 0) {
              ++this.size;
              data.push([key, value]);
            } else {
              data[index][1] = value;
            }
            return this;
          }
          module3.exports = listCacheSet;
        }, { "./_assocIndexOf": 28 }], 61: [function(require2, module3, exports3) {
          var Hash = require2("./_Hash"), ListCache = require2("./_ListCache"), Map = require2("./_Map");
          function mapCacheClear() {
            this.size = 0;
            this.__data__ = {
              "hash": new Hash(),
              "map": new (Map || ListCache)(),
              "string": new Hash()
            };
          }
          module3.exports = mapCacheClear;
        }, { "./_Hash": 21, "./_ListCache": 22, "./_Map": 23 }], 62: [function(require2, module3, exports3) {
          var getMapData = require2("./_getMapData");
          function mapCacheDelete(key) {
            var result = getMapData(this, key)["delete"](key);
            this.size -= result ? 1 : 0;
            return result;
          }
          module3.exports = mapCacheDelete;
        }, { "./_getMapData": 41 }], 63: [function(require2, module3, exports3) {
          var getMapData = require2("./_getMapData");
          function mapCacheGet(key) {
            return getMapData(this, key).get(key);
          }
          module3.exports = mapCacheGet;
        }, { "./_getMapData": 41 }], 64: [function(require2, module3, exports3) {
          var getMapData = require2("./_getMapData");
          function mapCacheHas(key) {
            return getMapData(this, key).has(key);
          }
          module3.exports = mapCacheHas;
        }, { "./_getMapData": 41 }], 65: [function(require2, module3, exports3) {
          var getMapData = require2("./_getMapData");
          function mapCacheSet(key, value) {
            var data = getMapData(this, key), size = data.size;
            data.set(key, value);
            this.size += data.size == size ? 0 : 1;
            return this;
          }
          module3.exports = mapCacheSet;
        }, { "./_getMapData": 41 }], 66: [function(require2, module3, exports3) {
          var memoize = require2("./memoize");
          var MAX_MEMOIZE_SIZE = 500;
          function memoizeCapped(func) {
            var result = memoize(func, function(key) {
              if (cache.size === MAX_MEMOIZE_SIZE) {
                cache.clear();
              }
              return key;
            });
            var cache = result.cache;
            return result;
          }
          module3.exports = memoizeCapped;
        }, { "./memoize": 94 }], 67: [function(require2, module3, exports3) {
          var getNative = require2("./_getNative");
          var nativeCreate = getNative(Object, "create");
          module3.exports = nativeCreate;
        }, { "./_getNative": 42 }], 68: [function(require2, module3, exports3) {
          var overArg = require2("./_overArg");
          var nativeKeys = overArg(Object.keys, Object);
          module3.exports = nativeKeys;
        }, { "./_overArg": 71 }], 69: [function(require2, module3, exports3) {
          var freeGlobal = require2("./_freeGlobal");
          var freeExports = typeof exports3 == "object" && exports3 && !exports3.nodeType && exports3;
          var freeModule = freeExports && typeof module3 == "object" && module3 && !module3.nodeType && module3;
          var moduleExports = freeModule && freeModule.exports === freeExports;
          var freeProcess = moduleExports && freeGlobal.process;
          var nodeUtil = function() {
            try {
              var types = freeModule && freeModule.require && freeModule.require("util").types;
              if (types) {
                return types;
              }
              return freeProcess && freeProcess.binding && freeProcess.binding("util");
            } catch (e) {
            }
          }();
          module3.exports = nodeUtil;
        }, { "./_freeGlobal": 40 }], 70: [function(require2, module3, exports3) {
          var objectProto = Object.prototype;
          var nativeObjectToString = objectProto.toString;
          function objectToString(value) {
            return nativeObjectToString.call(value);
          }
          module3.exports = objectToString;
        }, {}], 71: [function(require2, module3, exports3) {
          function overArg(func, transform) {
            return function(arg) {
              return func(transform(arg));
            };
          }
          module3.exports = overArg;
        }, {}], 72: [function(require2, module3, exports3) {
          var freeGlobal = require2("./_freeGlobal");
          var freeSelf = typeof self == "object" && self && self.Object === Object && self;
          var root = freeGlobal || freeSelf || Function("return this")();
          module3.exports = root;
        }, { "./_freeGlobal": 40 }], 73: [function(require2, module3, exports3) {
          var memoizeCapped = require2("./_memoizeCapped");
          var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
          var reEscapeChar = /\\(\\)?/g;
          var stringToPath = memoizeCapped(function(string) {
            var result = [];
            if (string.charCodeAt(0) === 46) {
              result.push("");
            }
            string.replace(rePropName, function(match, number, quote, subString) {
              result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
            });
            return result;
          });
          module3.exports = stringToPath;
        }, { "./_memoizeCapped": 66 }], 74: [function(require2, module3, exports3) {
          var isSymbol = require2("./isSymbol");
          var INFINITY = 1 / 0;
          function toKey(value) {
            if (typeof value == "string" || isSymbol(value)) {
              return value;
            }
            var result = value + "";
            return result == "0" && 1 / value == -INFINITY ? "-0" : result;
          }
          module3.exports = toKey;
        }, { "./isSymbol": 91 }], 75: [function(require2, module3, exports3) {
          var funcProto = Function.prototype;
          var funcToString = funcProto.toString;
          function toSource(func) {
            if (func != null) {
              try {
                return funcToString.call(func);
              } catch (e) {
              }
              try {
                return func + "";
              } catch (e) {
              }
            }
            return "";
          }
          module3.exports = toSource;
        }, {}], 76: [function(require2, module3, exports3) {
          function eq(value, other) {
            return value === other || value !== value && other !== other;
          }
          module3.exports = eq;
        }, {}], 77: [function(require2, module3, exports3) {
          var baseGet = require2("./_baseGet");
          function get(object, path, defaultValue) {
            var result = object == null ? void 0 : baseGet(object, path);
            return result === void 0 ? defaultValue : result;
          }
          module3.exports = get;
        }, { "./_baseGet": 29 }], 78: [function(require2, module3, exports3) {
          var baseIsArguments = require2("./_baseIsArguments"), isObjectLike = require2("./isObjectLike");
          var objectProto = Object.prototype;
          var hasOwnProperty = objectProto.hasOwnProperty;
          var propertyIsEnumerable = objectProto.propertyIsEnumerable;
          var isArguments = baseIsArguments(function() {
            return arguments;
          }()) ? baseIsArguments : function(value) {
            return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
          };
          module3.exports = isArguments;
        }, { "./_baseIsArguments": 31, "./isObjectLike": 88 }], 79: [function(require2, module3, exports3) {
          var isArray = Array.isArray;
          module3.exports = isArray;
        }, {}], 80: [function(require2, module3, exports3) {
          var isFunction = require2("./isFunction"), isLength = require2("./isLength");
          function isArrayLike(value) {
            return value != null && isLength(value.length) && !isFunction(value);
          }
          module3.exports = isArrayLike;
        }, { "./isFunction": 83, "./isLength": 84 }], 81: [function(require2, module3, exports3) {
          var baseGetTag = require2("./_baseGetTag"), isObjectLike = require2("./isObjectLike");
          var boolTag = "[object Boolean]";
          function isBoolean(value) {
            return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
          }
          module3.exports = isBoolean;
        }, { "./_baseGetTag": 30, "./isObjectLike": 88 }], 82: [function(require2, module3, exports3) {
          var root = require2("./_root"), stubFalse = require2("./stubFalse");
          var freeExports = typeof exports3 == "object" && exports3 && !exports3.nodeType && exports3;
          var freeModule = freeExports && typeof module3 == "object" && module3 && !module3.nodeType && module3;
          var moduleExports = freeModule && freeModule.exports === freeExports;
          var Buffer2 = moduleExports ? root.Buffer : void 0;
          var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
          var isBuffer = nativeIsBuffer || stubFalse;
          module3.exports = isBuffer;
        }, { "./_root": 72, "./stubFalse": 95 }], 83: [function(require2, module3, exports3) {
          var baseGetTag = require2("./_baseGetTag"), isObject = require2("./isObject");
          var asyncTag = "[object AsyncFunction]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
          function isFunction(value) {
            if (!isObject(value)) {
              return false;
            }
            var tag = baseGetTag(value);
            return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
          }
          module3.exports = isFunction;
        }, { "./_baseGetTag": 30, "./isObject": 87 }], 84: [function(require2, module3, exports3) {
          var MAX_SAFE_INTEGER = 9007199254740991;
          function isLength(value) {
            return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
          }
          module3.exports = isLength;
        }, {}], 85: [function(require2, module3, exports3) {
          function isNil(value) {
            return value == null;
          }
          module3.exports = isNil;
        }, {}], 86: [function(require2, module3, exports3) {
          var baseGetTag = require2("./_baseGetTag"), isObjectLike = require2("./isObjectLike");
          var numberTag = "[object Number]";
          function isNumber(value) {
            return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
          }
          module3.exports = isNumber;
        }, { "./_baseGetTag": 30, "./isObjectLike": 88 }], 87: [function(require2, module3, exports3) {
          function isObject(value) {
            var type = typeof value;
            return value != null && (type == "object" || type == "function");
          }
          module3.exports = isObject;
        }, {}], 88: [function(require2, module3, exports3) {
          function isObjectLike(value) {
            return value != null && typeof value == "object";
          }
          module3.exports = isObjectLike;
        }, {}], 89: [function(require2, module3, exports3) {
          var baseGetTag = require2("./_baseGetTag"), getPrototype = require2("./_getPrototype"), isObjectLike = require2("./isObjectLike");
          var objectTag = "[object Object]";
          var funcProto = Function.prototype, objectProto = Object.prototype;
          var funcToString = funcProto.toString;
          var hasOwnProperty = objectProto.hasOwnProperty;
          var objectCtorString = funcToString.call(Object);
          function isPlainObject(value) {
            if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
              return false;
            }
            var proto = getPrototype(value);
            if (proto === null) {
              return true;
            }
            var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
            return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
          }
          module3.exports = isPlainObject;
        }, { "./_baseGetTag": 30, "./_getPrototype": 43, "./isObjectLike": 88 }], 90: [function(require2, module3, exports3) {
          var baseGetTag = require2("./_baseGetTag"), isArray = require2("./isArray"), isObjectLike = require2("./isObjectLike");
          var stringTag = "[object String]";
          function isString(value) {
            return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
          }
          module3.exports = isString;
        }, { "./_baseGetTag": 30, "./isArray": 79, "./isObjectLike": 88 }], 91: [function(require2, module3, exports3) {
          var baseGetTag = require2("./_baseGetTag"), isObjectLike = require2("./isObjectLike");
          var symbolTag = "[object Symbol]";
          function isSymbol(value) {
            return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
          }
          module3.exports = isSymbol;
        }, { "./_baseGetTag": 30, "./isObjectLike": 88 }], 92: [function(require2, module3, exports3) {
          var baseIsTypedArray = require2("./_baseIsTypedArray"), baseUnary = require2("./_baseUnary"), nodeUtil = require2("./_nodeUtil");
          var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
          var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
          module3.exports = isTypedArray;
        }, { "./_baseIsTypedArray": 33, "./_baseUnary": 37, "./_nodeUtil": 69 }], 93: [function(require2, module3, exports3) {
          var arrayLikeKeys = require2("./_arrayLikeKeys"), baseKeys = require2("./_baseKeys"), isArrayLike = require2("./isArrayLike");
          function keys(object) {
            return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
          }
          module3.exports = keys;
        }, { "./_arrayLikeKeys": 26, "./_baseKeys": 34, "./isArrayLike": 80 }], 94: [function(require2, module3, exports3) {
          var MapCache = require2("./_MapCache");
          var FUNC_ERROR_TEXT = "Expected a function";
          function memoize(func, resolver) {
            if (typeof func != "function" || resolver != null && typeof resolver != "function") {
              throw new TypeError(FUNC_ERROR_TEXT);
            }
            var memoized = function() {
              var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
              if (cache.has(key)) {
                return cache.get(key);
              }
              var result = func.apply(this, args);
              memoized.cache = cache.set(key, result) || cache;
              return result;
            };
            memoized.cache = new (memoize.Cache || MapCache)();
            return memoized;
          }
          memoize.Cache = MapCache;
          module3.exports = memoize;
        }, { "./_MapCache": 24 }], 95: [function(require2, module3, exports3) {
          function stubFalse() {
            return false;
          }
          module3.exports = stubFalse;
        }, {}], 96: [function(require2, module3, exports3) {
          var baseToString = require2("./_baseToString");
          function toString(value) {
            return value == null ? "" : baseToString(value);
          }
          module3.exports = toString;
        }, { "./_baseToString": 36 }], "airtable": [function(require2, module3, exports3) {
          "use strict";
          var __importDefault = this && this.__importDefault || function(mod) {
            return mod && mod.__esModule ? mod : { "default": mod };
          };
          var base_1 = __importDefault(require2("./base"));
          var record_1 = __importDefault(require2("./record"));
          var table_1 = __importDefault(require2("./table"));
          var airtable_error_1 = __importDefault(require2("./airtable_error"));
          var Airtable2 = function() {
            function Airtable3(opts) {
              if (opts === void 0) {
                opts = {};
              }
              var defaultConfig = Airtable3.default_config();
              var apiVersion = opts.apiVersion || Airtable3.apiVersion || defaultConfig.apiVersion;
              Object.defineProperties(this, {
                _apiKey: {
                  value: opts.apiKey || Airtable3.apiKey || defaultConfig.apiKey
                },
                _apiVersion: {
                  value: apiVersion
                },
                _apiVersionMajor: {
                  value: apiVersion.split(".")[0]
                },
                _customHeaders: {
                  value: opts.customHeaders || {}
                },
                _endpointUrl: {
                  value: opts.endpointUrl || Airtable3.endpointUrl || defaultConfig.endpointUrl
                },
                _noRetryIfRateLimited: {
                  value: opts.noRetryIfRateLimited || Airtable3.noRetryIfRateLimited || defaultConfig.noRetryIfRateLimited
                },
                _requestTimeout: {
                  value: opts.requestTimeout || Airtable3.requestTimeout || defaultConfig.requestTimeout
                }
              });
              if (!this._apiKey) {
                throw new Error("An API key is required to connect to Airtable");
              }
            }
            Airtable3.prototype.base = function(baseId) {
              return base_1.default.createFunctor(this, baseId);
            };
            Airtable3.default_config = function() {
              return {
                endpointUrl: "https://api.airtable.com",
                apiVersion: "0.1.0",
                apiKey: void 0,
                noRetryIfRateLimited: false,
                requestTimeout: 300 * 1e3
              };
            };
            Airtable3.configure = function(_a) {
              var apiKey = _a.apiKey, endpointUrl = _a.endpointUrl, apiVersion = _a.apiVersion, noRetryIfRateLimited = _a.noRetryIfRateLimited, requestTimeout = _a.requestTimeout;
              Airtable3.apiKey = apiKey;
              Airtable3.endpointUrl = endpointUrl;
              Airtable3.apiVersion = apiVersion;
              Airtable3.noRetryIfRateLimited = noRetryIfRateLimited;
              Airtable3.requestTimeout = requestTimeout;
            };
            Airtable3.base = function(baseId) {
              return new Airtable3().base(baseId);
            };
            Airtable3.Base = base_1.default;
            Airtable3.Record = record_1.default;
            Airtable3.Table = table_1.default;
            Airtable3.Error = airtable_error_1.default;
            return Airtable3;
          }();
          module3.exports = Airtable2;
        }, { "./airtable_error": 2, "./base": 3, "./record": 15, "./table": 17 }] }, {}, ["airtable"])("airtable");
      });
    }
  });

  // src/cms/populate-external-data/index.ts
  var Airtable = require_airtable_umd();
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsfilter",
    async (filtersInstances) => {
      const [filtersInstance] = filtersInstances;
      const { listInstance } = filtersInstance;
      const [firstItem] = listInstance.items;
      const itemTemplateElement = firstItem.element;
      const products = await fetchProducts();
      listInstance.clearItems();
      const newItems = products.map((product) => {
        return createItem(product, itemTemplateElement);
      });
      await listInstance.addItems(newItems);
      const filterTemplateElement = filtersInstance.form.querySelector('[data-element="filter"]');
      if (!filterTemplateElement)
        return;
      const filtersWrapper = filterTemplateElement.parentElement;
      if (!filtersWrapper)
        return;
      filterTemplateElement.remove();
      const categories = collectCategories(products);
      for (const category of categories) {
        const newFilter = createFilter(category, filterTemplateElement);
        if (!newFilter)
          continue;
        filtersWrapper.append(newFilter);
      }
      filtersInstance.storeFiltersData();
    }
  ]);
  var fetchProducts = async () => {
    return new Promise((resolve, reject) => {
      var base = new Airtable({ apiKey: "keyVaqaXzXRDSsa31" }).base("app6CABYWEh8dxlQd");
      let data = [];
      base("Product Details").select({
        view: "Grid view"
      }).eachPage(function page(records, fetchNextPage) {
        try {
          records.forEach(function(record) {
            let image = "";
            try {
              image = record.get("Product Image")[0].url;
            } catch (error) {
            }
            const item = {
              partNumber: record?.get("Part Number") ?? " ",
              description: record?.get("Description") ?? " ",
              productCategory: record?.get("Product Category") ?? " ",
              productSegment: record?.get("Product Segment") ?? " ",
              ampRating: record?.get("Amp Rating") ?? " ",
              voltage: record?.get("Voltage") ?? " ",
              characteristics: record?.get("Characteristics") ?? " ",
              size: record?.get("Size") ?? " ",
              individualDatasheet: record?.get("Individual Datasheet") ?? " ",
              sectionDatasheet: record?.get("Section Datasheet") ?? " ",
              image
            };
            data.push(item);
          });
        } catch (e) {
          console.log("error inside eachPage => ", e);
        }
        fetchNextPage();
      }, function done(err) {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(data);
      });
    });
  };
  var createItem = (product, templateElement) => {
    const newItem = templateElement.cloneNode(true);
    const image = newItem.querySelector('[data-element="image"]');
    const sectionDatasheet = newItem.querySelector('[data-element="section datasheet"]');
    const individualDatasheet = newItem.querySelector('[data-element="individual datasheet"]');
    const partNumber = newItem.querySelector('[data-element="part number"]');
    const productCategory = newItem.querySelector('[data-element="product category"]');
    const productSegment = newItem.querySelector('[data-element="product segment"]');
    const description = newItem.querySelector('[data-element="description"]');
    const ampRating = newItem.querySelector('[data-element="amp rating"]');
    const voltage = newItem.querySelector('[data-element="voltage"]');
    const characteristics = newItem.querySelector('[data-element="characteristics"]');
    const size = newItem.querySelector('[data-element="size"]');
    if (image)
      image.src = product.image;
    if (individualDatasheet)
      individualDatasheet.href = product.individualDatasheet;
    if (sectionDatasheet)
      sectionDatasheet.href = product.sectionDatasheet;
    if (partNumber)
      partNumber.textContent = product.partNumber;
    if (productCategory)
      productCategory.textContent = product.productCategory;
    if (productSegment)
      productSegment.textContent = product.productSegment;
    if (description)
      description.textContent = product.description;
    if (ampRating)
      ampRating.textContent = product.ampRating;
    if (voltage)
      voltage.textContent = product.voltage;
    if (characteristics)
      characteristics.textContent = product.characteristics;
    if (size)
      size.textContent = product.size;
    return newItem;
  };
  var collectCategories = (products) => {
    const categories = /* @__PURE__ */ new Set();
    for (const { productCategory } of products) {
      categories.add(productCategory);
    }
    return [...categories];
  };
  var createFilter = (category, templateElement) => {
    const newFilter = templateElement.cloneNode(true);
    const label = newFilter.querySelector("span");
    const radio = newFilter.querySelector("input");
    if (!label || !radio)
      return;
    label.textContent = category;
    radio.value = category;
    return newFilter;
  };
})();
