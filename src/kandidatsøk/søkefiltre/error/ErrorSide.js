import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ManglerRolle from './ManglerRolle';
import GenerellFeilside from './GenerellFeilside';
import NotFound from './NotFound';

const ErrorSide = ({ fjernError, error }) => {
    const { pathname } = useLocation();
    const forrigePathname = useRef(pathname);

    useEffect(() => {
        if (forrigePathname.current !== pathname) {
            fjernError();
        }
    }, [pathname, fjernError]);

    if (error && error.status === 403) {
        return <ManglerRolle />;
    } else if (error && error.status === 404) {
        return <NotFound />;
    }

    return <GenerellFeilside />;
};

export default ErrorSide;
