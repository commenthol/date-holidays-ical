#!/usr/bin/env node

/* eslint
   no-multi-spaces: 0,
   comma-spacing: 0,
   no-console: 0
 */

'use strict'

const fs = require('fs')
const path = require('path')
const ical = require('..')()

const VERSION = require('../package.json').version

const cmmds = {
  help: ['-h', '--help', false, 'this help'],
  version: ['-v', '--version', false, 'display version'],
  out: ['-o', '--out', 'file' , 'write to file'],
  year: ['-y', '--year', 'year', 'year'],
  fullday: ['-f', '--fullday', false, 'ical events are per full day'],
  showcode: ['-s', '--showcode', false , 'show country code in each ical summary'],
  transp: ['-t', '--transp', false, 'ical events are all transparent'],
  name: ['-n', '--name', 'name', 'instead of country code add your own name to each ical summary'],
  query: ['-q', '--query', false, 'query for available countries, states, regions by shortcode'],
  language: ['-l', '--language', 'language', 'set language']
}

const cli = (cmmds, argv = process.argv.slice(2)) => {
  const cmd = { args: [], helptext: '\n    Usage: holiday-ical [options]\n\n' }
  const map = Object.entries(cmmds).reduce((o, [key, vals]) => {
    const [short, long, shift, help, def] = vals
    cmd.helptext += `    ${String(short).padEnd(2)}, ${String(long).padEnd(10)} ${(shift || '').padEnd(10)} ${help}\n`
    if (def) cmd[key] = def
    o[short] = o[long] = () => {
      cmd[key] = shift ? argv.shift() : true
    }
    return o
  }, {})
  cmd.helptext += `
    Examples:

      Query for available Countries:
      $ holiday-ical -q

      Query for available States in New Zealand:
      $ holiday-ical -q NZ

      Calender for 2017 New Zealand Auckland Province:
      $ holiday-ical -f -y 2017 NZ.au
  `
  while (argv.length) {
    const arg = argv.shift()
    const found = map[arg]
    if (found) {
      cmd.hasArgs = true
      found()
    } else {
      cmd.args = (cmd.args || []).concat(arg)
    }
  }
  return cmd
}

function main (cmd) {
  let res
  let args
  const opts = {}

  if (cmd.language) {
    opts.languages = [cmd.language]
  }

  if (cmd.version) {
    console.log(VERSION)
    return
  }
  if (cmd.help || (!cmd.query && !cmd.args.length)) {
    console.log(cmd.helptext)
    return
  }

  if (cmd.query) {
    const [country, state] = cmd.args
    res = ical.query(country, state, cmd.language)
  } else {
    args = []
    args.push(cmd.year)
    const [country, state, region] = cmd.args
    res = ical.init.call(null, country, state, region, opts)
    if (res) {
      const opts = {}
      ;['name', 'showcode', 'fullday', 'transp'].forEach(function (p) {
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
      let filename = path.resolve(process.cwd(), cmd.out)
      const ext = path.extname(filename)
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

main(cli(cmmds))
