import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { SEARCH, SØK_MED_URL_PARAMETERE } from './reducer/searchReducer';
import { FellesKandidatsøkProps } from './FellesKandidatsøk';
import { harUrlParametere } from './reducer/searchQuery';
import { Kandidatsøk } from './Kandidatsøk';
import { KandidaterErLagretSuksessmelding } from './KandidaterErLagretSuksessmelding';
import { Kandidatliste } from '../kandidatliste/kandidatlistetyper';
import { KandidatlisteHeader } from './headers/KandidatlisteHeader';
import { Nettstatus } from '../api/remoteData';
import AppState from '../AppState';
import useKandidatliste from './useKandidatliste';
import useNullstillKandidatlisteState from './useNullstillKandidatlistestate';
import './Resultat.less';

type Props = FellesKandidatsøkProps & {
    kandidatliste: Kandidatliste | undefined;
    match: {
        params: {
            kandidatlisteId: string;
        };
    };
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId: string) => void;
    kandidatlisteIdFraSøk?: string;
    fjernValgtKandidat: () => void;
    nullstillKandidaterErLagretIKandidatlisteAlert: () => void;
};

const KandidatsøkForKandidatliste: FunctionComponent<Props> = ({
    match,
    search,
    kandidatliste,
    leggUrlParametereIStateOgSøk,
    kandidatlisteIdFraSøk,
}) => {
    const kandidatlisteId = match.params.kandidatlisteId;
    useNullstillKandidatlisteState();
    useKandidatliste(undefined, kandidatlisteId);

    useEffect(() => {
        const søkestateKommerFraDenneKandidatlisten =
            !!kandidatlisteIdFraSøk && kandidatlisteIdFraSøk === kandidatlisteId;

        const skalSøkeMedEksisterendeSøkestate =
            !harUrlParametere(window.location.href) && søkestateKommerFraDenneKandidatlisten;

        if (skalSøkeMedEksisterendeSøkestate) {
            search();
        } else {
            leggUrlParametereIStateOgSøk(window.location.href, kandidatlisteId);
        }
    }, [kandidatlisteId, kandidatlisteIdFraSøk, leggUrlParametereIStateOgSøk, search]);

    return (
        <>
            <KandidaterErLagretSuksessmelding />
            <Kandidatsøk
                kandidatlisteId={kandidatlisteId}
                header={<KandidatlisteHeader kandidatliste={kandidatliste} />}
            />
        </>
    );
};

const mapStateToProps = (state: AppState) => ({
    kandidatliste:
        state.kandidatliste.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatliste.kandidatliste.data
            : undefined,
    kandidatlisteIdFraSøk: state.søk.kandidatlisteId,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId: string) =>
        dispatch({ type: SØK_MED_URL_PARAMETERE, href, kandidatlisteId }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatsøkForKandidatliste);
