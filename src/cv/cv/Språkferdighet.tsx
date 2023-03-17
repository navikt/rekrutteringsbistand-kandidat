import React, { FunctionComponent } from 'react';
import { Språkferdighet as SpråkferdighetType, Språkferdighetsnivå } from '../reducer/cv-typer';
import { BodyShort } from '@navikt/ds-react';
import css from './Cv.module.css';

type Props = {
    ferdighet: SpråkferdighetType;
};

const Språkferdighet: FunctionComponent<Props> = ({ ferdighet }) => (
    <>
        <span />
        <div className={css.erfaring}>
            <BodyShort className={css.bold}>{ferdighet.sprak}</BodyShort>
            {ferdighet.ferdighetSkriftlig && (
                <BodyShort>
                    Skriftlig: {språkferdighetTilVisningsnavn(ferdighet.ferdighetSkriftlig)}
                </BodyShort>
            )}
            {ferdighet.ferdighetMuntlig && (
                <BodyShort>
                    Muntlig: {språkferdighetTilVisningsnavn(ferdighet.ferdighetMuntlig)}
                </BodyShort>
            )}
        </div>
    </>
);

const språkferdighetTilVisningsnavn = (ferdighet: Språkferdighetsnivå) => {
    switch (ferdighet) {
        case Språkferdighetsnivå.IkkeOppgitt:
            return 'Ikke oppgitt';
        case Språkferdighetsnivå.Nybegynner:
            return 'Nybegynner';
        case Språkferdighetsnivå.Godt:
            return 'Godt';
        case Språkferdighetsnivå.VeldigGodt:
            return 'Veldig godt';
        case Språkferdighetsnivå.Førstespråk:
            return 'Førstespråk (morsmål)';
        default:
            return 'Ikke oppgitt';
    }
};

export default Språkferdighet;
