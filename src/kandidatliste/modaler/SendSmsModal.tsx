import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import { Dispatch } from 'redux';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { useDispatch, useSelector } from 'react-redux';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import { Select } from 'nav-frontend-skjema';
import { Systemtittel, Ingress, Normaltekst } from 'nav-frontend-typografi';

import { Kandidatmeldinger, SmsStatus } from '../domene/Kandidatressurser';
import { Kandidat } from '../domene/Kandidat';
import KandidatlisteAction from '../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import AppState from '../../AppState';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import useMarkerteKandidater from '../hooks/useMarkerteKandidater';
import { Stillingskategori } from '../domene/Kandidatliste';
import { Link } from '@navikt/ds-react';
import './SendSmsModal.less';

enum Meldingsmal {
    VurdertSomAktuell = 'vurdert-som-aktuell',
    FunnetPassendeStilling = 'funnet-passende-stilling',
    Jobbarrangement = 'jobbarrangement',
    // EtterspurtPgaKorona = 'etterspurt_pga_korona',
    // Webinar = 'webinar',
}

type Props = {
    vis: boolean;
    onClose: () => void;
    kandidater: Kandidat[];
    kandidatlisteId: string;
    stillingId: string;
    sendteMeldinger: Kandidatmeldinger;
    stillingskategori: Stillingskategori | null;
};

const SendSmsModal: FunctionComponent<Props> = (props) => {
    const {
        vis,
        onClose,
        kandidater,
        kandidatlisteId,
        stillingId,
        sendteMeldinger,
        stillingskategori,
    } = props;

    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();
    const { sendStatus } = useSelector((state: AppState) => state.kandidatliste.sms);
    const markerteKandidater = useMarkerteKandidater(kandidater);

    const sendSmsTilKandidater = (melding: string, fnr: string[], kandidatlisteId: string) => {
        dispatch({
            type: KandidatlisteActionType.SendSms,
            melding,
            fnr,
            kandidatlisteId,
        });
    };

    const kandidaterSomHarFåttSms = markerteKandidater.filter(
        (kandidat) => kandidat.fodselsnr && sendteMeldinger[kandidat.fodselsnr]
    );
    const kandidaterSomIkkeHarFåttSms = markerteKandidater.filter(
        (kandidat) => !(kandidat.fodselsnr && sendteMeldinger[kandidat.fodselsnr])
    );
    const harInaktiveKandidater = markerteKandidater.some(
        (kandidat) => kandidat.fodselsnr === null
    );

    const lenkeTilStilling = genererLenkeTilStilling(stillingId);
    const lenkeMedPrefiks = `https://www.${lenkeTilStilling}`;

    const [valgtMal, setValgtMal] = useState<Meldingsmal>(
        stillingskategori === Stillingskategori.Jobbmesse
            ? Meldingsmal.Jobbarrangement
            : Meldingsmal.VurdertSomAktuell
    );

    const onSendSms = () => {
        const melding = genererMelding(valgtMal, stillingId);
        const korrektLengdeFødselsnummer = 11;

        sendSmsTilKandidater(
            melding,
            kandidaterSomIkkeHarFåttSms
                .map((kandidat) => kandidat.fodselsnr || '')
                .filter((fnr) => fnr && fnr.length === korrektLengdeFødselsnummer),
            kandidatlisteId
        );
    };

    return (
        <ModalMedKandidatScope
            open={vis}
            className="send-sms-modal"
            onClose={onClose}
            aria-label={`Send SMS til ${kandidater.length} kandidater`}
        >
            {(kandidaterSomHarFåttSms.length > 0 || harInaktiveKandidater) && (
                <AlertStripeAdvarsel className="send-sms-modal__allerede-sendt-advarsel">
                    Ikke alle kandidatene vil motta SMS-en
                    <ul>
                        {kandidaterSomHarFåttSms.length > 0 && (
                            <li>
                                {kandidaterSomHarFåttSms.length === 1 ? (
                                    <>Du har allerede sendt SMS til én av kandidatene.</>
                                ) : (
                                    <>
                                        Du har allerede sendt SMS til{' '}
                                        {kandidaterSomHarFåttSms.length} av de{' '}
                                        {markerteKandidater.length} valgte kandidatene.
                                    </>
                                )}
                            </li>
                        )}
                        {harInaktiveKandidater && (
                            <li>Én eller flere av kandidatene er inaktive.</li>
                        )}
                    </ul>
                </AlertStripeAdvarsel>
            )}
            <div className="send-sms-modal__innhold">
                <Systemtittel className="send-sms-modal__tittel">Send SMS</Systemtittel>
                <Ingress className="send-sms-modal__ingress">
                    Det vil bli sendt SMS til <b>{kandidaterSomIkkeHarFåttSms.length}</b>{' '}
                    {kandidaterSomIkkeHarFåttSms.length === 1 ? 'kandidat' : 'kandidater'}
                </Ingress>
                <Normaltekst className="send-sms-modal__ingressbeskrivelse">
                    Telefonnummerene blir hentet fra Kontakt- og reservasjonsregisteret.
                </Normaltekst>
                <AlertStripeInfo className="send-sms-modal__kontortid-advarsel">
                    SMS sendes ut mellom 09:00 og 17:15 hver dag. Det kan oppstå forsinkelser.
                </AlertStripeInfo>

                {stillingskategori !== Stillingskategori.Jobbmesse && (
                    <Select
                        className="send-sms-modal__velg-mal"
                        label="Velg beskjed som skal vises i SMS-en*"
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            setValgtMal(e.target.value as Meldingsmal);
                        }}
                    >
                        <option value={Meldingsmal.VurdertSomAktuell}>
                            Send stilling til en aktuell kandidat
                        </option>
                        <option value={Meldingsmal.FunnetPassendeStilling}>
                            Oppfordre kandidat til å søke på stilling
                        </option>
                    </Select>
                )}

                <label htmlFor="forhåndsvisning" className="typo-normal skjemaelement__label">
                    Meldingen som vil bli sendt til kandidatene
                </label>
                <div id="forhåndsvisning" className="send-sms-modal__forhåndsvisning">
                    <Normaltekst>
                        <span>{genererMeldingUtenLenke(valgtMal)} </span>
                        <Link href={lenkeMedPrefiks} target="_blank" rel="noopener noreferrer">
                            {lenkeTilStilling}
                        </Link>
                    </Normaltekst>
                </div>
                <div className="send-sms-modal__knapper">
                    <Hovedknapp
                        spinner={sendStatus === SmsStatus.UnderUtsending}
                        onClick={onSendSms}
                    >
                        Send SMS
                    </Hovedknapp>
                    <Flatknapp onClick={onClose}>Avbryt</Flatknapp>
                </div>
            </div>
        </ModalMedKandidatScope>
    );
};

const genererLenkeTilStilling = (stillingId: string) => {
    return `nav.no/arbeid/stilling/${stillingId}`;
};

const genererMeldingUtenLenke = (valgtMal: Meldingsmal) => {
    if (valgtMal === Meldingsmal.VurdertSomAktuell) {
        return `Hei, vi har vurdert at kompetansen din kan passe til denne stillingen, hilsen NAV`;
    } else if (valgtMal === Meldingsmal.FunnetPassendeStilling) {
        return `Hei! Vi har funnet en stilling som kan passe deg. Interessert? Søk via lenka i annonsen. Hilsen NAV`;
    } else if (valgtMal === Meldingsmal.Jobbarrangement) {
        return `Hei, vi har et jobbarrangement som kan passe for deg, hilsen NAV. Se mer info:`;
    }
};

const genererMelding = (valgtMal: Meldingsmal, stillingId: string) => {
    return `${genererMeldingUtenLenke(valgtMal)} ${genererLenkeTilStilling(stillingId)}`;
};

export default SendSmsModal;
