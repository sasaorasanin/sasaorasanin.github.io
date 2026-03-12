import fs from 'node:fs';
import path from 'node:path';

const owner = process.env.GITHUB_REPOSITORY_OWNER;
const actor = process.env.GITHUB_ACTOR;
const issueBody = process.env.ISSUE_BODY || '';
const issueTitle = process.env.ISSUE_TITLE || '';
const issueNumber = process.env.ISSUE_NUMBER || '';
const issueLabelsRaw = process.env.ISSUE_LABELS || '';
const repoRoot = process.cwd();

function sanitizeSlug(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function quoteYaml(value) {
  if (value === null || value === undefined) return "''";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function toNumberOrUndef(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

function splitLines(value) {
  return String(value || '')
    .split(/\r?\n/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseCsvOrLines(value) {
  const text = String(value || '').trim();
  if (!text) return [];
  if (text.includes('\n')) return splitLines(text);
  return text
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function parsePriority(value) {
  const entries = splitLines(value);
  const map = {};
  for (const line of entries) {
    const [k, v] = line.split('=').map((x) => x?.trim());
    if (!k || !v) continue;
    const n = Number(v);
    if (Number.isFinite(n)) {
      map[k] = n;
    }
  }
  return Object.keys(map).length ? map : undefined;
}

function yamlArray(items) {
  if (!items || items.length === 0) return '[]';
  return `[${items.map((x) => quoteYaml(x)).join(', ')}]`;
}

function parseIssueBody(body) {
  const fields = {};
  const lines = String(body || '').split(/\r?\n/);
  let key = null;
  let buffer = [];

  const flush = () => {
    if (key) {
      fields[key] = buffer.join('\n').trim();
    }
    key = null;
    buffer = [];
  };

  for (const line of lines) {
    const match = line.match(/^###\s+(.+)$/);
    if (match) {
      flush();
      key = match[1].trim();
      continue;
    }
    if (key) {
      if (line.startsWith('_No response_')) continue;
      buffer.push(line);
    }
  }
  flush();

  return fields;
}

function normalizeFieldMap(raw) {
  const map = {};
  for (const [k, v] of Object.entries(raw)) {
    map[k.toLowerCase()] = v;
  }
  return map;
}

function detectType(labels) {
  if (labels.includes('content:work-experience')) return 'work';
  if (labels.includes('content:product')) return 'product';
  if (labels.includes('content:ecosystem')) return 'ecosystem';
  if (labels.includes('content:skill')) return 'skill';
  if (labels.includes('content:version')) return 'version';

  const title = issueTitle.toLowerCase();
  if (title.includes('[content/work]')) return 'work';
  if (title.includes('[content/product]')) return 'product';
  if (title.includes('[content/ecosystem]')) return 'ecosystem';
  if (title.includes('[content/skill]')) return 'skill';
  if (title.includes('[content/version]')) return 'version';
  return '';
}

function buildFrontmatterBlock(lines) {
  return `---\n${lines.join('\n')}\n---\n`;
}

function buildWork(fields) {
  const company = fields['company'] || 'Unknown Company';
  const position = fields['position'] || 'Role';
  const engagementType = fields['engagement type'] || 'Contract';
  const start = fields['start (yyyy-mm)'] || '';
  const end = fields['end (yyyy-mm or present)'] || '';
  const location = fields['location'] || 'Remote';
  const order = toNumberOrUndef(fields['order']);
  const displayOn = parseCsvOrLines(fields['display on versions']);
  const collapsedOn = parseCsvOrLines(fields['collapsed on']);
  const stars = toNumberOrUndef(fields['stars']);
  const priority = parsePriority(fields['priority per version']);
  const technologies = splitLines(fields['technologies']);
  const summary = fields['summary'] || '';
  const responsibilities = splitLines(fields['responsibilities']);
  const highlights = splitLines(fields['highlights']);
  const notes = fields['notes'] || '';

  const fm = [
    `company: ${quoteYaml(company)}`,
    `position: ${quoteYaml(position)}`,
    `engagementType: ${quoteYaml(engagementType)}`,
    `start: ${quoteYaml(start)}`,
    `end: ${quoteYaml(end)}`,
    `location: ${quoteYaml(location)}`,
  ];

  if (order !== undefined) fm.push(`order: ${order}`);
  if (displayOn.length) fm.push(`displayOn: ${yamlArray(displayOn)}`);
  if (collapsedOn.length) fm.push(`collapsedOn: ${yamlArray(collapsedOn)}`);
  if (stars !== undefined) fm.push(`stars: ${stars}`);
  if (priority) {
    fm.push('priority:');
    for (const [k, v] of Object.entries(priority)) {
      fm.push(`  ${k}: ${v}`);
    }
  }
  if (technologies.length) fm.push(`technologies: ${yamlArray(technologies)}`);

  let body = '';
  if (summary) body += `${summary}\n\n`;
  if (responsibilities.length) {
    body += '#### Responsibilities\n';
    body += responsibilities.map((x) => `- ${x.replace(/^[-*]\s*/, '')}`).join('\n');
    body += '\n\n';
  }
  if (highlights.length) {
    body += '#### Highlights\n';
    body += highlights.map((x) => `- ${x.replace(/^[-*]\s*/, '')}`).join('\n');
    body += '\n\n';
  }
  if (notes) {
    body += '#### Notes\n';
    body += `${notes}\n`;
  }

  const slug = sanitizeSlug(fields['slug'] || company);
  return {
    relativePath: path.join('content', 'work-experiences', `${slug}.md`),
    content: `${buildFrontmatterBlock(fm)}\n${body.trim()}\n`,
  };
}

function buildProduct(fields) {
  const name = fields['product name'] || 'Product';
  const group = fields['group'] || 'Products & Ventures';
  const status = fields['status'] || 'In Development';
  const order = toNumberOrUndef(fields['order']);
  const displayOn = parseCsvOrLines(fields['display on versions']);
  const collapsedOn = parseCsvOrLines(fields['collapsed on']);
  const stars = toNumberOrUndef(fields['stars']);
  const priority = parsePriority(fields['priority per version']);
  const technologies = splitLines(fields['technologies']);
  const summary = fields['summary'] || '';
  const highlights = splitLines(fields['highlights']);

  const fm = [
    `name: ${quoteYaml(name)}`,
    `group: ${quoteYaml(group)}`,
    `status: ${quoteYaml(status)}`,
  ];

  if (order !== undefined) fm.push(`order: ${order}`);
  if (displayOn.length) fm.push(`displayOn: ${yamlArray(displayOn)}`);
  if (collapsedOn.length) fm.push(`collapsedOn: ${yamlArray(collapsedOn)}`);
  if (stars !== undefined) fm.push(`stars: ${stars}`);
  if (priority) {
    fm.push('priority:');
    for (const [k, v] of Object.entries(priority)) {
      fm.push(`  ${k}: ${v}`);
    }
  }
  if (technologies.length) fm.push(`technologies: ${yamlArray(technologies)}`);

  let body = summary ? `${summary}\n\n` : '';
  if (highlights.length) {
    body += '#### Highlights\n';
    body += highlights.map((x) => `- ${x.replace(/^[-*]\s*/, '')}`).join('\n');
    body += '\n';
  }

  const slug = sanitizeSlug(fields['slug'] || name);
  return {
    relativePath: path.join('content', 'products', `${slug}.md`),
    content: `${buildFrontmatterBlock(fm)}\n${body.trim()}\n`,
  };
}

function buildEcosystem(fields) {
  const name = fields['name'] || 'Ecosystem';
  const focus = fields['focus'] || 'Open source ecosystem';
  const status = fields['status'] || 'Active';
  const order = toNumberOrUndef(fields['order']);
  const link = fields['link'] || '';
  const scale = fields['scale'] || '';
  const displayOn = parseCsvOrLines(fields['display on versions']);
  const collapsedOn = parseCsvOrLines(fields['collapsed on']);
  const stars = toNumberOrUndef(fields['stars']);
  const priority = parsePriority(fields['priority per version']);
  const summary = fields['summary'] || '';

  const fm = [
    `name: ${quoteYaml(name)}`,
    `focus: ${quoteYaml(focus)}`,
    `status: ${quoteYaml(status)}`,
  ];

  if (order !== undefined) fm.push(`order: ${order}`);
  if (link) fm.push(`link: ${quoteYaml(link)}`);
  if (scale) fm.push(`scale: ${quoteYaml(scale)}`);
  if (displayOn.length) fm.push(`displayOn: ${yamlArray(displayOn)}`);
  if (collapsedOn.length) fm.push(`collapsedOn: ${yamlArray(collapsedOn)}`);
  if (stars !== undefined) fm.push(`stars: ${stars}`);
  if (priority) {
    fm.push('priority:');
    for (const [k, v] of Object.entries(priority)) {
      fm.push(`  ${k}: ${v}`);
    }
  }

  const slug = sanitizeSlug(fields['slug'] || name);
  return {
    relativePath: path.join('content', 'ecosystems', `${slug}.md`),
    content: `${buildFrontmatterBlock(fm)}\n${summary}\n`,
  };
}

function buildSkill(fields) {
  const title = fields['title'] || 'Skill Group';
  const order = toNumberOrUndef(fields['group order']);
  const displayOn = parseCsvOrLines(fields['group display on versions']);
  const itemsRaw = splitLines(fields['items']);
  const summary = fields['summary'] || '';

  const fm = [`title: ${quoteYaml(title)}`];
  if (order !== undefined) fm.push(`order: ${order}`);
  if (displayOn.length) fm.push(`displayOn: ${yamlArray(displayOn)}`);

  fm.push('items:');
  for (const line of itemsRaw) {
    const parts = line.split('|').map((p) => p.trim());
    const name = parts[0];
    if (!name) continue;
    const itemOrder = toNumberOrUndef(parts[1]);
    const tags = parseCsvOrLines(parts[2]);

    if (itemOrder === undefined && tags.length === 0) {
      fm.push(`  - ${quoteYaml(name)}`);
      continue;
    }

    fm.push('  - name: ' + quoteYaml(name));
    if (itemOrder !== undefined) fm.push(`    order: ${itemOrder}`);
    if (tags.length) fm.push(`    displayOn: ${yamlArray(tags)}`);
  }

  const slug = sanitizeSlug(fields['slug'] || title);
  return {
    relativePath: path.join('content', 'skills', `${slug}.md`),
    content: `${buildFrontmatterBlock(fm)}\n${summary}\n`,
  };
}

function buildVersion(fields) {
  const name = fields['version name'] || 'CV Version';
  const slug = sanitizeSlug(fields['slug'] || name);
  const order = toNumberOrUndef(fields['order']);
  const collapseWork = fields['collapse work experiences'] || 'mixed';
  const collapseProducts = fields['collapse products'] || 'mixed';
  const summary = fields['summary'] || '';

  const fm = [
    `name: ${quoteYaml(name)}`,
    `slug: ${quoteYaml(slug)}`,
    `collapseWork: ${quoteYaml(collapseWork)}`,
    `collapseProducts: ${quoteYaml(collapseProducts)}`,
  ];
  if (order !== undefined) fm.push(`order: ${order}`);

  return {
    relativePath: path.join('content', 'versions', `${slug}.md`),
    content: `${buildFrontmatterBlock(fm)}\n${summary}\n`,
  };
}

function ensureUniquePath(relativePath) {
  const abs = path.join(repoRoot, relativePath);
  if (!fs.existsSync(abs)) return relativePath;

  const dir = path.dirname(relativePath);
  const ext = path.extname(relativePath);
  const base = path.basename(relativePath, ext);
  for (let i = 2; i < 1000; i += 1) {
    const candidate = path.join(dir, `${base}-${i}${ext}`);
    if (!fs.existsSync(path.join(repoRoot, candidate))) return candidate;
  }
  throw new Error(`Could not resolve unique file path for ${relativePath}`);
}

function writeOutput(type, fields) {
  let result;
  if (type === 'work') result = buildWork(fields);
  else if (type === 'product') result = buildProduct(fields);
  else if (type === 'ecosystem') result = buildEcosystem(fields);
  else if (type === 'skill') result = buildSkill(fields);
  else if (type === 'version') result = buildVersion(fields);
  else throw new Error('Unsupported content type');

  const uniqueRelativePath = ensureUniquePath(result.relativePath);
  const absPath = path.join(repoRoot, uniqueRelativePath);

  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, result.content, 'utf8');

  const output = [
    `created_file=${uniqueRelativePath.replace(/\\/g, '/')}`,
    `issue_number=${issueNumber}`,
    `content_type=${type}`,
    `author=${actor || ''}`,
    `owner=${owner || ''}`,
  ].join('\n');

  const outPath = process.env.GITHUB_OUTPUT;
  if (outPath) {
    fs.appendFileSync(outPath, `${output}\n`);
  }

  console.log(`Created ${uniqueRelativePath}`);
}

function main() {
  const labels = issueLabelsRaw
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

  const type = detectType(labels);
  if (!type) {
    console.log('Issue is not a recognized content form. Nothing to do.');
    return;
  }

  const parsed = parseIssueBody(issueBody);
  const fields = normalizeFieldMap(parsed);
  writeOutput(type, fields);
}

main();
