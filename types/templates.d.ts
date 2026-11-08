/** @param {string[]} vevents */
export declare const tVcalendar: (vevents: string[]) => string;
export type CalendarEvent = {
    created: string;
    summary: string;
    dtstart: string;
    dtend: string;
    description: string;
    busy: boolean;
    uid: string;
};
/**
 * @typedef {object} CalendarEvent
 * @property {string} created
 * @property {string} summary
 * @property {string} dtstart
 * @property {string} dtend
 * @property {string} description
 * @property {boolean} busy
 * @property {string} uid
 */
/** @param {CalendarEvent} event */
export declare const tVevent: (event: CalendarEvent) => string;
