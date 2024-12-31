import { tVcalendar, tVevent } from './templates.js'

const random = () => Math.random().toString(16).substr(2)

/**
 * generate a simple uid
 * @private
 * @return {String} uid
 */
function uid (len = 16) {
  let str = ''
  while (str.length < len) str += random()
  return `${str.substr(0, len)}@date-holidays`
}

/**
 * prefill a number with `len` zeroes
 * @private
 * @param {Number} num
 * @param {Number} [len]
 * @return {String} prefixed number
 */
function zero (num, len = 2) {
  const str = Array(len).join('0') + '' + num
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
function toDay (str, offset = 0) {
  // offset only full days
  offset = Math.ceil(offset / 86400000) * 86400000

  const ticks = +(new Date(str)) + (offset)
  const date = new Date(ticks)
  const s = zero(date.getFullYear(), 4) +
    zero(date.getMonth() + 1) +
    zero(date.getDate())
  return s
}

/**
 * apply template on date object from `date-holidays`
 * @private
 * @param {Object} date
 * @param {Object} [opts]
 * @param {Boolean} [opts.fullday] - if `true` then event is treated to be on complete day
 * @param {Boolean} [opts.transp] - if `true` then event is treated to be always transparent
 * @return {String} a single vCalendar vevent
 */
function vevent (date, opts = {}) {
  if (!date) {
    return '\n'
  }

  const now = (new Date())
  let dtstart = toISO(date.start)
  let dtend = toISO(date.end)
  const note = date.note || ''
  const type = date.type || ''

  if (opts.fullday) {
    dtend = toDay(date.date, +date.end - +date.start)
    dtstart = toDay(date.date)
  }

  const event = {
    created: toISO(now),
    summary: date.name,
    dtstart: dtstart,
    dtend: dtend,
    description: type + (type && note ? ' - ' : '') + note,
    busy: !opts.transp && type === 'public',
    uid: uid()
  }

  return tVevent(event)
}

/**
 * get vCalendar
 * @param {Object} date
 * @param {Object} [opts]
 * @return {String} vCalendar
 */
export function vcalendar (dates, opts) {
  const vevents = dates.map(date => vevent(date, opts))
  return tVcalendar(vevents)
}
