/* =====================================================================
   Netlify runs a function with exactly this name on every form
   submission ("submission-created" event). It copies the entry into a
   Notion database so Lingling and Max can see every RSVP and every
   olive-tree reservation in Notion.

   Configuration (Netlify → Site configuration → Environment variables):
     NOTION_TOKEN        secret of an internal Notion integration
     NOTION_DATABASE_ID  the database under the wedding page
   Without them the function does nothing; Netlify still stores the
   submission under Forms, so nothing is ever lost.
   No dependencies: Node's built-in fetch talks to the Notion API.
   ===================================================================== */

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// Columns the function needs, by Notion property type.
const COLUMNS = {
  'Form': 'select',
  'Email': 'email',
  'Attending': 'select',
  'Days': 'multi_select',
  'Guests': 'number',
  'Dietary': 'rich_text',
  'Message': 'rich_text',
  'Trees': 'number',
  'Payment': 'select',
  'Language': 'select',
  'Submitted': 'date',
  'Netlify ID': 'rich_text'
};

function text(value) {
  const s = String(value == null ? '' : value).slice(0, 1900);
  return { rich_text: s ? [{ text: { content: s } }] : [] };
}
function select(value, labels) {
  if (value == null || value === '') return { select: null };
  const name = (labels && labels[String(value)]) || String(value);
  return { select: { name: name.slice(0, 100) } };
}
function multi(values, labels) {
  let list = values == null ? [] : Array.isArray(values) ? values : String(values).split(',');
  list = list.map(v => String(v).trim()).filter(Boolean);
  return { multi_select: list.map(v => ({ name: (labels && labels[v]) || v })) };
}
function number(value) {
  const n = parseInt(value, 10);
  return { number: Number.isFinite(n) ? n : null };
}

async function notion(token, method, path, body) {
  const res = await fetch(NOTION_API + path, {
    method,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error('Notion ' + method + ' ' + path + ' → ' + res.status + ' ' + (json.message || ''));
  }
  return json;
}

// Make sure the database has every column we write to; add the missing ones.
async function ensureColumns(token, databaseId) {
  const db = await notion(token, 'GET', '/databases/' + databaseId);
  const existing = db.properties || {};
  let titleName = 'Name';
  for (const name of Object.keys(existing)) {
    if (existing[name].type === 'title') { titleName = name; }
  }
  const missing = {};
  for (const name of Object.keys(COLUMNS)) {
    if (!existing[name]) { missing[name] = { [COLUMNS[name]]: {} }; }
  }
  if (Object.keys(missing).length) {
    await notion(token, 'PATCH', '/databases/' + databaseId, { properties: missing });
  }
  return titleName;
}

function buildProperties(titleName, payload) {
  const d = payload.data || {};
  const form = payload.form_name || '';
  const props = {};
  props[titleName] = { title: [{ text: { content: String(d.name || payload.name || 'Unnamed').slice(0, 200) } }] };
  props['Form'] = select(form, { 'rsvp': 'RSVP', 'olive-trees': 'Olive tree' });
  props['Email'] = { email: d.email ? String(d.email).slice(0, 200) : null };
  props['Language'] = select(d.lang, { en: 'English', de: 'Deutsch', zh: '中文' });
  props['Submitted'] = { date: { start: payload.created_at || new Date().toISOString() } };
  props['Netlify ID'] = text(payload.id || payload.number || '');
  if (form === 'rsvp') {
    props['Attending'] = select(d.attending, { yes: 'Yes', no: 'No' });
    props['Days'] = multi(d.days, { friday: 'Friday', saturday: 'Saturday' });
    props['Guests'] = number(d.guests);
    props['Dietary'] = text(d.dietary);
    props['Message'] = text(d.message);
  } else if (form === 'olive-trees') {
    props['Trees'] = number(d.trees);
    props['Payment'] = select(d.payment, { 'bank-transfer': 'Bank transfer', 'paypal': 'PayPal', 'cash': 'Cash' });
  }
  return props;
}

exports.handler = async function (event) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = (process.env.NOTION_DATABASE_ID || '').replace(/-/g, '');
  if (!token || !databaseId) {
    console.log('submission-created: Notion not configured, nothing to do');
    return { statusCode: 200, body: 'notion not configured' };
  }
  let payload;
  try {
    payload = JSON.parse(event.body || '{}').payload;
  } catch (e) {
    return { statusCode: 400, body: 'invalid body' };
  }
  if (!payload || !payload.form_name) {
    return { statusCode: 400, body: 'no submission payload' };
  }
  try {
    const titleName = await ensureColumns(token, databaseId);
    const page = await notion(token, 'POST', '/pages', {
      parent: { database_id: databaseId },
      properties: buildProperties(titleName, payload)
    });
    console.log('submission-created: stored in Notion as', page.id);
    return { statusCode: 200, body: 'stored' };
  } catch (err) {
    // The submission itself is already saved by Netlify Forms; just report.
    console.error('submission-created: ' + err.message);
    return { statusCode: 500, body: err.message };
  }
};

exports.buildProperties = buildProperties; // for the local test
