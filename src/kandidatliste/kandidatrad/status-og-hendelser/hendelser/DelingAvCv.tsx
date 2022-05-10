import React, { FunctionComponent, useEffect, useState } from 'react';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { AddCircle, MinusCircle } from '@navikt/ds-icons';
import Hendelse, { Hendelsesstatus } from './Hendelse';
import { hentSisteKandidatutfall, Kandidatutfall, Utfallsendring } from '../../../domene/Kandidat';
import { formaterDatoNaturlig } from '../../../../utils/dateUtils';

type Props = {
    utfall: Kandidatutfall;
    utfallsendringer: Utfallsendring[];
    onEndreUtfall: (utfall: Kandidatutfall) => void;
    onSlettCv: () => void;
    kanEndre?: boolean;
    kanSletteCv?: boolean;
};

enum Visning {
    Registrer,
    FjernRegistrering,
    SlettSendtCv,
    BekreftRegistrer,
    BekreftFjernRegistrering,
    BekreftSlettSendtCv,
}

const hentInitiellVisning = (
    utfall: Kandidatutfall,
    utfallsendringer: Utfallsendring[]
): Visning => {
    if (utfall === Kandidatutfall.IkkePresentert) {
        return Visning.Registrer;
    } else {
        const sisteUtfallsendring = hentSisteKandidatutfall(utfall, utfallsendringer);

        if (sisteUtfallsendring?.sendtTilArbeidsgiversKandidatliste) {
            return Visning.SlettSendtCv;
        } else {
            return Visning.FjernRegistrering;
        }
    }
};

const DelingAvCv: FunctionComponent<Props> = ({
    kanEndre,
    kanSletteCv,
    utfall,
    utfallsendringer,
    onEndreUtfall,
    onSlettCv,
}) => {
    const [visning, setVisning] = useState<Visning>(hentInitiellVisning(utfall, utfallsendringer));

    useEffect(() => {
        setVisning(hentInitiellVisning(utfall, utfallsendringer));
    }, [utfall, utfallsendringer]);

    const onRegistrer = () => setVisning(Visning.BekreftRegistrer);
    const onFjernRegistrering = () => setVisning(Visning.BekreftFjernRegistrering);
    const onSlettSendtCv = () => setVisning(Visning.BekreftSlettSendtCv);

    const onAvbrytRegistrering = () => setVisning(Visning.Registrer);
    const onAvbrytFjerningAvRegistrering = () => setVisning(Visning.FjernRegistrering);
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
        utfall === Kandidatutfall.FåttJobben || utfall === Kandidatutfall.Presentert
            ? Hendelsesstatus.Grønn
            : Hendelsesstatus.Hvit;

    const sisteUtfallPresentert = hentSisteKandidatutfall(
        Kandidatutfall.Presentert,
        utfallsendringer
    );

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
                            <AddCircle />
                            Registrer manuelt
                        </Flatknapp>
                    )}
                </Hendelse>
            );

        case Visning.FjernRegistrering:
            return (
                <Hendelse
                    status={hendelsesstatus}
                    tittel="CV-en er delt med arbeidsgiver"
                    beskrivelse={utfallsbeskrivelse}
                >
                    {kanEndre && (
                        <Flatknapp
                            onClick={onFjernRegistrering}
                            className="endre-status-og-hendelser__registrer-hendelse"
                            kompakt
                            mini
                        >
                            <MinusCircle />
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
                    {kanEndre && (
                        <Flatknapp
                            onClick={onSlettSendtCv}
                            className="endre-status-og-hendelser__registrer-hendelse"
                            kompakt
                            mini
                        >
                            <MinusCircle />
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
                            <p>
                                Hvis du utfører denne handlingen så blir CV-en slettet fra
                                kandidatlisten til arbeidsgiver. Arbeidsgiver vil ikke kunne se
                                CV-en til kandidaten.
                            </p>
                            <p>Husk at årsaken til at du sletter CV-en må journalføres.</p>
                        </>
                    }
                >
                    {kanEndre && (
                        <>
                            <Hovedknapp
                                mini
                                kompakt
                                onClick={onBekreftSlettSendtCv}
                                className="endre-status-og-hendelser__bekreft-knapp"
                            >
                                Slett CV-en
                            </Hovedknapp>
                            <Knapp mini kompakt onClick={onAvbrytSlettSendtCv}>
                                Avbryt
                            </Knapp>
                        </>
                    )}
                </Hendelse>
            );
    }
};

export default DelingAvCv;
