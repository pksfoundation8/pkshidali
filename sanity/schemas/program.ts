import { defineType, defineField } from 'sanity';

export const program = defineType({
  name: 'program',
  title: 'Program',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'order', title: 'Display order', type: 'number', validation: (r) => r.required().min(1) }),
    defineField({
      name: 'icon', type: 'string',
      options: { list: ['cap', 'book', 'users', 'cross', 'hands', 'seed', 'star', 'heart'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status', type: 'string',
      options: { list: ['Active', 'Flagship', 'In development'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'olive', title: 'Use olive accent', type: 'boolean',
      description: 'Olive marks education and community programmes.',
      initialValue: false,
    }),
    defineField({
      name: 'summary', type: 'text', rows: 2,
      description: 'One sentence for the homepage card.',
      validation: (r) => r.required().max(120),
    }),
    defineField({ name: 'body', title: 'Detail page copy', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'focus', title: 'Focus areas', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'gallery', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'status' } },
});
