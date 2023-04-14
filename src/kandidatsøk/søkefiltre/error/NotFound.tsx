import React from 'react';
import css from './Feilside.module.css';
import { Heading } from '@navikt/ds-react';

const NotFound = () => (
    <Heading level="1" size="large" className={css.feilside}>
        Finner ikke siden{' '}
        <span role="img" aria-label="confused emoji">
            😕
        </span>
    </Heading>
);

export default NotFound;
