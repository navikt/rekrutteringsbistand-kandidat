import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import Modal from 'nav-frontend-modal';
import { KandidatIKandidatliste } from '../kandidatlistetyper';
import { Systemtittel, Ingress, Normaltekst } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Select } from 'nav-frontend-skjema';
import './SendSmsModal.less';
import Lenke from 'nav-frontend-lenker';
import { Hovedknapp, Flatknapp } from 'pam-frontend-knapper';

type Props = {
    vis: boolean;
    onClose: () => void;
    onSendSms: (melding: string) => void;
    kandidater: KandidatIKandidatliste[];
    stillingId: string;
};

enum Meldingsmal {
    VurdertSomAktuell = 'vurdert-som-aktuell',
    EtterspurtPgaKorona = 'etterspurt_pga_korona',
}

const genererLenkeTilStilling = (stillingId: string) => {
    return `nav.no/arbeid/stilling/${stillingId}`;
};

const genererMeldingUtenLenke = (valgtMal: Meldingsmal) => {
    if (valgtMal === Meldingsmal.VurdertSomAktuell) {
        return `Hei, vi har vurdert at kompetansen din kan passe til denne stillingen, hilsen NAV`;
    } else if (valgtMal === Meldingsmal.EtterspurtPgaKorona) {
        return `Hei, koronasituasjonen gjør kompetansen din etterspurt. Se denne stillingen, hilsen NAV`;
    }
};

const genererMelding = (valgtMal: Meldingsmal, stillingId: string) => {
    return `${genererMeldingUtenLenke(valgtMal)} ${genererLenkeTilStilling(stillingId)}`;
};

const SendSmsModal: FunctionComponent<Props> = props => {
    const { vis, onClose, onSendSms, kandidater, stillingId } = props;

    const markerteMandidater = kandidater.filter(kandidat => kandidat.markert);

    const lenkeTilStilling = genererLenkeTilStilling(stillingId);
    const lenkeMedPrefiks = `https://www.${lenkeTilStilling}`;

    const [valgtMal, setValgtMal] = useState<Meldingsmal>(Meldingsmal.VurdertSomAktuell);

    return (
        <Modal
            isOpen={vis}
            className="send-sms-modal"
            onRequestClose={onClose}
            contentLabel={`Send SMS til ${kandidater.length} kandidater`}
            closeButton
        >
            <Systemtittel className="send-sms-modal__tittel">Send SMS</Systemtittel>
            <Ingress className="send-sms-modal__ingress">
                Det vil bli sendt SMS til <b>{markerteMandidater.length}</b> av{' '}
                <b>{kandidater.length}</b> kandidater
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
            </Select>

            <label htmlFor="forhåndsvisning" className="typo-normal skjemaelement__label">
                Meldingen som vil bli sendt til kandidatene
            </label>
            <div id="forhåndsvisning" className="send-sms-modal__forhåndsvisning typo-normal">
                <span>{genererMeldingUtenLenke(valgtMal)} </span>
                <Lenke href={lenkeMedPrefiks}>{lenkeTilStilling}</Lenke>
            </div>
            <div className="send-sms-modal__knapper">
                <Hovedknapp onClick={() => onSendSms(genererMelding(valgtMal, stillingId))}>
                    Send SMS
                </Hovedknapp>
                <Flatknapp onClick={onClose}>Avbryt</Flatknapp>
            </div>
        </Modal>
    );
};

export default SendSmsModal;
