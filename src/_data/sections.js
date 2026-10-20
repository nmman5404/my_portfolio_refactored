// Array order controls both page sections and navigation. Set enabled: false to hide one.
// Navigation labels live in src/modules/<id>/data.js under `navigation`.
export default [
  { id: 'profile', template: 'modules/profile/template.njk', enabled: true },
  { id: 'about', template: 'modules/about/template.njk', enabled: true },
  { id: 'projects', template: 'modules/projects/template.njk', enabled: true },
  { id: 'skills', template: 'modules/skills/template.njk', enabled: true },
  { id: 'experience', template: 'modules/experience/template.njk', enabled: true },
  { id: 'blog', template: 'modules/blog/template.njk', enabled: true, requires: 'blog' },
  { id: 'contact', template: 'modules/contact/template.njk', enabled: true },
];
