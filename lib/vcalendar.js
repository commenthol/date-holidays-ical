'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require('./templates'),
    tVcalendar = _require.tVcalendar,
    tVevent = _require.tVevent;

var random = function random() {
  return Math.random().toString(16).substr(2);
};

/**
 * generate a simple uid
 * @private
 * @return {String} uid
 */
function uid() {
  var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;

  var str = '';
  while (str.length < len) {
    str += random();
  }return str.substr(0, len) + '@date-holidays';
}

/**
 * prefill a number with `len` zeroes
 * @private
 * @param {Number} num
 * @param {Number} [len]
 * @return {String} prefixed number
 */
function zero(num) {
  var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  var str = Array(len).join('0') + '' + num;
  return str.substring(str.length - len);
}

/**
 * convert an Iso Date or String to Vcalendar Date
 * @param {Date|String} date
 * @return {String}
 * @example
 * ```
 * toIso('2016-01-02T11:29:54.925Z')
 * //> '20160102T112954Z'
 * ```
 */
function toISO(date) {
  if ((typeof date === 'undefined' ? 'undefined' : _typeof(date)) === 'object') {
    date = date.toISOString();
  }
  return date.replace(/[:-]/g, '').replace(/\.\d{3}/g, '');
}

/**
 * convert a date string using offset days to a string
 * @private
 * @param {String} str
 * @param {Number} [offset] - offset to date described by str in milliseconds
 * @return {String} date string `YYYYMMDD`
 * @example
 * ```
 * toDay('2016-01-02 05:00:01')
 * //> '2016012'
 * ```
 */
function toDay(str) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  // offset only full days
  offset = Math.ceil(offset / 86400000) * 86400000;

  var ticks = +new Date(str) + offset;
  var date = new Date(ticks);
  var s = zero(date.getFullYear(), 4) + zero(date.getMonth() + 1) + zero(date.getDate());
  return s;
}

/**
 * apply template on date object from `date-holidays`
 * @private
 * @param {Object} date
 * @param {Object} [opts]
 * @param {Boolean} [opts.fullday] - if `true` then event is treated to be on complete day
 * @return {String} a single vCalendar vevent
 */
function vevent(date) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!date) {
    return '\n';
  }

  var now = new Date();
  var dtstart = toISO(date.start);
  var dtend = toISO(date.end);
  var note = date.note || '';
  var type = date.type || '';

  if (opts.fullday) {
    dtend = toDay(date.date, +date.end - +date.start);
    dtstart = toDay(date.date);
  }

  var event = {
    created: toISO(now),
    summary: date.name,
    dtstart: dtstart,
    dtend: dtend,
    description: type + (type && note ? ' - ' : '') + note,
    busy: type === 'public',
    uid: uid()
  };

  return tVevent(event);
}

/**
 * get vCalendar
 * @param {Object} date
 * @param {Object} [opts]
 * @return {String} vCalendar
 */
function vcalendar(dates, opts) {
  var vevents = dates.map(function (date) {
    return vevent(date, opts);
  });
  return tVcalendar(vevents);
}

module.exports = vcalendar;