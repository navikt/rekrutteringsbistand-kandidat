import React, { FunctionComponent, useEffect, useState } from 'react';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { AddCircle, MinusCircle } from '@navikt/ds-icons';
import { Utfall } from '../../utfall-med-endre-ikon/UtfallMedEndreIkon';
import Hendelse from './Hendelse';
import { useDispatch, useSelector } from 'react-redux';
import KandidatlisteActionType from '../../../reducer/KandidatlisteActionType';
import AppState from '../../../../AppState';

type Props = {
    redigerbart?: boolean;
    utfall: Utfall;
    kandidatnummer: string;
    kandidatlisteId: string;
    navn: string;
};

enum Visning {
    Registrer,
    FjernRegistrering,
    BekreftRegistrer,
    BekreftFjernRegistrering,
}

const RegistrerEllerFjernFåttJobben: FunctionComponent<Props> = ({
    redigerbart,
    utfall,
    kandidatnummer,
    kandidatlisteId,
    navn,
}) => {
    const dispatch = useDispatch();
    const valgtNavKontor = useSelector((state: AppState) => state.navKontor.valgtNavKontor);

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
        endreUtfallForKandidat(Utfall.FåttJobben);
    };

    const onBekreftFjerningAvRegistrering = () => {
        endreUtfallForKandidat(Utfall.Presentert);
    };

    const endreUtfallForKandidat = (nyttUtfall: Utfall) => {
        dispatch({
            kandidatlisteId,
            utfall: nyttUtfall,
            type: KandidatlisteActionType.ENDRE_UTFALL_KANDIDAT,
            navKontor: valgtNavKontor,
            kandidatnr: kandidatnummer,
        });
    };

    const checked = utfall === Utfall.FåttJobben;

    switch (visning) {
        case Visning.Registrer:
            return (
                <Hendelse checked={checked} tittel={undefined} beskrivelse={undefined}>
                    {redigerbart && (
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
                    {redigerbart && (
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
                    {redigerbart && (
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
                    {redigerbart && (
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

export default RegistrerEllerFjernFåttJobben;
