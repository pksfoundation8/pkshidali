import { defineField, defineType } from 'sanity';
import { receptionHosts } from '../../src/content/reception';

/**
 * A registration for the invitation-only funeral reception.
 *
 * The code is what admits someone at the door, so it is read-only here: it is
 * issued once when the guest registers and must not drift from the copy they
 * were sent.
 */
export const receptionGuest = defineType({
  name: 'receptionGuest',
  title: 'Reception Guest',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({
      name: 'host', title: 'Guest of', type: 'string',
      options: { list: receptionHosts.map((h) => ({ title: h, value: h })) },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'guests', title: 'Number attending (including themselves)', type: 'number',
      initialValue: 1, validation: (r) => r.min(1).max(20),
    }),
    defineField({
      name: 'code', title: 'Admission code', type: 'string', readOnly: true,
      description: 'Issued at registration and sent to the guest. Do not edit.',
    }),
    defineField({ name: 'message', title: 'Message to the family', type: 'text', rows: 3 }),
    defineField({ name: 'emailed', title: 'Code was emailed', type: 'boolean', readOnly: true }),
    defineField({ name: 'submittedAt', type: 'datetime', readOnly: true }),
  ],
  orderings: [
    { title: 'Newest first', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] },
    { title: 'By host', name: 'host', by: [{ field: 'host', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', host: 'host', code: 'code', guests: 'guests' },
    prepare({ title, host, code, guests }) {
      return { title: `${title} — ${code ?? 'no code'}`, subtitle: `Guest of ${host ?? '?'} · ${guests ?? 1} attending` };
    },
  },
});
