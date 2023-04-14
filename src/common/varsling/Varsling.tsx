import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import AppState from '../../AppState';
import { Alert } from '@navikt/ds-react';
import css from './Varsling.module.css';

const Varsling: FunctionComponent = () => {
    const { innhold, alertType } = useSelector((state: AppState) => state.varsling);

    if (innhold === null) {
        return null;
    }

    return (
        <Alert className={css.varsling} variant={alertType} aria-live="assertive">
            {innhold}
        </Alert>
    );
};

export default Varsling;
