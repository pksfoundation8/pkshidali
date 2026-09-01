import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { projectId, dataset, apiVersion } from './src/lib/sanity/env';

/**
 * Studio config. Mounted in-app at /studio, so the family administrators use
 * one URL and one login rather than a separate deployment.
 */
export default defineConfig({
  name: 'pkshidali',
  title: 'PK Shidali Foundation',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Tributes first — it is the queue that needs daily attention.
            S.listItem().title('Tributes').child(
              S.list().title('Tributes').items([
                S.listItem().title('Pending review').child(
                  S.documentList().title('Pending review')
                    .filter('_type == "tribute" && status == "pending"')
                ),
                S.listItem().title('Published').child(
                  S.documentList().title('Published')
                    .filter('_type == "tribute" && status == "published"')
                ),
                S.listItem().title('Rejected').child(
                  S.documentList().title('Rejected')
                    .filter('_type == "tribute" && status == "rejected"')
                ),
                S.documentTypeListItem('tribute').title('All tributes'),
              ])
            ),
            // Funeral RSVPs — operational and time-limited, but the family
            // needs a headcount per service, so the splits are listed as well
            // as the full list. The schema was registered without a structure
            // entry, which left submissions saved but unreachable in the desk.
            S.listItem().title('Funeral RSVPs').child(
              S.list().title('Funeral RSVPs').items([
                S.listItem().title('All RSVPs — newest first').child(
                  S.documentList().title('All RSVPs')
                    .filter('_type == "rsvp"')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
                S.listItem().title('Service of Song — 15 October').child(
                  S.documentList().title('Service of Song')
                    .filter('_type == "rsvp" && "service-of-song" in attending')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
                S.listItem().title('Funeral Service — 16 October').child(
                  S.documentList().title('Funeral Service')
                    .filter('_type == "rsvp" && "funeral-service" in attending')
                    .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
                ),
              ])
            ),
            S.divider(),
            S.documentTypeListItem('pillar').title('Legacy Pillars'),
            S.documentTypeListItem('program').title('Programs'),
            S.documentTypeListItem('milestone').title('Timeline'),
            S.divider(),
            S.documentTypeListItem('mediaAsset').title('Archive Records'),
            S.documentTypeListItem('sermon').title('Sermons'),
            S.divider(),
            S.documentTypeListItem('person').title('People'),
            S.documentTypeListItem('page').title('Pages'),
            S.listItem().title('Site Settings').child(
              S.document().schemaType('siteSettings').documentId('siteSettings')
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
