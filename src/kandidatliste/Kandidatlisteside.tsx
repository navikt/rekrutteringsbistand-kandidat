import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { Nettstatus } from '../api/Nettressurs';
import AppState from '../AppState';
import KandidatlisteOgModaler from './KandidatlisteOgModaler';
import NavFrontendSpinner from 'nav-frontend-spinner';
import useScrollTilToppen from './hooks/useScrollTilToppen';
import useHentKandidatlisteMedId from './hooks/useHentKandidatlisteMedId';

type Props = {
    stillingsId?: string;
    kandidatlisteId?: string;
};

const Kandidatlisteside: FunctionComponent<Props> = ({ stillingsId, kandidatlisteId }) => {
    const { kandidatliste } = useSelector((state: AppState) => state.kandidatliste);

    useScrollTilToppen(kandidatliste);
    useHentKandidatlisteMedId(stillingsId, kandidatlisteId);

    // const kandidaterMedState = useKandidaterMedState(
    //     kandidatliste,
    //     kandidattilstander,
    //     sms.sendteMeldinger,
    //     kandidatnotater,
    //     forespørslerOmDelingAvCv
    // );

    if (kandidatliste.kind === Nettstatus.LasterInn) {
        return (
            <div className="fullscreen-spinner">
                <NavFrontendSpinner type="L" />
            </div>
        );
    } else if (kandidatliste.kind !== Nettstatus.Suksess) {
        return null;
    }

    return <KandidatlisteOgModaler kandidatliste={kandidatliste.data} />;
};

export default Kandidatlisteside;
