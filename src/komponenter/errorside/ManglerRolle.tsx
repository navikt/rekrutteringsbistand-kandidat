import React from 'react';
import { Heading } from '@navikt/ds-react';
import css from './Feilside.module.css';

export default function ManglerRolle() {
    return (
        <Heading level="1" size="large" className={css.feilside}>
            Ups, det ser ut som du mangler korrekt rolle.
        </Heading>
    );
}
