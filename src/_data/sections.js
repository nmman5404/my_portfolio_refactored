// This registry controls section order and visibility. Navigation labels live
// beside section content in src/modules/<id>/data.js under `navigation`.
// leading preserves the retained HTML whitespace/comments for exact parity.
export default [
  {
    "id": "profile",
    "template": "modules/profile/template.njk",
    "enabled": true,
    "leading": {
      "en": "\r\n\r\n<!-- 1. HERO SECTION  -->\r\n        ",
      "vi": "\r\n\r\n<!-- 1. HERO SECTION  -->\r\n        "
    }
  },
  {
    "id": "about",
    "template": "modules/about/template.njk",
    "enabled": true,
    "leading": {
      "en": "\r\n\r\n        <!-- 1.5. ABOUT ME SECTION -->\r\n        ",
      "vi": "\r\n\r\n        <!-- 1.5. ABOUT ME SECTION -->\r\n        "
    }
  },
  {
    "id": "projects",
    "template": "modules/projects/template.njk",
    "enabled": true,
    "leading": {
      "en": "\r\n\r\n<!-- 2. PROJECTS SECTION -->\r\n        ",
      "vi": "\r\n\r\n<!-- 2. PROJECTS SECTION -->\r\n        "
    }
  },
  {
    "id": "skills",
    "template": "modules/skills/template.njk",
    "enabled": true,
    "leading": {
      "en": "\r\n\r\n        <!-- 3. SKILLS SECTION -->\r\n        ",
      "vi": "\r\n\r\n        <!-- 3. SKILLS SECTION -->\r\n        "
    }
  },
  {
    "id": "experience",
    "template": "modules/experience/template.njk",
    "enabled": true,
    "leading": {
      "en": "\r\n\r\n<!-- 4. EDUCATION & EXPERIENCE SECTION -->\r\n        ",
      "vi": "\r\n\r\n<!-- 4. EDUCATION & EXPERIENCE SECTION -->\r\n        "
    }
  },
  {
    "id": "blog",
    "template": "modules/blog/template.njk",
    "enabled": true,
    "requires": "blog",
    "leading": {
      "en": "\r\n\r\n        ",
      "vi": "\r\n\r\n        "
    }
  },
  {
    "id": "contact",
    "template": "modules/contact/template.njk",
    "enabled": true,
    "leading": {
      "en": "\r\n\r\n<!-- 5. CONTACT ME SECTION -->\r\n        ",
      "vi": "\r\n\r\n<!-- 5. CONTACT ME SECTION -->\r\n        "
    }
  }
];
