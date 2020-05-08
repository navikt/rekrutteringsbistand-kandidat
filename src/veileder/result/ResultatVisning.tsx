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

export const hentQueryUtenKriterier = (harHentetStilling) => ({
    fritekst: '',
    stillinger: [],
    arbeidserfaringer: [],
    utdanninger: [],
    kompetanser: [],
    geografiList: [],
    geografiListKomplett: [],
    totalErfaring: [],
    utdanningsniva: [],
    sprak: [],
    kvalifiseringsgruppeKoder: [],
    maaBoInnenforGeografi: false,
    harHentetStilling: harHentetStilling,
});

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

class ResultatVisning extends React.Component<Props, State> {
    suksessmeldingCallbackId: any;

    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
        this.state = {
            suksessmeldingLagreKandidatVises: false,
        };
    }

    componentDidMount() {
        const { stillingsId, kandidatlisteId } = this.props.match.params;
        this.props.initialSearch(stillingsId, kandidatlisteId);
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
            initialSearch(match.params.stillingsId, match.params.kandidatlisteId);
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
        if (this.props.match.params.kandidatlisteId || this.props.match.params.stillingsId) {
            clearTimeout(this.suksessmeldingCallbackId);
            this.setState({
                suksessmeldingLagreKandidatVises: true,
            });
            this.suksessmeldingCallbackId = setTimeout(() => {
                this.setState({
                    suksessmeldingLagreKandidatVises: false,
                });
            }, 5000);
        }
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
        const stillingsId = match.params.stillingsId;

        const visFantFåKandidater = !!(stillingsId && this.props.maksAntallTreff < 5);

        let headerLenke;
        if (stillingsId) {
            headerLenke = (
                <a className="SeStilling" href={`/stilling/${stillingsId}`}>
                    <i className="SeStilling__icon" />
                    <span className="link">Se stilling</span>
                </a>
            );
        } else if (kandidatliste) {
            headerLenke = (
                <a
                    className="TilKandidater"
                    href={`/kandidater/lister/detaljer/${kandidatliste.kandidatlisteId}`}
                >
                    <i className="TilKandidater__icon" />
                    <span className="link">Se kandidatliste</span>
                </a>
            );
        }

        const header =
            kandidatlisteId || stillingsId ? (
                <Container className="container--header">
                    <VeilederHeaderInfo kandidatliste={kandidatliste} stillingsId={stillingsId} />
                    <div className="container--header__lenker"><a className="SeStilling" href={`/stilling/${stillingsId}`}>
                        <i className="SeStilling__icon" />
                        <span className="link">Se stilling</span>
                    </a></div>
                </Container>
            ) : (
                <Container className="container--header--uten-stilling">
                    <Sidetittel> Kandidatsøk </Sidetittel>
                </Container>
            );

        return (
            <Kandidatsøk
                visFantFåKandidater={visFantFåKandidater}
                antallLagredeKandidater={antallLagredeKandidater}
                lagretKandidatliste={lagretKandidatliste}
                kandidatlisteId={kandidatlisteId}
                stillingsId={stillingsId}
                visSpinner={isInitialSearch}
                suksessmeldingLagreKandidatVises={this.state.suksessmeldingLagreKandidatVises}
                header={header}
                onRemoveCriteriaClick={this.onRemoveCriteriaClick}
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

export default connect(mapStateToProps, mapDispatchToProps)(ResultatVisning);
