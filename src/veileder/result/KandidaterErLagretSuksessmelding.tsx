import React, { FunctionComponent, useEffect, useState } from 'react';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';
import { LAGRE_STATUS } from '../../felles/konstanter';
import Lenke from 'nav-frontend-lenker';
import { Link } from 'react-router-dom';
import { lenkeTilKandidatliste } from '../application/paths';

interface Props {
    antallLagredeKandidater?: number;
    lagretKandidatliste?: {
        kandidatlisteId: string;
        tittel: string;
    };
    leggTilKandidatStatus: string;
}

export const KandidaterErLagretSuksessmelding: FunctionComponent<Props> = ({
    antallLagredeKandidater,
    lagretKandidatliste,
    leggTilKandidatStatus,
}) => {
    const [suksessmeldingLagreKandidatVises, setSuksessmeldingLagreKandidatVises] = useState<
        boolean
    >(false);

    useEffect(() => {
        if (leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            setSuksessmeldingLagreKandidatVises(true);

            const timer = setTimeout(() => {
                setSuksessmeldingLagreKandidatVises(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [leggTilKandidatStatus]);

    if (antallLagredeKandidater !== undefined && lagretKandidatliste) {
        const innhold = (
            <>
                {antallLagredeKandidater > 1
                    ? `${antallLagredeKandidater} kandidater`
                    : 'Kandidaten'}{' '}
                er lagret i kandidatlisten{' '}
                <Link to={lenkeTilKandidatliste(lagretKandidatliste.kandidatlisteId)}>
                    {lagretKandidatliste.tittel}
                </Link>
            </>
        );

        return (
            <HjelpetekstFading
                synlig={!!suksessmeldingLagreKandidatVises}
                type="suksess"
                innhold={innhold}
                id="hjelpetekstfading"
            />
        );
    } else {
        return null;
    }
};
