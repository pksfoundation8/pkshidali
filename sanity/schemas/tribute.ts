import { defineType, defineField } from 'sanity';

/**
 * The most sensitive document in the system.
 *
 * Two rules encoded here:
 *   1. Nothing publishes without an explicit status change by a human.
 *   2. `rawSubmission` is the consent record and is never edited. Moderators
 *      correct `body`; the original wording survives underneath it.
 */
export const tribute = defineType({
  name: 'tribute',
  title: 'Tribute',
  type: 'document',
  groups: [
    { name: 'content', title: 'Tribute', default: true },
    { name: 'contributor', title: 'Contributor' },
    { name: 'moderation', title: 'Moderation' },
    { name: 'record', title: 'Consent record' },
  ],
  fields: [
    // ── content ──────────────────────────────────────────────────
    defineField({
      name: 'title', type: 'string', group: 'content',
      description: 'Optional. A line that captures the tribute.',
    }),
    defineField({
      name: 'body', type: 'text', rows: 10, group: 'content',
      description: 'Correct obvious spelling only. Substantive edits change what someone said.',
      validation: (r) => r.required().min(40),
    }),
    defineField({
      name: 'taught', title: 'He taught me…', type: 'string', group: 'content',
      description: 'Completes the sentence on the homepage wall. A few words.',
    }),
    defineField({
      name: 'photo', type: 'image', options: { hotspot: true }, group: 'content',
      description: 'Only if the contributor supplied one and consented to its publication.',
    }),
    defineField({ name: 'audioUrl', title: 'Audio tribute URL', type: 'url', group: 'content' }),
    defineField({ name: 'videoUrl', title: 'Video tribute URL', type: 'url', group: 'content' }),
    defineField({
      name: 'transcript', type: 'text', rows: 6, group: 'content',
      description: 'Required for any audio or video. Accessibility, and it makes the archive searchable.',
    }),

    // ── contributor ──────────────────────────────────────────────
    defineField({
      name: 'name', type: 'string', group: 'contributor',
      description: 'As it should appear publicly.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'email', type: 'string', group: 'contributor',
      description: 'PRIVATE. Never rendered on the site. For moderator contact only.',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'relationship', type: 'string', group: 'contributor',
      options: {
        list: ['Family', 'Former Student', 'Teacher or Colleague', 'Church Member',
          'Pastor or Minister', 'Friend', 'Community', 'Grandchild', 'Organisation'],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'years', title: 'Years or period known', type: 'string', group: 'contributor' }),
    defineField({ name: 'location', type: 'string', group: 'contributor' }),

    // ── moderation ───────────────────────────────────────────────
    defineField({
      name: 'status', type: 'string', group: 'moderation',
      options: {
        list: [
          { title: 'Pending review', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Published', value: 'published' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'featured', type: 'boolean', group: 'moderation',
      description: 'Featured tributes appear in Lives He Touched on the homepage.',
      initialValue: false,
    }),
    defineField({
      name: 'moderatorNotes', type: 'text', rows: 3, group: 'moderation',
      description: 'Internal only. Why it was approved, held or rejected.',
    }),
    defineField({ name: 'submittedAt', type: 'datetime', group: 'moderation', readOnly: true }),

    // ── consent record ───────────────────────────────────────────
    defineField({
      name: 'permissionPublish', title: 'Consented to publication', type: 'boolean',
      group: 'record', readOnly: true,
      validation: (r) => r.custom((v) => (v === true ? true : 'Cannot publish without publication consent.')),
    }),
    defineField({
      name: 'permissionArchive', title: 'Consented to permanent archiving', type: 'boolean',
      group: 'record', readOnly: true,
      validation: (r) => r.custom((v) => (v === true ? true : 'Cannot archive without archive consent.')),
    }),
    defineField({
      name: 'rawSubmission', title: 'Original submission', type: 'text', rows: 10,
      group: 'record', readOnly: true,
      description: 'Immutable. This is what the contributor actually wrote and consented to.',
    }),
  ],
  orderings: [
    { title: 'Newest first', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', name: 'name', status: 'status', rel: 'relationship' },
    prepare({ title, name, status, rel }) {
      const flag = status === 'published' ? '●' : status === 'pending' ? '○' : '·';
      return { title: title || name || 'Untitled tribute', subtitle: `${flag} ${status} · ${rel ?? ''} · ${name ?? ''}` };
    },
  },
});
