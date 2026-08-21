import { defineType, defineField } from 'sanity';

/** Board members, leadership, and the family voices section. */
export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string' }),
    defineField({
      name: 'group', type: 'string',
      options: { list: ['Board', 'Leadership', 'Family', 'Staff'] },
    }),
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'portrait', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', type: 'array', of: [{ type: 'block' }] }),
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role', media: 'portrait' } },
});
