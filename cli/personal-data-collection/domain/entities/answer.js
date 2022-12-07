'use strict'
exports.__esModule = true
exports.createAnswer = void 0
var cuid_1 = require('cuid')
var createAnswer = function (_a) {
  var _b = _a.id,
    id = _b === void 0 ? (0, cuid_1['default'])() : _b,
    _c = _a.questionId,
    questionId = _c === void 0 ? 'N/A' : _c,
    _d = _a.response,
    response = _d === void 0 ? false : _d,
    _e = _a.timestamp,
    timestamp = _e === void 0 ? new Date() : _e
  return {
    id: id,
    questionId: questionId,
    response: response,
    timestamp: timestamp,
  }
}
exports.createAnswer = createAnswer
