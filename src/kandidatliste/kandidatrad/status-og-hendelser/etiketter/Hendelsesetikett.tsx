import { FunctionComponent } from 'react';
import moment from 'moment';
import { hentSisteKandidatutfall, Kandidatutfall, Utfallsendring } from '../../../domene/Kandidat';
import {
    ForespørselOmDelingAvCv,
    TilstandPåForespørsel,
} from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { formaterDato, formaterDatoUtenÅrstall } from '../../../../utils/dateUtils';
import { Sms, SmsStatus } from '../../../domene/Kandidatressurser';
import { cvErSendtTilArbeidsgiverOgSlettet } from '../hendelser/CvErSlettet';
import Etikett from './Etikett';
import css from './Hendelsesetikett.module.css';

type Props = {
    utfall: Kandidatutfall;
    utfallsendringer: Utfallsendring[];
    forespørselOmDelingAvCv?: ForespørselOmDelingAvCv;
    ikkeVisÅrstall?: boolean;
    sms?: Sms;
};

export enum Hendelse {
    NyKandidat = 'NY_KANDIDAT',
    DeltMedKandidat = 'DELT_MED_KANDIDAT',
    SvarJa = 'SVAR_JA',
    SvarNei = 'SVAR_NEI',
    CvDelt = 'CV_DELT',
    CvSlettet = 'CV_SLETTET',
    FåttJobben = 'FÅTT_JOBBEN',
    SmsFeilet = 'SMS_FEILET',
    SmsSendt = 'SMS_SENDT',
}

const Hendelsesetikett: FunctionComponent<Props> = ({
    utfall,
    utfallsendringer,
    forespørselOmDelingAvCv,
    ikkeVisÅrstall,
    sms,
}) => {
    const hendelse = hentKandidatensSisteHendelse(
        utfall,
        utfallsendringer,
        forespørselOmDelingAvCv,
        sms
    );
    const label = hendelseTilLabel(
        hendelse,
        ikkeVisÅrstall || false,
        utfallsendringer,
        forespørselOmDelingAvCv,
        sms
    );

    if (hendelse === Hendelse.NyKandidat) {
        return null;
    }

    return (
        <Etikett label="Utfall" className={css[hendelse.toLowerCase()]}>
            {label}
        </Etikett>
    );
};

export const hentKandidatensSisteHendelse = (
    utfall: Kandidatutfall,
    utfallsendringer: Utfallsendring[],
    forespørselOmDelingAvCv?: ForespørselOmDelingAvCv,
    sms?: Sms
): Hendelse => {
    const cvErSendtOgSlettet = cvErSendtTilArbeidsgiverOgSlettet(utfallsendringer);

    if (utfall === Kandidatutfall.FåttJobben) {
        return Hendelse.FåttJobben;
    } else if (cvErSendtOgSlettet) {
        return Hendelse.CvSlettet;
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
    } else if (sms?.status === SmsStatus.Sendt) {
        return Hendelse.SmsSendt;
    } else if (sms?.status === SmsStatus.Feil) {
        return Hendelse.SmsFeilet;
    }

    return Hendelse.NyKandidat;
};

const hendelseTilLabel = (
    hendelse: Hendelse,
    ikkeVisÅrstall: boolean,
    utfallsendringer: Utfallsendring[],
    forespørselOmDelingAvCv?: ForespørselOmDelingAvCv,
    sms?: Sms
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
        case Hendelse.CvSlettet: {
            return 'CV slettet';
        }
        case Hendelse.DeltMedKandidat: {
            const dagerTilSvarfrist = Math.floor(moment(svarfrist).diff(moment(), 'days', true));
            const formatertSvarfrist =
                svarfrist &&
                formaterMedEllerUtenÅrstall(moment(svarfrist).subtract(1, 'day').toISOString());

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
        case Hendelse.SmsSendt: {
            return `SMS sendt – ${sms && formaterDatoUtenÅrstall(sms.opprettet)}`;
        }
        case Hendelse.SmsFeilet: {
            return `SMS ikke sendt – ${sms && formaterDatoUtenÅrstall(sms.opprettet)}`;
        }
        default:
            return '';
    }
};

export default Hendelsesetikett;
