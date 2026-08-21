import { defineType, defineField } from 'sanity';

export const sermon = defineType({
  name: 'sermon',
  title: 'Sermon',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'date', type: 'date' }),
    defineField({ name: 'scripture', type: 'string', description: 'Primary passage, e.g. Matthew 25:14–30.' }),
    defineField({ name: 'audio', type: 'file' }),
    defineField({ name: 'notes', title: 'Sermon notes (PDF)', type: 'file' }),
    defineField({
      name: 'transcript', type: 'text', rows: 12,
      description: 'Publish alongside every recording. This is what makes his preaching findable.',
    }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
  ],
  orderings: [{ title: 'Date', name: 'date', by: [{ field: 'date', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'scripture' } },
});
