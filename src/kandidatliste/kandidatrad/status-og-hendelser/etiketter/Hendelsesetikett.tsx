import React, { FunctionComponent } from 'react';
import Etikett from 'nav-frontend-etiketter';
import { Kandidatutfall } from '../../../domene/Kandidat';
import './Hendelsesetikett.less';
import {
    ForespørselOmDelingAvCv,
    SvarPåDelingAvCv,
} from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';

type Props = {
    utfall: Kandidatutfall;
    forespørselOmDelingAvCv?: ForespørselOmDelingAvCv;
};

const Hendelsesetikett: FunctionComponent<Props> = ({ utfall, forespørselOmDelingAvCv }) => {
    const visning = tilVisning(utfall, forespørselOmDelingAvCv);

    if (visning === null) {
        return null;
    }

    return (
        <Etikett
            mini
            type="info"
            aria-label="Utfall"
            className={`hendelsesetikett hendelsesetikett--${utfall.toLowerCase()}`}
        >
            {visning}
        </Etikett>
    );
};

const tilVisning = (utfall: Kandidatutfall, forespørselOmDelingAvCv?: ForespørselOmDelingAvCv) => {
    if (utfall === Kandidatutfall.FåttJobben) {
        return 'Fått jobben';
    } else if (utfall === Kandidatutfall.Presentert) {
        return 'CV delt';
    } else if (forespørselOmDelingAvCv) {
        if (forespørselOmDelingAvCv.svar === SvarPåDelingAvCv.Ja) {
            return 'Svar: Ja';
        } else if (forespørselOmDelingAvCv?.svar === SvarPåDelingAvCv.Nei) {
            return 'Svar: Nei';
        } else {
            return 'Delt med kandidat';
        }
    }

    return null;
};

export default Hendelsesetikett;
