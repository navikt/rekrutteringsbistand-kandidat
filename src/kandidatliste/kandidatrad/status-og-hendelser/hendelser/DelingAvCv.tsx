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
    kanEndre?: boolean;
};

enum Visning {
    Registrer,
    FjernRegistrering,
    BekreftRegistrer,
    BekreftFjernRegistrering,
}

const DelingAvCv: FunctionComponent<Props> = ({
    kanEndre,
    utfall,
    utfallsendringer,
    onEndreUtfall,
}) => {
    const [visning, setVisning] = useState<Visning>(
        utfall === Kandidatutfall.IkkePresentert ? Visning.Registrer : Visning.FjernRegistrering
    );

    useEffect(() => {
        setVisning(
            utfall === Kandidatutfall.IkkePresentert ? Visning.Registrer : Visning.FjernRegistrering
        );
    }, [utfall]);

    const onRegistrer = () => setVisning(Visning.BekreftRegistrer);
    const onFjernRegistrering = () => setVisning(Visning.BekreftFjernRegistrering);
    const onAvbrytRegistrering = () => setVisning(Visning.Registrer);
    const onAvbrytFjerningAvRegistrering = () => setVisning(Visning.FjernRegistrering);

    const onBekreftRegistreringClick = () => {
        onEndreUtfall(Kandidatutfall.Presentert);
    };

    const onBekreftFjerningAvRegistrering = () => {
        onEndreUtfall(Kandidatutfall.IkkePresentert);
    };

    const hendelsesstatus =
        utfall === Kandidatutfall.FåttJobben || utfall === Kandidatutfall.Presentert
            ? Hendelsesstatus.Grønn
            : Hendelsesstatus.Hvit;

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
    }
};

export default DelingAvCv;
