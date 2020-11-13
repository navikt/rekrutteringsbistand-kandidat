import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { connect } from 'react-redux';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import { Select } from 'nav-frontend-skjema';
import { Systemtittel, Ingress, Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import Modal from 'nav-frontend-modal';

import { KandidatIKandidatliste, SmsStatus } from '../kandidatlistetyper';
import KandidatlisteAction from '../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import './SendSmsModal.less';
import AppState from '../../AppState';

type OwnProps = {
    vis: boolean;
    onClose: () => void;
    kandidater: KandidatIKandidatliste[];
    kandidatlisteId: string;
    stillingId: string;
};

type ConnectedProps = {
    sendStatus: SmsStatus;
    sendSmsTilKandidater: (melding: string, fnr: string[], kandidatlisteId: string) => void;
};

type Props = OwnProps & ConnectedProps;

enum Meldingsmal {
    VurdertSomAktuell = 'vurdert-som-aktuell',
    EtterspurtPgaKorona = 'etterspurt_pga_korona',
    Jobbarrangement = 'jobbarrangement',
}

const genererLenkeTilStilling = (stillingId: string) => {
    return `nav.no/arbeid/stilling/${stillingId}`;
};

const genererMeldingUtenLenke = (valgtMal: Meldingsmal) => {
    if (valgtMal === Meldingsmal.VurdertSomAktuell) {
        return `Hei, vi har vurdert at kompetansen din kan passe til denne stillingen, hilsen NAV`;
    } else if (valgtMal === Meldingsmal.EtterspurtPgaKorona) {
        return `Hei, koronasituasjonen gjør kompetansen din etterspurt. Se denne stillingen, hilsen NAV`;
    } else if (valgtMal === Meldingsmal.Jobbarrangement) {
        return `Hei, vi har et jobbarrangement som kan passe for deg, hilsen NAV. Se mer info:`;
    }
};

const genererMelding = (valgtMal: Meldingsmal, stillingId: string) => {
    return `${genererMeldingUtenLenke(valgtMal)} ${genererLenkeTilStilling(stillingId)}`;
};

const SendSmsModal: FunctionComponent<Props> = (props) => {
    const {
        vis,
        onClose,
        kandidater,
        kandidatlisteId,
        stillingId,
        sendStatus,
        sendSmsTilKandidater,
    } = props;

    const markerteMandidater = kandidater.filter((kandidat) => kandidat.tilstand.markert);
    const kandidaterSomHarFåttSms = markerteMandidater.filter((kandidat) => kandidat.sms);
    const kandidaterSomIkkeHarFåttSms = markerteMandidater.filter((kandidat) => !kandidat.sms);

    const lenkeTilStilling = genererLenkeTilStilling(stillingId);
    const lenkeMedPrefiks = `https://www.${lenkeTilStilling}`;

    const [valgtMal, setValgtMal] = useState<Meldingsmal>(Meldingsmal.VurdertSomAktuell);

    const onSendSms = () => {
        const melding = genererMelding(valgtMal, stillingId);

        sendSmsTilKandidater(
            melding,
            kandidaterSomIkkeHarFåttSms
                .map((kandidat) => kandidat.fodselsnr || '')
                .filter((fnr) => fnr && fnr.length > 0),
            kandidatlisteId
        );
    };

    return (
        <Modal
            isOpen={vis}
            className="send-sms-modal"
            onRequestClose={onClose}
            contentLabel={`Send SMS til ${kandidater.length} kandidater`}
            closeButton
        >
            {kandidaterSomHarFåttSms.length > 0 && (
                <AlertStripeAdvarsel className="send-sms-modal__allerede-sendt-advarsel">
                    {kandidaterSomHarFåttSms.length === 1 ? (
                        <>
                            Du har allerede sendt SMS til én av kandidatene. Kandidaten vil ikke
                            motta stillingen.
                        </>
                    ) : (
                        <>
                            Du har allerede sendt SMS til {kandidaterSomHarFåttSms.length} av de{' '}
                            {markerteMandidater.length} valgte kandidatene. Disse kandidatene vil
                            ikke motta en ny SMS.
                        </>
                    )}
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
                <AlertStripeAdvarsel className="send-sms-modal__kontortid-advarsel">
                    SMS sendes ut mellom 09:00 og 17:15 hver dag. Det kan oppstå forsinkelser.
                </AlertStripeAdvarsel>

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
                    <option value={Meldingsmal.EtterspurtPgaKorona}>
                        Koronavirus og behov for arbeidskraft
                    </option>
                    <option value={Meldingsmal.Jobbarrangement}>Jobbarrangement</option>
                </Select>

                <label htmlFor="forhåndsvisning" className="typo-normal skjemaelement__label">
                    Meldingen som vil bli sendt til kandidatene
                </label>
                <div id="forhåndsvisning" className="send-sms-modal__forhåndsvisning">
                    <Normaltekst>
                        <span>{genererMeldingUtenLenke(valgtMal)} </span>
                        <Lenke href={lenkeMedPrefiks} target="_blank" rel="noopener noreferrer">
                            {lenkeTilStilling}
                        </Lenke>
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
        </Modal>
    );
};

export default connect(
    (state: AppState) => ({
        sendStatus: state.kandidatliste.sms.sendStatus,
    }),
    (dispatch: (action: KandidatlisteAction) => void) => ({
        sendSmsTilKandidater: (melding: string, fnr: string[], kandidatlisteId: string) =>
            dispatch({
                type: KandidatlisteActionType.SEND_SMS,
                melding,
                fnr,
                kandidatlisteId,
            }),
    })
)(SendSmsModal);
