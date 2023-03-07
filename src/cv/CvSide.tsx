import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

import { Nettstatus } from '../api/Nettressurs';
import AppState from '../AppState';
import Jobbønsker from './jobbønsker/Jobbønsker';
import KandidatCv from './cv/Cv';
import KandidatTilretteleggingsbehov from './tilretteleggingsbehov/Tilretteleggingsbehov';
import NavFrontendSpinner from 'nav-frontend-spinner';
import IkkeFunnet from './ikke-funnet/IkkeFunnet';

const CvSide: FunctionComponent = () => {
    const { cv } = useSelector((state: AppState) => state.cv);

    if (cv.kind === Nettstatus.LasterInn || cv.kind === Nettstatus.IkkeLastet) {
        return (
            <div className="text-center">
                <NavFrontendSpinner type="L" />
            </div>
        );
    }

    if (cv.kind === Nettstatus.FinnesIkke) {
        return <IkkeFunnet />;
    }

    if (cv.kind === Nettstatus.Suksess) {
        return (
            <>
                <Jobbønsker cv={cv.data} />
                <KandidatCv cv={cv.data} />
                {cv.data.tilretteleggingsbehov && (
                    <KandidatTilretteleggingsbehov fnr={cv.data.fodselsnummer} />
                )}
            </>
        );
    }

    return <AlertStripeFeil>Klarte ikke å hente kandidatens CV</AlertStripeFeil>;
};

export default CvSide;
