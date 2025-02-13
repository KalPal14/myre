import React from 'react';

import useCrossBrowserState from '~/highlight-extension-fe/common/hooks/cross-browser-state/cross-browser-state.hook';

import ChangeEmailForm from './change-email-form';
import ChangePasswordForm from './change-password-form';
import ChangeUsernameForm from './change-username-form';

export default function UserInfoTab(): JSX.Element {
	const [currentUser, setCurrentUser] = useCrossBrowserState('currentUser');

	return (
		<section className="options_userInfoTab">
			{currentUser && (
				<>
					<ChangeEmailForm
						currentEmail={currentUser.email}
						onSuccess={(email) =>
							setCurrentUser({
								...currentUser,
								email,
							})
						}
					/>
					<ChangeUsernameForm
						currentUsername={currentUser.username}
						onSuccess={(username) =>
							setCurrentUser({
								...currentUser,
								username,
							})
						}
					/>
					<ChangePasswordForm
						passwordUpdatedAt={currentUser.passwordUpdatedAt}
						onSuccess={(passwordUpdatedAt) =>
							setCurrentUser({
								...currentUser,
								passwordUpdatedAt,
							})
						}
					/>
				</>
			)}
		</section>
	);
}
