import profile from '../modules/profile/data.js';
import about from '../modules/about/data.js';
import skills from '../modules/skills/data.js';
import experience from '../modules/experience/data.js';
import work from '../modules/experience/work.js';
import projects from '../modules/projects/data.js';
import contact from '../modules/contact/data.js';
import blog from '../modules/blog/data.js';
import chat from '../modules/chat/data.js';
import audio from '../modules/audio/data.js';
import interfaceData from '../modules/interface/data.js';
import article from '../modules/article/data.js';

export default {
  profile, about, skills,
  experience: { ...experience, timeline: work },
  projects, contact, blog, chat, audio,
  interface: interfaceData,
  article,
};
