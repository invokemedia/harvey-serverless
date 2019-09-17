import strings from './strings.helper';
import * as moment from 'moment';

export class AttachmentTransformer {
  static transform(user, timeEntries) {
    const hours = timeEntries.reduce((total, t) => total + t.hours, 0);
    const dow = moment().day();
    const dowFactor = {
      1: 0.0,
      2: 0.2,
      3: 0.4,
      4: 0.6,
      5: 0.8
    };
    const missing = ((user.weekly_capacity / 60 / 60) * dowFactor[dow]) - hours;
    return {
      hours,
      missing,
      fallback: strings.summary(user.first_name, hours, null, null),
      color: 'c93742',
      title: `${user.first_name} ${user.last_name}`,
      fields: [{
        value: strings.missingHours(missing),
        short: true
      }]
    };
  }
}