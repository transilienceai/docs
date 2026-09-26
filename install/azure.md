# Connect Microsoft Azure for a Transilience security audit

The Transilience Azure installer creates a dedicated, single-tenant Microsoft
Entra application named **Transilience Managed Compliance**. The application is
given read-only access to the Azure subscriptions, Entra configuration, audit
records, and Microsoft Defender for Endpoint evidence needed for a security and
compliance assessment.

The guided installer is available at
[transilience.ai/install/azure](https://www.transilience.ai/install/azure/).
When Transilience provides a customer-specific Cloud Shell command, use that
exact command: its one-time connection token associates the resulting
credential with the correct customer organization.

## What the installer does

1. Discovers all enabled subscriptions visible to the signed-in administrator,
   unless specific subscriptions or a management group were supplied.
2. Creates or reuses the dedicated **Transilience Managed Compliance** app
   registration and enterprise application in the customer's tenant.
3. Assigns the read-only Azure RBAC roles listed below at the selected scopes.
4. Adds the listed Microsoft Graph and Microsoft Defender for Endpoint
   **application** permissions and requests tenant-wide admin consent.
5. Creates a one-year client secret for this dedicated app and sends the tenant
   ID, client ID, secret, selected subscription IDs, and grant results directly
   to the customer-specific Transilience HTTPS callback.
6. Removes the local credential file after a successful callback and writes a
   non-secret `transilience-azure-install-manifest.json` summary in Cloud Shell.

The app acts as itself; it does not impersonate the administrator who performs
the installation. No delegated permission and no Microsoft Graph
`*.ReadWrite.*` permission is requested.

## Who should run it

Use an account that can:

- create an app registration and enterprise application in the intended Entra
  tenant;
- grant tenant-wide admin consent for application permissions; and
- assign Azure RBAC roles at every subscription or management-group scope that
  should be assessed.

In many tenants this means an Entra Global Administrator or Privileged Role
Administrator together with Owner, Role Based Access Control Administrator, or
User Access Administrator on the selected Azure scopes. A tenant may split
these duties between two administrators; the installer records a partial
connection when some read-only grants are unavailable, so the missing grants
can be repaired and the command run again.

## Azure RBAC roles

The full-evidence profile requests these roles. None is Owner or Contributor.

| Role | Where it is assigned | Why it is needed |
|---|---|---|
| Reader | Selected subscriptions or management group | Inventory Azure resources and read their control-plane configuration without changing them. |
| Security Reader | Selected subscriptions or management group | Read Defender for Cloud recommendations, alerts, security policies, and security state. |
| Monitoring Reader | Selected subscriptions or management group | Read Azure Monitor metrics, logs, alerts, and diagnostic settings. |
| Backup Reader | Selected subscriptions or management group | Read backup vaults, protected items, policies, jobs, and backup posture. |
| Key Vault Reader | Selected subscriptions or management group | Read vault and key/secret/certificate metadata. It cannot read secret values or key material. |
| Cost Management Reader | Selected subscriptions or management group | Read cost configuration, budgets, exports, and cost-management evidence. |
| Log Analytics Reader | Selected subscriptions, management group, or explicitly supplied workspaces | Query and read Log Analytics data and workspace monitoring configuration. |
| Microsoft Sentinel Reader | Selected subscriptions, management group, or explicitly supplied workspaces | Read Sentinel incidents, analytics, hunting, and workspace security configuration. |
| Management Group Reader | Management-group installs only | Read the management-group hierarchy and subscriptions included in the selected group. |
| Billing Reader | Explicitly supplied billing scopes only | Read billing-account/profile evidence. The role is not requested when no billing scope is supplied. |
| Azure Kubernetes Service RBAC Reader | Each discovered AKS cluster only | Read Kubernetes objects needed to assess cluster configuration; it is not assigned if no AKS cluster exists. |
| App Configuration Data Reader | Each discovered App Configuration store only | Read configuration key-values needed for posture checks; it is not assigned if no store exists. |

The installer intentionally excludes **Reader and Data Access**, storage
`listKeys`, Key Vault secret-value roles, and all write-capable Azure roles.

## Microsoft Graph application permissions

These permissions are tenant-wide, app-only, and require admin consent. They
let the audit run without a human remaining signed in.

| Permission | Security-audit purpose |
|---|---|
| `Directory.Read.All` | Read directory objects and relationships used for tenant-wide identity inventory. |
| `User.Read.All` | Inventory users, account state, and identity attributes. |
| `Group.Read.All` | Inventory groups and membership used for access-path analysis. |
| `Application.Read.All` | Inventory app registrations, enterprise applications, credentials metadata, and consent configuration. |
| `Device.Read.All` | Inventory Entra-registered devices and trust/compliance attributes. |
| `Organization.Read.All` | Read tenant identity, settings, and verified organization properties. |
| `Domain.Read.All` | Read verified and federated domain configuration. |
| `AdministrativeUnit.Read.All` | Read administrative units and their membership/delegation boundaries. |
| `RoleManagement.Read.Directory` | Read Entra role definitions and assignments. |
| `RoleEligibilitySchedule.Read.Directory` | Read eligible Privileged Identity Management role schedules. |
| `RoleAssignmentSchedule.Read.Directory` | Read active and scheduled privileged-role assignments. |
| `RoleManagementPolicy.Read.Directory` | Read PIM activation, approval, duration, and notification policies. |
| `RoleManagement.Read.All` | Read role-management configuration exposed across supported Microsoft Graph resources. |
| `Policy.Read.All` | Read tenant identity and authorization policies. |
| `Policy.Read.ConditionalAccess` | Read Conditional Access policies and named locations. |
| `Policy.Read.AuthenticationMethod` | Read authentication-method and MFA policy configuration. |
| `Policy.Read.PermissionGrant` | Read application consent and permission-grant policies. |
| `Policy.Read.DeviceConfiguration` | Read device registration and authorization policies. |
| `CrossTenantInformation.ReadBasic.All` | Read basic cross-tenant organization information for trust review. |
| `AuditLog.Read.All` | Read directory audit, provisioning, and sign-in activity. |
| `Reports.Read.All` | Read service-usage and security reports. |
| `ReportSettings.Read.All` | Read administrative report settings, including concealed-data settings. |
| `AuditLogsQuery.Read.All` | Query audit-log data exposed across Microsoft services. |
| `AccessReview.Read.All` | Read access reviews, reviewers, decisions, and settings. |
| `EntitlementManagement.Read.All` | Read access packages, catalogs, assignments, and entitlement policies. |
| `LifecycleWorkflows.Read.All` | Read joiner, mover, and leaver workflow configuration and execution history. |
| `Agreement.Read.All` | Read terms-of-use agreements and acceptance records. |
| `OnPremDirectorySynchronization.Read.All` | Read hybrid identity synchronization configuration and status. |
| `SecurityEvents.Read.All` | Read security events exposed through the Microsoft Graph security API. |
| `SecurityAlert.Read.All` | Read security alerts for investigation and control evidence. |
| `SecurityIncident.Read.All` | Read correlated security incidents and their status. |
| `ThreatHunting.Read.All` | Run read-only advanced hunting queries for security evidence. |
| `IdentityRiskyUser.Read.All` | Read risky-user detections and risk state. |
| `IdentityRiskEvent.Read.All` | Read identity risk detections and event detail. |
| `IdentityRiskyServicePrincipal.Read.All` | Read risk findings for workload identities and service principals. |
| `SecurityActions.Read.All` | Read security remediation-action status without initiating actions. |
| `ThreatIndicators.Read.All` | Read tenant threat-intelligence indicators. |
| `InformationProtectionPolicy.Read.All` | Read information-protection policy configuration. |
| `DeviceManagementConfiguration.Read.All` | Read Intune device configuration and compliance policies. |
| `DeviceManagementManagedDevices.Read.All` | Read managed-device inventory, ownership, health, and compliance state. |
| `DeviceManagementApps.Read.All` | Read managed application inventory and app-management policy. |
| `DeviceManagementServiceConfig.Read.All` | Read Intune tenant and service configuration. |
| `DeviceManagementRBAC.Read.All` | Read Intune roles, assignments, and scope tags. |

Some evidence is returned only when the corresponding Microsoft product is
licensed and configured in the customer's tenant. A permission can be granted
even when the underlying product has no data.

## Microsoft Defender for Endpoint application permissions

These are also app-only, read-only permissions:

| Permission | Security-audit purpose |
|---|---|
| `Machine.Read.All` | Read onboarded endpoint inventory, health, exposure, and device detail. |
| `Vulnerability.Read.All` | Read discovered vulnerabilities and affected devices. |
| `SecurityRecommendation.Read.All` | Read endpoint security recommendations and remediation context. |
| `Software.Read.All` | Read installed-software inventory and software evidence. |
| `Score.Read.All` | Read exposure/security score evidence. |
| `Alert.Read.All` | Read Defender for Endpoint alerts and related investigation context. |

## What Transilience cannot do with this access

The requested permissions do not allow Transilience to create, update, or
delete Azure resources; change users, groups, roles, MFA, Conditional Access,
or Intune policy; dismiss alerts; run remediation actions; read Key Vault secret
values; retrieve storage account keys; or sign in as the administrator.

The dedicated client secret can exercise only the roles and application
permissions listed above. Transilience stores the credential in the customer's
private Clerk organization metadata and in a protected Modal runtime secret. It
is not included in browser status responses, Slack notifications, the public
documentation, or the non-secret installation manifest.

## Customer installation steps

1. Confirm the customer-specific command came from Transilience and contains an
   `--external-id`, the Transilience production `--complete-url`, and
   `--profile azure-full-evidence-v1 --entra`.
2. Open [Azure Cloud Shell](https://shell.azure.com/) and select **Bash**.
3. Confirm Cloud Shell is signed into the intended customer tenant.
4. Paste the command once and let it finish. Do not email or paste any generated
   client secret into chat.
5. If the script reports that admin consent is incomplete, have an authorized
   Entra administrator grant consent under **App registrations → Transilience
   Managed Compliance → API permissions**, then run the same command again.
6. Save the final non-secret authorization summary. A `partial` result is safe
   to retain and lists exactly which grants need repair.

The default command includes every enabled subscription visible to the
installer. Use `--subscriptions ID1,ID2` or
`--scope management-group --management-group ID` when the customer wants a
deliberately narrower or hierarchy-based scope.

## Revocation

The customer can revoke access at any time by deleting the **Transilience
Managed Compliance** app registration, which also removes its tenant-local
service principal, and removing any remaining Azure RBAC assignments. The
installer also supports `--uninstall`; ask Transilience for a reviewed
offboarding command scoped to the customer's tenant.

## Microsoft references

- [Microsoft Graph permissions reference](https://learn.microsoft.com/en-us/graph/permissions-reference)
- [Azure built-in roles](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles)
- [Supported Microsoft Defender for Endpoint APIs](https://learn.microsoft.com/en-us/defender-endpoint/api/exposed-apis-list)
- [Apps and service principals in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals)
- [Application permissions and admin consent](https://learn.microsoft.com/en-us/entra/identity-platform/app-only-access-primer)

## Related

- [Apps](../concepts/apps.md) — what you can run after Azure is connected.
