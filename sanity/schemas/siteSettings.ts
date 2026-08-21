import { defineType, defineField } from 'sanity';

/** Singleton. The things that appear on every page. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'address', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'email', type: 'string', validation: (r) => r.email() }),
    defineField({
      name: 'quoteAttribution', type: 'string',
      description: 'Who the homepage pull quote is credited to. Change with care — attributing words to someone who did not say them is the one error this site cannot afford.',
    }),
    defineField({ name: 'scriptureText', type: 'text', rows: 3 }),
    defineField({
      name: 'scriptureReference', type: 'string',
      description: 'Include the translation. Prefer a public-domain one such as the KJV.',
    }),
    defineField({
      name: 'socials', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string' },
          { name: 'href', type: 'url' },
          { name: 'icon', type: 'string', options: { list: ['fb', 'ig', 'yt', 'li'] } },
        ],
      }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Settings' }) },
});
