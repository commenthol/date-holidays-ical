'use strict'

/* global describe, it */

var assert = require('assert')
var fs = require('fs')
var vcalendar = require('..')
var dates = require('./assets/AT-k-2016')

function comp (str) {
  return str
    .replace(/(CREATED|LAST-MODIFIED|DTSTAMP):\d{8}T\d{6}Z/g, '$1:XXX')
    .replace(/(UID: )\d+/g, '$1')
}

describe('#vcalendar', function () {
  it('can generate a calendar without entries', function () {
    var res = vcalendar([])
    var exp = 'BEGIN:VCALENDAR\n' +
     'VERSION:2.0\n' +
     'PRODID:-//date/holidays//NONSGML v1.0//EN\n' +
     'METHOD:PUBLISH\n' +
     'END:VCALENDAR\n' +
     ''
    assert.equal(res, exp)
  })

  it('can generate a calendar without one entry', function () {
    var res = vcalendar([].concat(dates[0]))
    var exp = 'BEGIN:VCALENDAR\n' +
     'VERSION:2.0\n' +
     'PRODID:-//date/holidays//NONSGML v1.0//EN\n' +
     'METHOD:PUBLISH\n' +
     'BEGIN:VEVENT\n' +
     'CREATED:20160130T115547Z\n' +
     'LAST-MODIFIED:20160130T115547Z\n' +
     'DTSTAMP:20160130T115547Z\n' +
     'SUMMARY:Neujahr\n' +
     'DTSTART;VALUE=DATE:20151231T230000Z\n' +
     'DTEND;VALUE=DATE:20160101T230000Z\n' +
     'DESCRIPTION:public\n' +
     'TRANSP:OPAQUE\n' +
     'UID: 626441846834495@date-holidays\n' +
     'END:VEVENT\n' +
     'END:VCALENDAR\n' +
     ''
    // ~ console.log(JSON.stringify(res))
    assert.equal(comp(res), comp(exp))
  })

  it('can generate a calendar without one fullday entry', function () {
    var res = vcalendar([].concat(dates[0]), {fullday: 1})
    var exp = 'BEGIN:VCALENDAR\n' +
      'VERSION:2.0\n' +
      'PRODID:-//date/holidays//NONSGML v1.0//EN\n' +
      'METHOD:PUBLISH\n' +
      'BEGIN:VEVENT\n' +
      'CREATED:20160130T120534Z\n' +
      'LAST-MODIFIED:20160130T120534Z\n' +
      'DTSTAMP:20160130T120534Z\n' +
      'SUMMARY:Neujahr\n' +
      'DTSTART;VALUE=DATE:20160101\n' +
      'DTEND;VALUE=DATE:20160102\n' +
      'DESCRIPTION:public\n' +
      'TRANSP:OPAQUE\n' +
      'UID: 713946806965395@date-holidays\n' +
      'END:VEVENT\n' +
      'END:VCALENDAR\n' +
      ''
    // ~ console.log(JSON.stringify(res))
    assert.equal(comp(res), comp(exp))
  })

  it('can generate a calendar without one fullday entry and time shown as free', function () {
    var res = vcalendar([].concat(dates[dates.length - 1]), {fullday: 1})
    var exp = 'BEGIN:VCALENDAR\n' +
     'VERSION:2.0\n' +
     'PRODID:-//date/holidays//NONSGML v1.0//EN\n' +
     'METHOD:PUBLISH\n' +
     'BEGIN:VEVENT\n' +
     'CREATED:20160130T120903Z\n' +
     'LAST-MODIFIED:20160130T120903Z\n' +
     'DTSTAMP:20160130T120903Z\n' +
     'SUMMARY:Silvester\n' +
     'DTSTART;VALUE=DATE:20161231\n' +
     'DTEND;VALUE=DATE:20170101\n' +
     'DESCRIPTION:bank\n' +
     'TRANSP:TRANSPARENT\n' +
     'UID: 126764929853379@date-holidays\n' +
     'END:VEVENT\n' +
     'END:VCALENDAR\n' +
     ''
    // ~ console.log(JSON.stringify(res))
    assert.equal(comp(res), comp(exp))
  })

  it('can write a ics file', function () {
    var res = vcalendar(dates, {fullday: 1})
    fs.writeFileSync(__dirname + '/assets/AT-k-2016.ics', res, 'utf8')
    // open the generated file in a calendar
  })
})
