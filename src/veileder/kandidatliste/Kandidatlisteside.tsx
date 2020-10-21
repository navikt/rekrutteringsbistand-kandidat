import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { Nettstatus } from '../../felles/common/remoteData';
import AppState from '../AppState';
import KandidatlisteOgModaler from './KandidatlisteOgModaler';
import NavFrontendSpinner from 'nav-frontend-spinner';
import useKandidaterMedState from './hooks/useKandidaterMedState';
import useScrollTilToppen from './hooks/useScrollTilToppen';
import useHentKandidatlisteMedId from './hooks/useHentKandidatlisteMedId';
import useHentSendteMeldinger from './hooks/useHentSendteMeldinger';

type Props = {
    stillingsId?: string;
    kandidatlisteId?: string;
};

const Kandidatlisteside: FunctionComponent<Props> = ({ stillingsId, kandidatlisteId }) => {
    const { kandidatliste, kandidattilstander, kandidatnotater, sms } = useSelector(
        (state: AppState) => state.kandidatliste
    );

    useScrollTilToppen(kandidatliste);
    useHentKandidatlisteMedId(stillingsId, kandidatlisteId);
    useHentSendteMeldinger(kandidatliste, sms.sendteMeldinger);

    const kandidaterMedState = useKandidaterMedState(
        kandidatliste,
        kandidattilstander,
        sms.sendteMeldinger,
        kandidatnotater
    );

    if (kandidatliste.kind === Nettstatus.LasterInn || kandidaterMedState === undefined) {
        return (
            <div className="fullscreen-spinner">
                <NavFrontendSpinner type="L" />
            </div>
        );
    } else if (kandidatliste.kind !== Nettstatus.Suksess) {
        return null;
    }

    return (
        <div>
            <KandidatlisteOgModaler
                kandidatliste={kandidatliste.data}
                kandidater={kandidaterMedState}
            />
        </div>
    );
};

export default Kandidatlisteside;
