import React, { FunctionComponent } from 'react';
import moment from 'moment';
import Etikett from 'nav-frontend-etiketter';
import { hentSisteKandidatutfall, Kandidatutfall, Utfallsendring } from '../../../domene/Kandidat';
import {
    ForespørselOmDelingAvCv,
    TilstandPåForespørsel,
} from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { datoformatNorskKort } from '../../../../utils/dateUtils';
import './Hendelsesetikett.less';

type Props = {
    utfall: Kandidatutfall;
    utfallsendringer: Utfallsendring[];
    forespørselOmDelingAvCv?: ForespørselOmDelingAvCv;
};

export enum Hendelse {
    NyKandidat = 'NY_KANDIDAT',
    DeltMedKandidat = 'DELT_MED_KANDIDAT',
    SvarJa = 'SVAR_JA',
    SvarNei = 'SVAR_NEI',
    CvDelt = 'CV_DELT',
    FåttJobben = 'FÅTT_JOBBEN',
}

const Hendelsesetikett: FunctionComponent<Props> = ({
    utfall,
    utfallsendringer,
    forespørselOmDelingAvCv,
}) => {
    const hendelse = hentKandidatensSisteHendelse(utfall, forespørselOmDelingAvCv);
    const cvDeltTidspunkt = hentSisteKandidatutfall(Kandidatutfall.Presentert, utfallsendringer);
    const fåttJobbenTidspunkt = hentSisteKandidatutfall(
        Kandidatutfall.FåttJobben,
        utfallsendringer
    );

    const label = hendelseTilLabel(
        hendelse,
        cvDeltTidspunkt?.tidspunkt,
        fåttJobbenTidspunkt?.tidspunkt,
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
        if (forespørselOmDelingAvCv.tilstand === TilstandPåForespørsel.HarSvart) {
            return forespørselOmDelingAvCv.svar.svar ? Hendelse.SvarJa : Hendelse.SvarNei;
        } else {
            return Hendelse.DeltMedKandidat;
        }
    }

    return Hendelse.NyKandidat;
};

const hendelseTilLabel = (
    hendelse: Hendelse,
    cvDeltTidspunkt?: string,
    fåttJobbenTidspunkt?: string,
    svarTidspunkt?: string | null,
    svarfrist?: string
) => {
    const formatertSvarfrist =
        svarfrist && datoformatNorskKort(moment(svarfrist).subtract(1, 'day').toISOString());
    const formatertSvarTidspunkt = svarTidspunkt && datoformatNorskKort(svarTidspunkt);
    const dagerTilSvarfrist = Math.floor(moment(svarfrist).diff(moment(), 'days', true));

    switch (hendelse) {
        case Hendelse.FåttJobben: {
            const label = 'Fått jobben';
            return fåttJobbenTidspunkt
                ? label + ` – ${datoformatNorskKort(fåttJobbenTidspunkt)}`
                : label;
        }
        case Hendelse.CvDelt: {
            const label = 'CV delt';
            return cvDeltTidspunkt ? label + ` – ${datoformatNorskKort(cvDeltTidspunkt)}` : label;
        }
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
