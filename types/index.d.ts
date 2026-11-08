import { vcalendar } from './vcalendar.js';
export type CalendarOptions = {
    name?: string;
    showcode?: boolean;
    fullday?: boolean;
    transp?: boolean;
};
export type Ical = {
    query: (country?: string, state?: string, language?: string) => Record<string, string>;
    init: (country?: string, state?: string, region?: string, opts?: import('date-holidays').HolidaysTypes.Options) => boolean | undefined;
    calendar: (year?: string | number | Date, opts?: CalendarOptions) => string | undefined;
};
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
declare function ical(_opts?: import('date-holidays').HolidaysTypes.Options): Ical;
declare namespace ical {
    export { vcalendar };
}
export default ical;
