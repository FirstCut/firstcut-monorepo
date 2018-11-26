"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

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

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n  type Query {\n    _empty: String\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var baseQuery = (0, _graphqlTag.default)(_templateObject());
var resolvers = (0, _lodash.merge)(resolvers, _firstcutProjectRequests.resolvers, _firstcutProjectTemplates.resolvers);

var logInput =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(resolve, root, args, context, info) {
    var result;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return resolve(root, args, context, info);

          case 2:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function logInput(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

var eventMiddleware = {
  Query: {
    projectTemplates: function () {
      var _projectTemplates = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(resolve, parent, args, context, info) {
        var result;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log('PROJECT TEMP{LAtes');
                _context2.next = 3;
                return resolve(parent, args, context, info);

              case 3:
                result = _context2.sent;
                return _context2.abrupt("return", result);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function projectTemplates(_x6, _x7, _x8, _x9, _x10) {
        return _projectTemplates.apply(this, arguments);
      };
    }()
  },
  Mutation: {
    addRequest: function () {
      var _addRequest = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(resolve, parent, args, context, info) {
        var result;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                console.log('ADD REQUEST MIDDLEWARE');
                _context3.next = 3;
                return resolve(parent, args, context, info);

              case 3:
                result = _context3.sent;
                return _context3.abrupt("return", result);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function addRequest(_x11, _x12, _x13, _x14, _x15) {
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
var playground = process.env.NODE_ENV === 'development';
var options = {
  port: port,
  playground: playground,
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