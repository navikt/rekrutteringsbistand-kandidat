import React from 'react';
import { connect } from 'react-redux';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Container } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Flatknapp } from 'nav-frontend-knapper';
import NavFrontendChevron from 'nav-frontend-chevron';
import StillingSearch from '../sok/stilling/StillingSearch';
import UtdanningSearch from '../sok/utdanning/UtdanningSearch';
import ArbeidserfaringSearch from '../sok/arbeidserfaring/ArbeidserfaringSearch';
import KompetanseSearch from '../sok/kompetanse/KompetanseSearch';
import GeografiSearch from '../sok/geografi/GeografiSearch';
import SprakSearch from '../sok/sprak/SprakSearch';
import ForerkortSearch from '../sok/forerkort/ForerkortSearch';
import KandidaterVisning from './KandidaterVisning';
import NavkontorSearch from '../sok/navkontor/NavkontorSearch';
import HovedmalSearch from '../sok/hovedmal/HovedmalSearch';
import TilretteleggingsbehovSearch from '../sok/tilretteleggingsbehov/TilretteleggingsbehovSearch';
import {
    INITIAL_SEARCH_BEGIN,
    LUKK_ALLE_SOKEPANEL,
    REMOVE_KOMPETANSE_SUGGESTIONS,
    SEARCH,
    SET_STATE,
} from '../sok/searchReducer';
import './Resultat.less';
import { LAGRE_STATUS } from '../../felles/konstanter';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';
import { capitalizeEmployerName } from '../../felles/sok/utils';
import InnsatsgruppeSearch from '../sok/innsatsgruppe/InnsatsgruppeSearch';
import Sidetittel from '../../felles/common/Sidetittel';
import { Nettstatus } from '../../felles/common/remoteData';
import FantFåKandidater from './fant-få-kandidater/FantFåKandidater';
import KandidatlisteActionType from '../kandidatlister/reducer/KandidatlisteActionType';
import ViktigeYrker from './viktigeyrker/ViktigeYrker';
import PermitteringSearch from '../sok/permittering/PermitteringSearch';
import TilgjengelighetSearch from '../sok/tilgjengelighet/TilgjengelighetSearch';
import { Kandidatliste } from '../kandidatlister/kandidatlistetyper';
import FritekstSearch from '../sok/fritekst/FritekstSearch';
import { VeilederHeaderInfo } from './VeilederHeaderInfo';

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
    resetQuery: (query: any /* TODO Finnes denne typen et sted? */) => void;
    initialSearch: (stillingsId: string | undefined, kandidatlisteId: string | undefined) => void;
    totaltAntallTreff: number;
    maksAntallTreff: number;
    search: () => void;
    removeKompetanseSuggestions: () => void;
    isInitialSearch: boolean;
    leggTilKandidatStatus: string; // TODO Dette er av typen LAGRE_STATUS
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

        const HeaderLinker = () => (
            <div className="container--header__lenker">
                {stillingsId && (
                    <a className="SeStilling" href={`/stilling/${stillingsId}`}>
                        <i className="SeStilling__icon" />
                        <span className="link">Se stilling</span>
                    </a>
                )}
                {kandidatliste && <a
                    className="TilKandidater"
                    href={`/kandidater/lister/detaljer/${kandidatliste.kandidatlisteId}`}
                >
                    <i className="TilKandidater__icon" />
                    <span className="link">Se kandidatliste</span>
                </a>}
            </div>
        );

        const visFantFåKandidater = stillingsId && this.props.maksAntallTreff < 5;

        return (
            <div>
                <HjelpetekstFading
                    synlig={this.state.suksessmeldingLagreKandidatVises}
                    type="suksess"
                    innhold={`${
                        antallLagredeKandidater > 1
                            ? `${antallLagredeKandidater} kandidater`
                            : 'Kandidaten'
                    } er lagret i kandidatlisten «${lagretKandidatliste.tittel}»`}
                    id="hjelpetekstfading"
                />
                <div className="ResultatVisning--hovedside--header">
                    {kandidatlisteId || stillingsId ? (
                        <Container className="container--header">
                            <VeilederHeaderInfo
                                kandidatliste={kandidatliste}
                                stillingsId={stillingsId}
                            />
                            <HeaderLinker />
                        </Container>
                    ) : (
                        <Container className="container--header--uten-stilling">
                            <Sidetittel> Kandidatsøk </Sidetittel>
                        </Container>
                    )}
                </div>
                {isInitialSearch ? (
                    <div className="fullscreen-spinner">
                        <NavFrontendSpinner type="L" />
                    </div>
                ) : (
                    <div>
                        <Container className="blokk-l">
                            <ViktigeYrker />
                            <Column xs="12" sm="4" id="sokekriterier">
                                <div className="sokekriterier--column">
                                    <div className="knapp-wrapper">
                                        <Flatknapp
                                            mini
                                            id="slett-alle-kriterier-lenke"
                                            onClick={this.onRemoveCriteriaClick}
                                        >
                                            Slett alle kriterier
                                        </Flatknapp>
                                    </div>
                                    <div className="resultatvisning--sokekriterier">
                                        <FritekstSearch />
                                        <StillingSearch stillingsId={stillingsId} />
                                        <GeografiSearch stillingsId={stillingsId} />
                                        <PermitteringSearch />
                                        <TilgjengelighetSearch />
                                        <UtdanningSearch />
                                        <ArbeidserfaringSearch />
                                        <SprakSearch />
                                        <ForerkortSearch />
                                        <KompetanseSearch />
                                        <NavkontorSearch />
                                        <HovedmalSearch />
                                        <InnsatsgruppeSearch />
                                        <TilretteleggingsbehovSearch />
                                    </div>
                                </div>
                            </Column>
                            <Column xs="12" sm="8" id="sokeresultat">
                                <div className="kandidatervisning--column">
                                    <KandidaterVisning
                                        skjulPaginering={visFantFåKandidater}
                                        kandidatlisteId={kandidatlisteId}
                                        stillingsId={stillingsId}
                                    />
                                    {visFantFåKandidater && <FantFåKandidater />}
                                </div>
                            </Column>
                        </Container>
                    </div>
                )}
            </div>
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
