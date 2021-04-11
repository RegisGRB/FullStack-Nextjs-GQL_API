"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _apolloServerExpress = require("apollo-server-express");

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _schemas = _interopRequireDefault(require("./schemas"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

var Config = _interopRequireWildcard(require("./configs"));

var _cors = _interopRequireDefault(require("cors"));

var _Auth = _interopRequireDefault(require("./middleware/Auth"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require('dotenv').config();

var startServer = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var app, stripe, server;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            app = (0, _express["default"])();
            stripe = require("stripe")("sk_test_51IdKa0EWLULmTbAKV5JLEAXK4XalxwTWVRVYc9nl2bUEeHLnvZ8IFXnuxUdNjtVT0nktMU79VVeuDsSHE58KO5nF00Bjcw0zFE");
            app.use(_express["default"]["static"]("."));
            app.use(_express["default"].json()); // const corsOptions = {
            //   origin: process.env.CORS_ORIGIN,
            //   credentials: true,
            //   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
            // };

            server = new _apolloServerExpress.ApolloServer({
              typeDefs: _schemas["default"],
              resolvers: _resolvers["default"],
              context: function context(_ref2) {
                var req = _ref2.req,
                    res = _ref2.res,
                    next = _ref2.next;
                return {
                  req: req,
                  res: res,
                  next: next
                };
              }
            });
            app.use(_Auth["default"]);
            server.applyMiddleware({
              app: app
            });
            app.use((0, _cors["default"])());
            app.post("/create-payment-intent", /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
                var Price, paymentIntent;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        Price = req.body.Price; // Create a PaymentIntent with the order amount and currency

                        _context.next = 3;
                        return stripe.paymentIntents.create({
                          amount: Math.round(Price * 100),
                          currency: "usd"
                        });

                      case 3:
                        paymentIntent = _context.sent;
                        res.send({
                          clientSecret: paymentIntent.client_secret
                        });

                      case 5:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x, _x2) {
                return _ref3.apply(this, arguments);
              };
            }());
            _context2.next = 11;
            return _mongoose["default"].connect(Config.db.url, {
              useNewUrlParser: true,
              useCreateIndex: true,
              useUnifiedTopology: true,
              useFindAndModify: true
            }).then(function () {
              console.log("Successfully connect to database");
            })["catch"](function (err) {
              console.log('couldn"t not connect to database', err);
              process.exit(-1);
            });

          case 11:
            app.listen({
              port: Config.server.port
            }, function (e) {
              return console.log("\uD83D\uDE80 GraphQl ready at http://localhost:".concat(Config.server.port).concat(server.graphqlPath));
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function startServer() {
    return _ref.apply(this, arguments);
  };
}();

startServer(); // require('dotenv').config()
// const app = require("./services/server.service");
// const mongoService = require("./services/mongoose.service");
// mongoService.dbConnect();
// app.start();