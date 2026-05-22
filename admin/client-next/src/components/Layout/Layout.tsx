import type React from 'react';
import { Route as RootRoute } from '../../routes/__root.js';
import {
  buildAdminNextPath,
  getBackUrl,
  getBrandName,
  getKeystoneVersion,
  getSignedInUser,
  getSignoutPath,
} from '../../adminNextPath.js';
import type { SessionUser } from '../../api/session.js';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  listKeys: string[];
}

export function Layout({ children, listKeys }: LayoutProps) {
  const { user } = RootRoute.useRouteContext();
  const brandName = getBrandName();
  const version = getKeystoneVersion();
  const backUrl = getBackUrl();
  const signoutHref = getSignoutPath();

  return (
    <div className={styles.layout}>
      <header>
        <nav className={styles.nav} aria-label="Primary">
          <div className={styles.navContainer}>
            <ul className={styles.navList} data-nav-side="left">
              <li className={styles.navItem}>
                <a
                  href={buildAdminNextPath('/')}
                  className={`${styles.navLink} ${styles.navBrand}`}
                  title={`Dashboard - ${brandName}`}
                >
                  <HomeIcon />
                </a>
              </li>
              {listKeys.map((key) => (
                <li key={key} className={styles.navItem}>
                  <a
                    href={buildAdminNextPath(`/${key}`)}
                    className={styles.navLink}
                    data-nav-list-link
                    data-list-path={key}
                  >
                    {toTitleCase(key)}
                  </a>
                </li>
              ))}
            </ul>
            <ul className={`${styles.navList} ${styles.navListRight}`} data-nav-side="right">
              <li className={styles.navItem}>
                <a
                  href={backUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={styles.navLink}
                  title={`Front page - ${brandName}`}
                >
                  <GlobeIcon />
                </a>
              </li>
              <li className={styles.navItem}>
                <a
                  href={signoutHref}
                  className={styles.navLink}
                  title="Sign Out"
                >
                  <SignoutIcon />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <main className={styles.body}>
        <div className={styles.container}>{children}</div>
      </main>
      <Footer brandName={brandName} version={version} user={user} />
    </div>
  );
}

interface FooterProps {
  brandName: string;
  version: string;
  user: SessionUser | null;
}

function Footer({ brandName, version, user }: FooterProps) {
  const userLabel = getUserDisplayName(user);
  return (
    <footer className={styles.footer} data-keystone-footer>
      <div className={styles.container}>
        <span>{brandName}</span>
        <span> powered by </span>
        <a
          href="http://v4.keystonejs.com"
          target="_blank"
          rel="noreferrer noopener"
          className={styles.footerLink}
          tabIndex={-1}
        >
          KeystoneJS
        </a>
        {version ? <span> version {version}.</span> : <span>.</span>}
        {userLabel !== null && (
          <span>
            <span> Signed in as </span>
            <span className={styles.footerLink}>{userLabel}</span>
            <span>.</span>
          </span>
        )}
      </div>
    </footer>
  );
}

function getUserDisplayName(user: SessionUser | null): string | null {
  // Prefer the server-resolved label from window.Keystone — it goes through
  // UserList.getDocumentName(user) which handles the Name field's {first,last}
  // virtual ("Test Admin"). Fall back to the API user shape only if the server
  // didn't inject one (e.g., unauthenticated SSR or legacy server build).
  const serverLabel = getSignedInUser();
  if (serverLabel) return serverLabel;
  if (user === null) return null;
  if (typeof user.name === 'string' && user.name.trim().length > 0) return user.name;
  if (user.name && typeof user.name === 'object') {
    const first = typeof (user.name as { first?: unknown }).first === 'string'
      ? ((user.name as { first?: string }).first ?? '').trim()
      : '';
    const last = typeof (user.name as { last?: unknown }).last === 'string'
      ? ((user.name as { last?: string }).last ?? '').trim()
      : '';
    const combined = `${first} ${last}`.trim();
    if (combined.length > 0) return combined;
  }
  if (typeof user.email === 'string' && user.email.trim().length > 0) return user.email;
  return user.id || null;
}

function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function HomeIcon() {
  // octicons "home" glyph (16x16)
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16 9l-3-3V2h-2v2L8 1 0 9h2l1 6c0 .5.5 1 1 1h3v-5h2v5h3c.5 0 1-.5 1-1l1-6h2z" />
    </svg>
  );
}

function GlobeIcon() {
  // octicons "globe" glyph (16x16)
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm5.7 3.4c.8 1 1.3 2.2 1.4 3.6h-2.4c-.1-1.1-.4-2.1-.9-3 .8-.1 1.4-.3 1.9-.6zM8 1c.9 0 1.9 1.1 2.5 3-1.6.6-3.4.6-5 0C6.1 2.1 7.1 1 8 1zM5.2 6h5.6c.2.8.3 1.6.3 2.5 0 .9-.1 1.7-.3 2.5H5.2c-.2-.8-.3-1.6-.3-2.5 0-.9.1-1.7.3-2.5zM2.3 12.6c-.8-1-1.3-2.2-1.4-3.6h2.4c.1 1.1.4 2.1.9 3-.8.1-1.4.3-1.9.6zM.9 7c.1-1.4.6-2.6 1.4-3.6.5.3 1.1.5 1.9.6-.5.9-.8 1.9-.9 3H.9zM4.3 12c1.6-.6 3.4-.6 5 0-.6 1.9-1.6 3-2.5 3-.9 0-1.9-1.1-2.5-3zm7.4 0c.5-.9.8-1.9.9-3h2.4c-.1 1.4-.6 2.6-1.4 3.6-.5-.3-1.1-.5-1.9-.6z" />
    </svg>
  );
}

function SignoutIcon() {
  // octicons "sign-out" glyph (16x16)
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 9V7H7V5h5V3l4 3-4 3zm-2 3H6V3L2 1h8v3h1V1c0-.6-.4-1-1-1H1C.4 0 0 .4 0 1v13.4c0 .4.2.7.6.9l4.3 1.6h.4c.4 0 .7-.4.7-.9V13h4c.6 0 1-.4 1-1V9h-1v3z" />
    </svg>
  );
}
