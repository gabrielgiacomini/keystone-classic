# Legacy Email Templates (Reference Only)

These four Jade templates were originally shipped in the upstream Keystone v4
package under `templates/helpers/emails/`. They are **not used by any code in
this repository** and have been moved here as reference material only.

## Files

| File | Purpose |
|---|---|
| `layout-default.jade` | Outer email layout wrapper |
| `styles-default.jade` | Default inline CSS styles |
| `styles-ink.jade` | Ink responsive email framework CSS |
| `mixin-button.jade` | Reusable CTA button mixin |

## Known Issues

These templates have bugs inherited from the original Keystone v4 source and
**will not work as-is**:

- `css.shadeColor()` is called but never defined
- Several Underscore.js (`_`) helpers are referenced without a load path
- VML syntax errors in the button mixin (Microsoft Outlook compatibility code)

## How to Write Email Templates

The framework delegates email sending to the [`keystone-email`][ke] package.
Templates are loaded from a directory you configure — the framework does not
look at `templates/` at all. Refer to the `keystone-email` README for setup
instructions and supported template engines (Jade/Pug, Nunjucks, Handlebars,
EJS, Mustache).

[ke]: https://github.com/keystonejs/keystone-email
