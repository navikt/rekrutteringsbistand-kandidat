import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';

import { Nettstatus } from '../api/Nettressurs';
import AppState from '../AppState';
import Jobbprofil from './jobbprofil/Jobbprofil';
import KandidatCv from './cv/Cv';
import IkkeFunnet from './ikke-funnet/IkkeFunnet';
import Sidelaster from '../common/sidelaster/Sidelaster';
import Sidefeil from '../common/sidefeil/Sidefeil';
import css from './CvSide.module.css';

const CvSide: FunctionComponent = () => {
    const { cv } = useSelector((state: AppState) => state.cv);

    if (cv.kind === Nettstatus.LasterInn || cv.kind === Nettstatus.IkkeLastet) {
        return <Sidelaster />;
    }

    if (cv.kind === Nettstatus.FinnesIkke) {
        return <IkkeFunnet />;
    }

    if (cv.kind === Nettstatus.Suksess) {
        return (
            <div className={css.side}>
                <Jobbprofil cv={cv.data} />
                <KandidatCv cv={cv.data} />
                {/*cv.data.tilretteleggingsbehov && (
                    <KandidatTilretteleggingsbehov fnr={cv.data.fodselsnummer} />
                )*/}
            </div>
        );
    }

    return <Sidefeil feilmelding="Klarte ikke å hente kandidatens CV" />;
};

export default CvSide;
