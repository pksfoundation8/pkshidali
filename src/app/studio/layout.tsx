export { metadata, viewport } from 'next-sanity/studio';

/** The Studio renders its own full-page chrome, outside the site shell. */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
