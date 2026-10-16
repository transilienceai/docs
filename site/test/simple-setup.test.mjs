import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {setupRoutes,screenshotAssets} from '../guides.mjs';
const read=route=>fs.readFileSync(`dist${route}index.html`,'utf8');
test('each cloud/method begins with Permissions, Install, Verify and an Audit default',()=>{
 for(const route of Object.keys(setupRoutes)){
  const html=read(route);assert.match(html,/data-setup-guide/);
  for(const step of ['permissions','install','verify'])assert.match(html,new RegExp(`id="${step}"`));
  assert.match(html,/<input type="radio" name="permissions" value="audit" checked>/);
  assert.match(html,/<input type="radio" name="permissions" value="logs">/);
  assert.match(html,/<input type="radio" name="permissions" value="both">/);
  assert.match(html,/<details class="full-reference"><summary>/);
  assert.ok(html.includes('<img src="/screenshots/'),`${route}: screenshot missing`);
  assert.ok(html.indexOf('id="install"')<html.indexOf('class="full-reference"'));
 }
});
test('homepage is a direct cloud/method chooser, not a planner or marketing diagram',()=>{
 const html=read('/');assert.match(html,/Connect your cloud\./);
 for(const route of Object.keys(setupRoutes))assert.ok(html.includes(`href="${route}"`));
 assert.doesNotMatch(html,/Build my onboarding plan|class="connection-map"|class="journey"/);
 assert.match(html,/Cloud · AWS/);assert.match(html,/Cloud · Azure/);
});
test('logs-only is never silently mapped to broader automated install permissions',()=>{
 assert.match(read('/aws/cloudformation/'),/standard audit stack always includes SecurityAudit/);
 assert.match(read('/aws/cloudformation/'),/\/aws\/manual\/\?permissions=logs#install/);
 assert.match(read('/azure/cloud-shell/'),/--tier logs also grants Reader and Security Reader/);
 assert.match(read('/azure/cloud-shell/'),/\/azure\/manual\/\?permissions=logs#install/);
 assert.match(read('/aws/manual/'),/Do not attach SecurityAudit for Logs only/);
 assert.match(read('/azure/manual/'),/Do not add subscription-wide audit roles for a logs-only approval/);
});
test('Azure starts with narrow subscription flags, dry run and no implicit tenant consent',()=>{
 const html=read('/azure/cloud-shell/');
 assert.match(html,/--tier posture --no-entra/);assert.match(html,/--tier logs --no-entra/);
 assert.match(html,/--subscriptions &#39;|--subscriptions '&lt;APPROVED_SUBSCRIPTION_IDS&gt;'/);
 assert.match(html,/--dry-run/);assert.match(html,/--workspace-ids/);
  assert.doesNotMatch(html,/\n\+  --scope/);
 assert.doesNotMatch(html,/<code>bash[^<]*--all-subscriptions/);
});
test('bucket selection is URL-local and does not invent a provider API or persist identity',()=>{
 const app=fs.readFileSync('public/app.js','utf8');
 assert.match(app,/allowed=\['audit','logs','both'\]/);assert.match(app,/history\.replaceState/);
 assert.match(app,/popstate/);assert.match(app,/panel\.hidden=panel\.dataset\.permissionPanel!==bucket/);
 assert.doesNotMatch(app,/localStorage.*permissions|fetch\([^)]*permissions/);
});
test('technical reference cannot be mistaken for the selected minimal bucket',()=>{
 for(const route of Object.keys(setupRoutes))assert.match(read(route),/Do not grant every role or API permission in this reference/);
});
test('reviewed source screenshots are byte-for-byte copies, with secret/identity views excluded',()=>{
 for(const asset of screenshotAssets)assert.equal(Buffer.compare(fs.readFileSync(`../assets/${asset}`),fs.readFileSync(`dist/screenshots/${asset}`)),0);
 assert.ok(!screenshotAssets.some(x=>/secret|registered-application|trust-policy|subscription-id/.test(x)));
});
