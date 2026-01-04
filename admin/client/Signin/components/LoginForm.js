/**
 * The login form of the signin screen
 */

import PropTypes from 'prop-types';

import React from 'react';
import { Button, Form, FormField, FormInput } from '../../App/elemental';

const LoginForm = ({
	email,
	handleInputChange,
	handleSubmit,
	isAnimating,
	password,
}) => {
	return (
		<div className="auth-box__col" data-testid="signin-form">
			<Form onSubmit={handleSubmit} noValidate>
				<FormField label="Email" htmlFor="email">
					<FormInput
						autoFocus
						type="email"
						name="email"
						onChange={handleInputChange}
						value={email}
						data-testid="signin-email-input"
					/>
				</FormField>
				<FormField label="Password" htmlFor="password">
					<FormInput
						type="password"
						name="password"
						onChange={handleInputChange}
						value={password}
						data-testid="signin-password-input"
					/>
				</FormField>
				<Button disabled={isAnimating} color="primary" type="submit" data-testid="signin-submit-button">
					Sign In
				</Button>
			</Form>
		</div>
	);
};

LoginForm.propTypes = {
	email: PropTypes.string,
	handleInputChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	isAnimating: PropTypes.bool,
	password: PropTypes.string,
};


export default LoginForm;
