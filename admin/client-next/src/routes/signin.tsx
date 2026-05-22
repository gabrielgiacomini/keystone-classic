import { useEffect } from 'react';
import { createRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signin } from '../api/session.js';
import { Route as RootRoute } from './__root.js';
import styles from './signin.module.css';

const signinSchema = z.object({
  email: z.email({ message: 'Enter a valid email' }),
  password: z.string().min(1, 'Password is required'),
});

type SigninFields = z.infer<typeof signinSchema>;

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/signin',
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/' });
    }
  },
  component: SigninPage,
});

function SigninPage() {
  const navigate = useNavigate();
  const { setSessionUser, user } = RootRoute.useRouteContext();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SigninFields>({ resolver: zodResolver(signinSchema) });

  useEffect(() => {
    if (user) void navigate({ to: '/' });
  }, [navigate, user]);

  async function onSubmit(data: SigninFields) {
    try {
      const response = await signin(data);
      setSessionUser(response.user);
      await navigate({ to: '/' });
    } catch {
      setError('root', { message: 'The email and password you entered are not valid.' });
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.srOnly}>Keystone Sign In</h1>
        <div className={styles.inner}>
          <div className={styles.brand}>
            <span className={styles.logo} aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                width="64"
                height="64"
                role="img"
                aria-label="KeystoneJS"
              >
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="Georgia, 'Times New Roman', Times, serif"
                  fontSize="48"
                  fontWeight="400"
                  fill="#ffffff"
                >
                  K
                </text>
              </svg>
            </span>
            <span className={styles.wordmark}>KeystoneJS</span>
          </div>
          <div className={styles.formColumn}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {errors.root && (
                <p className={styles.alert} role="alert">
                  {errors.root.message}
                </p>
              )}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  className={styles.input}
                  {...register('email')}
                />
                {errors.email && (
                  <p className={styles.fieldError} role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={styles.input}
                  {...register('password')}
                />
                {errors.password && (
                  <p className={styles.fieldError} role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <button type="submit" className={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? 'Signing In…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <span>Powered by </span>
        <a
          href="https://keystonejs.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          KeystoneJS
        </a>
      </div>
    </main>
  );
}
