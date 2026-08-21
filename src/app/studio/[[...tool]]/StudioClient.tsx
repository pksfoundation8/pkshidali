'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

/** Client-only: the Studio builds its own React tree and cannot be prerendered. */
export default function StudioClient() {
  return <NextStudio config={config} />;
}
