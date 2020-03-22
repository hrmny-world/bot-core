import moment from 'moment';
import 'moment-duration-format';

export function secondsToHumanReadable(seconds: number) {
  return moment.duration(Number(seconds), 'seconds').format();
}
