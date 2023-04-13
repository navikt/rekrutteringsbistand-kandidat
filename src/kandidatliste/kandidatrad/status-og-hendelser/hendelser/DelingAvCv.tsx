import React, { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PlusCircleIcon, MinusCircleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, ErrorMessage } from '@navikt/ds-react';

import { cvErSendtTilArbeidsgiverOgSlettet } from './CvErSlettet';
import { formaterDatoNaturlig } from '../../../../utils/dateUtils';
import { hentSisteKandidatutfall, Kandidatutfall, Utfallsendring } from '../../../domene/Kandidat';
import { Nettstatus } from '../../../../api/Nettressurs';
import AppState from '../../../../AppState';
import Hendelse, { Hendelsesstatus } from './Hendelse';
import css from './DelingAvCv.module.css';

type Props = {
    utfall: Kandidatutfall;
    utfallsendringer: Utfallsendring[];
    onEndreUtfall: (utfall: Kandidatutfall) => void;
    onSlettCv: () => void;
    kanEndre?: boolean;
};

enum Visning {
    Registrer,
    CvErDelt,
    SlettSendtCv,
    BekreftRegistrer,
    BekreftFjernRegistrering,
    BekreftSlettSendtCv,
}

const hentInitiellVisning = (
    utfall: Kandidatutfall,
    utfallsendringer: Utfallsendring[],
    cvErSlettet: boolean
): Visning => {
    if (cvErSlettet) {
        return Visning.CvErDelt;
    } else if (utfall === Kandidatutfall.IkkePresentert) {
        return Visning.Registrer;
    } else {
        const sisteUtfallsendring = hentSisteKandidatutfall(utfall, utfallsendringer);

        if (
            sisteUtfallsendring?.sendtTilArbeidsgiversKandidatliste ||
            bleSendtTilArbeidsgiversKandidatlisteFørAvregistreringAvFåttJobben(utfallsendringer)
        ) {
            return Visning.SlettSendtCv;
        } else {
            return Visning.CvErDelt;
        }
    }
};

const bleSendtTilArbeidsgiversKandidatlisteFørAvregistreringAvFåttJobben = (
    utfallsendringer: Utfallsendring[]
): Boolean => {
    if (utfallsendringer.length < 3) return false;

    const [sisteUtfall, nestSisteutfall, tredjeSisteUtfall] = utfallsendringer;

    const harFjernetRegistreringAvFåttJobben =
        sisteUtfall.utfall === Kandidatutfall.Presentert &&
        nestSisteutfall.utfall === Kandidatutfall.FåttJobben &&
        tredjeSisteUtfall.utfall === Kandidatutfall.Presentert;

    return (
        harFjernetRegistreringAvFåttJobben && tredjeSisteUtfall.sendtTilArbeidsgiversKandidatliste
    );
};

const DelingAvCv: FunctionComponent<Props> = ({
    kanEndre,
    utfall,
    utfallsendringer,
    onEndreUtfall,
    onSlettCv,
}) => {
    const cvErSlettet = cvErSendtTilArbeidsgiverOgSlettet(utfallsendringer);
    const slettCvStatus = useSelector(
        (state: AppState) => state.kandidatliste.slettCvFraArbeidsgiversKandidatlisteStatus
    );

    const [visning, setVisning] = useState<Visning>(
        hentInitiellVisning(utfall, utfallsendringer, cvErSlettet)
    );

    useEffect(() => {
        setVisning(hentInitiellVisning(utfall, utfallsendringer, cvErSlettet));
    }, [utfall, utfallsendringer, cvErSlettet]);

    const onRegistrer = () => setVisning(Visning.BekreftRegistrer);
    const onFjernRegistrering = () => setVisning(Visning.BekreftFjernRegistrering);
    const onSlettSendtCv = () => setVisning(Visning.BekreftSlettSendtCv);

    const onAvbrytRegistrering = () => setVisning(Visning.Registrer);
    const onAvbrytFjerningAvRegistrering = () => setVisning(Visning.CvErDelt);
    const onAvbrytSlettSendtCv = () => setVisning(Visning.SlettSendtCv);

    const onBekreftRegistreringClick = () => {
        onEndreUtfall(Kandidatutfall.Presentert);
    };

    const onBekreftFjerningAvRegistrering = () => {
        onEndreUtfall(Kandidatutfall.IkkePresentert);
    };

    const onBekreftSlettSendtCv = () => {
        onSlettCv();
    };

    const hendelsesstatus =
        utfall === Kandidatutfall.FåttJobben || utfall === Kandidatutfall.Presentert || cvErSlettet
            ? Hendelsesstatus.Grønn
            : Hendelsesstatus.Hvit;

    const sisteUtfallPresentert = hentSisteKandidatutfall(
        Kandidatutfall.Presentert,
        utfallsendringer
    );

    const gjeldendeUtfallErFåttJobben = utfall === Kandidatutfall.FåttJobben;

    const utfallsbeskrivelse = sisteUtfallPresentert
        ? `${formaterDatoNaturlig(sisteUtfallPresentert.tidspunkt)} av ${
              sisteUtfallPresentert.registrertAvIdent
          }`
        : undefined;

    switch (visning) {
        case Visning.Registrer:
            return (
                <Hendelse
                    status={hendelsesstatus}
                    tittel="CV-en er delt med arbeidsgiver"
                    beskrivelse="Gjøres i kandidatlisten"
                >
                    {kanEndre && (
                        <Button
                            size="small"
                            onClick={onRegistrer}
                            className={css.knapp}
                            variant="secondary"
                            icon={<PlusCircleIcon aria-hidden />}
                        >
                            Registrer manuelt
                        </Button>
                    )}
                </Hendelse>
            );

        case Visning.CvErDelt:
            return (
                <Hendelse
                    status={hendelsesstatus}
                    tittel="CV-en er delt med arbeidsgiver"
                    beskrivelse={utfallsbeskrivelse}
                >
                    {kanEndre && !cvErSlettet && !gjeldendeUtfallErFåttJobben && (
                        <Button
                            variant="tertiary"
                            onClick={onFjernRegistrering}
                            className={css.knapp}
                            icon={<MinusCircleIcon />}
                            size="small"
                        >
                            Fjern registrering
                        </Button>
                    )}
                </Hendelse>
            );

        case Visning.SlettSendtCv:
            return (
                <Hendelse
                    status={hendelsesstatus}
                    tittel="CV-en er delt med arbeidsgiver"
                    beskrivelse={utfallsbeskrivelse}
                >
                    {kanEndre && !gjeldendeUtfallErFåttJobben && (
                        <Button
                            variant="tertiary"
                            size="small"
                            onClick={onSlettSendtCv}
                            className={css.knapp}
                            icon={<MinusCircleIcon />}
                        >
                            Slett CV-en hos arbeidsgiver
                        </Button>
                    )}
                </Hendelse>
            );

        case Visning.BekreftRegistrer:
            return (
                <Hendelse
                    renderChildrenBelowContent
                    status={hendelsesstatus}
                    tittel="Registrer at CV-en er blitt delt"
                    beskrivelse="Når du registrerer at CV-en er blitt delt med arbeidsgiver vil det bli telt, og tellingen vil bli brukt til statistikk"
                >
                    {kanEndre && (
                        <>
                            <Button
                                size="small"
                                onClick={onBekreftRegistreringClick}
                                className={css.bekreftKnapp}
                            >
                                CV-en er blitt delt
                            </Button>
                            <Button variant="secondary" size="small" onClick={onAvbrytRegistrering}>
                                Avbryt
                            </Button>
                        </>
                    )}
                </Hendelse>
            );

        case Visning.BekreftFjernRegistrering:
            return (
                <Hendelse
                    renderChildrenBelowContent
                    status={hendelsesstatus}
                    tittel={'Fjern registreringen "delt med arbeidsgiver"'}
                    beskrivelse={
                        'Hvis du fjerner registreringen vil tellingen på "presentert" taes bort.'
                    }
                >
                    {kanEndre && (
                        <>
                            <Button
                                size="small"
                                onClick={onBekreftFjerningAvRegistrering}
                                className={css.bekreftKnapp}
                            >
                                Fjern registreringen
                            </Button>
                            <Button
                                size="small"
                                variant="secondary"
                                onClick={onAvbrytFjerningAvRegistrering}
                            >
                                Avbryt
                            </Button>
                        </>
                    )}
                </Hendelse>
            );

        case Visning.BekreftSlettSendtCv:
            return (
                <Hendelse
                    renderChildrenBelowContent
                    status={hendelsesstatus}
                    tittel="Slett CV-en fra kandidatlisten til arbeidsgiver"
                    beskrivelse={
                        <>
                            <BodyLong spacing className="blokk-xs">
                                Hvis du utfører denne handlingen så blir CV-en slettet fra
                                kandidatlisten til arbeidsgiver. Arbeidsgiver vil ikke kunne se
                                CV-en til kandidaten.
                            </BodyLong>
                            <BodyLong>
                                Husk at årsaken til at du sletter CV-en må journalføres.
                            </BodyLong>
                        </>
                    }
                >
                    {kanEndre && (
                        <>
                            <Button
                                size="small"
                                loading={slettCvStatus === Nettstatus.SenderInn}
                                onClick={
                                    slettCvStatus === Nettstatus.SenderInn
                                        ? () => {}
                                        : onBekreftSlettSendtCv
                                }
                                className={css.bekreftKnapp}
                            >
                                Slett CV-en
                            </Button>
                            <Button size="small" variant="tertiary" onClick={onAvbrytSlettSendtCv}>
                                Avbryt
                            </Button>
                        </>
                    )}
                    {slettCvStatus === Nettstatus.Feil && (
                        <ErrorMessage>
                            Klarte ikke å slette CV-en. Vennligst prøv igjen senere.
                        </ErrorMessage>
                    )}
                </Hendelse>
            );
    }
};

export default DelingAvCv;
