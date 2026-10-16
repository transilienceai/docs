export const sourceCommit = '079477426ae1df1a94f9ff43472826ba16e281c9';
export const reviewed = '14 October 2026';
export const origin = 'https://cloudonboarding.transilience.dev';
export const repo = 'https://github.com/transilienceai/docs';
export const groups = [
  ['Get started', [['/', 'Connect your cloud']]],
  ['Cloud · AWS', [['/aws/cloudformation/', 'CloudFormation'], ['/aws/manual/', 'Manual setup'], ['/aws/organization/', 'Multiple accounts'], ['/aws/user-access/', 'Engineer access']]],
  ['Cloud · Azure', [['/azure/cloud-shell/', 'Cloud Shell / script'], ['/azure/manual/', 'Manual setup']]],
  ['Help & reference', [['/verify/', 'Verify connection'], ['/troubleshooting/', 'Troubleshooting'], ['/permissions/', 'Permissions'], ['/downloads/', 'Templates & scripts'], ['/security/', 'Security & revocation']]]
];
export const sourcePages = [
  {path:'/aws/cloudformation/',title:'Connect AWS with CloudFormation',description:'Review the stack. Launch your customer-specific connection. Verify the result.',file:'install/aws-cloudformation.md',cloud:'AWS',label:'Recommended · automated',next:'/verify/'},
  {path:'/aws/manual/',title:'Connect AWS, step by step',description:'Create the OIDC provider and scoped audit role in your own AWS console.',file:'install/aws-manual-onboarding.md',cloud:'AWS',label:'Manual · console',next:'/verify/'},
  {path:'/azure/cloud-shell/',title:'Connect Azure with Cloud Shell',description:'One dedicated app, explicit scopes, and an inspectable record of every grant.',file:'install/azure.md',cloud:'Azure',label:'Recommended · automated',next:'/verify/'},
  {path:'/azure/manual/',title:'Connect Azure, step by step',description:'Create the app, assign Azure roles, and consent to the approved API permissions.',file:'install/azure-subscriptions-and-logs.md',cloud:'Azure',label:'Manual · console',next:'/verify/'}
];
export const customPages = [
{path:'/plan/',title:'Your cloud. Your scope. Your plan.',description:'Choose a path before you grant access. Nothing here connects to your cloud or sends your information.',label:'Interactive planner',widget:'planner',body:`
## A connection that fits your environment

Automated installation and manual setup lead to the same objective: approved evidence access in the right customer organization. They do not necessarily grant identical permissions. Review the selected method’s access profile before installing.

### Bring these to the installation

- Your customer organization in Transilience, and a current connection link or command from **Integrations** or your authorized Transilience contact.
- The AWS account IDs or Azure tenant and subscription IDs that you have approved for assessment.
- An administrator who can create the connector identity and approve its permissions. Azure may require two administrators with different responsibilities.
- Your data-access approval and a named owner for credential rotation and offboarding.

### Keep human and service access separate

The assessment connector is a service identity. If an engineer also needs interactive access, use the separate [AWS engineer-access guide](/aws/user-access/) and an individually approved work email. A human login does not replace the connector.

### Know where the boundary is

This public portal is documentation, not a credential broker. It cannot create a tenant-specific connection token, verify a live installation, or receive cloud secrets. The planner stays in your browser. Installation and verification happen in your cloud account and your authenticated Transilience workspace.
`},
{path:'/aws/',title:'Connect AWS with confidence.',description:'A short-lived identity for the platform. An explicit scope for your accounts. You stay in control.',label:'Amazon Web Services',widget:'aws-paths',body:`
## Choose how you connect

**CloudFormation is the preferred Managed Compliance path.** Start from the customer-specific Quick Create link, not a generic template URL. The stack grants SecurityAudit plus the single Cost Explorer read action, and registers the connection with Transilience.

Prefer to approve each console action? The manual path creates the OIDC provider and audit role yourself. Its guide includes optional ECR read access when that evidence is in scope; it is not identical to the base CloudFormation profile.

## Understand the identity model

Customer AWS account → account-local OIDC provider → dedicated audit role → approved Transilience workload. The documented connector uses Modal-issued OIDC tokens exchanged for short-lived AWS credentials. Hosting these instructions on Cloudflare does **not** change that workload identity or its trust policy.

No IAM user or long-lived AWS access key is required for the automated assessment connector. Only the installer needs permissions to create the approved IAM, OIDC, Lambda, and CloudFormation resources. Transilience’s audit role does not inherit the installer’s administrative permissions.

## One account or an organization?

The base stack assesses the account where it is deployed. It does not silently enroll your AWS Organization. Read the [multi-account design](/aws/organization/) before deploying a central-security-account setup.

## Need to give a person access too?

Use [Invite an engineer](/aws/user-access/) for an individual work-email invitation, account assignment, and permission-set selection. This is optional and separate from the platform connector.
`},
{path:'/aws/organization/',title:'Make every account boundary explicit.',description:'Select a multi-account design that is easy to approve, inspect, and revoke.',label:'AWS · organization design',body:`
## Choose an account model

| Model | Where the role lives | What you must approve |
|---|---|---|
| Standalone | In the assessed account | Its account-local provider, trust conditions, and audit policy. |
| Direct role in each account | A dedicated role and OIDC provider in every approved account | The exact account list and a reviewed deployment in each. |
| Central security account | The OIDC entry role in the central account; separate audit roles in approved members | Both sides of each trust relationship and an explicit list of member-role ARNs. |

## Direct account-by-account enrollment

1. Record every approved 12-digit account ID and the regions to assess.
2. Obtain the right customer-specific onboarding link for the selected design.
3. Deploy and verify one account first; then enroll the remaining approved accounts.
4. Record the role ARN and integration status for each account, not just a total.
5. Confirm an initial evidence run in each account. A connected management account does not prove member coverage.

The base CloudFormation template does not create a StackSet or member-account roles automatically. Do not assume that enabling AWS Organizations discovery grants assessment access everywhere.

## Central security-account enrollment

The entry role needs an explicit permission to assume each approved member role. Each member must trust the exact approved central role. Use the [manual guide’s central-account policy examples](/aws/manual/#5-configure-multi-account-access-when-required) and replace all placeholders with reviewed values.

Avoid wildcard member-role resources. Review service control policies, permissions boundaries, role trust, and session restrictions. An allow in one policy is not proof that effective access exists.

## Keep a coverage register

Track account ID, owner, environment, regions, role ARN, onboarding method, permission profile, last successful collection, and offboarding owner. Label excluded accounts explicitly. Send this non-secret register through your approved collaboration channel; never include tokens or session credentials.
`},
{path:'/aws/user-access/',title:'Invite an engineer. Not a shared identity.',description:'Give an approved person the access they need—without sharing passwords, access keys, or your administrator account.',label:'AWS · optional human access',widget:'engineer',body:`
## Recommended: AWS IAM Identity Center

This human-access path is separate from the OIDC assessment connector. Use a named Transilience engineer’s approved work email. Your administrator creates or provisions the person; this portal does not send an invitation or grant access.

1. In **IAM Identity Center → Settings**, confirm your identity source. For an external identity provider, provision the engineer through that provider’s approved process instead of creating a duplicate local user.
2. For the built-in Identity Center directory, open **Users → Add user**, enter the individual’s email, and select AWS’s email invitation option. AWS—not this website—sends the setup email. Current AWS documentation specifies a seven-day invitation window.
3. Put the engineer in a customer-approved group. Assign that group only to the selected AWS accounts and a reviewed permission set. Use a short session duration, for example one hour.
4. Require MFA through the configured identity source. Validate effective access with the engineer before marking the request complete.

[AWS user invitations](https://docs.aws.amazon.com/singlesignon/latest/userguide/addusers.html) · [Account and permission-set assignments](https://docs.aws.amazon.com/singlesignon/latest/userguide/assignusers.html)

## Choose the least access that answers the question

| Profile | Appropriate use | Important boundary |
|---|---|---|
| SecurityAudit | Security configuration and posture review | Recommended starting point; not an unrestricted log or data reader. |
| ViewOnlyAccess | Basic resource visibility | Intentionally narrower; may not support a full assessment. |
| ReadOnlyAccess | Broader investigation approved by the customer | Can expose service data and sensitive content; review every allowed service. |

AWS-managed policies evolve. Review their current policy JSON and the permission set’s effective policies, including boundaries and account controls. Do not grant AdministratorAccess as a shortcut. Add narrowly scoped log, billing, or ECR permissions only after a separate need-and-scope review.

[AWS IAM access best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) · [SecurityAudit policy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/SecurityAudit.html)

## Exception: an IAM console-only user

Use this only when your customer cannot use federation and has approved the exception. IAM user creation is **not** an email invitation workflow.

1. Create one named IAM user for the approved person; use your naming standard and approved read-only group/policy.
2. Enable console access, require password change at next sign-in, and require MFA before routine use. Do not create an access key.
3. Deliver the console sign-in URL and temporary password through separate approved secure channels. Never put the password in email, this portal, a Slack message, or the access-request download.
4. Set an expiry/review date and record the exception owner. Disable the user when the engagement ends, remove any access keys, and review outstanding sessions.

The email in the request identifies the intended person; assigning an email-shaped IAM username does not make AWS send that person an invitation.

[AWS console-password administration](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_passwords_admin-change-user.html)

## Revoke and review

Remove account/permission-set assignments and group membership when the engagement ends. For an external identity provider, remove the source identity’s access as well. Handle active sessions according to your incident/offboarding policy; deleting a user or password is not a blanket guarantee that all issued credentials are invalidated immediately.
`},
{path:'/azure/',title:'Bring Azure into view.',description:'Resource posture, identity, endpoint, and log evidence—with the grants laid out before you begin.',label:'Microsoft Azure',widget:'azure-paths',body:`
## Choose your installation path

The guided Cloud Shell installer creates a dedicated, single-tenant **Transilience Managed Compliance** application. The manual guide walks your administrators through the same categories of access in the Azure and Entra consoles.

The documented full-evidence profile is **azure-full-evidence-v1** with **--entra**. Azure RBAC is scoped to the subscriptions or management group you select; Graph and Defender for Endpoint application permissions are tenant-wide and require admin consent. These are different approval boundaries.

## Decide scope before running the installer

By default, the guided installer discovers every enabled subscription visible to the signed-in administrator. Narrow it deliberately with the supported subscription-list or management-group options. Verify the intended tenant before creating an application.

An Entra consent administrator may not have Azure RBAC assignment rights, and a subscription Owner may not be able to consent to Graph permissions. Agree the split of responsibilities in advance. Partial grants must be recorded as partial coverage, not a fully healthy connection.

## What you will review

- **Azure roles:** resource inventory, Defender for Cloud, monitoring, backup, Key Vault metadata, cost, Log Analytics, and Sentinel reading. Conditional roles apply only to the relevant management groups, billing scopes, AKS clusters, and App Configuration stores.
- **Microsoft Graph:** identity, policies, sign-ins, audit, risk, Intune, and security evidence. These are app-only permissions, not delegated access to the installing administrator.
- **Defender for Endpoint:** endpoint, vulnerability, software, score, recommendation, and alert evidence.
- **A dedicated application credential:** a one-year secret in the current installer. Track expiry and use only the approved secure handoff.

Use the [permission explorer](/permissions/#azure-permissions) to search the complete permission manifest. Read-only evidence may include personal data, logs, and configuration values; treat approval as a data-access decision, not just a no-write guarantee.

## Access is not the same as telemetry

Granting API permissions does not license a product, onboard endpoints, create a Sentinel workspace, or configure diagnostic export. [Verify evidence coverage](/verify/) after connecting and record unlicensed, unconfigured, or excluded data sources explicitly.
`},
{path:'/verify/',title:'Connected is a milestone. Evidence is the proof.',description:'Check deployment, registration, effective permissions, and the first real collection independently.',label:'Finish · verification',widget:'checklist',body:`
## AWS: four independent checks

1. **Deployment:** the CloudFormation stack is CREATE_COMPLETE, or the manually created provider and role exist in the correct account.
2. **Trust and permissions:** the provider is account-local; audience and approved workspace subject conditions are present; audit and any separately approved optional policies match the intended profile.
3. **Registration:** Transilience Integrations shows the correct account ID and role ARN, with a successful onboarding status. Manual setup requires the approved non-secret role-ARN handoff and registration.
4. **Evidence:** request an initial collection in the authenticated Transilience workspace. Confirm collection time, account, region, source coverage, and any access-denied errors. The public portal cannot perform that test for you.

### Read-only identity sanity check

Run in your **customer administrator’s own** approved CLI session. This checks the identity you are currently using; it does not test Transilience’s OIDC role assumption or grant access.

~~~bash
aws sts get-caller-identity --query '{Account:Account,Arn:Arn}' --output json
~~~

## Azure: prove each evidence plane

1. **Tenant and identity:** verify the tenant ID, application/client ID, service principal, and selected subscriptions against your approved scope.
2. **Azure RBAC:** inspect role assignments at each approved subscription, management group, and any explicitly supplied workspace or billing scope.
3. **Consent:** inspect the Application permissions and Granted status for Microsoft Graph and Defender for Endpoint. Permission names alone do not prove consent succeeded.
4. **Registration and credential:** confirm secure callback receipt or approved secret handoff, integration status, and a recorded rotation owner and expiry.
5. **Evidence:** validate resource counts, security posture, identity/log data, endpoint evidence, and timestamps. Empty results can mean no data, no licence, missing configuration, wrong scope, or insufficient effective permissions.

### Read-only tenant sanity check

~~~bash
az account show --query '{tenantId:tenantId,subscriptionId:id,name:name}' --output json
~~~

This checks the signed-in administrator’s current context, not the app’s effective access. Never print an access token or client secret as a diagnostic step.

## Record a useful handoff

Keep the non-secret account/tenant IDs, approved scopes, role ARN or app ID, permission profile, installation time, first successful collection time, missing evidence, rotation owner, and offboarding owner. Do not include passwords, access tokens, session credentials, or the secret-bearing Azure credentials file.

## A checklist is not a live health test

The checklist on this page stores only local completion flags. It never calls AWS, Azure, or the Transilience backend. Clear it when starting a different customer’s setup. The authenticated workspace remains the source for live connection and collection status.
`},
{path:'/troubleshooting/',title:'Find the boundary. Fix the cause.',description:'Use the first failed step to narrow the problem. Don’t add broad permissions just to make an error disappear.',label:'Support · troubleshooting',widget:'troubleshooting',body:`
## Bring a clean support bundle

Include provider, onboarding method, non-secret account/tenant identifiers, approved scope, stack ID or app ID, first error with timestamp, and the non-secret install manifest. Redact tokens, secrets, authorization headers, customer log contents, and personal data not needed to investigate.

## Do not “fix” these with AdministratorAccess

An access-denied error can come from an account control policy, missing scope, wrong identity, role trust, missing consent, or a product with no configured data. More permissions in the wrong place do not solve an identity or registration problem.

## Need a fresh connection link?

Use the authenticated Transilience workspace or your authorized contact to obtain one. Do not recycle another customer’s Quick Create link, invent a callback URL, or paste a one-time connection token into this site.
`},
{path:'/security/',title:'An access model you can explain.',description:'Know what is granted, where secrets belong, and how to turn access off.',label:'Trust · security & revocation',body:`
## The portal does not collect credentials

This is a static documentation site. Planner selections and access-request fields stay in the current browser page. Only optional checklist completion flags and display preferences are stored locally. There are no credential fields, analytics SDKs, contact-form submissions, or backend installers here.

Generated access requests contain only the non-secret fields you choose to include. Review the file before sharing it. An email address identifies an engineer; it is not a secret transport or proof of approval.

## Three distinct trust boundaries

| Boundary | Identity | Approval and revocation |
|---|---|---|
| AWS assessment connector | Dedicated role with approved Modal OIDC trust | Customer controls role, trust conditions, and policies. Delete the stack or revoke the dedicated role/trust. |
| Azure assessment connector | Dedicated, single-tenant Entra application | Customer controls scoped Azure roles, tenant-wide API consent, and app credential. Remove app and residual assignments. |
| Optional engineer access | Individually approved human identity | Customer controls IdP/Identity Center invitation, MFA, account assignments, session limits, and offboarding. |

The source onboarding documents describe the Managed Compliance connector. Moving this website to Cloudflare does not migrate a connector runtime, replace an OIDC issuer, or change the organization that can assume a role.

## Read-only does not mean low sensitivity

Inventory can expose network layout and identities. Logs may contain personal data. Broad AWS ReadOnlyAccess may expose service data. Azure App Configuration Data Reader can read configuration values. Key Vault Reader is for metadata, not secret values. Approve the evidence required for the use case and document exclusions.

## AWS offboarding

For the stack-based path, delete only the verified customer stack. The documented template removes its dedicated role and registration resources and sends a disconnect callback. The shared OIDC provider is intentionally retained: do not remove it until you have checked other dependencies. For a manual setup, revoke/remove the dedicated role and its policies, then confirm disconnected status and that a new collection cannot authenticate.

Handle active AWS sessions according to your security policy; changing a role or deleting a password does not imply every previously issued credential is immediately unusable.

## Azure rotation and offboarding

The current installer creates a one-year client secret. Record expiry and an owner. Rotate via the approved connection workflow before expiry; verify a new successful collection before retiring the old credential. Do not rerun or improvise secret-reset commands without checking the effect on the existing integration.

To offboard, remove the dedicated app registration/service principal, remove any residual Azure RBAC assignments, and verify the integration is disconnected and subsequent authentication fails. Request a reviewed tenant-scoped uninstall command if using the installer’s uninstall path.

## Keep secrets out of support channels

Never email or paste a client secret, ConnectToken, session token, password, or AWS access key. The Azure credentials JSON is secret-bearing even if its filename looks like a normal report. The installation manifest is non-secret, but still inspect it before sharing. Use only the secure handoff channel supplied for your organization.
`},
{path:'/downloads/',title:'Inspect first. Install with intent.',description:'Review the production template and installer. Keep customer-specific connection values in the approved workflow.',label:'Resources · templates & scripts',widget:'downloads',body:`
## These are review snapshots, not generic connection links

The downloadable files are byte-for-byte snapshots of Transilience’s publicly hosted production assets fetched on 14 October 2026. Each has a SHA-256 fingerprint. They contain installation logic, not your organization’s connection token. Compare the upstream asset again before a new deployment; production code can change.

### AWS CloudFormation

Review the YAML and its IAM trust/policies. To install, start with the customer-specific Quick Create link from Integrations so the organization, one-time token, and callback are correct. Do not upload this template with guessed connection values.

[Current upstream template](https://transiliencepublic.s3.us-east-1.amazonaws.com/cloudformation-templates/transilience-security-audit.yaml) · [Installation guide](/aws/cloudformation/)

### Azure Cloud Shell script

Download and inspect the Bash installer; do not pipe unfamiliar remote code straight into a shell. The full-evidence profile includes Azure roles and tenant-wide application consent, and it creates a dedicated app secret. Run only the exact reviewed customer-specific command and approved scope. The script is for **Azure Cloud Shell Bash**, not a PowerShell session.

[Current upstream installer](https://transiliencepublic.s3.us-east-1.amazonaws.com/cloudformation-templates/install-scripts/azure-compliance.sh) · [Cloud Shell guide](/azure/cloud-shell/)

### Review a downloaded file’s fingerprint

~~~bash
# macOS
shasum -a 256 transilience-security-audit.yaml
shasum -a 256 azure-compliance.sh
# Linux / Azure Cloud Shell
sha256sum transilience-security-audit.yaml azure-compliance.sh
~~~

Compare the output to the fingerprints above. A matching fingerprint confirms the snapshot’s bytes, not that permissions are appropriate for your account.

## Prefer a manual installation?

Follow the [AWS console procedure](/aws/manual/) or [Azure portal procedure](/azure/manual/) instead. All trust-policy placeholders must be replaced with current approved values; never copy example tenant or workspace IDs from screenshots.
`}
];

export const problems = [
 ['AWS','Stack failed or rolled back','Open CloudFormation Events and find the first CREATE_FAILED resource. Check installer IAM/Lambda rights, named-IAM acknowledgement, SCPs, and an existing failed stack. For ROLLBACK_COMPLETE, delete only that failed stack and obtain a fresh customer-specific link.','/aws/cloudformation/'],
 ['AWS','Stack complete, integration disconnected','Inspect OnboardingStatus and the registration error. Compare AccountId and RoleArn with the intended account. Refresh Integrations. Share the stack ID and redacted first error, never the ConnectToken.','/aws/cloudformation/'],
 ['AWS','OIDC or AssumeRoleWithWebIdentity denied','Verify the account-local provider ARN, audience, current approved workspace subject, and effective policy controls. Do not remove trust conditions or use a wildcard-only subject to bypass the failure.','/aws/manual/'],
 ['AWS','Only the management account has evidence','A base stack does not deploy member roles. Compare your approved account list with installed roles and successful per-account collections. Review both sides of central-to-member trust.','/aws/organization/'],
 ['AWS','The engineer did not receive an invitation','Confirm the Identity Center identity source and exact work email. An external IdP uses its own provisioning flow. An IAM console-only user does not receive an Identity Center invitation merely because its username is an email address.','/aws/user-access/'],
 ['Azure','Admin consent is incomplete','Use an authorized Entra consent administrator. Inspect Application (not Delegated) permissions and Granted status for Graph and Defender for Endpoint. Keep partial grant results; repair only the missing approvals.','/azure/manual/'],
 ['Azure','Subscription roles are missing','Check the signed-in administrator’s role-assignment rights at every approved scope. Entra administration alone does not confer Azure RBAC rights. Check deny assignments and inherited scope.','/azure/cloud-shell/'],
 ['Azure','Callback or secure handoff failed','Inspect the non-secret install manifest and callback error. The owner-readable credentials file remains in Cloud Shell and contains a secret: transfer it only through the approved secure channel. Do not attach it to support tickets.','/azure/cloud-shell/'],
 ['Azure','Connected but no endpoint, Sentinel, or sign-in data','Check the correct tenant/workspace, effective grants, product licensing, endpoint onboarding, diagnostic configuration, and time range. An API permission alone does not create telemetry.','/verify/'],
 ['Azure','App credential expired','Use the approved rotation workflow, verify a new collection, then retire the old credential. Never post the replacement secret in email or Slack.','/security/']
];
