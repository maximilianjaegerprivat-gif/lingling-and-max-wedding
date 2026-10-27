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

// Columns that may already exist under another name (same type) and are used instead.
const ALIASES = {
  'Guests': ['Amount of people', 'Number of guests', 'People', 'Personen', 'Gäste'],
  'Email': ['Email address', 'E-Mail', 'E-mail', 'Mail'],
  'Message': ['Comments', 'Comment', 'Note', 'Notes', 'Nachricht']
};

// Write a value into a plain-text column when the existing column is text, not the type we expect.
function asText(value) {
  let s = '';
  if (value.email != null) s = value.email;
  else if (value.select) s = value.select.name;
  else if (value.multi_select) s = value.multi_select.map(o => o.name).join(', ');
  else if (value.number != null) s = String(value.number);
  else if (value.date) s = value.date.start;
  else if (value.rich_text) return value;
  return text(s);
}

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

// NOTION_DATABASE_ID may point at the database itself or at a page that holds
// one inline (the ID in the page URL). Find the database either way.
let resolved = null;
async function resolveDatabase(token, id) {
  if (resolved) return resolved;
  try {
    const db = await notion(token, 'GET', '/databases/' + id);
    resolved = { id, db };
    return resolved;
  } catch (err) {
    if (!/is a page/i.test(err.message)) throw err;
  }
  let cursor = null;
  do {
    const res = await notion(token, 'GET', '/blocks/' + id + '/children?page_size=100' + (cursor ? '&start_cursor=' + cursor : ''));
    const child = (res.results || []).find(b => b.type === 'child_database');
    if (child) {
      const dbId = String(child.id).replace(/-/g, '');
      const db = await notion(token, 'GET', '/databases/' + dbId);
      console.log('submission-created: using database ' + dbId + ' inside page ' + id);
      resolved = { id: dbId, db };
      return resolved;
    }
    cursor = res.has_more ? res.next_cursor : null;
  } while (cursor);
  // The page holds no database yet (a simple table is not one): create "Replies" in it.
  const properties = { 'Name': { title: {} } };
  for (const name of Object.keys(COLUMNS)) { properties[name] = { [COLUMNS[name]]: {} }; }
  const created = await notion(token, 'POST', '/databases', {
    parent: { type: 'page_id', page_id: id },
    title: [{ type: 'text', text: { content: 'Replies' } }],
    properties
  });
  const createdId = String(created.id).replace(/-/g, '');
  console.log('submission-created: created database ' + createdId + ' inside page ' + id);
  resolved = { id: createdId, db: created };
  return resolved;
}

// Make sure the database has every column we write to; add the missing ones.
async function ensureColumns(token, databaseId, db) {
  const existing = db.properties || {};
  let titleName = 'Name';
  for (const name of Object.keys(existing)) {
    if (existing[name].type === 'title') { titleName = name; }
  }
  const names = {};
  const types = {};
  const missing = {};
  const usable = (col, type) => existing[col] && (existing[col].type === type || existing[col].type === 'rich_text');
  for (const name of Object.keys(COLUMNS)) {
    const col = usable(name, COLUMNS[name]) ? name : (ALIASES[name] || []).find(a => usable(a, COLUMNS[name]));
    if (col) { names[name] = col; types[name] = existing[col].type; continue; }
    names[name] = name;
    types[name] = COLUMNS[name];
    if (!existing[name]) { missing[name] = { [COLUMNS[name]]: {} }; }
  }
  if (Object.keys(missing).length) {
    await notion(token, 'PATCH', '/databases/' + databaseId, { properties: missing });
  }
  return { titleName, names, types };
}

function buildProperties(columns, payload) {
  const d = payload.data || {};
  const form = payload.form_name || '';
  const props = {};
  const set = (name, value) => {
    const col = columns.names[name] || name;
    props[col] = columns.types[name] === COLUMNS[name] ? value : asText(value);
  };
  props[columns.titleName] = { title: [{ text: { content: String(d.name || payload.name || 'Unnamed').slice(0, 200) } }] };
  set('Form', select(form, { 'rsvp': 'RSVP', 'olive-trees': 'Olive tree' }));
  set('Email', { email: d.email ? String(d.email).slice(0, 200) : null });
  set('Language', select(d.lang, { en: 'English', de: 'Deutsch', zh: '中文' }));
  set('Submitted', { date: { start: payload.created_at || new Date().toISOString() } });
  set('Netlify ID', text(payload.id || payload.number || ''));
  if (form === 'rsvp') {
    set('Attending', select(d.attending, { yes: 'Yes', no: 'No' }));
    set('Days', multi(d.days, { friday: 'Friday', saturday: 'Saturday' }));
    set('Guests', number(d.guests));
    set('Dietary', text(d.dietary));
    set('Message', text(d.message));
  } else if (form === 'olive-trees') {
    set('Trees', number(d.trees));
    set('Payment', select(d.payment, { 'bank-transfer': 'Bank transfer', 'paypal': 'PayPal', 'cash': 'Cash' }));
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
    const target = await resolveDatabase(token, databaseId);
    const columns = await ensureColumns(token, target.id, target.db);
    const page = await notion(token, 'POST', '/pages', {
      parent: { database_id: target.id },
      properties: buildProperties(columns, payload)
    });
    console.log('submission-created: stored in Notion as', page.id);
    return { statusCode: 200, body: 'stored' };
  } catch (err) {
    // The submission itself is already saved by Netlify Forms; just report.
    resolved = null;
    console.error('submission-created: ' + err.message);
    return { statusCode: 500, body: err.message };
  }
};

exports.buildProperties = buildProperties; // for the local test
