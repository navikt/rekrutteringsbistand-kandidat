import React from 'react';
import { Header, AuthStatus } from 'pam-frontend-header';
import { loggInn, loggUt } from './Toppmeny';

const TomToppmeny = () => (
    <Header
        onLoginClick={loggInn}
        onLogoutClick={loggUt}
        authenticationStatus={AuthStatus.IS_AUTHENTICATED}
        useMenu="none"
    />
);

export default TomToppmeny;
