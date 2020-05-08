import React from 'react';
import { connect } from 'react-redux';
import {
    INITIAL_SEARCH_BEGIN,
    LUKK_ALLE_SOKEPANEL,
    REMOVE_KOMPETANSE_SUGGESTIONS,
    SEARCH,
    SET_STATE,
} from '../sok/searchReducer';
import './Resultat.less';
import { LAGRE_STATUS } from '../../felles/konstanter';
import { Nettstatus } from '../../felles/common/remoteData';
import KandidatlisteActionType from '../kandidatlister/reducer/KandidatlisteActionType';
import { Kandidatliste } from '../kandidatlister/kandidatlistetyper';
import { Kandidatsøk } from './Kandidatsøk';
import { VeilederHeaderInfo } from './VeilederHeaderInfo';
import Sidetittel from '../../felles/common/Sidetittel';
import { Container } from 'nav-frontend-grid';
import { hentQueryUtenKriterier } from './ResultatVisning';

interface Props {
    resetQuery: (query: any) => void;
    initialSearch: (stillingsId: string | undefined, kandidatlisteId: string | undefined) => void;
    totaltAntallTreff: number;
    maksAntallTreff: number;
    search: () => void;
    removeKompetanseSuggestions: () => void;
    isInitialSearch: boolean;
    leggTilKandidatStatus: string;
    antallLagredeKandidater: number;
    lagretKandidatliste: {
        kandidatlisteId: string;
        tittel: string;
    };
    harHentetStilling: boolean;
    kandidatliste: Kandidatliste | undefined;
    match: {
        params: {
            kandidatlisteId?: string;
            stillingsId?: string;
        };
    };
    resetKandidatlisterSokekriterier: () => void;
    lukkAlleSokepanel: () => void;
}

interface State {
    suksessmeldingLagreKandidatVises: boolean;
}

class KandidatsøkFraKandidatliste extends React.Component<Props, State> {
    suksessmeldingCallbackId: any;

    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
        this.state = {
            suksessmeldingLagreKandidatVises: false,
        };
    }

    componentDidMount() {
        const { kandidatlisteId } = this.props.match.params;
        this.props.initialSearch(undefined, kandidatlisteId);
        this.props.resetKandidatlisterSokekriterier();
    }

    componentDidUpdate(prevProps) {
        const { leggTilKandidatStatus, match, initialSearch } = this.props;

        if (
            prevProps.leggTilKandidatStatus !== leggTilKandidatStatus &&
            leggTilKandidatStatus === LAGRE_STATUS.SUCCESS
        ) {
            this.visAlertstripeLagreKandidater();
        }
        if (prevProps.match.params.kandidatlisteId !== match.params.kandidatlisteId) {
            initialSearch(undefined, match.params.kandidatlisteId);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.suksessmeldingCallbackId);
    }

    onRemoveCriteriaClick = () => {
        this.props.lukkAlleSokepanel();
        this.props.resetQuery(hentQueryUtenKriterier(this.props.harHentetStilling));
        this.props.removeKompetanseSuggestions();
        this.props.search();
    };

    visAlertstripeLagreKandidater = () => {
        clearTimeout(this.suksessmeldingCallbackId);
        this.setState({
            suksessmeldingLagreKandidatVises: true,
        });
        this.suksessmeldingCallbackId = setTimeout(() => {
            this.setState({
                suksessmeldingLagreKandidatVises: false,
            });
        }, 5000);
    };

    render() {
        const {
            match,
            isInitialSearch,
            lagretKandidatliste,
            kandidatliste,
            antallLagredeKandidater,
        } = this.props;
        const kandidatlisteId = match.params.kandidatlisteId;

        const header = (
            <Container className="container--header">
                <VeilederHeaderInfo kandidatliste={kandidatliste} />
                <div className="container--header__lenker">
                    {kandidatliste && (
                        <a
                            className="TilKandidater"
                            href={`/kandidater/lister/detaljer/${kandidatliste.kandidatlisteId}`}
                        >
                            <i className="TilKandidater__icon" />
                            <span className="link">Se kandidatliste</span>
                        </a>
                    )}
                </div>
            </Container>
        );

        return (
            <Kandidatsøk
                antallLagredeKandidater={antallLagredeKandidater}
                lagretKandidatliste={lagretKandidatliste}
                kandidatlisteId={kandidatlisteId}
                visSpinner={isInitialSearch}
                suksessmeldingLagreKandidatVises={this.state.suksessmeldingLagreKandidatVises}
                header={header}
            />
        );
    }
}

const mapStateToProps = (state) => ({
    isInitialSearch: state.search.isInitialSearch,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    maksAntallTreff: state.search.maksAntallTreff,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    antallLagredeKandidater: state.kandidatlister.leggTilKandidater.antallLagredeKandidater,
    lagretKandidatliste: state.kandidatlister.leggTilKandidater.lagretListe,
    harHentetStilling: state.search.harHentetStilling,
    kandidatliste:
        state.kandidatlister.detaljer.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatlister.detaljer.kandidatliste.data
            : undefined,
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    initialSearch: (stillingsId, kandidatlisteId) => {
        dispatch({ type: INITIAL_SEARCH_BEGIN, stillingsId, kandidatlisteId });
    },
    resetKandidatlisterSokekriterier: () => {
        dispatch({ type: KandidatlisteActionType.RESET_KANDIDATLISTER_SOKEKRITERIER });
    },
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatsøkFraKandidatliste);
