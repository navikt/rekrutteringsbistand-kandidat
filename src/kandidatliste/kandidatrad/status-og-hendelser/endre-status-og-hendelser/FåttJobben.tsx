import React, { FunctionComponent, useEffect, useState } from 'react';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { AddCircle, MinusCircle } from '@navikt/ds-icons';
import { Utfall } from '../../utfall-med-endre-ikon/UtfallMedEndreIkon';
import Hendelse from './Hendelse';

type Props = {
    kanEndre?: boolean;
    utfall: Utfall;
    navn: string;
    onEndreUtfall: (nyttUtfall: Utfall) => void;
};

enum Visning {
    Registrer,
    FjernRegistrering,
    BekreftRegistrer,
    BekreftFjernRegistrering,
}

const FåttJobben: FunctionComponent<Props> = ({ kanEndre, utfall, navn, onEndreUtfall }) => {
    const [visning, setVisning] = useState<Visning>(
        utfall === Utfall.FåttJobben ? Visning.FjernRegistrering : Visning.Registrer
    );

    useEffect(() => {
        setVisning(utfall === Utfall.FåttJobben ? Visning.FjernRegistrering : Visning.Registrer);
    }, [utfall]);

    const onRegistrer = () => setVisning(Visning.BekreftRegistrer);
    const onFjernRegistrering = () => setVisning(Visning.BekreftFjernRegistrering);
    const onAvbrytRegistrering = () => setVisning(Visning.Registrer);
    const onAvbrytFjerningAvRegistrering = () => setVisning(Visning.FjernRegistrering);

    const onBekreftRegistreringClick = () => {
        onEndreUtfall(Utfall.FåttJobben);
    };

    const onBekreftFjerningAvRegistrering = () => {
        onEndreUtfall(Utfall.Presentert);
    };

    const checked = utfall === Utfall.FåttJobben;

    switch (visning) {
        case Visning.Registrer:
            return (
                <Hendelse checked={checked} tittel={undefined} beskrivelse={undefined}>
                    {kanEndre && (
                        <Flatknapp
                            mini
                            kompakt
                            onClick={onRegistrer}
                            className="endre-status-og-hendelser__registrer-hendelse endre-status-og-hendelser__registrer-hendelse--kompenser-for-padding"
                        >
                            <AddCircle />
                            Registrer at kandidaten har fått jobb
                        </Flatknapp>
                    )}
                </Hendelse>
            );

        case Visning.FjernRegistrering:
            return (
                <Hendelse
                    checked={checked}
                    tittel="Kandidaten har fått jobben"
                    beskrivelse={undefined}
                >
                    {kanEndre && (
                        <Flatknapp
                            mini
                            kompakt
                            onClick={onFjernRegistrering}
                            className="endre-status-og-hendelser__registrer-hendelse"
                        >
                            <MinusCircle />
                            Fjern registreringen
                        </Flatknapp>
                    )}
                </Hendelse>
            );

        case Visning.BekreftRegistrer:
            return (
                <Hendelse
                    renderChildrenBelowContent
                    checked={checked}
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
                    checked={checked}
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
