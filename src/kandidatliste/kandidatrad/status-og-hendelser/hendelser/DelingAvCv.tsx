import React, { FunctionComponent, useEffect, useState } from 'react';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { PlusCircleIcon, MinusCircleIcon } from '@navikt/aksel-icons';
import Hendelse, { Hendelsesstatus } from './Hendelse';
import { hentSisteKandidatutfall, Kandidatutfall, Utfallsendring } from '../../../domene/Kandidat';
import { formaterDatoNaturlig } from '../../../../utils/dateUtils';
import { useSelector } from 'react-redux';
import AppState from '../../../../AppState';
import { Nettstatus } from '../../../../api/Nettressurs';
import { Feilmelding, Normaltekst } from 'nav-frontend-typografi';
import { cvErSendtTilArbeidsgiverOgSlettet } from './CvErSlettet';

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
                        <Flatknapp
                            mini
                            kompakt
                            onClick={onRegistrer}
                            className="endre-status-og-hendelser__registrer-hendelse"
                        >
                            <PlusCircleIcon />
                            Registrer manuelt
                        </Flatknapp>
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
                        <Flatknapp
                            onClick={onFjernRegistrering}
                            className="endre-status-og-hendelser__registrer-hendelse"
                            kompakt
                            mini
                        >
                            <MinusCircleIcon />
                            Fjern registrering
                        </Flatknapp>
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
                        <Flatknapp
                            onClick={onSlettSendtCv}
                            className="endre-status-og-hendelser__registrer-hendelse"
                            kompakt
                            mini
                        >
                            <MinusCircleIcon />
                            Slett CV-en hos arbeidsgiver
                        </Flatknapp>
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
                            <Hovedknapp
                                mini
                                kompakt
                                onClick={onBekreftRegistreringClick}
                                className="endre-status-og-hendelser__bekreft-knapp"
                            >
                                CV-en er blitt delt
                            </Hovedknapp>
                            <Knapp mini kompakt onClick={onAvbrytRegistrering}>
                                Avbryt
                            </Knapp>
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
                            <Hovedknapp
                                mini
                                kompakt
                                onClick={onBekreftFjerningAvRegistrering}
                                className="endre-status-og-hendelser__bekreft-knapp"
                            >
                                Fjern registreringen
                            </Hovedknapp>
                            <Knapp mini kompakt onClick={onAvbrytFjerningAvRegistrering}>
                                Avbryt
                            </Knapp>
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
                            <Normaltekst className="blokk-xs">
                                Hvis du utfører denne handlingen så blir CV-en slettet fra
                                kandidatlisten til arbeidsgiver. Arbeidsgiver vil ikke kunne se
                                CV-en til kandidaten.
                            </Normaltekst>
                            <Normaltekst>
                                Husk at årsaken til at du sletter CV-en må journalføres.
                            </Normaltekst>
                        </>
                    }
                >
                    {kanEndre && (
                        <>
                            <Hovedknapp
                                mini
                                kompakt
                                spinner={slettCvStatus === Nettstatus.SenderInn}
                                onClick={
                                    slettCvStatus === Nettstatus.SenderInn
                                        ? () => {}
                                        : onBekreftSlettSendtCv
                                }
                                className="endre-status-og-hendelser__bekreft-knapp"
                            >
                                Slett CV-en
                            </Hovedknapp>
                            <Knapp mini kompakt onClick={onAvbrytSlettSendtCv}>
                                Avbryt
                            </Knapp>
                        </>
                    )}
                    {slettCvStatus === Nettstatus.Feil && (
                        <Feilmelding className="hendelse__feilmelding">
                            Klarte ikke å slette CV-en. Vennligst prøv igjen senere.
                        </Feilmelding>
                    )}
                </Hendelse>
            );
    }
};

export default DelingAvCv;
