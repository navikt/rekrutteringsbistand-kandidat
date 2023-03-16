import React, { FunctionComponent } from 'react';
import Tidsperiode from './Tidsperiode';
import { Yrkeserfaring } from '../reducer/cv-typer';
import { Detail, BodyShort } from '@navikt/ds-react';
import css from './Cv.module.css';

type Props = { arbeidserfaring: Yrkeserfaring };

const Arbeidserfaring: FunctionComponent<Props> = ({ arbeidserfaring }) => {
    let arbeidsgiverOgSted = '',
        stillingstittel = '';

    if (arbeidserfaring.arbeidsgiver && arbeidserfaring.sted) {
        arbeidsgiverOgSted = `${arbeidserfaring.arbeidsgiver} | ${arbeidserfaring.sted}`;
    } else if (arbeidserfaring.arbeidsgiver) {
        arbeidsgiverOgSted = arbeidserfaring.arbeidsgiver;
    } else if (arbeidserfaring.sted) {
        arbeidsgiverOgSted = arbeidserfaring.sted;
    }

    if (arbeidserfaring.alternativStillingstittel) {
        stillingstittel = arbeidserfaring.alternativStillingstittel;
    } else if (arbeidserfaring.styrkKodeStillingstittel) {
        stillingstittel = arbeidserfaring.styrkKodeStillingstittel;
    }

    return (
        <>
            <Detail className={css.tidsperiode}>
                <Tidsperiode
                    fradato={arbeidserfaring.fraDato}
                    tildato={arbeidserfaring.tilDato}
                    navarende={!arbeidserfaring.tilDato}
                />
            </Detail>
            <div className={css.erfaring}>
                <BodyShort className={css.bold}>{stillingstittel}</BodyShort>
                <BodyShort>{arbeidsgiverOgSted}</BodyShort>

                {arbeidserfaring.beskrivelse && (
                    <BodyShort>{arbeidserfaring.beskrivelse}</BodyShort>
                )}
            </div>
        </>
    );
};

export default Arbeidserfaring;
