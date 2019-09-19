import strings from './strings.helper';
import * as moment from 'moment';

export class AttachmentTransformer {
  static transform(user, timeEntries) {
    const hours = timeEntries.reduce((total, t) => total + t.hours, 0);
    const dow = moment().day();
    const dowFactor = {
      1: 1.0,
      2: 0.2,
      3: 0.4,
      4: 0.6,
      5: 0.8
    };
    const missing = ((user.weekly_capacity / 60 / 60) * dowFactor[dow]) - hours;
    let color;
    if (missing >= 32) {
      color = 'FE2908'; // red
    } else if (missing >= 24) {
      color = 'FE7B08'; // deep orange
    } else if (missing >= 16) {
      color = 'FED508'; // orange
    } else if (missing >= 8) {
      color = 'FEF613'; // yellow
    } else {
      color = '0BBF4D'; // greenish
    }
    return {
      hours,
      missing,
      fallback: strings.summary(user.first_name, hours, null, null),
      color,
      slackName: `@${user.slackName}`,
      title: `${user.first_name} ${user.last_name}`,
      fields: [{
        value: strings.missingHours(missing),
        short: true
      }]
    };
  }
}