import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';
import css from './ForrigeNeste.module.css';

export type Kandidatnavigering = {
    neste?: string;
    forrige?: string;
    index: number;
    antall: number;
};

type Props = {
    kandidatnavigering: Kandidatnavigering;
    lenkeClass?: string;
};

const ForrigeNeste: FunctionComponent<Props> = ({ kandidatnavigering, lenkeClass }) => {
    const { forrige, neste, antall, index } = kandidatnavigering;

    if (antall === 0) {
        return null;
    }

    let forrigeCls = 'navds-link' + (forrige ? '' : ' ' + css.skjult);
    let nesteCls = 'navds-link' + (neste ? '' : ' ' + css.skjult);

    if (lenkeClass) {
        forrigeCls += ' ' + lenkeClass;
        nesteCls += ' ' + lenkeClass;
    }

    return (
        <div className={css.forrigeNeste}>
            {forrige && (
                <Link className={forrigeCls} to={forrige || '#'}>
                    <ChevronLeftIcon />
                    Forrige kandidat
                </Link>
            )}
            <BodyShort as="span">
                {index + 1} av {antall}
            </BodyShort>
            <Link className={nesteCls} to={neste || '#'}>
                Neste kandidat
                <ChevronRightIcon />
            </Link>
        </div>
    );
};

export default ForrigeNeste;
