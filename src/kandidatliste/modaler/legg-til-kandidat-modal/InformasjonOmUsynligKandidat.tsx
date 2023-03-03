import React, { FunctionComponent, useEffect, useState } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Undertittel, Normaltekst, Feilmelding } from 'nav-frontend-typografi';
import { fetchUsynligKandidat } from '../../../api/api';
import { Nettressurs, ikkeLastet, Nettstatus } from '../../../api/Nettressurs';
import { UsynligKandidat } from '../../domene/Kandidat';
import { Kandidatliste } from '../../domene/Kandidatliste';
import FormidleUsynligKandidat from './FormidleUsynligKandidat';

type Props = {
    fnr: string;
    kandidatliste: Kandidatliste;
    stillingsId: string | null;
    valgtNavKontor: string | null;
    onClose: () => void;
};

const InformasjonOmUsynligKandidat: FunctionComponent<Props> = ({
    fnr,
    kandidatliste,
    stillingsId,
    valgtNavKontor,
    onClose,
}) => {
    const [pdlSøk, setPdlSøk] = useState<Nettressurs<UsynligKandidat[]>>(ikkeLastet());

    useEffect(() => {
        const hentUsynligKandidat = async () => {
            setPdlSøk(await fetchUsynligKandidat(fnr));
        };

        if (stillingsId && valgtNavKontor && kandidatliste.kanEditere) {
            hentUsynligKandidat();
        }
    }, [fnr, stillingsId, valgtNavKontor, kandidatliste.kanEditere]);

    if (stillingsId === null || valgtNavKontor === null) {
        return null;
    }

    if (!kandidatliste.kanEditere) {
        return (
            <>
                <Undertittel className="blokk-xxs">Fra folkeregisteret</Undertittel>
                <Normaltekst>
                    Ikke aktuelt. Du er ikke eier av stillingen og kan derfor ikke registrere
                    formidling.
                </Normaltekst>
            </>
        );
    }

    return (
        <>
            <Undertittel className="blokk-xxs">Fra folkeregisteret</Undertittel>
            {pdlSøk.kind === Nettstatus.LasterInn && (
                <NavFrontendSpinner className="LeggTilKandidatModal__spinner" />
            )}

            {pdlSøk.kind === Nettstatus.FinnesIkke && (
                <Feilmelding>Fant ikke personen i folkeregisteret.</Feilmelding>
            )}

            {pdlSøk.kind === Nettstatus.Feil && (
                <Feilmelding>Klarte ikke å hente person fra folkeregisteret.</Feilmelding>
            )}

            {pdlSøk.kind === Nettstatus.Suksess && (
                <FormidleUsynligKandidat
                    fnr={fnr}
                    usynligKandidat={pdlSøk.data}
                    kandidatliste={kandidatliste}
                    stillingsId={stillingsId}
                    valgtNavKontor={valgtNavKontor}
                    onClose={onClose}
                />
            )}
        </>
    );
};

export default InformasjonOmUsynligKandidat;
