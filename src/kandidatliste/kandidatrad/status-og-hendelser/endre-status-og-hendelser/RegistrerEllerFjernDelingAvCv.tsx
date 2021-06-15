import React, { FunctionComponent, useState } from 'react';
import { Flatknapp } from 'nav-frontend-knapper';
import { AddCircle, MinusCircle } from '@navikt/ds-icons';
import { Utfall } from '../../utfall-med-endre-ikon/UtfallMedEndreIkon';
import Hendelse from './Hendelse';

type Props = {
    utfall: Utfall;
};

enum Visning {
    Registrer,
    FjernRegistrering,
    BekreftRegistrer,
    BekreftFjernRegistrering,
}

const RegistrerEllerFjernDelingAvCv: FunctionComponent<Props> = ({ utfall }) => {
    const [visning, setVisning] = useState<Visning>(
        utfall === Utfall.IkkePresentert ? Visning.Registrer : Visning.FjernRegistrering
    );

    const onRegistrer = () => setVisning(Visning.BekreftRegistrer);
    const onFjernRegistrering = () => setVisning(Visning.BekreftFjernRegistrering);

    const checked = utfall === Utfall.FåttJobben || utfall === Utfall.Presentert;

    switch (visning) {
        case Visning.Registrer:
            return (
                <Hendelse
                    checked={checked}
                    tittel="CV-en er delt med arbeidsgiver"
                    beskrivelse="Gjøres i kandidatlisten"
                >
                    <Flatknapp
                        mini
                        kompakt
                        onClick={onRegistrer}
                        className="endre-status-og-hendelser__registrer-hendelse"
                    >
                        <AddCircle />
                        Registrer manuelt
                    </Flatknapp>
                </Hendelse>
            );

        case Visning.FjernRegistrering:
            return (
                <Hendelse
                    checked={checked}
                    tittel="CV-en er delt med arbeidsgiver"
                    beskrivelse={undefined}
                >
                    <Flatknapp
                        onClick={onFjernRegistrering}
                        className="endre-status-og-hendelser__registrer-hendelse"
                        kompakt
                        mini
                    >
                        <MinusCircle />
                        Fjern registrering
                    </Flatknapp>
                </Hendelse>
            );

        case Visning.BekreftRegistrer:
            return (
                <Hendelse
                    renderChildrenBelowContent
                    checked={checked}
                    tittel="Registrer at CV-en er blitt delt"
                    beskrivelse="Når du registrerer at CV-en er blitt delt med arbeidsgiver vil det bli telt, og tellingen vil bli brukt til statistikk"
                >
                    <div>TODO: Bekreft registrering</div>
                </Hendelse>
            );

        case Visning.BekreftFjernRegistrering:
            return (
                <Hendelse
                    renderChildrenBelowContent
                    checked={checked}
                    tittel={'Fjern registreringen "delt med arbeidsgiver"'}
                    beskrivelse={
                        'Hvis du fjerner registreringen vil tellingen på "presentert" taes bort'
                    }
                >
                    <div>TODO: Bekreft fjern registrering</div>
                </Hendelse>
            );
    }
};

export default RegistrerEllerFjernDelingAvCv;
