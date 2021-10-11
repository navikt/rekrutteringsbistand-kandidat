import React, { FunctionComponent } from 'react';
import moment from 'moment';
import Etikett from 'nav-frontend-etiketter';
import { hentSisteKandidatutfall, Kandidatutfall, Utfallsendring } from '../../../domene/Kandidat';
import {
    ForespørselOmDelingAvCv,
    TilstandPåForespørsel,
} from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import './Hendelsesetikett.less';
import { formaterDato, formaterDatoUtenÅrstall } from '../../../../utils/dateUtils';

type Props = {
    utfall: Kandidatutfall;
    utfallsendringer: Utfallsendring[];
    forespørselOmDelingAvCv?: ForespørselOmDelingAvCv;
    ikkeVisÅrstall?: boolean;
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
    ikkeVisÅrstall,
}) => {
    const hendelse = hentKandidatensSisteHendelse(utfall, forespørselOmDelingAvCv);
    const cvDeltTidspunkt = hentSisteKandidatutfall(Kandidatutfall.Presentert, utfallsendringer);
    const fåttJobbenTidspunkt = hentSisteKandidatutfall(
        Kandidatutfall.FåttJobben,
        utfallsendringer
    );

    const label = hendelseTilLabel(
        hendelse,
        ikkeVisÅrstall || false,
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
            return forespørselOmDelingAvCv.svar.harSvartJa ? Hendelse.SvarJa : Hendelse.SvarNei;
        } else if (forespørselOmDelingAvCv.tilstand === TilstandPåForespørsel.KanIkkeOpprette) {
            return Hendelse.NyKandidat;
        } else {
            return Hendelse.DeltMedKandidat;
        }
    }

    return Hendelse.NyKandidat;
};

const hendelseTilLabel = (
    hendelse: Hendelse,
    ikkeVisÅrstall: boolean,
    cvDeltTidspunkt?: string,
    fåttJobbenTidspunkt?: string,
    svarTidspunkt?: string | null,
    svarfrist?: string
) => {
    const formaterSvarfrist = (dato: string) =>
        ikkeVisÅrstall ? formaterDatoUtenÅrstall(dato) : formaterDato(dato);

    switch (hendelse) {
        case Hendelse.FåttJobben: {
            const label = 'Fått jobben';
            return fåttJobbenTidspunkt
                ? label + ` – ${formaterSvarfrist(fåttJobbenTidspunkt)}`
                : label;
        }
        case Hendelse.CvDelt: {
            const label = 'CV delt';
            return cvDeltTidspunkt ? label + ` – ${formaterSvarfrist(cvDeltTidspunkt)}` : label;
        }
        case Hendelse.DeltMedKandidat: {
            const dagerTilSvarfrist = Math.floor(moment(svarfrist).diff(moment(), 'days', true));
            const formatertSvarfrist =
                svarfrist && formaterSvarfrist(moment(svarfrist).subtract(1, 'day').toISOString());

            if (dagerTilSvarfrist < 0) {
                return 'Delt med kandidat, frist utløpt';
            } else if (dagerTilSvarfrist === 0) {
                return `Delt med kandidat, frist i dag`;
            } else {
                return `Delt med kandidat, frist ${formatertSvarfrist}`;
            }
        }
        case Hendelse.SvarJa: {
            return `Svar: Ja – ${svarTidspunkt && formaterSvarfrist(svarTidspunkt)}`;
        }
        case Hendelse.SvarNei: {
            return `Svar: Nei – ${svarTidspunkt && formaterSvarfrist(svarTidspunkt)}`;
        }
        default:
            return '';
    }
};

export default Hendelsesetikett;
