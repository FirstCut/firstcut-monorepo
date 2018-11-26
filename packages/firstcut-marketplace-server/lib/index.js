"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _firstcutProjectTemplates = require("firstcut-project-templates");

var _firstcutProjectRequests = require("firstcut-project-requests");

var _lodash = require("lodash");

var _mongodb = require("mongodb");

var _graphqlYoga = require("graphql-yoga");

var _graphqlTools = require("graphql-tools");

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

var _graphqlMiddleware = require("graphql-middleware");

var _firstcutEventHandler = _interopRequireWildcard(require("firstcut-event-handler"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n  type Query {\n    _empty: String\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var isDevelopment = process.env.NODE_ENV === 'development';
var baseQuery = (0, _graphqlTag.default)(_templateObject());
var resolvers = (0, _lodash.merge)(resolvers, _firstcutProjectRequests.resolvers, _firstcutProjectTemplates.resolvers);
var eventMiddleware = {
  Query: {
    projectTemplates: function () {
      var _projectTemplates = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(resolve, parent, args, context, info) {
        var result;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, _firstcutEventHandler.default)((0, _objectSpread2.default)({
                  event: _firstcutEventHandler.EVENTS.PROJECT_REQUEST
                }, args));
                _context.next = 3;
                return resolve(parent, args, context, info);

              case 3:
                result = _context.sent;
                return _context.abrupt("return", result);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function projectTemplates(_x, _x2, _x3, _x4, _x5) {
        return _projectTemplates.apply(this, arguments);
      };
    }()
  },
  Mutation: {
    addRequest: function () {
      var _addRequest = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(resolve, parent, args, context, info) {
        var result;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return resolve(parent, args, context, info);

              case 2:
                result = _context2.sent;
                return _context2.abrupt("return", result);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function addRequest(_x6, _x7, _x8, _x9, _x10) {
        return _addRequest.apply(this, arguments);
      };
    }()
  }
};
var schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: [baseQuery, _firstcutProjectTemplates.typeDefs, _firstcutProjectRequests.typeDefs],
  resolvers: resolvers
});
var withMiddleware = (0, _graphqlMiddleware.applyMiddleware)(schema, eventMiddleware);
var server = new _graphqlYoga.GraphQLServer({
  schema: withMiddleware
});
var port = process.env.PORT || 4000;
var options = {
  port: port,
  playground: isDevelopment,
  endpoint: '/graphql'
};
server.start(options, function () {
  return console.log('🚀 Server ready at', port);
});
var url = process.env.MONGO_URL;
var dbName = 'firstcut-dev';

_mongodb.MongoClient.connect(url, function (err, client) {
  var db = client.db(dbName);
  (0, _firstcutProjectTemplates.init)(db.collection('project_templates'));
  (0, _firstcutProjectRequests.init)(db.collection('project_requests'));
}); // server.listen({ port: PORT }).then(() => console.log(`Running at http://localhost:${PORT}${server.graphqlPath}`));