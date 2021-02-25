import React, { FunctionComponent } from 'react';
import { match } from 'react-router-dom';
import DefaultKandidatsøk from './DefaultKandidatsøk';
import KandidatsøkFraKandidatliste from './KandidatsøkFraKandidatliste';
import KandidatsøkFraStilling from './KandidatsøkFraStilling';
import { Kandidatsøk } from './Kandidatsøk';
import { KandidatlisteHeader } from './headers/KandidatlisteHeader';

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

    const header = <KandidatlisteHeader kandidatliste={undefined} stillingsId={stillingsId} />;

    // return (
    //     <Kandidatsøk
    //         visFantFåKandidater={visFantFåKandidater}
    //         stillingsId={stillingsIdFraUrl}
    //         visSpinner={isInitialSearch}
    //         header={header}
    //         onRemoveCriteriaClick={onRemoveCriteriaClick}
    //     />
    // );

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
