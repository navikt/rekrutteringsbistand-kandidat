import React, { FunctionComponent } from 'react';
import Cv from './reducer/cv-typer';
import KandidatCv from './cv/Cv';
import KandidatJobbprofil from './jobbprofil/Jobbprofil';
import KandidatTilretteleggingsbehov from './tilretteleggingsbehov/Tilretteleggingsbehov';
import Knapperad from '../knapperad/Knapperad';

interface Props {
    cv: Cv;
}

const CvSide: FunctionComponent<Props> = ({ cv }) => {
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
