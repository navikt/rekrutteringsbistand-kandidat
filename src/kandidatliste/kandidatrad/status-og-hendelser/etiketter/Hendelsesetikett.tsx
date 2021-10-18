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
    const label = hendelseTilLabel(
        hendelse,
        ikkeVisÅrstall || false,
        utfallsendringer,
        forespørselOmDelingAvCv
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
    utfallsendringer: Utfallsendring[],
    forespørselOmDelingAvCv?: ForespørselOmDelingAvCv
) => {
    const cvDeltTidspunkt = hentSisteKandidatutfall(Kandidatutfall.Presentert, utfallsendringer);
    const fåttJobbenTidspunkt = hentSisteKandidatutfall(
        Kandidatutfall.FåttJobben,
        utfallsendringer
    );

    const formaterMedEllerUtenÅrstall = (dato: string) =>
        ikkeVisÅrstall ? formaterDatoUtenÅrstall(dato) : formaterDato(dato);

    const svarfrist = forespørselOmDelingAvCv?.svarfrist;
    const svarTidspunkt = forespørselOmDelingAvCv?.svar?.svarTidspunkt;

    switch (hendelse) {
        case Hendelse.FåttJobben: {
            const label = 'Fått jobben';
            return fåttJobbenTidspunkt
                ? label + ` – ${formaterMedEllerUtenÅrstall(fåttJobbenTidspunkt.tidspunkt)}`
                : label;
        }
        case Hendelse.CvDelt: {
            const label = 'CV delt';
            return cvDeltTidspunkt
                ? label + ` – ${formaterMedEllerUtenÅrstall(cvDeltTidspunkt.tidspunkt)}`
                : label;
        }
        case Hendelse.DeltMedKandidat: {
            const dagerTilSvarfrist = Math.floor(moment(svarfrist).diff(moment(), 'days', true));
            const formatertSvarfrist =
                svarfrist &&
                formaterMedEllerUtenÅrstall(
                    // TODO: Fjern de tre ekstra timene når vi får riktig tidssone fra backend
                    moment(svarfrist).subtract(1, 'day').add(3, 'hours').toISOString()
                );

            if (
                dagerTilSvarfrist < 0 ||
                forespørselOmDelingAvCv?.tilstand === TilstandPåForespørsel.Avbrutt
            ) {
                return 'Delt med kandidat, frist utløpt';
            } else if (dagerTilSvarfrist === 0) {
                return `Delt med kandidat, frist i dag`;
            } else {
                return `Delt med kandidat, frist ${formatertSvarfrist}`;
            }
        }
        case Hendelse.SvarJa: {
            return `Svar: Ja – ${svarTidspunkt && formaterMedEllerUtenÅrstall(svarTidspunkt)}`;
        }
        case Hendelse.SvarNei: {
            return `Svar: Nei – ${svarTidspunkt && formaterMedEllerUtenÅrstall(svarTidspunkt)}`;
        }
        default:
            return '';
    }
};

export default Hendelsesetikett;
