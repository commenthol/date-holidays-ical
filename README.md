# date-holidays-ical

> Generate ical (.ics) files from date-holidays data

[![NPM version](https://badge.fury.io/js/date-holidays-ical.svg)](https://www.npmjs.com/package/date-holidays-ical/)
[![Build Status](https://github.com/commenthol/date-holidays-ical/actions/workflows/ci.yml/badge.svg)](https://github.com/commenthol/date-holidays-ical/actions/workflows/ci.yml)

This tool exports data from [date-holidays][] into iCal format.

## Usage

```
  Usage: holidays-ical [options]

  Options:

    -h, --help                this help
    -v, --version             display version
    -o, --out      file       write to file
    -y, --year     year       year or year range
    -f, --fullday             ical events are per full day
    -s, --showcode            show country code in each ical summary
    -t, --transp              ical events are all transparent
    -n, --name     name       instead of country code add your own name to each ical summary
    -q, --query               query for available countries, states, regions by shortcode
    -l, --language language   set language

  Examples:

    Query for available Countries:
    $ holiday-ical -q

    Query for available States in New Zealand:
    $ holiday-ical -q NZ

    Calender for 2017 New Zealand, Auckland Province:
    $ holiday-ical -f -y 2017 NZ.au

    Calender for 2017 - 2019 New Zealand Auckland Province:
    $ holiday-ical -f -y 2017-2019 NZ.au
```

Import the generated file into your calendar tool of choice.

## API

```js
var ical = require('date-holidays-ical')()

// query for available countries
var res = ical.query()
//> { AD: 'Andorra',
//>   ..
//>   UY: 'Uruguay' }

// initialize with country, e.g. Uruguay
res = ical.init('UY')
//> true

// get iCal Calender
res = ical.calendar(2016)
```

## LICENSE

[ICS][LICENSE]

## References

<!-- !ref -->

* [date-holidays][date-holidays]
* [LICENSE][LICENSE]
* [RCF5545][RCF5545]

<!-- ref! -->

[date-holidays]: https://github.com/commenthol/date-holidays
[RCF5545]: https://tools.ietf.org/html/rfc5545
[LICENSE]: ./LICENSE
