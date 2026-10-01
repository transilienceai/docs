# Install AWS with the Transilience CloudFormation template

This is the preferred AWS onboarding path for **Transilience Managed
Compliance**. A customer-specific AWS CloudFormation Quick Create link deploys
the read-only AWS role, connects it to Transilience, and starts the initial
cloud-security assessment.

Use the Quick Create link from the Transilience **Integrations** page or from
the customer's Transilience contact. Do not construct or reuse another
customer's link: each link contains a one-time `ConnectToken` that associates
the AWS account with the correct Transilience organization.

The current production template is available for review at:

<https://transiliencepublic.s3.us-east-1.amazonaws.com/cloudformation-templates/transilience-security-audit.yaml>

The template URL is for security review. Start the installation from the
customer-specific Quick Create link so the required organization token and
company name are populated correctly.

## What the stack creates

The default stack name is `transilience-compliance`. It creates:

- an idempotent `oidc.modal.com` IAM OpenID Connect provider, or reuses the
  existing provider;
- a stack-scoped IAM role named `TrComplianceRole-<STACK_NAME>`;
- the AWS-managed `SecurityAudit` policy on that role;
- a least-privilege inline policy allowing only `ce:GetCostAndUsage` for cloud
  cost analysis;
- a small Lambda-backed custom resource that creates or reuses the OIDC
  provider;
- a registration Lambda and execution role that send the AWS account ID, role
  ARN, stack ID, region, company name, and one-time connection token to the
  Transilience onboarding service; and
- CloudFormation outputs for the AWS account ID, role ARN, role name, OIDC
  provider ARN, onboarding status, and permission summary.

The stack does not create an IAM user, access key, or secret access key.
Transilience uses a short-lived Modal OIDC identity token to assume the AWS
role.

## Access granted to Transilience

The compliance role has:

- **`SecurityAudit`** — AWS's managed read-only security-audit policy; and
- **`ce:GetCostAndUsage`** — read-only access to the exact Cost Explorer
  operation used for cloud cost analysis.

Its trust policy requires both the `oidc.modal.com` audience and the approved
Transilience Modal workspace subject. The role does not grant administrator,
resource-modification, IAM-management, or general billing permissions.

CloudFormation also creates narrowly scoped deployment resources. The OIDC
setup Lambda can create, read, and tag only the account's
`oidc.modal.com` provider. The registration Lambda has basic CloudWatch logging
permission and calls the Transilience onboarding endpoint.

## Before you start

Confirm that:

- you are signed in to the AWS account that Transilience should assess;
- the signed-in identity can create CloudFormation stacks, IAM roles and
  policies, Lambda functions, and an IAM OIDC provider;
- the identity can acknowledge named IAM resources
  (`CAPABILITY_NAMED_IAM`); and
- you have the current customer-specific **Connect AWS** or Quick Create link.

For an AWS Organization, deploy the stack in the account that Transilience is
expected to assess. If a central security account already has approved
cross-account audit roles, agree the account design with Transilience before
installation. The base template does not automatically create member-account
roles or a StackSet.

## Install from the Quick Create link

1. In Transilience, open **Integrations** and select **Connect AWS**, or open the
   customer-specific Quick Create link supplied by Transilience.
2. Sign in to the intended AWS account. Confirm the account name and account ID
   before continuing.
3. On **CloudFormation → Quick create stack**, review the template URL and stack
   name. The standard stack name is `transilience-compliance`.
4. Confirm that **CustomerName** and **ConnectToken** are already populated.
   `CustomerEmail` can be blank for a token-backed launch.
5. Do not change `ConnectToken`, `TransilienceBackendUrl`, or any hidden
   onboarding value. If the link is missing its token, stop and request a new
   link.
6. Review the template and the permissions summarized above.
7. Select **I acknowledge that AWS CloudFormation might create IAM resources
   with custom names**.
8. Select **Create stack**.
9. Wait until the stack reaches `CREATE_COMPLETE`. Installation normally takes
   a few minutes.
10. Open the stack's **Outputs** tab and confirm that `RoleArn`, `AccountId`,
    `OIDCProviderArn`, and `OnboardingStatus` are present. Do not send the
    one-time connection token in email or chat.
11. Return to Transilience **Integrations**. The AWS card should show
    **Connected** and the role ARN. The initial AWS security assessment can then
    start automatically.

## Validate the installation

- [ ] The stack status is `CREATE_COMPLETE`.
- [ ] The account ID in the Outputs tab is the intended AWS account.
- [ ] The role name begins with `TrComplianceRole-`.
- [ ] The role has `SecurityAudit` and the inline Cost Explorer read policy.
- [ ] The trust policy uses the account-local `oidc.modal.com` provider.
- [ ] The trust policy checks the expected audience and approved workspace
      subject.
- [ ] No IAM user or static AWS access key was created.
- [ ] Transilience shows the AWS integration as connected.

## Troubleshooting

### The stack failed or rolled back

Open the stack's **Events** tab and find the first `CREATE_FAILED` event. Record
the logical resource and its status reason. Common causes are insufficient IAM
or Lambda permissions, failure to acknowledge named IAM resources, an account
control policy that blocks OIDC providers, or a previously failed stack with
the same name.

If the stack is `ROLLBACK_COMPLETE`, delete that failed stack and request a
fresh customer-specific Quick Create link before trying again. Do not copy the
old `ConnectToken` into a new launch.

The `oidc.modal.com` provider can already exist. The template is designed to
reuse it rather than fail with `EntityAlreadyExists`.

### The stack completed but Transilience is not connected

1. Confirm that `OnboardingStatus` is successful in the Outputs tab.
2. Refresh the Transilience Integrations page.
3. If the status is still disconnected, provide Transilience support with the
   stack ID, AWS account ID, role ARN, and the relevant CloudFormation event or
   registration error.

Do not send the connection token, AWS session credentials, or unrelated
CloudWatch log contents.

## Uninstall and revoke access

Delete the `transilience-compliance` CloudFormation stack, or the stack name
used during installation. This removes the stack-scoped compliance role,
registration resources, and their policies and sends a disconnect callback to
Transilience.

The `oidc.modal.com` provider is intentionally left in place because another
approved role or stack might use it. Delete that provider separately only
after confirming that no other workload depends on it.

After deletion, confirm that the AWS integration no longer appears connected
in Transilience. Contact support if the application still shows the removed
role.

## References

- [Use quick-create links to create CloudFormation stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stacks-quick-create-links.html)
- [Control CloudFormation access with IAM](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/control-access-with-iam.html)
- [View CloudFormation stack events](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/view-stack-events.html)
- [AWS `SecurityAudit` managed policy](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/SecurityAudit.html)
- [Modal OIDC integration](https://modal.com/docs/guide/oidc-integration)

## Related

- [AWS install routing](aws.md)
- [Manual AWS onboarding](aws-manual-onboarding.md)
- [Apps](../concepts/apps.md)
