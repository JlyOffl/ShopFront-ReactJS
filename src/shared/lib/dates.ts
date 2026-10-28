const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const formatDateTime = (date: Date): string => dateTimeFormat.format(date);
