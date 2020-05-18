import React, { FunctionComponent } from 'react';
import KandidatCv from './cv/Cv';
import KandidatJobbprofil from './jobbprofil/Jobbprofil';
import KandidatTilretteleggingsbehov from './tilretteleggingsbehov/Tilretteleggingsbehov';
import Knapperad from '../knapperad/Knapperad';
import { useSelector } from 'react-redux';
import AppState from '../../AppState';

const CvSide: FunctionComponent = () => {
    const { cv } = useSelector((state: AppState) => state.cv);

    return (
        <>
            <Knapperad aktørId={cv.aktorId} />
            <KandidatJobbprofil cv={cv} />
            <KandidatCv cv={cv} />
            {cv.tilretteleggingsbehov && <KandidatTilretteleggingsbehov fnr={cv.fodselsnummer} />}
        </>
    );
};

export default CvSide;
