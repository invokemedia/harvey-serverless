export default {
    summary: (from, to) => `Almost there! So far, %s has entered %s hours for the week of ${from} to ${to}.`,
    missingHours: (hours) => `Missing ${hours} hours`,
    withAttachments: (from, to) => `*Almost there!* These team members still have hours to enter for the week of ${from} to ${to}.`,
    withoutAttachments: () => '*Nicely done, folks!* I’ve got no reminders for you, because *everyone has already entered their hours.* Keep it up!'
  };