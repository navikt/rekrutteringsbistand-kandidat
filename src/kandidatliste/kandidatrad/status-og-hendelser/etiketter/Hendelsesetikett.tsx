import React, { FunctionComponent } from 'react';
import moment from 'moment';
import Etikett from 'nav-frontend-etiketter';
import { Kandidatutfall } from '../../../domene/Kandidat';
import { ForespørselOmDelingAvCv } from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
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
    const label = hendelseTilLabel(
        hendelse,
        forespørselOmDelingAvCv?.svar?.svarTidspunkt,
        forespørselOmDelingAvCv?.svarfrist
    );

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
        if (forespørselOmDelingAvCv.svar?.svar) {
            return Hendelse.SvarJa;
        } else if (forespørselOmDelingAvCv.svar?.svar === false) {
            return Hendelse.SvarNei;
        } else {
            return Hendelse.DeltMedKandidat;
        }
    }

    return Hendelse.NyKandidat;
};

const hendelseTilLabel = (
    hendelse: Hendelse,
    svarTidspunkt?: string | null,
    svarfrist?: string
) => {
    const formatertSvarfrist =
        svarfrist && datoformatNorskKort(moment(svarfrist).subtract(1, 'day').toISOString());
    const formatertSvarTidspunkt = svarTidspunkt && datoformatNorskKort(svarTidspunkt);
    const dagerTilSvarfrist = Math.floor(moment(svarfrist).diff(moment(), 'days', true));

    switch (hendelse) {
        case Hendelse.FåttJobben:
            return 'Fått jobben';
        case Hendelse.CvDelt:
            return 'CV delt';
        case Hendelse.DeltMedKandidat: {
            if (dagerTilSvarfrist < 0) {
                return 'Delt med kandidat, frist utløpt';
            } else if (dagerTilSvarfrist === 0) {
                return `Delt med kandidat, frist i dag`;
            } else {
                return `Delt med kandidat, frist ${formatertSvarfrist}`;
            }
        }
        case Hendelse.SvarJa: {
            return `Svar: Ja – ${formatertSvarTidspunkt}`;
        }
        case Hendelse.SvarNei: {
            return `Svar: Nei – ${formatertSvarTidspunkt}`;
        }
        default:
            return '';
    }
};

export default Hendelsesetikett;
