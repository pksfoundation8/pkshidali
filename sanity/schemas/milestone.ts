import { defineType, defineField } from 'sanity';

export const milestone = defineType({
  name: 'milestone',
  title: 'Timeline Milestone',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'order', title: 'Display order', type: 'number', validation: (r) => r.required().min(1) }),
    defineField({
      name: 'period', type: 'string',
      description: 'A year, a range, or a phrase such as "Across the years".',
    }),
    defineField({
      name: 'icon', type: 'string',
      options: { list: ['seed', 'book', 'cap', 'cross', 'family', 'star'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'summary', type: 'text', rows: 2, validation: (r) => r.required().max(120) }),
    defineField({
      name: 'open', title: 'Open-ended', type: 'boolean',
      description: 'Marks the final node. Its date stays open on purpose — the story did not end in 2026.',
      initialValue: false,
    }),
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'period' } },
});
