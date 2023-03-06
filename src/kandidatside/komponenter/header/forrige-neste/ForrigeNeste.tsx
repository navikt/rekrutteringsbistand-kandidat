import React, { FunctionComponent } from 'react';
import { Kandidatnavigering } from '../../../fraSøkUtenKontekst/useNavigerbareKandidaterFraSøk';
import { Link } from 'react-router-dom';
import { Back, Next } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';
import css from './ForrigeNeste.module.css';

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
                    <Back />
                    Forrige kandidat
                </Link>
            )}
            <BodyShort as="span">
                {index + 1} av {antall}
            </BodyShort>
            <Link className={nesteCls} to={neste || '#'}>
                Neste kandidat
                <Next />
            </Link>
        </div>
    );
};

export default ForrigeNeste;
