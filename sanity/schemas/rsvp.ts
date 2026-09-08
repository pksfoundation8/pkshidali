import { defineField, defineType } from 'sanity';

/**
 * A funeral RSVP.
 *
 * Attendance is operational data, not archive material: the family needs a
 * count for seating and catering. Contact details are kept so they can reach
 * an attendee if arrangements change, and for no other purpose.
 */
export const rsvp = defineType({
  name: 'rsvp',
  title: 'Funeral RSVP',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({
      name: 'attending', title: 'Attending', type: 'array', of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Service of Song — 15 October, 4:00 PM', value: 'service-of-song' },
          { title: 'Lying in State — 16 October, 8:00 AM', value: 'lying-in-state' },
          { title: 'Funeral Service — 16 October, 10:00 AM', value: 'funeral-service' },
        ],
      },
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'guests', title: 'Number attending (including themselves)', type: 'number',
      initialValue: 1, validation: (r) => r.min(1).max(50),
    }),
    defineField({ name: 'travellingFrom', title: 'Travelling from', type: 'string' }),
    defineField({ name: 'relationship', title: 'How they knew him', type: 'string' }),
    defineField({ name: 'message', title: 'Message to the family', type: 'text', rows: 4 }),
    defineField({ name: 'submittedAt', type: 'datetime', readOnly: true }),
  ],
  orderings: [
    { title: 'Newest first', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', guests: 'guests', attending: 'attending' },
    prepare({ title, guests, attending }) {
      const list = attending ?? [];
      const which = list.length === 3 ? 'all three' : list.join(', ');
      return { title, subtitle: `${guests ?? 1} attending · ${which || 'no service chosen'}` };
    },
  },
});
