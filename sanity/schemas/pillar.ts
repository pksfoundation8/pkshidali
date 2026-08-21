import { defineType, defineField } from 'sanity';

export const pillar = defineType({
  name: 'pillar',
  title: 'Legacy Pillar',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug', type: 'slug', options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order', title: 'Display order', type: 'number',
      description: 'Controls position on the homepage grid.',
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'icon', type: 'string',
      description: 'Icon key from the design system.',
      options: {
        list: ['cross', 'book', 'shield', 'users', 'prayer', 'family', 'cap', 'hands', 'seed', 'star'],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline', type: 'string',
      description: 'One short line. Appears in small caps under the title.',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'blurb', type: 'text', rows: 2,
      description: 'One sentence for the homepage card. Keep it under 70 characters or the six-across grid breaks.',
      validation: (r) => r.required().max(90),
    }),
    defineField({
      name: 'body', title: 'Detail page copy', type: 'array', of: [{ type: 'block' }],
    }),
    defineField({
      name: 'practices', title: 'How the foundation carries it',
      type: 'array', of: [{ type: 'string' }],
    }),
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'tagline' } },
});
