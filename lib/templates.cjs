'use strict';

/** @param {string[]} vevents */
const tVcalendar = (vevents) => `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//date/holidays//NONSGML v1.0//EN
METHOD:PUBLISH
${vevents.join('')}END:VCALENDAR
`;

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
const tVevent = (event) => `BEGIN:VEVENT
CREATED:${event.created}
LAST-MODIFIED:${event.created}
DTSTAMP:${event.created}
SUMMARY:${event.summary}
DTSTART;VALUE=DATE:${event.dtstart}
DTEND;VALUE=DATE:${event.dtend}${event.description ? `\nDESCRIPTION:${event.description}` : '\n'}
TRANSP:${event.busy ? 'OPAQUE' : 'TRANSPARENT'}
UID:${event.uid}
END:VEVENT
`;

exports.tVcalendar = tVcalendar;
exports.tVevent = tVevent;
