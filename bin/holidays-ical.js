#!/usr/bin/env node

/* eslint
   no-multi-spaces: 0,
   comma-spacing: 0,
   no-console: 0
 */

'use strict'

var fs = require('fs')
var path = require('path')
var cmd = require('commander')
var ical = require('..')()

var VERSION = require('../package.json').version

cmd
  .version(VERSION)
  .option('-o, --out <file>' , 'write to file')
  .option('-y, --year <year>', 'year', parseInt)
  .option('-f, --fullday'    , 'ical events are per full day')
  .option('-s, --showcode'   , 'show country code in each ical summary')
  .option('-n, --name <name>', 'instead of country code add your own name to each ical summary')
  .option('-q, --query'      , 'query for available countries, states, regions by shortcode')
  .on('--help', function () {
    var log = [
      '  Examples:',
      '',
      '    Query for available Countries:',
      '    $ holiday-ical -q',
      '',
      '    Query for available States in New Zealand:',
      '    $ holiday-ical -q NZ',
      '',
      '    Calender for 2017 New Zealand, Auckland Province:',
      '    $ holiday-ical -f -y 2017 NZ.au',
      ''
    ].join('\n')
    console.log(log)
  })
  .parse(process.argv)

function main (cmd) {
  var res
  var args

  if (!cmd.query && cmd.args.length === 0) {
    cmd.help()
    return
  }

  if (cmd.query) {
    res = ical.query.apply(null, cmd.args)
  } else {
    args = []
    args.push(cmd.year)
    res = ical.init.apply(null, cmd.args)
    if (res) {
      var opts = {}
      ;['name', 'showcode', 'fullday'].map(function (p) {
        if (/string|boolean/.test(typeof cmd[p])) {
          opts[p] = cmd[p]
        }
      })
      res = ical.calendar(cmd.year, opts)
    } else {
      console.error('Country, State code is unknown')
    }
  }

  if (res) {
    if (cmd.out) {
      var filename = path.resolve(process.cwd(), cmd.out)
      var ext = path.extname(filename)
      if (!ext) {
        filename += '.ics'
      }
      fs.writeFileSync(filename, res, 'utf8')
    } else {
      console.log(res)
    }
  } else {
    console.error('No results found')
  }
}

main(cmd)
