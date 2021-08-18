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

export enum Hendelse {
    DeltMedKandidat = 'DELT_MED_KANDIDAT',
    SvarJa = 'SVAR_JA',
    SvarNei = 'SVAR_NEI',
    NyKandidat = 'NY_KANDIDAT',
    CvDelt = 'CV_DELT',
    FåttJobben = 'FÅTT_JOBBEN',
}

const Hendelsesetikett: FunctionComponent<Props> = ({ utfall, forespørselOmDelingAvCv }) => {
    const hendelse = hentKandidatensSisteHendelse(utfall, forespørselOmDelingAvCv);
    const label = hendelseTilLabel(hendelse, forespørselOmDelingAvCv?.svarfrist);

    if (hendelse === Hendelse.NyKandidat) {
        return null;
    }

    return (
        <Etikett
            mini
            type="info"
            aria-label="Utfall"
            className={`hendelsesetikett hendelsesetikett--${hendelse.toLowerCase()}`}
        >
            {label}
        </Etikett>
    );
};

export const hentKandidatensSisteHendelse = (
    utfall: Kandidatutfall,
    forespørselOmDelingAvCv?: ForespørselOmDelingAvCv
): Hendelse => {
    if (utfall === Kandidatutfall.FåttJobben) {
        return Hendelse.FåttJobben;
    } else if (utfall === Kandidatutfall.Presentert) {
        return Hendelse.CvDelt;
    } else if (forespørselOmDelingAvCv) {
        if (forespørselOmDelingAvCv.svar === SvarPåDelingAvCv.Ja) {
            return Hendelse.SvarJa;
        } else if (forespørselOmDelingAvCv?.svar === SvarPåDelingAvCv.Nei) {
            return Hendelse.SvarNei;
        } else {
            return Hendelse.DeltMedKandidat;
        }
    }

    return Hendelse.NyKandidat;
};

const hendelseTilLabel = (hendelse: Hendelse, svarfrist?: string) => {
    const formatertSvarfrist = svarfrist && datoformatNorskKort(svarfrist);

    switch (hendelse) {
        case Hendelse.FåttJobben:
            return 'Fått jobben';
        case Hendelse.CvDelt:
            return 'CV delt';
        case Hendelse.DeltMedKandidat: {
            return `Delt med kandidat, frist ${formatertSvarfrist}`;
        }
        case Hendelse.SvarJa: {
            return `Svar: Ja – ${formatertSvarfrist}`;
        }
        case Hendelse.SvarNei: {
            return `Svar: Nei – ${formatertSvarfrist}`;
        }
        default:
            return '';
    }
};

export default Hendelsesetikett;
