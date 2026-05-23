import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../App/elemental/index.mjs';

// TODO Figure out if we should change "Keystone" to "Admin area"

const UserInfo = ({
	adminLegacyPath,
	signoutPath,
	userCanAccessKeystone,
	userName,
}) => {
	const adminButton = userCanAccessKeystone ? (
		<Button href={adminLegacyPath} color="primary">
			Open Keystone
		</Button>
	) : null;

	return (
		<div className="auth-box__col">
			<p>Hi {userName},</p>
			<p>You're already signed in.</p>
			{adminButton}
			<Button href={signoutPath} variant="link" color="cancel">
				Sign Out
			</Button>
		</div>
	);
};

UserInfo.propTypes = {
	adminLegacyPath: PropTypes.string.isRequired,
	signoutPath: PropTypes.string.isRequired,
	userCanAccessKeystone: PropTypes.bool,
	userName: PropTypes.string.isRequired,
};

export default UserInfo;
