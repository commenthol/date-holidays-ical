import ical from 'date-holidays-ical'

const holidays = ical()
const configured = ical({ timezone: 'UTC' })
const countries: Record<string, string> = holidays.query()
const initialized: boolean | undefined = holidays.init('AT', 'k')
const calendar: string | undefined = holidays.calendar(2016)
const range: string | undefined = holidays.calendar('2016-2017', {
  name: 'Regional holidays',
  showcode: true,
  fullday: true,
  transp: false
})
const converted: string = ical.vcalendar(
  [
    {
      date: '2016-01-01',
      start: new Date('2016-01-01T00:00:00Z'),
      end: new Date('2016-01-02T00:00:00Z'),
      name: 'New Year',
      type: 'public'
    }
  ],
  { fullday: true }
)

void [configured, countries, initialized, calendar, range, converted]
