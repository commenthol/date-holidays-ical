'use strict'

/* global describe, it */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const vcalendar = require('..').vcalendar
const dates = require('./assets/AT-k-2016')

function comp (str) {
  return str
    .replace(/(CREATED|LAST-MODIFIED|DTSTAMP):\d{8}T\d{6}Z/g, '$1:20160101T000000Z')
    .replace(/(UID:)[^@]+/g, '$10000000000')
}

describe('#vcalendar', function () {
  it('can generate a calendar without entries', function () {
    const res = vcalendar([])
    const exp = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//date/holidays//NONSGML v1.0//EN
METHOD:PUBLISH
END:VCALENDAR
`
    assert.strictEqual(res, exp)
  })

  it('can generate a calendar without one entry', function () {
    const res = vcalendar([].concat(dates[0]))
    const exp = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//date/holidays//NONSGML v1.0//EN
METHOD:PUBLISH
BEGIN:VEVENT
CREATED:20160130T115547Z
LAST-MODIFIED:20160130T115547Z
DTSTAMP:20160130T115547Z
SUMMARY:Neujahr
DTSTART;VALUE=DATE:20151231T230000Z
DTEND;VALUE=DATE:20160101T230000Z
DESCRIPTION:public
TRANSP:OPAQUE
UID:626441846834495@date-holidays
END:VEVENT
END:VCALENDAR
`
    assert.strictEqual(comp(res), comp(exp))
  })

  it('can generate a calendar without one fullday entry', function () {
    const res = vcalendar([].concat(dates[0]), { fullday: 1 })
    const exp = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//date/holidays//NONSGML v1.0//EN
METHOD:PUBLISH
BEGIN:VEVENT
CREATED:20160130T120534Z
LAST-MODIFIED:20160130T120534Z
DTSTAMP:20160130T120534Z
SUMMARY:Neujahr
DTSTART;VALUE=DATE:20160101
DTEND;VALUE=DATE:20160102
DESCRIPTION:public
TRANSP:OPAQUE
UID:713946806965395@date-holidays
END:VEVENT
END:VCALENDAR
`
    assert.strictEqual(comp(res), comp(exp))
  })

  it('can generate a calendar with one fullday entry and time shown as free', function () {
    const res = vcalendar([].concat(dates[dates.length - 1]), { fullday: 1 })
    const exp = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//date/holidays//NONSGML v1.0//EN
METHOD:PUBLISH
BEGIN:VEVENT
CREATED:20160130T120903Z
LAST-MODIFIED:20160130T120903Z
DTSTAMP:20160130T120903Z
SUMMARY:Silvester
DTSTART;VALUE=DATE:20161231
DTEND;VALUE=DATE:20170101
DESCRIPTION:bank
TRANSP:TRANSPARENT
UID:126764929853379@date-holidays
END:VEVENT
END:VCALENDAR
`
    assert.strictEqual(comp(res), comp(exp))
  })

  it('can generate a calendar with an entry which lasts 3 days', function () {
    const res = vcalendar([{
      date: '2016-12-26 00:00:00',
      start: new Date('2016-12-25T23:00:00.000Z'),
      end: new Date('2016-12-28T13:00:00.000Z'),
      name: 'A special day',
      type: 'observance',
      note: 'soo special'
    }], { fullday: 1 })

    const exp = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//date/holidays//NONSGML v1.0//EN
METHOD:PUBLISH
BEGIN:VEVENT
CREATED:20160130T120903Z
LAST-MODIFIED:20160130T120903Z
DTSTAMP:20160130T120903Z
SUMMARY:A special day
DTSTART;VALUE=DATE:20161226
DTEND;VALUE=DATE:20161229
DESCRIPTION:observance - soo special
TRANSP:TRANSPARENT
UID:126764929853379@date-holidays
END:VEVENT
END:VCALENDAR
`
    assert.strictEqual(comp(res), comp(exp))
  })

  it('can write a ics file', function () {
    let res = vcalendar(dates, { fullday: 1 })
    res = comp(res)
    fs.writeFileSync(path.resolve(__dirname, 'assets/AT-k-2016.ics'), res, 'utf8')
    // open the generated file in a calendar
  })
})
