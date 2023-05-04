import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Nettstatus } from '../api/Nettressurs';
import AppState from '../state/AppState';
import KandidatlisteOgModaler from './KandidatlisteOgModaler';
import useScrollTilToppen from './hooks/useScrollTilToppen';
import KandidatlisteActionType from './reducer/KandidatlisteActionType';
import Sidelaster from '../komponenter/sidelaster/Sidelaster';

type Props = {
    stillingsId?: string;
    kandidatlisteId?: string;
};

const Kandidatlisteside: FunctionComponent<Props> = ({ stillingsId, kandidatlisteId }) => {
    const dispatch = useDispatch();
    const { kandidatliste } = useSelector((state: AppState) => state.kandidatliste);

    useScrollTilToppen(kandidatliste);

    useEffect(() => {
        if (stillingsId) {
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedStillingsId,
                stillingsId,
            });
        } else if (kandidatlisteId) {
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId,
                kandidatlisteId,
            });
        }
    }, [dispatch, stillingsId, kandidatlisteId]);

    if (kandidatliste.kind === Nettstatus.LasterInn) {
        return <Sidelaster />;
    } else if (kandidatliste.kind !== Nettstatus.Suksess) {
        return null;
    }

    return <KandidatlisteOgModaler kandidatliste={kandidatliste.data} />;
};

export default Kandidatlisteside;
