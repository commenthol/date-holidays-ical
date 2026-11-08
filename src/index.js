import { vcalendar } from './vcalendar.js'
import Holidays from 'date-holidays'

/**
 * @typedef {object} CalendarOptions
 * @property {string} [name]
 * @property {boolean} [showcode]
 * @property {boolean} [fullday]
 * @property {boolean} [transp]
 */

/**
 * @typedef {object} Ical
 * @property {(country?: string, state?: string, language?: string) => Record<string, string>} query
 * @property {(country?: string, state?: string, region?: string, opts?: import('date-holidays').HolidaysTypes.Options) => boolean | undefined} init
 * @property {(year?: string | number | Date, opts?: CalendarOptions) => string | undefined} calendar
 */

/**
 * @param {import('date-holidays').HolidaysTypes.Options} [_opts]
 * @returns {Ical}
 */
function ical(_opts) {
  const hd = new Holidays(_opts)

  const self = {
    /**
     * Query for available countries and states.
     * @param {string} [country]
     * @param {string} [state]
     * @param {string} [language]
     * @returns {Record<string, string>} shortcode, name pairs
     */
    query: function (country, state, language) {
      return hd.query(country, state, language)
    },

    /**
     * Initialize date-holidays.
     * @param {string} [country]
     * @param {string} [state]
     * @param {string} [region]
     * @param {import('date-holidays').HolidaysTypes.Options} [opts]
     * @returns {boolean | undefined} true if data could be initialized
     */
    init: function (country, state, region, opts) {
      return /** @type {boolean | undefined} */ (
        /** @type {unknown} */ (hd.init(country, state, region, opts))
      )
    },

    /**
     * Convert holidays to an iCal calendar.
     * @param {string | number | Date} [year]
     * @param {CalendarOptions} [opts]
     * @returns {string | undefined} iCal-formatted calendar
     */
    calendar: function (year, opts = {}) {
      let dates = []
      if (typeof year === 'string' && year.includes('-')) {
        const [start, end] = year.split('-').map(Number)
        for (let tmp = start; tmp <= end; tmp++) {
          dates = dates.concat(hd.getHolidays(tmp))
        }
      } else {
        dates = hd.getHolidays(year)
      }

      if (dates) {
        if (opts.name || opts.showcode) {
          let sc = ''
          if (opts.name) {
            sc = opts.name + ' '
          } else if (opts.showcode) {
            const conf =
              /** @type {{ __conf: Record<string, string | undefined> }} */ (
                /** @type {unknown} */ (hd)
              ).__conf
            const codes = 'country,state,region'
              .split(',')
              .map((key) => conf[key])
              .filter(Boolean)
            sc = '(' + codes.join('.') + ') '
          }
          dates.forEach((date) => {
            date.name = sc + date.name
          })
        }
        return vcalendar(dates, opts)
      }
    }
  }

  return self
}
ical.vcalendar = vcalendar

export default ical
