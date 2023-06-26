import { useEffect, useRef } from 'react';
import { Alert, BodyLong, Button } from '@navikt/ds-react';
import { useLocation } from 'react-router-dom';

import ManglerRolle from './ManglerRolle';
import NotFound from './NotFound';
import css from './Errorside.module.css';

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

    return (
        <Alert variant="warning">
            <div className={css.alertBody}>
                <BodyLong>Det oppstod en feil. Forsøk å laste siden på nytt.</BodyLong>
                <Button onClick={refreshPage}>Last siden på nytt</Button>
            </div>
        </Alert>
    );
};

function refreshPage() {
    window.location.reload();
}

export default ErrorSide;
