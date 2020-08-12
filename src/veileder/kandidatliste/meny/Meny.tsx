import React, { FunctionComponent } from 'react';
import FinnKandidaterLenke from './FinnKandidaterLenke';
import LeggTilKandidatKnapp from './LeggTilKandidatKnapp';
import './Meny.less';

interface Props {
    kandidatlisteId: string;
    stillingsId: string | null;
    onLeggTilKandidat: () => void;
}

const Meny: FunctionComponent<Props> = ({ kandidatlisteId, stillingsId, onLeggTilKandidat }) => {
    return (
        <div className="kandidatliste-meny">
            <FinnKandidaterLenke kandidatlisteId={kandidatlisteId} stillingsId={stillingsId} />
            <LeggTilKandidatKnapp onLeggTilKandidat={onLeggTilKandidat} />
        </div>
    );
};

export default Meny;
