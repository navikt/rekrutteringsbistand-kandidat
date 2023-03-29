import React, { FunctionComponent, useEffect, useState } from 'react';
import { ErrorMessage } from '@navikt/ds-react';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { fetchUsynligKandidat } from '../../../api/api';
import { Nettressurs, ikkeLastet, Nettstatus } from '../../../api/Nettressurs';
import { UsynligKandidat } from '../../domene/Kandidat';
import { Kandidatliste } from '../../domene/Kandidatliste';
import FormidleUsynligKandidat from './FormidleUsynligKandidat';
import Sidelaster from '../../../common/sidelaster/Sidelaster';

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
                    Du er ikke eier av stillingen og kan derfor ikke registrere formidling.
                </Normaltekst>
            </>
        );
    }

    return (
        <>
            <Undertittel className="blokk-xxs">Fra folkeregisteret</Undertittel>
            {pdlSøk.kind === Nettstatus.LasterInn && <Sidelaster size="large" />}

            {pdlSøk.kind === Nettstatus.FinnesIkke && (
                <ErrorMessage>Fant ikke personen i folkeregisteret.</ErrorMessage>
            )}

            {pdlSøk.kind === Nettstatus.Feil && (
                <ErrorMessage>Klarte ikke å hente person fra folkeregisteret.</ErrorMessage>
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
