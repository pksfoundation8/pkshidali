import { defineType, defineField } from 'sanity';

/** Archive catalogue entry. Consistent metadata is what makes the collection
 *  searchable in twenty years rather than a folder of untitled files. */
export const mediaAsset = defineType({
  name: 'mediaAsset',
  title: 'Archive Record',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'type', type: 'string',
      options: { list: ['photo', 'document', 'audio', 'video'] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'section', type: 'string',
      description: 'Which archive section this appears under.',
      options: { list: ['sermons', 'photos', 'documents', 'video'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'date', type: 'date', description: 'Leave blank if genuinely unknown. Do not guess.' }),
    defineField({
      name: 'dateUncertain', title: 'Date is approximate', type: 'boolean', initialValue: false,
      description: 'An uncertain date recorded as uncertain is worth more than a confident wrong one.',
    }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'file', type: 'file' }),
    defineField({ name: 'transcript', type: 'text', rows: 6, description: 'Required for audio and video.' }),
    defineField({ name: 'peopleIdentified', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'originalSource', type: 'string', description: 'Who supplied it, and where it came from.' }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
  ],
  preview: { select: { title: 'title', subtitle: 'type', media: 'image' } },
});
