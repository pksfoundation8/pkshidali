import { defineType, defineField } from 'sanity';

/** Generic page: governance, policies, and anything else editorial. */
export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'intro', type: 'text', rows: 3 }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'published', type: 'boolean', initialValue: false,
      description: 'Unpublished pages are excluded from the sitemap and marked noindex.',
    }),
    defineField({ name: 'seoDescription', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
