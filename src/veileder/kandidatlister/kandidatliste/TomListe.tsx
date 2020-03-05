import React, { FunctionComponent } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import FinnKandidaterLenke from './knappe-rad/FinnKandidaterLenke';
import LeggTilKandidatKnapp from './knappe-rad/LeggTilKandidatKnapp';

type Props = {
    kandidatlisteId: string;
    stillingsId: string;
    onLeggTilKandidat: () => void;
};

const TomListe: FunctionComponent<Props> = ({
    kandidatlisteId,
    stillingsId,
    onLeggTilKandidat,
}) => (
    <div className="tom-liste">
        <div className="content">
            <Undertittel className="tekst">Du har ingen kandidater i kandidatlisten</Undertittel>
            <div className="knapper">
                <FinnKandidaterLenke kandidatlisteId={kandidatlisteId} stillingsId={stillingsId} />
                <LeggTilKandidatKnapp onLeggTilKandidat={onLeggTilKandidat} />
            </div>
        </div>
    </div>
);

export default TomListe;
