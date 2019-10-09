const tVcalendar = (vevents) => `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//date/holidays//NONSGML v1.0//EN
METHOD:PUBLISH
${vevents.join('')}END:VCALENDAR
`

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
`

module.exports = {
  tVcalendar,
  tVevent
}
