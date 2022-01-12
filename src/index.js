
import { vcalendar } from './vcalendar.js'
import Holidays from 'date-holidays'

/**
 * @type { import('date-holidays').HolidaysTypes } HolidayTypes
 */

function ical (opts) {
  const hd = new Holidays()

  const self = {
    /**
     * Query for available countries, states
     * @param {String} [country]
     * @param {String} [state]
     * @param {string} [language]
     * @return {Object} shortcode, name pairs
     */
    query: function (country, state, language) {
      return hd.query(country, state, language)
    },

    /**
     * Initialite date-holidays
     * @param {String} country
     * @param {String} [state]
     * @param {String} [region]
     * @param {HolidayTypes.Options} [opts]
     * @return {Boolean} true if data could be initialized
     */
    init: function (country, state, region, opts) {
      return hd.init(country, state, region, opts)
    },

    /**
     * Convert to iCal Calendar
     * @param {Number} [year]
     * @param {Object} [opts]
     * @return {String} iCal formatted Calendar
     */
    calendar: function (year, opts) {
      const dates = hd.getHolidays(year)

      if (dates) {
        if (opts.name || opts.showcode) {
          let sc = []
          if (opts.name) {
            sc = opts.name + ' '
          } else if (opts.showcode) {
            'country,state,region'.split(',').forEach((p) => {
              let tmp
              if ((tmp = hd.__conf[p])) {
                sc.push(tmp)
              }
            })
            sc = '(' + sc.join('.') + ') '
          }
          dates.forEach(date => {
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
