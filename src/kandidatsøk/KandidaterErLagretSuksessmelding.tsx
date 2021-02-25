import React, { FunctionComponent, useEffect, useState } from 'react';
import HjelpetekstFading from '../common/HjelpetekstFading';
import { LAGRE_STATUS } from '../common/konstanter';
import { Link } from 'react-router-dom';
import { lenkeTilKandidatliste } from '../app/paths';
import { useSelector } from 'react-redux';
import AppState from '../AppState';

export const KandidaterErLagretSuksessmelding: FunctionComponent = () => {
    const { lagreStatus, antallLagredeKandidater, lagretListe } = useSelector(
        (state: AppState) => state.kandidatliste.leggTilKandidater
    );

    const [
        suksessmeldingLagreKandidatVises,
        setSuksessmeldingLagreKandidatVises,
    ] = useState<boolean>(false);

    useEffect(() => {
        if (lagreStatus === LAGRE_STATUS.SUCCESS) {
            setSuksessmeldingLagreKandidatVises(true);

            const timer = setTimeout(() => {
                setSuksessmeldingLagreKandidatVises(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [lagreStatus]);

    if (antallLagredeKandidater && lagretListe) {
        const innhold = (
            <>
                {antallLagredeKandidater > 1
                    ? `${antallLagredeKandidater} kandidater`
                    : 'Kandidaten'}{' '}
                er lagret i kandidatlisten{' '}
                <Link className="lenke" to={lenkeTilKandidatliste(lagretListe.kandidatlisteId)}>
                    {lagretListe.tittel}
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
