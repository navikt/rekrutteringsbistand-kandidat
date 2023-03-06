import React, { FunctionComponent } from 'react';
import KandidatCv from './cv/Cv';
import Jobbønsker from './jobbønsker/Jobbønsker';
import KandidatTilretteleggingsbehov from './tilretteleggingsbehov/Tilretteleggingsbehov';
import LastNedCv from '../kandidatside/komponenter/last-ned-cv/LastNedCv';
import { useSelector } from 'react-redux';
import AppState from '../AppState';
import { Nettstatus } from '../api/Nettressurs';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
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
                <LastNedCv fodselsnummer={cv.data.fodselsnummer} />
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
