export type CalendarDate = {
    date: string;
    start: Date;
    end: Date;
    name: string;
    type?: string;
    note?: string;
};
export type CalendarOptions = {
    fullday?: boolean;
    transp?: boolean;
};
/**
 * get vCalendar
 * @param {CalendarDate[]} dates
 * @param {CalendarOptions} [opts]
 * @returns {string} vCalendar
 */
export declare function vcalendar(dates: CalendarDate[], opts?: CalendarOptions): string;
