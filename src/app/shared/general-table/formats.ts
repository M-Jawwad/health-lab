import * as dateFns from 'date-fns';

export const DATE_FORMAT: any = (v: any, r?: any, c?: any) => (v == null) ? ('N/A') : (typeof(v) === 'string') ? dateFns.format(new Date(v), 'dd-MM-yyyy') : dateFns.format(new Date(v * 1000), 'dd-MM-yyyy');
export const DATETIME_FORMAT: any = (v: any, r?: any, c?: any) => (v == null) ? ('N/A') : dateFns.format(new Date(v * 1000), 'dd-MM-yyyy, hh:mm');

export const FORMATS: any = {
    date: DATE_FORMAT,
    datetime: DATETIME_FORMAT,
}