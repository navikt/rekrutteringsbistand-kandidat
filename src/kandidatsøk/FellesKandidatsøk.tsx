import React, { FunctionComponent } from 'react';
import { match } from 'react-router-dom';
import DefaultKandidatsøk from './DefaultKandidatsøk';
import KandidatsøkFraKandidatliste from './KandidatsøkFraKandidatliste';
import KandidatsøkFraStilling from './KandidatsøkFraStilling';

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

    if (stillingsId) {
        return (
            <KandidatsøkFraStilling
                match={{
                    params: {
                        stillingsId,
                    },
                }}
            />
        );
    } else if (kandidatlisteId) {
        return (
            <KandidatsøkFraKandidatliste
                match={{
                    params: {
                        kandidatlisteId,
                    },
                }}
            />
        );
    } else {
        return <DefaultKandidatsøk />;
    }
};

export default FellesKandidatsøk;
