import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as isLeapYear from 'dayjs/plugin/isLeapYear';
import * as customParse from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isLeapYear);
dayjs.extend(customParse);
dayjs.tz.setDefault('Asia/Bangkok');

export default dayjs;
