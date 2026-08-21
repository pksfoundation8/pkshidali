import imageUrlBuilder from '@sanity/image-url';
import { projectId, dataset, isSanityConfigured } from './env';

/** Local shape rather than importing the type from `sanity`, which would pull
 *  the whole studio package into the dependency graph. */
export type SanityImage = { asset?: { _ref?: string } } & Record<string, unknown>;

const builder = isSanityConfigured ? imageUrlBuilder({ projectId, dataset }) : null;

export function urlFor(source: SanityImage) {
  return builder ? builder.image(source) : null;
}
