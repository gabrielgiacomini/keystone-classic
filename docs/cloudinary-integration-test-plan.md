# Cloudinary Integration Test Plan

## Implementation Checklist

1. Keep the default fixture hermetic.
   - Confirm `npm run dev:full-fixture` continues to use mocked Cloudinary.
   - Confirm mocked uploads return renderable fixture image URLs.
   - Confirm no real Cloudinary network calls happen unless explicitly enabled.
   - Keep this path as the default for local development and CI.

2. Finalize the real Cloudinary env flow.
   - Use ignored `.env` for local credentials.
   - Keep `.env.example` placeholder-only.
   - Require both `RUN_CLOUDINARY_INTEGRATION=1` and `CLOUDINARY_URL`.
   - Ensure `npm run dev:full-fixture:cloudinary` loads `.env`.
   - Ensure `npm run test:e2e-ui:fields:cloudinary` loads `.env`.

3. Use a dedicated test asset namespace.
   - Define a Cloudinary folder or prefix, likely `keystone-classic-e2e`.
   - For each test run, generate a unique run prefix such as `keystone-classic-e2e/<timestamp>-<random-id>`.
   - Ensure uploaded test assets use that prefix through field folder config or upload options.
   - Avoid touching assets outside that prefix.

4. Add a Cloudinary cleanup helper.
   - Track uploaded `public_id`s during real integration tests.
   - After each test, call Cloudinary destroy for every tracked `public_id`.
   - Attempt cleanup in `afterAll` as a backup.
   - Make cleanup best-effort but visible if it fails.
   - Never delete broad folders or untracked assets.

5. Add preview rendering regression coverage.
   - Open the full-fixture legacy media asset page.
   - Assert all legacy Cloudinary image previews exist.
   - Assert each preview image has `complete === true`, `naturalWidth > 0`, and `naturalHeight > 0`.
   - Cover `CloudinaryImage` and `CloudinaryImages`.
   - Keep this test running in the normal mocked test path.

6. Add mocked upload preview assertions.
   - Extend the current hermetic upload test.
   - After each mocked upload and save, assert preview images render.
   - Cover legacy `CloudinaryImage`, legacy `CloudinaryImages`, direct `Types.Cloudinary` single image, and direct `Types.Cloudinary` gallery.
   - Reload the item page and assert previews still render.

7. Add the real Cloudinary upload test gate.
   - Create a dedicated describe block or spec for real Cloudinary.
   - Skip unless `RUN_CLOUDINARY_INTEGRATION=1` and `CLOUDINARY_URL` are present.
   - Keep it out of the default e2e run unless explicitly invoked.
   - Use serial execution if shared cleanup or a shared run prefix is used.

8. Cover real upload for legacy single image.
   - Upload a small PNG to `legacyImage`.
   - Wait for `/keystone-api/cloudinary/upload`.
   - Assert the response includes `public_id`, `secure_url`, `url`, `width`, `height`, `format`, and `resource_type: image`.
   - Save the item.
   - Assert Mongo stores matching Cloudinary data.
   - Assert the preview image renders.
   - Reload the item and assert the preview still renders.
   - Track `public_id` for cleanup.

9. Cover real upload for legacy gallery.
   - Upload one or more PNGs to `legacyGallery`.
   - Wait for the upload API response.
   - Save the item.
   - Assert the Mongo gallery array includes uploaded asset data.
   - Assert gallery previews render.
   - Reload and assert previews still render.
   - Track all uploaded `public_id`s for cleanup.

10. Cover real upload for direct single Cloudinary field.
    - Upload a PNG to `cloudinaryDirectImage`.
    - Wait for the upload API response.
    - Save the item.
    - Assert Mongo stores a Cloudinary-shaped object.
    - Assert the admin preview renders.
    - Reload and assert the preview still renders.
    - Track `public_id` for cleanup.

11. Cover real upload for direct Cloudinary gallery.
    - Upload a PNG to `cloudinaryDirectGallery`.
    - Wait for the upload API response.
    - Save the item.
    - Assert Mongo stores the uploaded image in the array.
    - Assert gallery previews render.
    - Reload and assert previews still render.
    - Track all uploaded `public_id`s for cleanup.

12. Cover removal behavior with real Cloudinary.
    - Remove uploaded single-image fields.
    - Remove uploaded gallery images.
    - Save the item.
    - Assert Mongo clears the relevant field values.
    - Decide whether field removal should destroy Cloudinary assets immediately.
    - If current behavior calls destroy, assert cleanup succeeds.
    - If current behavior only clears references, document that cleanup is handled by the test helper.

13. Cover real CDN URL rendering.
    - Seed or upload a real Cloudinary asset.
    - Assert stored `secure_url` points to `res.cloudinary.com`.
    - Assert the legacy renderer uses the resize-generated CDN path for normal Cloudinary URLs.
    - Assert the image renders with nonzero dimensions.
    - This protects the helper logic that bypasses resize only for non-CDN fixture URLs.

14. Verify application run modes.
    - Start `npm run dev:full-fixture` and verify mocked uploads still work.
    - Start `npm run dev:full-fixture:cloudinary` and verify real uploads reach Cloudinary.
    - Open `http://127.0.0.1:3008/keystone` and `http://127.0.0.1:3008/keystone-next`.
    - Login with fixture credentials.
    - Upload one image manually and confirm it appears.

15. Run type and build verification.
    - Run `npm run typecheck:e2e-ui`.
    - Run `npm run admin-next:build`.
    - Run `npm run build:server`.
    - Avoid running these while another process is deleting or rebuilding `dist`.

16. Run e2e verification.
    - With MongoDB running, run `npm run test:e2e-ui:fields`.
    - Then run `npm run test:e2e-ui:fields:cloudinary`.
    - Confirm default tests do not require Cloudinary credentials.
    - Confirm real tests skip or fail clearly when credentials are missing.

17. Run a security check.
    - Confirm `.env` is ignored.
    - Confirm no real API key, secret, or full `CLOUDINARY_URL` appears in `git diff`, committed tests, traces where avoidable, or logs.
    - Keep only placeholders in committed files.

18. Commit the implementation.
    - Commit only test helpers, fixture server changes, npm scripts, placeholder docs/env examples, and required generated files.
    - Do not commit `.env`.
    - Suggested commit message: `Add optional Cloudinary integration coverage`.

19. Push and report.
    - Push the branch after tests pass or after documenting any environment blocker.
    - Report the commit hash, scripts added, tests added, verification results, and any tests not run.
