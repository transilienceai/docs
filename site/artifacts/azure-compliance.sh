#!/usr/bin/env bash
# Bash 3.2 (still shipped by macOS) treats an explicitly declared empty array
# as an unset variable under `set -u`, which can abort the best-effort partial
# authorization path precisely when a permission family grants zero entries.
# Every scalar used below has an explicit default; retain fail-fast and
# pipe-failure behavior while allowing a legitimate empty result set.
set -eo pipefail

TIER="posture"
PERMISSION_PROFILE="legacy"
SCOPE_KIND="management-group"
MANAGEMENT_GROUP=""
SUBSCRIPTIONS=""
WORKSPACE_IDS=""
BILLING_SCOPES=""
APP_NAME="Transilience Managed Compliance"
UNINSTALL="false"
DRY_RUN="false"
EXTERNAL_ID=""
COMPLETE_URL=""
RETURN_URL=""
# Connect-everything defaults for the one-click Cloud Shell case:
#   ALL_SUBSCRIPTIONS: assess every subscription the caller can access (all 6+
#     in the tenant), not just the current one.
#   ENTRA: posture onboarding stays on the fast Azure-resource path. Entra
#     directory access is opt-in because admin consent is a separate concern
#     and can add a minute of retries before the first CSPM run starts.
ALL_SUBSCRIPTIONS="false"
ENTRA="false"

usage() {
  cat <<'EOF'
Transilience Azure read-only compliance installer

Usage:
  azure-compliance.sh [options]

Options:
  --tier posture|logs|complete
  --profile azure-full-evidence-v1   Request the complete, versioned read-only
                                    evidence profile used by the app
  --scope management-group|subscriptions
  --management-group ID             Required for management-group scope
  --subscriptions ID1,ID2           Narrow to specific subscriptions
  --all-subscriptions               Assess every accessible subscription (default
                                    when no scope target is supplied)
  --entra / --no-entra              Grant/skip read-only Entra ID (Microsoft
                                    Graph) directory access. Default: --no-entra
  --workspace-ids RESOURCE_ID,...   Optional; narrows log roles to workspaces
  --billing-scopes RESOURCE_ID,...  Optional billing account/profile scopes on
                                    which Billing Reader should be assigned
  --app-name NAME                   Default: Transilience Managed Compliance
  --external-id TOKEN               Optional one-time platform callback token
  --complete-url HTTPS_URL          Optional platform completion callback
  --return-url HTTPS_URL            Security OS Integrations page to open after
                                     automatic completion
  --uninstall                       Remove role assignments and the dedicated app
  --dry-run                         Print the plan without changing Azure
  --help

Tiers:
  posture   Reader + Security Reader; base read-only Entra Graph
            (Directory/AuditLog/Policy/RoleManagement .Read.All)
  logs      Posture PLUS Log Analytics Reader + Microsoft Sentinel Reader, and the
            log-monitoring Graph permissions User.Read.All, ThreatHunting.Read.All,
            DeviceManagementManagedDevices.Read.All, Policy.Read.ConditionalAccess
            — i.e. Microsoft Defender / Entra sign-in & MFA-CA / Intune log access
  complete  Azure roles above

Profiles:
  azure-full-evidence-v1
             All applicable read-only Azure RBAC, Microsoft Graph, and
             Microsoft Defender for Endpoint permissions used for evidence
             collection. A denied permission does not discard the credential:
             the callback records a partial connection and lists what is
             missing so the grant can be repaired and the installer re-run.

By default (no scope target) the installer assesses EVERY subscription you can
access. Entra ID directory access is opt-in with --entra so the first CSPM run
is not delayed by an unrelated admin-consent step. Use --tier logs --entra to
also grant the log-monitoring roles + Graph permissions above. Pass
--subscriptions / --management-group to narrow the scope.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tier) TIER="$2"; shift 2 ;;
    --profile) PERMISSION_PROFILE="$2"; shift 2 ;;
    --scope) SCOPE_KIND="$2"; shift 2 ;;
    --management-group) MANAGEMENT_GROUP="$2"; shift 2 ;;
    --subscriptions) SUBSCRIPTIONS="$2"; shift 2 ;;
    --workspace-ids) WORKSPACE_IDS="$2"; shift 2 ;;
    --billing-scopes) BILLING_SCOPES="$2"; shift 2 ;;
    --app-name) APP_NAME="$2"; shift 2 ;;
    --external-id) EXTERNAL_ID="$2"; shift 2 ;;
    --complete-url) COMPLETE_URL="$2"; shift 2 ;;
    --return-url) RETURN_URL="$2"; shift 2 ;;
    --all-subscriptions) ALL_SUBSCRIPTIONS="true"; shift ;;
    --entra) ENTRA="true"; shift ;;
    --no-entra) ENTRA="false"; shift ;;
    --uninstall) UNINSTALL="true"; shift ;;
    --dry-run) DRY_RUN="true"; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done

case "$TIER" in posture|logs|complete) ;; *) echo "Invalid tier: $TIER" >&2; exit 2 ;; esac
case "$PERMISSION_PROFILE" in
  legacy) ;;
  azure-full-evidence-v1) TIER="complete"; ENTRA="true" ;;
  *) echo "Invalid profile: $PERMISSION_PROFILE" >&2; exit 2 ;;
esac
case "$SCOPE_KIND" in management-group|subscriptions) ;; *) echo "Invalid scope: $SCOPE_KIND" >&2; exit 2 ;; esac
if [[ -n "$EXTERNAL_ID" || -n "$COMPLETE_URL" ]]; then
  [[ -n "$EXTERNAL_ID" && -n "$COMPLETE_URL" ]] || { echo "--external-id and --complete-url must be supplied together" >&2; exit 2; }
  case "$COMPLETE_URL" in
    https://*.transilience.cloud/*|https://transilience.cloud/*|https://*.transilience.ai/*|https://transilience.ai/*|https://api.settlingforless.com/*|https://transilience-customer-prod--transilience-onboarding*.modal.run/*|https://transilience-customer-dev--transilience-onboarding*.modal.run/*) ;;
    *) echo "Completion URL is not an approved Transilience HTTPS endpoint" >&2; exit 2 ;;
  esac
fi
if [[ -n "$RETURN_URL" ]]; then
  case "$RETURN_URL" in
    https://*.transilience.cloud/*|https://transilience.cloud/*) ;;
    *) echo "Return URL is not an approved Transilience HTTPS endpoint" >&2; exit 2 ;;
  esac
fi

# Zero-input default: when no explicit scope target is supplied (the one-click
# Cloud Shell case), assess EVERY enabled subscription the caller can access.
# Pass --subscriptions ID1,ID2 to narrow, or --management-group ID to scope to
# a management group (which also covers future subscriptions under it).
if [[ "$SCOPE_KIND" == "management-group" && -z "$MANAGEMENT_GROUP" && -z "$SUBSCRIPTIONS" ]]; then
  SCOPE_KIND="subscriptions"
  ALL_SUBSCRIPTIONS="true"
fi
if [[ "$SCOPE_KIND" == "subscriptions" && "$ALL_SUBSCRIPTIONS" == "true" && -z "$SUBSCRIPTIONS" ]]; then
  command -v az >/dev/null || { echo "Azure CLI (az) is required." >&2; exit 1; }
  az account show >/dev/null 2>&1 || az login >/dev/null
  # Every enabled subscription in the signed-in tenant the caller can see.
  TENANT_FOR_SUBS="$(az account show --query tenantId -o tsv)"
  SUBSCRIPTIONS="$(az account list --all --query "[?tenantId=='$TENANT_FOR_SUBS' && state=='Enabled'].id" -o tsv | paste -sd, -)"
  [[ -n "$SUBSCRIPTIONS" ]] || {
    echo "No accessible subscriptions found. As a Global Admin, enable 'Access management for Azure resources' (Entra ID > Properties) to get access across the tenant, then re-run — or pass --subscriptions ID1,ID2." >&2
    exit 2
  }
  SUB_COUNT="$(awk -F, '{print NF}' <<< "$SUBSCRIPTIONS")"
  echo "No scope supplied; assessing all $SUB_COUNT accessible subscription(s)."
fi
if [[ "$SCOPE_KIND" == "subscriptions" && -z "$SUBSCRIPTIONS" ]]; then
  command -v az >/dev/null || { echo "Azure CLI (az) is required." >&2; exit 1; }
  az account show >/dev/null 2>&1 || az login >/dev/null
  SUBSCRIPTIONS="$(az account show --query id -o tsv)"
  [[ -n "$SUBSCRIPTIONS" ]] || { echo "Could not determine the current subscription; pass --subscriptions." >&2; exit 2; }
  echo "Defaulting to the current subscription: $SUBSCRIPTIONS"
fi

declare -a BASE_SCOPES=()
declare -a SUBSCRIPTION_LIST=()
if [[ "$SCOPE_KIND" == "management-group" ]]; then
  [[ -n "$MANAGEMENT_GROUP" ]] || { echo "--management-group is required" >&2; exit 2; }
  BASE_SCOPES+=("/providers/Microsoft.Management/managementGroups/$MANAGEMENT_GROUP")
else
  [[ -n "$SUBSCRIPTIONS" ]] || { echo "--subscriptions is required" >&2; exit 2; }
  IFS=',' read -r -a RAW_SUBSCRIPTION_LIST <<< "$SUBSCRIPTIONS"
  for subscription in "${RAW_SUBSCRIPTION_LIST[@]}"; do
    subscription="${subscription//[[:space:]]/}"
    if [[ -n "$subscription" ]]; then
      SUBSCRIPTION_LIST+=("$subscription")
      BASE_SCOPES+=("/subscriptions/$subscription")
    fi
  done
fi

declare -a LOG_SCOPES=()
if [[ -n "$WORKSPACE_IDS" ]]; then
  IFS=',' read -r -a RAW_WORKSPACE_LIST <<< "$WORKSPACE_IDS"
  for workspace in "${RAW_WORKSPACE_LIST[@]}"; do
    workspace="${workspace## }"; workspace="${workspace%% }"
    [[ -n "$workspace" ]] && LOG_SCOPES+=("$workspace")
  done
else
  LOG_SCOPES=("${BASE_SCOPES[@]}")
fi

# Versioned permission contract. Keep the names (rather than GUIDs) in source:
# Entra application-role GUIDs can be resolved from the tenant's Microsoft
# first-party service principals and the names make the requested access
# reviewable. Every entry is an application/read permission; no delegated or
# write permission is requested.
declare -a FULL_EVIDENCE_BASE_RBAC_ROLES=(
  "Reader"
  "Security Reader"
  "Monitoring Reader"
  "Backup Reader"
  "Key Vault Reader"
  "Cost Management Reader"
)
declare -a FULL_EVIDENCE_LOG_RBAC_ROLES=(
  "Log Analytics Reader"
  "Microsoft Sentinel Reader"
)
declare -a FULL_EVIDENCE_GRAPH_PERMISSIONS=(
  "Directory.Read.All"
  "User.Read.All"
  "Group.Read.All"
  "Application.Read.All"
  "Device.Read.All"
  "Organization.Read.All"
  "Domain.Read.All"
  "AdministrativeUnit.Read.All"
  "RoleManagement.Read.Directory"
  "RoleEligibilitySchedule.Read.Directory"
  "RoleAssignmentSchedule.Read.Directory"
  "RoleManagementPolicy.Read.Directory"
  "RoleManagement.Read.All"
  "Policy.Read.All"
  "Policy.Read.ConditionalAccess"
  "Policy.Read.AuthenticationMethod"
  "Policy.Read.PermissionGrant"
  "Policy.Read.DeviceConfiguration"
  "CrossTenantInformation.ReadBasic.All"
  "AuditLog.Read.All"
  "Reports.Read.All"
  "ReportSettings.Read.All"
  "AuditLogsQuery.Read.All"
  "AccessReview.Read.All"
  "EntitlementManagement.Read.All"
  "LifecycleWorkflows.Read.All"
  "Agreement.Read.All"
  "OnPremDirectorySynchronization.Read.All"
  "SecurityEvents.Read.All"
  "SecurityAlert.Read.All"
  "SecurityIncident.Read.All"
  "ThreatHunting.Read.All"
  "IdentityRiskyUser.Read.All"
  "IdentityRiskEvent.Read.All"
  "IdentityRiskyServicePrincipal.Read.All"
  "SecurityActions.Read.All"
  "ThreatIndicators.Read.All"
  "InformationProtectionPolicy.Read.All"
  "DeviceManagementConfiguration.Read.All"
  "DeviceManagementManagedDevices.Read.All"
  "DeviceManagementApps.Read.All"
  "DeviceManagementServiceConfig.Read.All"
  "DeviceManagementRBAC.Read.All"
)
declare -a FULL_EVIDENCE_DEFENDER_PERMISSIONS=(
  "Machine.Read.All"
  "Vulnerability.Read.All"
  "SecurityRecommendation.Read.All"
  "Software.Read.All"
  "Score.Read.All"
  "Alert.Read.All"
)

ACTION="install"
[[ "$UNINSTALL" == "true" ]] && ACTION="uninstall"
echo "Transilience Azure installer"
echo "  Action: $ACTION"
echo "  Tier:   $TIER"
echo "  Profile: $PERMISSION_PROFILE"
echo "  Scope:  $SCOPE_KIND"
printf '  Targets:\n'; printf '    - %s\n' "${BASE_SCOPES[@]}"
if [[ "$TIER" != "posture" ]]; then
  printf '  Log targets:\n'; printf '    - %s\n' "${LOG_SCOPES[@]}"
fi

if [[ "$DRY_RUN" == "true" ]]; then
  echo
  echo "Dry run only. Planned Azure RBAC access:"
  if [[ "$PERMISSION_PROFILE" == "azure-full-evidence-v1" ]]; then
    printf '  - %s\n' "${FULL_EVIDENCE_BASE_RBAC_ROLES[@]}"
    printf '  - %s\n' "${FULL_EVIDENCE_LOG_RBAC_ROLES[@]}"
    echo "  - Management Group Reader (management-group scope only)"
    echo "  - Billing Reader (--billing-scopes only)"
    echo "  - Azure Kubernetes Service RBAC Reader (discovered AKS clusters)"
    echo "  - App Configuration Data Reader (discovered App Configuration stores)"
    echo "  Microsoft Graph application permissions: ${#FULL_EVIDENCE_GRAPH_PERMISSIONS[@]} read-only permissions"
    printf '  - %s\n' "${FULL_EVIDENCE_GRAPH_PERMISSIONS[@]}"
    echo "  Microsoft Defender for Endpoint application permissions:"
    printf '  - %s\n' "${FULL_EVIDENCE_DEFENDER_PERMISSIONS[@]}"
  else
    echo "  - Reader"
    echo "  - Security Reader"
    if [[ "$TIER" != "posture" ]]; then
      echo "  - Log Analytics Reader"
      echo "  - Microsoft Sentinel Reader"
    fi
  fi
  if [[ "$ENTRA" == "true" && "$PERMISSION_PROFILE" != "azure-full-evidence-v1" ]]; then
    echo "  Microsoft Graph (Entra) read-only permissions:"
    echo "  - Directory.Read.All, AuditLog.Read.All, Policy.Read.All, RoleManagement.Read.Directory"
    if [[ "$TIER" != "posture" ]]; then
      echo "  - User.Read.All, ThreatHunting.Read.All, DeviceManagementManagedDevices.Read.All, Policy.Read.ConditionalAccess (log monitoring)"
    fi
  fi
  exit 0
fi

command -v az >/dev/null || { echo "Azure CLI (az) is required." >&2; exit 1; }
command -v jq >/dev/null || { echo "jq is required (it is preinstalled in Azure Cloud Shell)." >&2; exit 1; }
az account show >/dev/null 2>&1 || az login >/dev/null

TENANT_ID="$(az account show --query tenantId -o tsv)"
APP_ID="$(az ad app list --display-name "$APP_NAME" --query "[?displayName=='$APP_NAME'].appId | [0]" -o tsv)"

if [[ "$UNINSTALL" == "true" ]]; then
  if [[ -z "$APP_ID" ]]; then
    echo "Dedicated app is already absent: $APP_NAME"
    exit 0
  fi
  SP_OBJECT_ID="$(az ad sp list --filter "appId eq '$APP_ID'" --query '[0].id' -o tsv)"
  if [[ -n "$SP_OBJECT_ID" ]]; then
    # This service principal is dedicated to Transilience, so remove every
    # assignment it owns, including resource-scoped and optional billing roles.
    az role assignment delete --assignee "$SP_OBJECT_ID" --all --only-show-errors 2>/dev/null || true
    az ad sp delete --id "$SP_OBJECT_ID" --only-show-errors 2>/dev/null || true
  fi
  az ad app delete --id "$APP_ID" --only-show-errors
  echo "Azure offboarding is complete. Deleted the dedicated Transilience app and its scoped role assignments."
  exit 0
fi

if [[ -z "$APP_ID" ]]; then
  APP_ID="$(az ad app create --display-name "$APP_NAME" --sign-in-audience AzureADMyOrg --query appId -o tsv)"
  echo "Created app registration: $APP_ID"
else
  echo "Reusing app registration: $APP_ID"
fi

SP_OBJECT_ID="$(az ad sp list --filter "appId eq '$APP_ID'" --query '[0].id' -o tsv)"
if [[ -z "$SP_OBJECT_ID" ]]; then
  for _ in 1 2 3 4 5 6; do
    # A newly-created application can take several seconds to replicate to the
    # service-principal endpoint. Treat that expected 404 as retryable instead
    # of letting `set -e` abort an otherwise valid first-time installation.
    az ad sp create --id "$APP_ID" --only-show-errors >/dev/null 2>&1 || true
    SP_OBJECT_ID="$(az ad sp list --filter "appId eq '$APP_ID'" --query '[0].id' -o tsv)"
    [[ -n "$SP_OBJECT_ID" ]] && break
    sleep 5
  done
  [[ -n "$SP_OBJECT_ID" ]] || { echo "Enterprise application did not become available in time" >&2; exit 1; }
  echo "Created enterprise application: $SP_OBJECT_ID"
fi

role_assignment_id() {
  az role assignment list --assignee "$SP_OBJECT_ID" --role "$1" --scope "$2" \
    --include-inherited --query '[0].id' -o tsv 2>/dev/null || true
}

declare -a RBAC_GRANTED=()
declare -a RBAC_FAILED=()
declare -a RBAC_NOT_APPLICABLE=()
declare -a GRAPH_GRANTED=()
declare -a GRAPH_MISSING=()
declare -a DEFENDER_GRANTED=()
declare -a DEFENDER_MISSING=()
declare -a USABLE_SUBSCRIPTIONS=()

assign_role() {
  local role="$1" scope="$2" attempt
  local permission="${role}@${scope}"
  if [[ -n "$(role_assignment_id "$role" "$scope")" ]]; then
    RBAC_GRANTED+=("$permission")
    echo "Verified: $role at $scope"
    return 0
  fi
  if az role assignment create \
      --assignee-object-id "$SP_OBJECT_ID" \
      --assignee-principal-type ServicePrincipal \
      --role "$role" \
      --scope "$scope" \
      --only-show-errors >/dev/null 2>&1; then
    # Azure RBAC is eventually consistent. Do not report a successful create
    # as missing just because the verification read races replication.
    for attempt in 1 2 3 4; do
      if [[ -n "$(role_assignment_id "$role" "$scope")" ]]; then
        RBAC_GRANTED+=("$permission")
        echo "Verified: $role at $scope"
        return 0
      fi
      sleep 2
    done
  fi
  RBAC_FAILED+=("$permission")
  echo "WARNING: Could not grant $role at $scope; continuing so the usable credential can still be returned." >&2
  return 1
}

if [[ "$PERMISSION_PROFILE" == "azure-full-evidence-v1" ]]; then
  for scope in "${BASE_SCOPES[@]}"; do
    for role in "${FULL_EVIDENCE_BASE_RBAC_ROLES[@]}"; do
      assign_role "$role" "$scope" || true
    done
    if [[ "$SCOPE_KIND" == "management-group" ]]; then
      assign_role "Management Group Reader" "$scope" || true
    fi
  done
  for scope in "${LOG_SCOPES[@]}"; do
    for role in "${FULL_EVIDENCE_LOG_RBAC_ROLES[@]}"; do
      assign_role "$role" "$scope" || true
    done
  done
else
  for scope in "${BASE_SCOPES[@]}"; do
    assign_role "Reader" "$scope" || true
    assign_role "Security Reader" "$scope" || true
  done
  if [[ "$TIER" != "posture" ]]; then
    for scope in "${LOG_SCOPES[@]}"; do
      assign_role "Log Analytics Reader" "$scope" || true
      assign_role "Microsoft Sentinel Reader" "$scope" || true
    done
  fi
fi

# Resolve the subscriptions under a management-group target before discovering
# resource-scoped roles. Failure to enumerate does not destroy the credential;
# it produces a partial connection with no runnable subscriptions.
if [[ "$SCOPE_KIND" == "management-group" ]]; then
  SUBSCRIPTION_IDS_JSON="$(az account management-group subscription show-sub-under-mg \
    --name "$MANAGEMENT_GROUP" --query '[].name' -o json 2>/dev/null || echo '[]')"
  while IFS= read -r subscription; do
    [[ -n "$subscription" ]] && SUBSCRIPTION_LIST+=("$subscription")
  done < <(jq -r '.[]' <<< "$SUBSCRIPTION_IDS_JSON")
else
  SUBSCRIPTION_IDS_JSON="$(printf '%s\n' "${SUBSCRIPTION_LIST[@]}" | jq -R . | jq -s .)"
fi

if [[ "$PERMISSION_PROFILE" == "azure-full-evidence-v1" ]]; then
  # These two roles are meaningful only on matching resources, so discover and
  # assign them rather than widening their scope unnecessarily.
  AKS_FOUND="false"
  APPCONFIG_FOUND="false"
  for subscription in "${SUBSCRIPTION_LIST[@]}"; do
    while IFS= read -r resource_id; do
      [[ -z "$resource_id" ]] && continue
      AKS_FOUND="true"
      assign_role "Azure Kubernetes Service RBAC Reader" "$resource_id" || true
    done < <(az resource list --subscription "$subscription" \
      --resource-type Microsoft.ContainerService/managedClusters \
      --query '[].id' -o tsv 2>/dev/null || true)
    while IFS= read -r resource_id; do
      [[ -z "$resource_id" ]] && continue
      APPCONFIG_FOUND="true"
      assign_role "App Configuration Data Reader" "$resource_id" || true
    done < <(az resource list --subscription "$subscription" \
      --resource-type Microsoft.AppConfiguration/configurationStores \
      --query '[].id' -o tsv 2>/dev/null || true)
  done
  [[ "$AKS_FOUND" == "true" ]] || RBAC_NOT_APPLICABLE+=("Azure Kubernetes Service RBAC Reader (no AKS clusters discovered)")
  [[ "$APPCONFIG_FOUND" == "true" ]] || RBAC_NOT_APPLICABLE+=("App Configuration Data Reader (no App Configuration stores discovered)")
  if [[ -n "$BILLING_SCOPES" ]]; then
    IFS=',' read -r -a RAW_BILLING_SCOPES <<< "$BILLING_SCOPES"
    for scope in "${RAW_BILLING_SCOPES[@]}"; do
      scope="${scope//[[:space:]]/}"
      [[ -n "$scope" ]] && assign_role "Billing Reader" "$scope" || true
    done
  else
    RBAC_NOT_APPLICABLE+=("Billing Reader (no billing scope supplied)")
  fi
  if [[ "$SCOPE_KIND" != "management-group" ]]; then
    RBAC_NOT_APPLICABLE+=("Management Group Reader (subscription scope selected)")
  fi
fi

# A subscription is runnable when the service principal can read its resource
# inventory. Security/log/API permissions may still be partial and are reported
# independently. Management-group Reader inheritance is honored by the query.
for subscription in "${SUBSCRIPTION_LIST[@]}"; do
  if [[ -n "$(role_assignment_id "Reader" "/subscriptions/$subscription")" ]]; then
    USABLE_SUBSCRIPTIONS+=("$subscription")
  fi
done

# --- Entra (Microsoft Graph) read-only application permissions ---------------
# Grant this dedicated app tenant-wide READ access to Entra ID directory data
# (users, groups, roles, sign-in/audit logs, conditional-access policies), then
# admin-consent it so the service principal can use it app-only. All Graph
# permissions here are *.Read.All (read-only). Requires a Global Administrator
# or Privileged Role Administrator to consent; the script is idempotent.
GRAPH_APP_ID="00000003-0000-0000-c000-000000000000"  # Microsoft Graph
DEFENDER_APP_ID="fc780465-2017-40d4-a0c5-307022471b92" # WindowsDefenderATP
declare -a GRAPH_PERMISSIONS=(
  "Directory.Read.All"
  "AuditLog.Read.All"
  "Policy.Read.All"
  "RoleManagement.Read.Directory"
)
# Additional read-only Graph permissions for LOG MONITORING — Microsoft Defender
# (advanced hunting), Entra sign-in / MFA / Conditional Access, and Intune. Added
# on top of the base set for the `logs` and `complete` tiers so the one-click
# connect covers what the Transilience log-monitoring pipeline reads (this is the
# self-service replacement for the manual "Onboard Azure for Log Monitoring" steps).
declare -a LOG_GRAPH_PERMISSIONS=(
  "User.Read.All"
  "ThreatHunting.Read.All"
  "DeviceManagementManagedDevices.Read.All"
  "Policy.Read.ConditionalAccess"
)
if [[ "$TIER" != "posture" ]]; then
  GRAPH_PERMISSIONS+=("${LOG_GRAPH_PERMISSIONS[@]}")
fi
if [[ "$PERMISSION_PROFILE" == "azure-full-evidence-v1" ]]; then
  GRAPH_PERMISSIONS=("${FULL_EVIDENCE_GRAPH_PERMISSIONS[@]}")
fi

declare -a GRAPH_PERMISSION_IDS=()
declare -a DEFENDER_PERMISSION_IDS=()

resolve_and_request_permissions() {
  local resource_app_id="$1" label="$2" kind="$3"
  local resource_json resource_object_id permission permission_id
  local permissions=()
  if [[ "$kind" == "graph" ]]; then
    permissions=("${GRAPH_PERMISSIONS[@]}")
  else
    permissions=("${FULL_EVIDENCE_DEFENDER_PERMISSIONS[@]}")
  fi
  resource_json="$(az ad sp show --id "$resource_app_id" -o json 2>/dev/null || true)"
  if [[ -z "$resource_json" ]]; then
    az ad sp create --id "$resource_app_id" --only-show-errors >/dev/null 2>&1 || true
    resource_json="$(az ad sp show --id "$resource_app_id" -o json 2>/dev/null || true)"
  fi
  resource_object_id="$(jq -r '.id // empty' <<< "$resource_json")"
  if [[ -z "$resource_object_id" ]]; then
    for permission in "${permissions[@]}"; do
      if [[ "$kind" == "graph" ]]; then
        GRAPH_MISSING+=("${label}:${permission}")
      else
        DEFENDER_MISSING+=("${label}:${permission}")
      fi
    done
    return 0
  fi
  for permission in "${permissions[@]}"; do
    permission_id="$(jq -r --arg permission "$permission" \
      '.appRoles[]? | select(.value == $permission and .isEnabled == true and (.allowedMemberTypes | index("Application"))) | .id' \
      <<< "$resource_json" | head -1)"
    if [[ -z "$permission_id" ]]; then
      if [[ "$kind" == "graph" ]]; then
        GRAPH_MISSING+=("${label}:${permission}")
      else
        DEFENDER_MISSING+=("${label}:${permission}")
      fi
      continue
    fi
    if [[ "$kind" == "graph" ]]; then
      GRAPH_PERMISSION_IDS+=("${permission}|${permission_id}|${resource_object_id}")
    else
      DEFENDER_PERMISSION_IDS+=("${permission}|${permission_id}|${resource_object_id}")
    fi
    az ad app permission add --id "$APP_ID" --api "$resource_app_id" \
      --api-permissions "${permission_id}=Role" --only-show-errors >/dev/null 2>&1 || true
  done
}

verify_api_permissions() {
  local label="$1" kind="$2" assignments_json entry permission permission_id resource_object_id
  local permission_ids=()
  if [[ "$kind" == "graph" ]]; then
    permission_ids=("${GRAPH_PERMISSION_IDS[@]}")
  else
    permission_ids=("${DEFENDER_PERMISSION_IDS[@]}")
  fi
  assignments_json="$(az rest --method GET \
    --url "https://graph.microsoft.com/v1.0/servicePrincipals/${SP_OBJECT_ID}/appRoleAssignments?\$select=resourceId,appRoleId" \
    -o json 2>/dev/null || echo '{"value":[]}')"
  for entry in "${permission_ids[@]}"; do
    IFS='|' read -r permission permission_id resource_object_id <<< "$entry"
    if jq -e --arg resource "$resource_object_id" --arg permission "$permission_id" \
      '.value | any(.resourceId == $resource and .appRoleId == $permission)' \
      <<< "$assignments_json" >/dev/null; then
      if [[ "$kind" == "graph" ]]; then
        GRAPH_GRANTED+=("${label}:${permission}")
      else
        DEFENDER_GRANTED+=("${label}:${permission}")
      fi
    else
      if [[ "$kind" == "graph" ]]; then
        GRAPH_MISSING+=("${label}:${permission}")
      else
        DEFENDER_MISSING+=("${label}:${permission}")
      fi
    fi
  done
}

ENTRA_GRANTED="false"
if [[ "$ENTRA" == "true" ]]; then
  echo "Configuring Microsoft Graph read-only application access…"
  resolve_and_request_permissions "$GRAPH_APP_ID" "Microsoft Graph" graph
  if [[ "$PERMISSION_PROFILE" == "azure-full-evidence-v1" ]]; then
    echo "Configuring Microsoft Defender for Endpoint read-only application access…"
    resolve_and_request_permissions "$DEFENDER_APP_ID" "Microsoft Defender for Endpoint" defender
  fi
  # Admin-consent the application permissions (grants app-role assignments on
  # the Graph service principal). Retry briefly — the app permission list can
  # take a moment to propagate before consent succeeds.
  CONSENT_OK="false"
  for _ in 1 2 3 4 5 6; do
    if az ad app permission admin-consent --id "$APP_ID" --only-show-errors 2>/dev/null; then
      CONSENT_OK="true"; break
    fi
    sleep 10
  done
  [[ "$CONSENT_OK" == "true" ]] && sleep 5
  verify_api_permissions "Microsoft Graph" graph
  if [[ "$PERMISSION_PROFILE" == "azure-full-evidence-v1" ]]; then
    verify_api_permissions "Microsoft Defender for Endpoint" defender
  fi
  if [[ "$CONSENT_OK" == "true" && "${#GRAPH_MISSING[@]}" -eq 0 ]]; then
    ENTRA_GRANTED="true"
    echo "Microsoft Graph read access granted and verified."
  else
    echo "WARNING: Entra permissions were added but admin consent did not complete." >&2
    echo "         Grant consent in the portal (App registrations > $APP_NAME > API permissions > Grant admin consent), or re-run as a Global Administrator." >&2
  fi
fi

umask 077
CREDENTIAL_FILE="transilience-azure-credentials.json"
while IFS= read -r key_id; do
  [[ -n "$key_id" ]] && az ad app credential delete --id "$APP_ID" --key-id "$key_id" --only-show-errors
done < <(az ad app credential list --id "$APP_ID" --query "[?displayName=='transilience-onboarding'].keyId" -o tsv)
CREDENTIAL_JSON="$(az ad app credential reset --id "$APP_ID" --append --display-name transilience-onboarding --years 1 -o json)"
jq --arg tenantId "$TENANT_ID" --arg tier "$TIER" --arg profile "$PERMISSION_PROFILE" --arg scope "$SCOPE_KIND" \
  '{tenantId:$tenantId,clientId:.appId,clientSecret:.password,tier:$tier,permissionProfile:$profile,scope:$scope}' \
  <<< "$CREDENTIAL_JSON" > "$CREDENTIAL_FILE"

array_json() {
  if [[ "$#" -eq 0 ]]; then
    echo '[]'
  else
    printf '%s\n' "$@" | jq -R . | jq -s .
  fi
}

RBAC_GRANTED_JSON="$(array_json "${RBAC_GRANTED[@]}")"
RBAC_FAILED_JSON="$(array_json "${RBAC_FAILED[@]}")"
RBAC_NOT_APPLICABLE_JSON="$(array_json "${RBAC_NOT_APPLICABLE[@]}")"
GRAPH_GRANTED_JSON="$(array_json "${GRAPH_GRANTED[@]}")"
GRAPH_MISSING_JSON="$(array_json "${GRAPH_MISSING[@]}")"
DEFENDER_GRANTED_JSON="$(array_json "${DEFENDER_GRANTED[@]}")"
DEFENDER_MISSING_JSON="$(array_json "${DEFENDER_MISSING[@]}")"
USABLE_SUBSCRIPTIONS_JSON="$(array_json "${USABLE_SUBSCRIPTIONS[@]}")"

AUTHORIZATION_STATUS="complete"
if [[ "${#RBAC_FAILED[@]}" -gt 0 || "${#GRAPH_MISSING[@]}" -gt 0 || "${#DEFENDER_MISSING[@]}" -gt 0 ]]; then
  AUTHORIZATION_STATUS="partial"
fi
if [[ "$PERMISSION_PROFILE" == "azure-full-evidence-v1" && "${#USABLE_SUBSCRIPTIONS[@]}" -eq 0 ]]; then
  AUTHORIZATION_STATUS="partial"
fi

# Write the local handoff files before attempting the callback. Customers may
# need to transfer the credential through an approved secure channel when the
# callback is unavailable, and keeping the same files after callback success
# makes the customer procedure deterministic.
jq -n \
  --arg tenantId "$TENANT_ID" \
  --arg clientId "$APP_ID" \
  --arg servicePrincipalObjectId "$SP_OBJECT_ID" \
  --arg tier "$TIER" \
  --arg permissionProfile "$PERMISSION_PROFILE" \
  --arg authorizationStatus "$AUTHORIZATION_STATUS" \
  --arg scope "$SCOPE_KIND" \
  --arg credentialsFile "$CREDENTIAL_FILE" \
  --argjson subscriptionIds "$SUBSCRIPTION_IDS_JSON" \
  --argjson usableSubscriptionIds "$USABLE_SUBSCRIPTIONS_JSON" \
  --argjson rbacGranted "$RBAC_GRANTED_JSON" \
  --argjson rbacFailed "$RBAC_FAILED_JSON" \
  --argjson rbacNotApplicable "$RBAC_NOT_APPLICABLE_JSON" \
  --argjson graphPermissionsGranted "$GRAPH_GRANTED_JSON" \
  --argjson graphPermissionsMissing "$GRAPH_MISSING_JSON" \
  --argjson defenderPermissionsGranted "$DEFENDER_GRANTED_JSON" \
  --argjson defenderPermissionsMissing "$DEFENDER_MISSING_JSON" \
  '{tenantId:$tenantId,clientId:$clientId,servicePrincipalObjectId:$servicePrincipalObjectId,tier:$tier,permissionProfile:$permissionProfile,authorizationStatus:$authorizationStatus,scope:$scope,credentialsFile:$credentialsFile,subscriptionIds:$subscriptionIds,usableSubscriptionIds:$usableSubscriptionIds,rbacGranted:$rbacGranted,rbacFailed:$rbacFailed,rbacNotApplicable:$rbacNotApplicable,graphPermissionsGranted:$graphPermissionsGranted,graphPermissionsMissing:$graphPermissionsMissing,defenderPermissionsGranted:$defenderPermissionsGranted,defenderPermissionsMissing:$defenderPermissionsMissing}' \
  > transilience-azure-install-manifest.json

AUTO_REGISTERED="false"
if [[ -n "$COMPLETE_URL" ]]; then
  CLIENT_SECRET="$(jq -r '.clientSecret' "$CREDENTIAL_FILE")"
  CALLBACK_BODY="$(jq -n \
    --arg external_id "$EXTERNAL_ID" \
    --arg azure_tenant_id "$TENANT_ID" \
    --arg client_id "$APP_ID" \
    --arg client_secret "$CLIENT_SECRET" \
    --arg scope_mode "$SCOPE_KIND" \
    --arg management_group "$MANAGEMENT_GROUP" \
    --arg permission_profile "$PERMISSION_PROFILE" \
    --arg authorization_status "$AUTHORIZATION_STATUS" \
    --argjson entra_enabled "$ENTRA_GRANTED" \
    --argjson subscription_ids "$SUBSCRIPTION_IDS_JSON" \
    --argjson usable_subscription_ids "$USABLE_SUBSCRIPTIONS_JSON" \
    --argjson rbac_granted "$RBAC_GRANTED_JSON" \
    --argjson rbac_failed "$RBAC_FAILED_JSON" \
    --argjson rbac_not_applicable "$RBAC_NOT_APPLICABLE_JSON" \
    --argjson graph_permissions_granted "$GRAPH_GRANTED_JSON" \
    --argjson graph_permissions_missing "$GRAPH_MISSING_JSON" \
    --argjson defender_permissions_granted "$DEFENDER_GRANTED_JSON" \
    --argjson defender_permissions_missing "$DEFENDER_MISSING_JSON" \
    '{external_id:$external_id,azure_tenant_id:$azure_tenant_id,client_id:$client_id,client_secret:$client_secret,subscription_ids:$subscription_ids,usable_subscription_ids:$usable_subscription_ids,scope_mode:$scope_mode,management_group:$management_group,entra_enabled:$entra_enabled,permission_profile:$permission_profile,authorization_status:$authorization_status,rbac_granted:$rbac_granted,rbac_failed:$rbac_failed,rbac_not_applicable:$rbac_not_applicable,graph_permissions_granted:$graph_permissions_granted,graph_permissions_missing:$graph_permissions_missing,defender_permissions_granted:$defender_permissions_granted,defender_permissions_missing:$defender_permissions_missing}')"
  RESPONSE_FILE="$(mktemp)"
  HTTP_CODE="$(curl -sS --retry 2 --connect-timeout 10 -o "$RESPONSE_FILE" -w '%{http_code}' -X POST "$COMPLETE_URL" -H 'content-type: application/json' -d "$CALLBACK_BODY")"
  if [[ "$HTTP_CODE" != 2* ]]; then
    echo "Completion callback failed with HTTP $HTTP_CODE" >&2
    cat "$RESPONSE_FILE" >&2
    rm -f "$RESPONSE_FILE"
    echo "The credential and install manifest remain in Cloud Shell for approved secure handoff." >&2
    exit 1
  fi
  rm -f "$RESPONSE_FILE"
  AUTO_REGISTERED="true"
  echo "Transilience connection activated automatically ($AUTHORIZATION_STATUS authorization)."
  echo "The credential and install manifest remain in Cloud Shell for approved secure handoff."
fi

echo
echo "Azure onboarding is complete."
echo "Authorization status: $AUTHORIZATION_STATUS"
if [[ "$AUTHORIZATION_STATUS" == "partial" ]]; then
  echo "Some read-only grants were unavailable. The credential was retained and the missing grants are listed in transilience-azure-install-manifest.json." >&2
fi
echo "A non-secret summary is in transilience-azure-install-manifest.json."
echo "Download $CREDENTIAL_FILE and move it only through the approved secure handoff."
echo "Reader and Data Access was intentionally excluded because it permits storage-key data access."
if [[ "$AUTO_REGISTERED" == "true" ]]; then
  echo
  echo "Connection complete. Transilience security apps and scans are starting automatically."
  if [[ -n "$RETURN_URL" ]]; then
    echo "Return to Security OS to follow live activity:"
    echo "  $RETURN_URL"
  fi
fi
