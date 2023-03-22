import React, { FunctionComponent, useEffect, useState } from 'react';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { PlusCircleIcon, MinusCircleIcon } from '@navikt/aksel-icons';
import Hendelse, { Hendelsesstatus } from './Hendelse';
import { hentSisteKandidatutfall, Kandidatutfall, Utfallsendring } from '../../../domene/Kandidat';
import { formaterDatoNaturlig } from '../../../../utils/dateUtils';

type Props = {
    kanEndre?: boolean;
    utfall: Kandidatutfall;
    utfallsendringer: Utfallsendring[];
    navn: string;
    onEndreUtfall: (nyttUtfall: Kandidatutfall) => void;
};

enum Visning {
    Registrer,
    FjernRegistrering,
    BekreftRegistrer,
    BekreftFjernRegistrering,
}

const FåttJobben: FunctionComponent<Props> = ({
    kanEndre,
    utfall,
    utfallsendringer,
    navn,
    onEndreUtfall,
}) => {
    const [visning, setVisning] = useState<Visning>(
        utfall === Kandidatutfall.FåttJobben ? Visning.FjernRegistrering : Visning.Registrer
    );

    useEffect(() => {
        setVisning(
            utfall === Kandidatutfall.FåttJobben ? Visning.FjernRegistrering : Visning.Registrer
        );
    }, [utfall]);

    const onRegistrer = () => setVisning(Visning.BekreftRegistrer);
    const onFjernRegistrering = () => setVisning(Visning.BekreftFjernRegistrering);
    const onAvbrytRegistrering = () => setVisning(Visning.Registrer);
    const onAvbrytFjerningAvRegistrering = () => setVisning(Visning.FjernRegistrering);

    const onBekreftRegistreringClick = () => {
        onEndreUtfall(Kandidatutfall.FåttJobben);
    };

    const onBekreftFjerningAvRegistrering = () => {
        onEndreUtfall(Kandidatutfall.Presentert);
    };

    const hendelsesstatus =
        utfall === Kandidatutfall.FåttJobben ? Hendelsesstatus.Grønn : Hendelsesstatus.Hvit;

    switch (visning) {
        case Visning.Registrer:
            return (
                <Hendelse
                    status={hendelsesstatus}
                    tittel={kanEndre ? undefined : 'Kandidaten har fått jobb'}
                    beskrivelse={kanEndre ? undefined : 'Gjøres av eier av stillingen/listen'}
                >
                    {kanEndre && (
                        <Flatknapp
                            mini
                            kompakt
                            onClick={onRegistrer}
                            className="endre-status-og-hendelser__registrer-hendelse endre-status-og-hendelser__registrer-hendelse--kompenser-for-padding"
                        >
                            <PlusCircleIcon />
                            Registrer at kandidaten har fått jobb
                        </Flatknapp>
                    )}
                </Hendelse>
            );

        case Visning.FjernRegistrering:
            const utfallsendring = hentSisteKandidatutfall(
                Kandidatutfall.Presentert,
                utfallsendringer
            );
            const utfallsbeskrivelse = utfallsendring
                ? `${formaterDatoNaturlig(utfallsendring.tidspunkt)} av ${
                      utfallsendring.registrertAvIdent
                  }`
                : undefined;

            return (
                <Hendelse
                    status={hendelsesstatus}
                    tittel="Kandidaten har fått jobben"
                    beskrivelse={utfallsbeskrivelse}
                >
                    {kanEndre && (
                        <Flatknapp
                            mini
                            kompakt
                            onClick={onFjernRegistrering}
                            className="endre-status-og-hendelser__registrer-hendelse"
                        >
                            <MinusCircleIcon />
                            Fjern registreringen
                        </Flatknapp>
                    )}
                </Hendelse>
            );

        case Visning.BekreftRegistrer:
            return (
                <Hendelse
                    renderChildrenBelowContent
                    status={hendelsesstatus}
                    tittel={`Registrer at ${navn} har fått jobben`}
                    beskrivelse="Når du registrerer at en kandidat har fått jobb vil resultatet bli telt, og tellingen vil bli brukt til statistikk"
                >
                    {kanEndre && (
                        <>
                            <Hovedknapp
                                mini
                                kompakt
                                onClick={onBekreftRegistreringClick}
                                className="endre-status-og-hendelser__bekreft-knapp"
                            >
                                Registrere fått jobben
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
                    tittel={'Fjern registreringen "fått jobben"'}
                    beskrivelse={
                        'Hvis du fjerner registreringen vil tellingen på "fått jobben" taes bort.'
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
    }
};

export default FåttJobben;
