import * as _ from 'lodash';
import strings from './strings.config';

export class AttachmentTransformer {
  static transform(users, timeEntries) {
    return users.map((u) => {
      const hours = _(timeEntries).filter((t) => t.user.id === u.id).sumBy((t) => t.hours);
      const missing = (u.weekly_capacity / 60 / 60) - hours;
      return {
        hours,
        missing,
        fallback: strings.summary,
        color: 'c93742',
        title: u.first_name,
        fields: [{
          value: strings.missingHours,
          short: true
        }]
      };
    });
  }
}