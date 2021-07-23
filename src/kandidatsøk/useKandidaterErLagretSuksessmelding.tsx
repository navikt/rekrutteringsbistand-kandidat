import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { lenkeTilKandidatliste } from '../app/paths';
import { Nettstatus } from '../api/Nettressurs';
import { VarslingAction, VarslingActionType } from '../common/varsling/varslingReducer';
import AppState from '../AppState';

const useKandidaterErLagretSuksessmelding = () => {
    const dispatch: Dispatch<VarslingAction> = useDispatch();

    const { lagreStatus, antallLagredeKandidater, lagretListe } = useSelector(
        (state: AppState) => state.kandidatliste.leggTilKandidater
    );

    useEffect(() => {
        if (lagreStatus === Nettstatus.Suksess && lagretListe) {
            const lenke = lenkeTilKandidatliste(lagretListe.kandidatlisteId);
            const prefiks =
                antallLagredeKandidater > 1 ? antallLagredeKandidater + 'kandidater' : 'Kandidaten';

            const innhold = (
                <>
                    {`${prefiks} er lagret i kandidatlisten `}
                    <Link className="lenke" to={lenke}>
                        «{lagretListe.tittel}»
                    </Link>
                </>
            );

            dispatch({
                type: VarslingActionType.VisVarsling,
                alertType: 'suksess',
                innhold,
            });
        }
    }, [lagreStatus, dispatch, antallLagredeKandidater, lagretListe]);
};

export default useKandidaterErLagretSuksessmelding;
