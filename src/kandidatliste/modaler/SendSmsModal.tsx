import { FunctionComponent, useState, ChangeEvent } from 'react';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@navikt/ds-react';

import { Kandidatmeldinger, SmsStatus } from '../domene/Kandidatressurser';
import { Kandidat } from '../domene/Kandidat';
import KandidatlisteAction from '../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import AppState from '../../state/AppState';
import Modal from '../../komponenter/modal/Modal';
import useMarkerteKandidater from '../hooks/useMarkerteKandidater';
import { Stillingskategori } from '../domene/Kandidatliste';
import { Alert, BodyShort, Heading, Label, Link, Select } from '@navikt/ds-react';
import css from './SendSmsModal.module.css';

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
        <Modal
            open={vis}
            className={css.sendSmsModal}
            onClose={onClose}
            aria-label={`Send SMS til ${kandidater.length} kandidater`}
        >
            {(kandidaterSomHarFåttSms.length > 0 || harInaktiveKandidater) && (
                <Alert variant="warning" size="small" className={css.alleredeSendtAdvarsel}>
                    Ikke alle kandidatene vil motta SMS-en
                    <ul className={css.alleredeSendtAdvarselListe}>
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
                </Alert>
            )}
            <div className="send-sms-modal__innhold">
                <Heading spacing size="medium" level="2">
                    Send SMS
                </Heading>
                <BodyShort>
                    Det vil bli sendt SMS til <b>{kandidaterSomIkkeHarFåttSms.length}</b>{' '}
                    {kandidaterSomIkkeHarFåttSms.length === 1 ? 'kandidat' : 'kandidater'}
                </BodyShort>
                <BodyShort size="small">
                    Telefonnummerene blir hentet fra Kontakt- og reservasjonsregisteret.
                </BodyShort>
                <Alert variant="info" className={css.kontortidAdvarsel}>
                    <Label size="small">
                        SMS sendes ut mellom 09:00 og 17:15 hver dag. Det kan oppstå forsinkelser.
                    </Label>
                </Alert>

                {stillingskategori !== Stillingskategori.Jobbmesse && (
                    <Select
                        className={css.velgMal}
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
                <Label htmlFor="forhåndsvisning">Meldingen som vil bli sendt til kandidatene</Label>
                <div id="forhåndsvisning" className={css.forhåndsvisning}>
                    <BodyShort>
                        <span>{genererMeldingUtenLenke(valgtMal)} </span>
                        <Link href={lenkeMedPrefiks} target="_blank" rel="noopener noreferrer">
                            {lenkeTilStilling}
                        </Link>
                    </BodyShort>
                </div>
                <div className={css.knapper}>
                    <Button
                        variant="primary"
                        loading={sendStatus === SmsStatus.UnderUtsending}
                        onClick={onSendSms}
                    >
                        Send SMS
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                        Avbryt
                    </Button>
                </div>
            </div>
        </Modal>
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
