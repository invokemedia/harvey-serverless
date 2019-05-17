import strings from './strings.helper';

export class AttachmentTransformer {
  static transform(user, timeEntries) {
    const hours = timeEntries.reduce((total, t) => total + t.hours, 0);
    const missing = (user.weekly_capacity / 60 / 60) - hours;
    return {
      hours,
      missing,
      fallback: strings.summary(user.first_name, hours, null, null),
      color: 'c93742',
      title: user.first_name,
      fields: [{
        value: strings.missingHours(missing),
        short: true
      }]
    };
  }
}