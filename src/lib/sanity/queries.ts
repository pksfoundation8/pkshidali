/** GROQ is plain text. Tagging it only exists so editors syntax-highlight it —
 *  importing the tag from next-sanity would pull studio code into the graph. */
const groq = (strings: TemplateStringsArray, ...values: unknown[]) =>
  strings.reduce((acc, s, i) => acc + s + (i < values.length ? String(values[i]) : ''), '');

export const pillarsQuery = groq`
  *[_type == "pillar"] | order(order asc) {
    "slug": slug.current, title, tagline, blurb, icon,
    "body": body[].children[].text,
    practices
  }`;

export const programsQuery = groq`
  *[_type == "program"] | order(order asc) {
    "slug": slug.current, title, summary, icon, olive, status,
    "body": body[].children[].text,
    focus
  }`;

export const milestonesQuery = groq`
  *[_type == "milestone"] | order(order asc) {
    title, period, icon, summary, open
  }`;

/** Published only. Status is the gate — nothing else may open it. */
export const publishedTributesQuery = groq`
  *[_type == "tribute" && status == "published"] | order(submittedAt desc) {
    "id": _id, name, relationship, title, body, taught, years, location
  }`;

export const featuredTributesQuery = groq`
  *[_type == "tribute" && status == "published" && featured == true]
    | order(submittedAt desc) [0...4] {
    "id": _id, name, relationship, title, body, taught, years, location
  }`;

export const tributeByIdQuery = groq`
  *[_type == "tribute" && _id == $id && status == "published"][0] {
    "id": _id, name, relationship, title, body, taught, years, location
  }`;

export const archiveSectionQuery = groq`
  *[_type == "mediaAsset" && section == $section] | order(date desc) {
    "id": _id, title, type, date, dateUncertain, description
  }`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    address, phone, email, quoteAttribution, scriptureText, scriptureReference, socials
  }`;
