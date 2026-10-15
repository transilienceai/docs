import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const base=path.resolve('dist');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?files(path.join(dir,f.name)):[path.join(dir,f.name)]);}
const htmlFiles=files(base).filter(f=>f.endsWith('.html'));
const read=f=>fs.readFileSync(f,'utf8');
const html=(route)=>read(path.join(base,route,'index.html'));
test('all 15 public guide pages and a real 404 are built',()=>{assert.equal(htmlFiles.length,16);assert.match(html('/'),/Your cloud/);assert.match(read(path.join(base,'404.html')),/404 — Guide not found/);});
test('all local links, scripts, styles, downloads and anchor targets resolve',()=>{
 for(const f of htmlFiles){const text=read(f);for(const [,attr,url] of text.matchAll(/\b(href|src)="([^"]+)"/g)){
  if(!url.startsWith('/')&&!url.startsWith('#'))continue;
  const parsed=new URL(url,'https://local/'+path.relative(base,f));
  let target=path.join(base,decodeURIComponent(parsed.pathname));if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert.ok(fs.existsSync(target),`${f}: missing ${attr} ${url}`);
  if(parsed.hash){assert.ok(read(target).includes(`id="${decodeURIComponent(parsed.hash.slice(1))}"`),`${f}: missing anchor ${url}`);}
 }}
});
test('permissions match source guide exactly: 12 RBAC, 43 Graph, 6 Defender',()=>{
 const data=JSON.parse(read(path.join(base,'permissions.json')));assert.equal(data.rbacCount,12);assert.equal(data.graphCount,43);assert.equal(data.mdeCount,6);assert.equal(data.permissions.length,64);
 const source=read('../install/azure.md');for(const p of data.permissions.filter(p=>p.provider==='Azure'))assert.ok(source.includes(p.name));
 assert.equal(new Set(data.permissions.map(p=>p.plane+':'+p.name)).size,64);
 assert.match(html('/permissions/'),/Graph permissions/);assert.match(html('/permissions/'),/App Configuration Data Reader/);
});
test('downloaded artifacts match published fingerprints',()=>{const manifest=JSON.parse(read(path.join(base,'downloads/manifest.json')));for(const a of manifest.artifacts){const bytes=fs.readFileSync(path.join(base,'downloads',a.name));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256);assert.equal(bytes.length,a.bytes);assert.equal(Buffer.compare(bytes,fs.readFileSync(path.join('artifacts',a.name))),0);}});
test('downloaded script parses but is never executed in tests',()=>{execFileSync('bash',['-n','artifacts/azure-compliance.sh']);});
test('base AWS template keeps OIDC conditions, read audit policy and one CE operation',()=>{const yaml=read('artifacts/transilience-security-audit.yaml');assert.match(yaml,/sts:AssumeRoleWithWebIdentity/);assert.match(yaml,/oidc\.modal\.com:aud/);assert.match(yaml,/oidc\.modal\.com:sub/);assert.match(yaml,/SecurityAudit/);assert.match(yaml,/ce:GetCostAndUsage/);assert.doesNotMatch(yaml,/AWS::IAM::User|AWS::IAM::AccessKey|AdministratorAccess|AmazonEC2ContainerRegistryReadOnly/);});
test('public pages never embed original console screenshots or inline executable content',()=>{for(const f of htmlFiles){const text=read(f);assert.doesNotMatch(text,/<img[^>]+assets\/(?:aws|azure)-manual/);assert.doesNotMatch(text,/<script(?![^>]*src=)[^>]*>/);assert.doesNotMatch(text,/\son(?:click|submit|load)=/i);assert.doesNotMatch(text,/type="password"/);assert.match(text,/Skip to content/);assert.match(text,/lang="en"/);}});
test('human access is separate and download is a draft, not an email submission',()=>{const text=html('/aws/user-access/');assert.match(text,/SecurityAudit · recommended/);assert.match(text,/ViewOnlyAccess/);assert.match(text,/ReadOnlyAccess/);assert.match(text,/IAM console-only user/);assert.match(text,/not sent/);assert.doesNotMatch(text,/<form[^>]+action=/);assert.doesNotMatch(text,/mailto:/);const app=read('public/app.js');assert.match(app,/DRAFT — NOT SENT — NO ACCESS GRANTED/);assert.match(app,/createAccessKeys:false/);assert.match(app,/mfaRequired:true/);});
test('only the public search index is fetched and no input data is persisted',()=>{const app=read('public/app.js');assert.deepEqual([...app.matchAll(/fetch\('([^']+)'/g)].map(m=>m[1]),['/search-index.json']);assert.doesNotMatch(app,/XMLHttpRequest|sendBeacon|WebSocket|setInterval/);assert.match(app,/localStorage\.setItem\('transilience-onboarding-checks-'\+cloud,JSON\.stringify\(values\)\)/);});
test('headers prevent credential form submissions, framing, external scripts and referrer leakage',()=>{const headers=read('public/_headers');for(const value of ["form-action 'none'","frame-ancestors 'none'","script-src 'self'","connect-src 'self'",'Referrer-Policy: no-referrer','X-Content-Type-Options: nosniff','Content-Disposition: attachment'])assert.ok(headers.includes(value));});
test('search covers the real guides and every route has a canonical URL',()=>{const index=JSON.parse(read(path.join(base,'search-index.json')));assert.equal(index.length,15);assert.ok(index.find(p=>p.url==='/azure/manual/').text.includes('Directory.Read.All'));for(const f of htmlFiles)assert.match(read(f),/<link rel="canonical" href="https:\/\/cloudonboarding\.transilience\.dev\//);});
test('guide headings have unique IDs and buttons are explicitly typed',()=>{for(const f of htmlFiles){const text=read(f);const ids=[...text.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,f);for(const [,tag] of text.matchAll(/<(button\b[^>]*)>/g))assert.match(tag,/type="(?:button|submit)"/);}});
test('mobile-hidden navigation is not focusable and search preserves real link semantics',()=>{assert.match(read('public/styles.css'),/\.sidebar\{visibility:hidden\}\.sidebar\.is-open\{visibility:visible\}/);const app=read('public/app.js');assert.doesNotMatch(app,/a\.setAttribute\('role','listitem'\)/);assert.match(app,/row\.setAttribute\('role','listitem'\)/);assert.match(app,/ArrowDown/);assert.match(app,/ArrowUp/);});
