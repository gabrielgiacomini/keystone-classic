# Admin Parity Soak Runbook

This runbook covers the remaining external P4 gate: requiring the `admin-parity`
GitHub Actions check on `master` and proving that it stays green for 14 days.

## Current Verified State

Last checked from this workspace:

- `npm run admin-parity:protect:status` exited 0 on 2026-05-25. Repository
  `gabrielgiacomini/keystone-classic` is public, branch `master` is protected,
  and classic branch protection requires the `admin-parity` check.
- `npm run admin-parity:soak` exited non-zero on 2026-05-25. The required-check
  source is now valid, but the historical 14-day window is not clean: 12
  in-window `admin-parity` jobs did not succeed, only 1 green day was found, and
  green days are missing for 2026-05-12 through 2026-05-25 except 2026-05-22.
- `npm run admin-parity:final -- --dry-run` on 2026-05-26 confirms the local
  final-gate order now covers the convergence baseline commands before the
  external soak: ledger, lint, typecheck, `build-dev`, production build, unit,
  API e2e, canonical admin parity, package verification, and
  `admin-parity:soak`.
- Manual branch CI run `26382033849` on 2026-05-25 found fresh-checkout CI
  drift on `modernization/legacy-client-convergence`: Node 20/22 test jobs were
  incompatible with the Node 24 Mocha strip-types setup, some jobs ran before
  admin-next assets or `dist` existed, the legacy bundle job invoked bare `jiti`
  outside npm script PATH, and production audit flagged Express/QS. The branch
  now contains CI/package hardening for those repo-owned failures; rerun CI on a
  new commit before treating the branch as ready to merge into `master`.
- Manual branch CI run `26382347256` on the hardened branch commit improved the
  current head to green `package-verify`, `lint-typecheck`, `prod-audit`,
  `e2e-api`, `e2e-ui`, and `admin-parity`. The remaining failures were
  repo-owned and fixed afterward: the decommissioned legacy bundle-hash CI job
  was removed, and the headless boot unit test now isolates CI Mongo environment
  variables before asserting default database-name fallback behavior.
- Manual branch CI run `26382502620` passed on 2026-05-25 for commit
  `bcfce962` on `modernization/legacy-client-convergence`: `prod-audit`,
  `e2e-ui`, `test (24)`, `admin-parity`, `e2e-api`, `package-verify`, and
  `lint-typecheck` all completed successfully. This proves the current branch
  head is green before merge; the 14-day soak still cannot pass until the fixed
  branch is on `master` and the required check stays green for the full window.
- Pull request #3 merged into protected `master` on 2026-05-25 as merge commit
  `43657bee42c6f242980ac7ecd694c519e0abbe1c`. Post-merge push CI run
  `26382899615` passed `test (24)`, `lint-typecheck`, `e2e-api`, `e2e-ui`,
  `package-verify`, `prod-audit`, and required `admin-parity`. This is the
  first post-merge green required-check signal for the new soak window.
- Later direct pushes to `master` on 2026-05-25 advanced the branch through
  `49f7bd7d`, `bfa3bad2`, `ee801942`, `6e4835ec`, and `c77f853f` to restore
  the legacy React 18 admin shell, date picker behavior, no-default-column item
  routes, horizontal field spacing, and datetime inline controls. GitHub
  accepted those pushes with required-check bypass notices for `admin-parity`.
  Treat these as local stabilization evidence only; the protected 14-day soak
  must restart from a green required `admin-parity` run on the current
  `master` head.
- `npm run admin-parity:protect:status` exited non-zero during the
  2026-05-12T03:13:48Z refresh. Repository
  `gabrielgiacomini/keystone4-ts` is private, branch `main` is not protected,
  and no active required-check source requires `admin-parity`.
- `npm run admin-parity:soak` exited non-zero during the
  2026-05-12T03:28:04Z refresh because the branch-rules API returned the same
  private-repo 403 and branch `main` is not protected. The verifier now fails
  fast before workflow/job history scans when the required-check source cannot
  be verified.
- The last full workflow-history scan before fail-fast hardening, at
  2026-05-12T03:02:16Z, found one in-window failed `admin-parity` job, only 1
  of the required 14 green days, and missing green UTC days for 2026-04-29
  through 2026-05-10 plus 2026-05-12. The failed job is run `25667193476`, job
  `75342652937`:
  `https://github.com/gabrielgiacomini/keystone4-ts/actions/runs/25667193476/job/75342652937`.
- The local Playwright webServer memory mitigation is in place, and the local
  `npm run admin-parity` wrapper passed after that hardening. The remaining
  external work is a clean 14-day `admin-parity` soak on `master`.

## Preconditions

- The CI workflow in `.github/workflows/ci.yml` is present on `master`.
- The workflow contains the `admin-parity` job and the daily schedule.
- `gh auth status` succeeds for an account with admin access to the repository.
- Classic branch protection or active branch rulesets with required status
  checks are available for the repository.

## Owner Handoff Checklist

1. Run `npm run admin-parity:protect:status` and confirm whether `master`
   already has a required-check source for `admin-parity`.
2. If GitHub rejects branch protection/rulesets for a private repository, stop and have
   the repository owner choose the account/repository change first. Do not make
   a repository public or change billing without explicit owner approval.
3. Enable a required status-check rule through the GitHub Branches/Rulesets UI
   or, after reviewing the dry run, apply classic branch protection with
   `npm run admin-parity:protect -- --apply`.
4. Re-run `npm run admin-parity:protect:status`; it must exit 0 before the
   soak can start.
5. Let the scheduled `admin-parity` job run cleanly for the full 14-day window.
   `npm run admin-parity:soak` is the local verifier for that window.
6. After the soak verifier passes, run `npm run admin-parity:final` from a
   fresh checkout and update the roadmap/audit evidence.

## Enable The Required Check

### GitHub UI

1. Open GitHub repository settings.
2. Go to Branches or Rulesets.
3. Create or edit a branch protection rule or active ruleset for `master`.
4. Enable required status checks.
5. Require the `admin-parity` check.
6. Save the rule.

### GitHub CLI

Owners can print the exact branch-protection API call and JSON body without
changing GitHub:

```sh
npm run admin-parity:protect
```

The dry run should print a `gh api --method PUT
repos/gabrielgiacomini/keystone-classic/branches/master/protection --input -`
command whose JSON body includes:

```json
{
  "required_status_checks": {
    "contexts": ["admin-parity"],
    "strict": true
  }
}
```

Owners can also read the current GitHub state without changing anything:

```sh
npm run admin-parity:protect:status
```

The status and soak verifiers accept either classic branch protection or active
branch rulesets that apply to `main` and require `admin-parity`.

For branch-protection helper options:

```sh
npm run admin-parity:protect -- --help
```

Once classic branch protection is available for the repository and the owner is
ready to apply the change:

```sh
npm run admin-parity:protect -- --apply
```

The helper uses GitHub's `PUT /branches/{branch}/protection` endpoint. If the
branch is already protected, it refuses to apply unless `--force` is passed,
because that endpoint can replace existing protection settings.

If GitHub returns `403 Upgrade to GitHub Pro or make this repository public to
enable this feature`, stop and resolve the account/repository setting first.

Verify the required-check source:

```sh
npm run admin-parity:protect:status
```

Expected result:

```text
admin-parity required check ready for gabrielgiacomini/keystone-classic@master
```

For classic branch protection specifically, the raw GitHub branch endpoint can
also be inspected:

```sh
gh api repos/gabrielgiacomini/keystone-classic/branches/master \
  --jq '{protected:.protected,required_status_checks:.protection.required_status_checks}'
```

Expected classic branch-protection result:

```json
{
  "protected": true,
  "required_status_checks": {
    "contexts": ["admin-parity"]
  }
}
```

GitHub may report classic required checks in `checks` instead of `contexts`.
Active branch rulesets may not appear in that branch-protection payload, so use
`npm run admin-parity:protect:status` as the source of truth for either path.

## Monitor The Soak

The workflow runs `admin-parity` on every push/PR/manual dispatch and once per
day from the scheduled CI event. During the soak, do not skip, quarantine, or
rename the check.

Run the verifier at any time:

```sh
npm run admin-parity:soak
```

For verifier environment overrides:

```sh
npm run admin-parity:soak -- --help
```

The verifier checks both conditions:

- `master` has classic branch protection or an active branch ruleset requiring
  `admin-parity`.
- The last 14 days contain at least 14 green `admin-parity` days and no failed
  `admin-parity` jobs.

If a run turns red, fix the root cause on `main`; the 14-day window must become
clean again before P4 can be marked complete.

## Completion Gate

P4-30 can be closed only after all commands below pass from a fresh checkout:

```sh
npm run admin-parity:final
```

To inspect the exact command order without running the e2e suites:

```sh
npm run admin-parity:final -- --dry-run
```

For final-gate options:

```sh
npm run admin-parity:final -- --help
```

Then update the roadmap status for P4-30 and the completion audit with the
successful command output and the final required-check evidence from
`npm run admin-parity:protect:status`.
