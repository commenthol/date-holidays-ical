'use strict'

var tmpl = require('resig')

// Vcalendar template
var tVcalendar = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//date/holidays//NONSGML v1.0//EN',
  'METHOD:PUBLISH',
  '<%= vevents %>' +
  'END:VCALENDAR'
].join('\\n') + '\\n'

// Vevent template
var tVevent = [
  'BEGIN:VEVENT',
  'CREATED:<%= created %>',
  'LAST-MODIFIED:<%= created %>',
  'DTSTAMP:<%= created %>',
  'SUMMARY:<%= summary %>',
  'DTSTART;VALUE=DATE:<%= dtstart %>',
  'DTEND;VALUE=DATE:<%= dtend %>',
  '<% if (description) { %>' +
  'DESCRIPTION:<%= description %>',
  '<% } %>' +
  'TRANSP:<% if (busy) { %>OPAQUE<% } else { %>TRANSPARENT<% } %>',
  'UID:<%= uid %>',
  'END:VEVENT'
].join('\\n') + '\\n'

/**
 * generate a simple uid
 * @private
 * @return {String} uid
 */
function uid () {
  var uid = (Math.random() * 1e16).toString(16) +
    '@date-holidays'
  return uid
}

/**
 * prefill a number with `len` zeroes
 * @private
 * @param {Number} num
 * @param {Number} [len]
 * @return {String} prefixed number
 */
function zero (num, len) {
  len = len || 2
  var str = Array(len).join('0') + '' + num
  return str.substring(str.length - len)
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
function toISO (date) {
  if (typeof date === 'object') {
    date = date.toISOString()
  }
  return date
    .replace(/[:-]/g, '')
    .replace(/\.\d{3}/g, '')
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
function toDay (str, offset) {
  offset = offset || 0
  // offset only full days
  offset = Math.ceil(offset / 86400000) * 86400000

  var date = +(new Date(str)) + (offset)
  date = new Date(date)
  var s = zero(date.getFullYear(), 4) +
    zero(date.getMonth() + 1) +
    zero(date.getDate())
  return s
}

/**
 * apply template on date object from `date-holidays`
 * @private
 * @param {Object} date
 * @param {Object} [opts]
 * @return {String} a single vCalendar vevent
 */
function vevent (date, opts) {
  opts = opts || {}

  if (!date) {
    return '\n'
  }

  var now = (new Date())
  var dtstart = toISO(date.start)
  var dtend = toISO(date.end)
  var note = date.note || ''
  var type = date.type || ''

  if (opts.fullday) {
    dtend = toDay(date.date, +date.end - +date.start)
    dtstart = toDay(date.date)
  }

  var event = {
    created: toISO(now),
    summary: date.name,
    dtstart: dtstart,
    dtend: dtend,
    description: type + (type && note ? ' - ' : '') + note,
    busy: (type === 'public' ? 1 : 0),
    uid: uid()
  }

  return tmpl(tVevent, event)
}

/**
 * get vCalendar
 * @param {Object} date
 * @param {Object} [opts]
 * @param
 * @return {String} vCalendar
 */
function vcalendar (dates, opts) {
  var vevents = dates.map(function (date) {
    return vevent(date, opts)
  })

  return tmpl(tVcalendar, {vevents: vevents.join('')})
}

module.exports = vcalendar
