import strings from './strings.helper';
import * as moment from 'moment';

export class AttachmentTransformer {
  // factor allows us to create flexiblity in the system.
  static transform(user, timeEntries, factor = 1) {
    const hours = timeEntries.reduce((total, t) => total + t.hours, 0);
    const dayOfWeek = moment().day();
    const dayOfWeekFactor = {
      1: 1.0 * factor,
      2: 0.2 * factor,
      3: 0.4 * factor,
      4: 0.6 * factor,
      5: 0.8 * factor,
    };
    const missing =
      (user.weekly_capacity / 60 / 60) * dayOfWeekFactor[dayOfWeek] - hours;
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
      missing: Math.round(missing),
      fallback: strings.summary(user.first_name, hours),
      color,
      slackId: `<@${user.slackId}>`,
      title: `${user.first_name} ${user.last_name}`,
      fields: [
        {
          value: strings.missingHours(Math.round(missing)),
          short: true,
        },
      ],
    };
  }
}
