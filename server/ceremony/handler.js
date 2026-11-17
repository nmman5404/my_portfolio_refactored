import ceremony from '../../src/modules/ceremony/data.js';
import { normalizeRecipientId, readRecipients, resolveInvitation } from './recipients.js';

function json(response, status, body) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
}

function requestId(request) {
  const values = new URL(request.url || '/', 'http://localhost').searchParams.getAll('id');
  if (values.length > 1) throw new TypeError('Ambiguous recipient id.');
  const id = request.query && Object.hasOwn(request.query, 'id') ? request.query.id : values[0];
  normalizeRecipientId(id);
  return id;
}

/** The same handler serves Vercel and the local production preview. */
export function createInvitationHandler({
  loadRecipients = readRecipients,
  defaults = ceremony.invitation,
  logger = console,
} = {}) {
  return function invitation(request, response) {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET');
      return json(response, 405, { error: 'Method not allowed.' });
    }
    let id;
    try {
      id = requestId(request);
    } catch {
      return json(response, 400, { error: 'Invalid recipient id.' });
    }
    try {
      return json(response, 200, resolveInvitation(id, { directory: loadRecipients(), defaults }));
    } catch {
      logger.error('Ceremony invitation data is unavailable.');
      return json(response, 500, { error: 'Invitation is temporarily unavailable.' });
    }
  };
}
