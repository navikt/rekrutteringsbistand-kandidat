import React, { FunctionComponent } from 'react';
import KandidatCv from './cv/Cv';
import Jobbønsker from './jobbønsker/Jobbønsker';
import KandidatTilretteleggingsbehov from './tilretteleggingsbehov/Tilretteleggingsbehov';
import LastNedCv from '../last-ned-cv/LastNedCv';
import { useSelector } from 'react-redux';
import AppState from '../../AppState';

const CvSide: FunctionComponent = () => {
    const { cv } = useSelector((state: AppState) => state.cv);

    return (
        <>
            <LastNedCv aktørId={cv.aktorId} />
            <Jobbønsker cv={cv} />
            <KandidatCv cv={cv} />
            {cv.tilretteleggingsbehov && <KandidatTilretteleggingsbehov fnr={cv.fodselsnummer} />}
        </>
    );
};

export default CvSide;
