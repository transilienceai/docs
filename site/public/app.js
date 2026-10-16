/* Static portal: no cloud API calls, credential fields, telemetry, or form submissions. */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function node(tag,text,className){const el=document.createElement(tag);if(text)el.textContent=text;if(className)el.className=className;return el;}
const menu=$('#menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));$('#sidebar').classList.toggle('is-open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu?.setAttribute('aria-expanded','false');$('#sidebar')?.classList.remove('is-open');}});
document.addEventListener('click',e=>{if(!e.target.closest('#sidebar')&&!e.target.closest('#menu-toggle')){menu?.setAttribute('aria-expanded','false');$('#sidebar')?.classList.remove('is-open');}});

// The bucket is a local documentation selection, never an access grant.
const setupGuide=$('[data-setup-guide]');
if(setupGuide){
 const allowed=['audit','logs','both'];
 function showBucket(value,updateUrl=false){
  const bucket=allowed.includes(value)?value:'audit';
  $$('input[name="permissions"]').forEach(input=>{input.checked=input.value===bucket;});
  $$('[data-permission-panel]').forEach(panel=>{panel.hidden=panel.dataset.permissionPanel!==bucket;});
  $$('[data-verify-bucket]').forEach(panel=>{panel.hidden=panel.dataset.verifyBucket!==bucket;});
  $$('[data-log-scope]').forEach(panel=>{panel.hidden=bucket==='audit';});
  $$('[data-selected-bucket]').forEach(label=>{label.textContent={audit:'Audit',logs:'Logs',both:'Audit + Logs'}[bucket];});
  // Switching setup method within a cloud keeps the instruction selection.
  const prefix=setupGuide.dataset.cloud==='AWS'?'/aws/':'/azure/';
  $$('#sidebar a').forEach(link=>{const url=new URL(link.href);if(url.pathname.startsWith(prefix)){url.searchParams.set('permissions',bucket);link.href=url.pathname+url.search+url.hash;}});
  // Deep links and Back retain the selected bucket without storing any identity.
  if(updateUrl){const url=new URL(location.href);url.searchParams.set('permissions',bucket);history.replaceState(null,'',url);}
 }
 showBucket(new URL(location.href).searchParams.get('permissions'));
 $$('input[name="permissions"]').forEach(input=>input.addEventListener('change',()=>showBucket(input.value,true)));
 window.addEventListener('popstate',()=>showBucket(new URL(location.href).searchParams.get('permissions')));
}

// Search downloads only the public guide index. Input and queries never leave the page.
let indexPromise;
const dialog=$('#search-dialog'), search=$('#site-search'), results=$('#search-results');
async function showSearch(){
 dialog.showModal();search.focus();
 indexPromise??=fetch('/search-index.json').then(r=>{if(!r.ok)throw new Error('Index unavailable');return r.json();});
 try{await indexPromise;updateSearch();}catch{results.replaceChildren(node('p','Search is temporarily unavailable. Use the guide navigation.','empty'));}
}
async function updateSearch(){
 if(!indexPromise)return;let index;try{index=await indexPromise;}catch{return;}
 const terms=search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
 const ranked=index.map(item=>{const title=(item.title+' '+item.description).toLowerCase();const text=(title+' '+item.text).toLowerCase();return {...item,score:terms.every(t=>text.includes(t))?terms.reduce((s,t)=>s+(title.includes(t)?10:1),0):-1};}).filter(item=>item.score>=0).sort((a,b)=>b.score-a.score).slice(0,8);
 results.replaceChildren();
 if(!ranked.length){results.append(node('p','No matching guides. Try “consent”, “role”, or “CloudFormation”.','empty'));return;}
 if(!terms.length)results.append(node('p','Popular starting points','small muted'));
 for(const item of ranked){const row=node('div');row.setAttribute('role','listitem');const a=node('a');a.href=item.url;a.append(node('strong',item.title),node('span',item.description));row.append(a);results.append(row);}
}
$('#open-search')?.addEventListener('click',showSearch);
$('#close-search')?.addEventListener('click',()=>dialog.close());
search?.addEventListener('input',updateSearch);
search?.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){$('#search-results a')?.focus();e.preventDefault();}});
results?.addEventListener('keydown',e=>{const links=$$('#search-results a'),i=links.indexOf(document.activeElement);if(e.key==='ArrowDown'){links[Math.min(i+1,links.length-1)]?.focus();e.preventDefault();}if(e.key==='ArrowUp'){if(i<=0)search.focus();else links[i-1].focus();e.preventDefault();}});
document.addEventListener('keydown',e=>{const editing=/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);if((e.key.toLowerCase()==='k'&&(e.metaKey||e.ctrlKey))||(e.key==='/'&&!editing)){e.preventDefault();showSearch();}});
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

for(const pre of $$('pre')){
 const code=pre.querySelector('code');if(!code)continue;
 const copy=node('button','Copy','copy-code');copy.type='button';copy.setAttribute('aria-label','Copy code block');pre.prepend(copy);
 copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code.textContent);copy.textContent='Copied ✓';}catch{copy.textContent='Select & copy';const range=document.createRange();range.selectNodeContents(code);getSelection().removeAllRanges();getSelection().addRange(range);}setTimeout(()=>copy.textContent='Copy',2000);});
}

const plans={
 aws:{automated:{title:'AWS CloudFormation',url:'/aws/cloudformation/',steps:['Confirm your approved account ID and installer permissions.','Review the audit-role stack and your organization-specific Quick Create link.','Create the stack, confirm Outputs, then verify the first evidence collection.']},manual:{title:'AWS manual console setup',url:'/aws/manual/',steps:['Obtain current approved Transilience workspace IDs and your account design.','Create the OIDC provider and audit role with explicit audience and subject restrictions.','Hand off the non-secret role ARN through the approved workflow and verify evidence.']}},
 azure:{automated:{title:'Azure Cloud Shell installer',url:'/azure/cloud-shell/',steps:['Confirm tenant, selected subscriptions, and who can approve RBAC and tenant-wide consent.','Inspect the installer, then run your exact customer-specific Bash command.','Review the non-secret grant manifest, secure callback, and first evidence collection.']},manual:{title:'Azure manual portal setup',url:'/azure/manual/',steps:['Create the dedicated single-tenant application in the approved tenant.','Assign the scoped read roles and consent to Graph and Defender application permissions.','Securely hand off the credential, register the connection, and verify each evidence source.']}}
};
function updatePlan(){const cloud=$('#plan-cloud').value,method=$('#plan-method').value,multiple=$('#plan-scope').value==='multiple';const plan=plans[cloud][method],out=$('#plan-result');out.replaceChildren(node('span','Your recommended route','eyebrow'),node('h3',plan.title));const list=node('ol');plan.steps.forEach(s=>list.append(node('li',s)));out.append(list);if(multiple){const notice=node('p',cloud==='aws'?'Multiple accounts need explicit per-account roles or an approved central-to-member trust design. The base stack does not enroll an organization.':'Default discovery includes enabled subscriptions visible to the installer. Narrow the approved subscription list or management-group boundary before running.');out.append(notice);if(cloud==='aws'){const a=node('a','Review multi-account design →','text-link');a.href='/aws/organization/';out.append(a,node('br'));}}const a=node('a','Open my setup guide →','button primary');a.href=plan.url;out.append(a);}
if($('#plan-cloud')){['#plan-cloud','#plan-method','#plan-scope'].forEach(s=>$(s).addEventListener('change',updatePlan));updatePlan();}

function updatePermissions(){const query=$('#permission-search').value.toLowerCase().trim();const provider=$('#permission-provider').value;const plane=$('#permission-plane').value;let count=0;for(const row of $$('[data-permission]')){const visible=(!query||row.textContent.toLowerCase().includes(query))&&(provider==='all'||row.dataset.provider===provider)&&(plane==='all'||row.dataset.plane===plane);row.hidden=!visible;if(visible)count++;}$('#permission-count').textContent=`${count} of ${$$('[data-permission]').length} permission entries`;$('#permission-empty').hidden=count!==0;}
if($('#permission-search')){['#permission-search','#permission-provider','#permission-plane'].forEach(s=>$(s).addEventListener(s.includes('search')?'input':'change',updatePermissions));}

const checklist={aws:['Confirmed the intended AWS account IDs and assessment scope.','Reviewed the exact access profile and current approved OIDC trust conditions.','Verified stack completion (or manual role creation) in the correct account.','Confirmed successful registration and the correct role ARN in Transilience.','Validated a real collection, timestamps, regions, and missing evidence.','Recorded the connection owner, optional human-access review date, and offboarding plan.'],azure:['Confirmed the intended Entra tenant and approved subscription/workspace scopes.','Reviewed Azure RBAC, Graph, and Defender application permissions separately.','Verified effective Azure role assignments and tenant-wide admin consent.','Confirmed secure credential handoff and recorded expiry and rotation owner.','Validated a real collection and distinguished missing licences/data from denied access.','Recorded missing grants, evidence exclusions, and the offboarding owner.']};
function savedChecks(cloud){try{return JSON.parse(localStorage.getItem('transilience-onboarding-checks-'+cloud)||'[]');}catch{return [];}}
function renderChecks(){const cloud=$('#check-cloud').value;const stored=savedChecks(cloud);const saved=Array.isArray(stored)?stored:[];const box=$('#check-items');box.replaceChildren();checklist[cloud].forEach((text,i)=>{const label=node('label',null,'check-row');const input=node('input');input.type='checkbox';input.checked=saved.includes(i);input.dataset.check=i;input.addEventListener('change',()=>{const values=$$('#check-items input:checked').map(c=>Number(c.dataset.check));try{localStorage.setItem('transilience-onboarding-checks-'+cloud,JSON.stringify(values));}catch{/* Browsers may disable local storage. UI still works for this page. */}updateProgress();});label.append(input,node('span',text));box.append(label);});updateProgress();}
function updateProgress(){const total=checklist[$('#check-cloud').value].length,n=$$('#check-items input:checked').length;$('#check-progress').style.width=(n/total*100)+'%';$('#check-status').textContent=`${n} of ${total} local checks complete.${n===total?' Checklist finished—this is not a live connection test.':''}`;}
if($('#check-cloud')){$('#check-cloud').addEventListener('change',renderChecks);$('#reset-checklist').addEventListener('click',()=>{try{localStorage.removeItem('transilience-onboarding-checks-'+$('#check-cloud').value);}catch{}renderChecks();});renderChecks();}

const profileNotes={SecurityAudit:'Recommended starting point for security-configuration review. Does not guarantee access to every log or service-data source.',ViewOnlyAccess:'Basic visibility only. Expect assessment gaps and review them with the customer; do not present this as full security-evidence access.',ReadOnlyAccess:'Broader read access can expose service data and sensitive content. Customer approval must explicitly cover that data exposure.'};
let accessRequest;
function invalidateRequest(){accessRequest=undefined;$('#request-result').hidden=true;}
function updateProfile(){const method=$('#engineer-method').value,profile=$('#engineer-profile').value;$('#profile-notice').textContent=profileNotes[profile]+(method.startsWith('IAM console')?' IAM exception: no automatic email invite. Require MFA, password reset at next login, secure password handoff, and no access keys.':' AWS/your IdP sends the actual invitation after administrator approval.');invalidateRequest();}
if($('#engineer-form')){
 const date=new Date();date.setDate(date.getDate()+30);$('#engineer-expiry').value=date.toISOString().slice(0,10);$('#engineer-expiry').min=new Date().toISOString().slice(0,10);
 ['#engineer-profile','#engineer-method'].forEach(s=>$(s).addEventListener('change',updateProfile));updateProfile();
 $('#engineer-form').addEventListener('input',invalidateRequest);
 $('#engineer-accounts').addEventListener('input',()=>$('#engineer-accounts').setCustomValidity(''));
 $('#engineer-form').addEventListener('submit',e=>{
  e.preventDefault();const accountInput=$('#engineer-accounts'),accountIds=[...new Set(accountInput.value.split(',').map(a=>a.trim()).filter(Boolean))];
  if(!accountIds.length||accountIds.some(id=>!/^\d{12}$/.test(id))){accountInput.setCustomValidity('Enter one or more 12-digit AWS account IDs, separated by commas.');accountInput.reportValidity();return;}
  accountInput.setCustomValidity('');
  if(!$('#engineer-form').reportValidity())return;
  const method=$('#engineer-method').value,profile=$('#engineer-profile').value;
  accessRequest={status:'DRAFT — NOT SENT — NO ACCESS GRANTED',engineerWorkEmail:$('#engineer-email').value.trim(),awsAccountIds:accountIds,accessMethod:method,managedPolicy:profile,managedPolicyArn:'arn:aws:iam::aws:policy/'+profile,purpose:$('#engineer-purpose').value.trim(),reviewOrExpiryDate:$('#engineer-expiry').value,administratorReviewRequired:true,mfaRequired:true,recommendedSessionDuration:'1 hour (Identity Center)',createAccessKeys:false,credentialDelivery:'Never include passwords, keys, or tokens in this request. Use approved secure channels.',nextStep:method.startsWith('IAM Identity')?'Customer administrator provisions the named person, sends the AWS/IdP invitation, and approves scoped account/group assignments.':'Customer administrator documents the IAM-user exception, requires password reset and MFA, and uses approved separate channels for the console URL and temporary password.',policyReview:profileNotes[profile]};
  $('#request-preview').textContent=JSON.stringify(accessRequest,null,2);$('#request-result').hidden=false;$('#request-result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
 });
 $('#download-request').addEventListener('click',()=>{if(!accessRequest)return;const url=URL.createObjectURL(new Blob([JSON.stringify(accessRequest,null,2)+'\n'],{type:'application/json'}));const a=node('a');a.href=url;a.download='transilience-aws-engineer-access-request.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
}

// Highlight the section in view without polling or backend requests.
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){$$('.toc a').forEach(a=>a.removeAttribute('aria-current'));const link=$$('.toc a').find(a=>a.hash==='#'+entry.target.id);link?.setAttribute('aria-current','location');}}},{rootMargin:'-15% 0px -70% 0px'});$$('.prose h2[id]').forEach(h=>observer.observe(h));}
