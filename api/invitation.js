import { createInvitationHandler } from '../server/ceremony/handler.js';

// Guest data stays on the server; this route returns one selected invitation.
export default createInvitationHandler();
