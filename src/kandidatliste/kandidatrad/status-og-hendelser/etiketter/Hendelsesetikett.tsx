import React, { FunctionComponent } from 'react';
import Etikett from 'nav-frontend-etiketter';
import { Kandidatutfall } from '../../../domene/Kandidat';
import {
    ForespørselOmDelingAvCv,
    SvarPåDelingAvCv,
} from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { datoformatNorskKort } from '../../../../utils/dateUtils';
import './Hendelsesetikett.less';

type Props = {
    utfall: Kandidatutfall;
    forespørselOmDelingAvCv?: ForespørselOmDelingAvCv;
};

enum Variant {
    Ingen = 'ingen',
    DeltMedKandidat = 'delt-med-kandidat',
    SvarNei = 'svar-nei',
    SvarJa = 'svar-ja',
    CvDelt = 'cv-delt',
    FåttJobben = 'fått-jobben',
}

const Hendelsesetikett: FunctionComponent<Props> = ({ utfall, forespørselOmDelingAvCv }) => {
    const variant = tilVisning(utfall, forespørselOmDelingAvCv);
    const label = variantTilLabel(variant, forespørselOmDelingAvCv?.svarfrist);

    if (variant === Variant.Ingen) {
        return null;
    }

    return (
        <Etikett
            mini
            type="info"
            aria-label="Utfall"
            className={`hendelsesetikett hendelsesetikett--${variant}`}
        >
            {label}
        </Etikett>
    );
};

const tilVisning = (utfall: Kandidatutfall, forespørselOmDelingAvCv?: ForespørselOmDelingAvCv) => {
    if (utfall === Kandidatutfall.FåttJobben) {
        return Variant.FåttJobben;
    } else if (utfall === Kandidatutfall.Presentert) {
        return Variant.CvDelt;
    } else if (forespørselOmDelingAvCv) {
        if (forespørselOmDelingAvCv.svar === SvarPåDelingAvCv.Ja) {
            return Variant.SvarJa;
        } else if (forespørselOmDelingAvCv?.svar === SvarPåDelingAvCv.Nei) {
            return Variant.SvarNei;
        } else {
            return Variant.DeltMedKandidat;
        }
    }

    return Variant.Ingen;
};

const variantTilLabel = (variant: Variant, svarfrist?: string) => {
    const formatertSvarfrist = svarfrist && datoformatNorskKort(svarfrist);

    switch (variant) {
        case Variant.FåttJobben:
            return 'Fått jobben';
        case Variant.CvDelt:
            return 'CV delt';
        case Variant.DeltMedKandidat: {
            return `Delt med kandidat, frist ${formatertSvarfrist}`;
        }
        case Variant.SvarJa: {
            return `Svar: Ja – ${formatertSvarfrist}`;
        }
        case Variant.SvarNei: {
            return `Svar: Nei – ${formatertSvarfrist}`;
        }
        default:
            return '';
    }
};

export default Hendelsesetikett;
