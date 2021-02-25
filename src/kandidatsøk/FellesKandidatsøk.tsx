import React, { FunctionComponent } from 'react';
import { match } from 'react-router-dom';
import { Kandidatsøk } from './Kandidatsøk';
import { KandidatlisteHeader } from './headers/KandidatlisteHeader';
import { useSelector } from 'react-redux';
import AppState from '../AppState';
import { Nettstatus } from '../api/remoteData';
import { Sidetittel } from 'nav-frontend-typografi';
import { Container } from 'nav-frontend-grid';

export type FellesKandidatsøkProps = {
    resetQuery: (query: any) => void;
    leggUrlParametereIStateOgSøk: (href: string) => void;
    search: () => void;
    removeKompetanseSuggestions: () => void;
    isInitialSearch: boolean;
    harHentetStilling: boolean;
    resetKandidatlisterSokekriterier: () => void;
    lukkAlleSokepanel: () => void;
};

type Props = {
    match: match<{
        kandidatlisteId?: string;
        stillingsId?: string;
    }>;
};

const FellesKandidatsøk: FunctionComponent<Props> = ({ match }) => {
    const { kandidatlisteId, stillingsId } = match.params;
    const iKontekstAvKandidatliste = !!kandidatlisteId;
    const iKontekstAvStilling = !!stillingsId;

    const kandidatlistNetteressurs = useSelector(
        (state: AppState) => state.kandidatliste.kandidatliste
    );
    const kandidatliste =
        kandidatlistNetteressurs.kind === Nettstatus.Suksess
            ? kandidatlistNetteressurs.data
            : undefined;

    const header =
        iKontekstAvKandidatliste || iKontekstAvStilling ? (
            <KandidatlisteHeader kandidatliste={kandidatliste} stillingsId={stillingsId} />
        ) : (
            <Container className="container--header--uten-stilling">
                <Sidetittel>Kandidatsøk</Sidetittel>
            </Container>
        );

    return (
        <Kandidatsøk
            kandidatlisteId={kandidatlisteId || kandidatliste?.kandidatlisteId}
            stillingsId={stillingsId}
            visFantFåKandidater={false} // todo
            visSpinner={false} // todo
            header={header}
            onRemoveCriteriaClick={() => {}}
        />
    );
};

export default FellesKandidatsøk;
