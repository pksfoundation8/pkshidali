# Portrait sources

Kept out of `public/` so they are not served or shipped in a deploy.

- `seated-original.png` — the studio cutout as supplied. Transparent
  background, but the white chair is part of the cutout.
- `seated-chair-removed.png` — the same with the chair erased: a flood fill
  inward from the borders over near-white, low-saturation pixels. His shirt is
  enclosed by the suit, so the fill cannot reach it. A faint dark contour where
  the chair edge was remains; it is invisible behind the memorial card's fade
  mask at the size the portrait is used.

`public/portrait-seated-v1.webp` is cropped from the second file at
`{left:150, top:8, width:560, height:640}` — head, tie and pocket square, in
roughly the proportions of the portrait it replaced. Re-crop from the source
rather than upscaling the webp, and bump the version in the filename so the
CDN and browsers actually fetch the new one.
