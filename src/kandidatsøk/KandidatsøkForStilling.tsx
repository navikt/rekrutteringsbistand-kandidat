import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { SEARCH, SØK_MED_INFO_FRA_STILLING, SØK_MED_URL_PARAMETERE } from './reducer/searchReducer';
import { FellesKandidatsøkProps } from './FellesKandidatsøk';
import { harUrlParametere } from './reducer/searchQuery';
import { KandidaterErLagretSuksessmelding } from './KandidaterErLagretSuksessmelding';
import { Kandidatliste } from '../kandidatliste/kandidatlistetyper';
import { KandidatlisteHeader } from './headers/KandidatlisteHeader';
import { Kandidatsøk } from './Kandidatsøk';
import { Nettstatus } from '../api/remoteData';
import AppState from '../AppState';
import useKandidatliste from './useKandidatliste';
import useNullstillKandidatlisteState from './useNullstillKandidatlistestate';
import './Resultat.less';

type Props = FellesKandidatsøkProps & {
    maksAntallTreff: number;
    kandidatliste: Kandidatliste | undefined;
    match: {
        params: {
            stillingsId: string;
        };
    };
    leggInfoFraStillingIStateOgSøk: (stillingsId: string, kandidatlisteId?: string) => void;
    hentKandidatlisteMedStillingsId: (stillingsId: string) => void;
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId?: string) => void;
    kandidatlisteIdFraSøk: string;
};

const KandidatsøkForStilling: FunctionComponent<Props> = ({
    match,
    kandidatliste,
    leggInfoFraStillingIStateOgSøk,
    leggUrlParametereIStateOgSøk,
    maksAntallTreff,
}) => {
    const stillingsIdFraUrl = match.params.stillingsId;
    useNullstillKandidatlisteState();
    useKandidatliste(stillingsIdFraUrl);

    useEffect(() => {
        if (harUrlParametere(window.location.href)) {
            leggUrlParametereIStateOgSøk(window.location.href, kandidatliste?.kandidatlisteId);
        } else {
            leggInfoFraStillingIStateOgSøk(stillingsIdFraUrl, kandidatliste?.kandidatlisteId);
        }
    }, [
        kandidatliste,
        stillingsIdFraUrl,
        leggInfoFraStillingIStateOgSøk,
        leggUrlParametereIStateOgSøk,
    ]);

    return (
        <>
            <KandidaterErLagretSuksessmelding />
            <Kandidatsøk
                visFantFåKandidater={maksAntallTreff < 5}
                stillingsId={stillingsIdFraUrl}
                header={
                    <KandidatlisteHeader
                        kandidatliste={kandidatliste}
                        stillingsId={stillingsIdFraUrl}
                    />
                }
            />
        </>
    );
};

const mapStateToProps = (state: AppState) => ({
    kandidatliste:
        state.kandidatliste.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatliste.kandidatliste.data
            : undefined,
    maksAntallTreff: state.søk.maksAntallTreff,
    kandidatlisteIdFraSøk: state.søk.kandidatlisteId,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    leggInfoFraStillingIStateOgSøk: (stillingsId: string, kandidatlisteId?: string) =>
        dispatch({ type: SØK_MED_INFO_FRA_STILLING, stillingsId, kandidatlisteId }),
    leggUrlParametereIStateOgSøk: (href: string, kandidatlisteId?: string) =>
        dispatch({ type: SØK_MED_URL_PARAMETERE, href, kandidatlisteId }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatsøkForStilling);
