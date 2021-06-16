import React, { FunctionComponent, useState } from 'react';
import { Flatknapp, Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { AddCircle, MinusCircle } from '@navikt/ds-icons';
import { Utfall } from '../../utfall-med-endre-ikon/UtfallMedEndreIkon';
import Hendelse from './Hendelse';
import { useDispatch, useSelector } from 'react-redux';
import KandidatlisteActionType from '../../../reducer/KandidatlisteActionType';
import AppState from '../../../../AppState';
import { useEffect } from 'react';

type Props = {
    redigerbart?: boolean;
    utfall: Utfall;
    kandidatnummer: string;
    kandidatlisteId: string;
};

enum Visning {
    Registrer,
    FjernRegistrering,
    BekreftRegistrer,
    BekreftFjernRegistrering,
}

const RegistrerEllerFjernDelingAvCv: FunctionComponent<Props> = ({
    redigerbart,
    utfall,
    kandidatnummer,
    kandidatlisteId,
}) => {
    const dispatch = useDispatch();
    const valgtNavKontor = useSelector((state: AppState) => state.navKontor.valgtNavKontor);

    const [visning, setVisning] = useState<Visning>(
        utfall === Utfall.IkkePresentert ? Visning.Registrer : Visning.FjernRegistrering
    );

    useEffect(() => {
        setVisning(
            utfall === Utfall.IkkePresentert ? Visning.Registrer : Visning.FjernRegistrering
        );
    }, [utfall]);

    const onRegistrer = () => setVisning(Visning.BekreftRegistrer);
    const onFjernRegistrering = () => setVisning(Visning.BekreftFjernRegistrering);
    const onAvbrytRegistrering = () => setVisning(Visning.Registrer);
    const onAvbrytFjerningAvRegistrering = () => setVisning(Visning.FjernRegistrering);

    const onBekreftRegistreringClick = () => {
        endreUtfallForKandidat(Utfall.Presentert);
    };

    const onBekreftFjerningAvRegistrering = () => {
        endreUtfallForKandidat(Utfall.IkkePresentert);
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

    const checked = utfall === Utfall.FåttJobben || utfall === Utfall.Presentert;

    switch (visning) {
        case Visning.Registrer:
            return (
                <Hendelse
                    checked={checked}
                    tittel="CV-en er delt med arbeidsgiver"
                    beskrivelse="Gjøres i kandidatlisten"
                >
                    {redigerbart && (
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
                    checked={checked}
                    tittel="CV-en er delt med arbeidsgiver"
                    beskrivelse={undefined}
                >
                    {redigerbart && (
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
                    checked={checked}
                    tittel="Registrer at CV-en er blitt delt"
                    beskrivelse="Når du registrerer at CV-en er blitt delt med arbeidsgiver vil det bli telt, og tellingen vil bli brukt til statistikk"
                >
                    {redigerbart && (
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
                    checked={checked}
                    tittel={'Fjern registreringen "delt med arbeidsgiver"'}
                    beskrivelse={
                        'Hvis du fjerner registreringen vil tellingen på "presentert" taes bort.'
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

export default RegistrerEllerFjernDelingAvCv;
