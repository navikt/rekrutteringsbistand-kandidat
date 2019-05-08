import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Media from 'react-media';
import { Column, Container } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Flatknapp, Hovedknapp } from 'pam-frontend-knapper';
import StillingSearch from '../sok/stilling/StillingSearch';
import UtdanningSearch from '../sok/utdanning/UtdanningSearch';
import ArbeidserfaringSearch from '../sok/arbeidserfaring/ArbeidserfaringSearch';
import KompetanseSearch from '../sok/kompetanse/KompetanseSearch';
import GeografiSearch from '../sok/geografi/GeografiSearch';
import SprakSearch from '../sok/sprak/SprakSearch';
import SertifikatSearch from '../sok/sertifikat/SertifikatSearch';
import KandidaterVisning from './KandidaterVisning';
import { REMOVE_KOMPETANSE_SUGGESTIONS, SEARCH, MATCH_SEARCH, PERFORM_INITIAL_SEARCH, SET_STATE } from '../sok/searchReducer';
import './Resultat.less';
import ForerkortSearch from '../sok/forerkort/ForerkortSearch';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';
import { LAGRE_STATUS } from '../../felles/konstanter';
import { USE_JANZZ } from '../common/fasitProperties';
import PageHeader from '../../felles/common/PageHeaderWrapper';
import FritekstSearch from '../sok/fritekst/FritekstSearch';
import LenkeTilKandidatsokNext from './LenkeTilKandidatsokNext.tsx';
import Sidetittel from '../../felles/common/Sidetittel';

class ResultatVisning extends React.Component {
    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
        this.state = {
            suksessmeldingLagreKandidatVises: false
        };
    }

    componentDidMount() {
        this.props.performInitialSearch();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.leggTilKandidatStatus !== this.props.leggTilKandidatStatus && this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            this.visAlertstripeLagreKandidater();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.suksessmeldingCallbackId);
    }

    onRemoveCriteriaClick = () => {
        this.props.resetQuery({
            stillinger: [],
            arbeidserfaringer: [],
            utdanninger: [],
            kompetanser: [],
            geografiList: [],
            geografiListKomplett: [],
            totalErfaring: [],
            utdanningsniva: [],
            sprak: [],
            sertifikat: [],
            maaBoInnenforGeografi: false
        });
        this.props.removeKompetanseSuggestions();
        this.props.search();
        if (USE_JANZZ) {
            this.props.matchSearch();
        }
    };

    onMatchClick = () => {
        this.props.matchSearch();
    };

    onMatchClickMedScroll = () => {
        this.onMatchClick();
        window.scrollTo(0, 0);
    };

    visAlertstripeLagreKandidater = () => {
        clearTimeout(this.suksessmeldingCallbackId);
        this.setState({
            suksessmeldingLagreKandidatVises: true
        });
        this.suksessmeldingCallbackId = setTimeout(() => {
            this.setState({
                suksessmeldingLagreKandidatVises: false
            });
        }, 5000);
    };

    render() {
        const { antallLagredeKandidater } = this.props;
        return (
            <div>
                <HjelpetekstFading
                    synlig={this.state.suksessmeldingLagreKandidatVises}
                    type="suksess"
                    tekst={antallLagredeKandidater > 1 ? `${antallLagredeKandidater} kandidater er lagt til` : 'Kandidaten er lagt til'}
                    id="hjelpetekstfading"
                />
                <PageHeader className="ResultatVisning--header-padding">
                    <div className="child-item__container--header">
                        <Sidetittel> {USE_JANZZ ? 'Kandidatmatch' : 'Kandidatsøk'} </Sidetittel>
                    </div>
                </PageHeader>
                {this.props.isInitialSearch ? (
                    <div className="fullscreen-spinner">
                        <NavFrontendSpinner type="L" />
                    </div>
                ) : (
                    <div>
                        <Container className="blokk-s">
                            <Media query={{ 'max-width': 991 }}>
                                {this.props.visLenkeTilKandidatsokNext && !USE_JANZZ && <LenkeTilKandidatsokNext />}
                            </Media>
                            <Column xs="12" md="4">
                                <div className="sokekriterier--column">
                                    <div className="knapp-wrapper">
                                        <Flatknapp
                                            mini
                                            id="slett-alle-kriterier-lenke"
                                            className={USE_JANZZ ? 'knapp-slett-alle-kriterier-lenke' : ''}
                                            onClick={this.onRemoveCriteriaClick}
                                        >
                                            Slett alle kriterier
                                        </Flatknapp>
                                    </div>
                                    {USE_JANZZ ? <Hovedknapp
                                        onClick={this.onMatchClick}
                                        className="send--sokekriterier--knapp"
                                        id="knapp-send--sokekriterier-knapp"
                                        disabled={this.props.isSearching}
                                    >
                                        Finn kandidater
                                    </Hovedknapp> : ''}
                                    <div className="resultatvisning--sokekriterier">
                                        {!USE_JANZZ ? <FritekstSearch /> : ''}
                                        <StillingSearch />
                                        {USE_JANZZ ? <KompetanseSearch /> : ''}
                                        <GeografiSearch />
                                        <UtdanningSearch />
                                        <ArbeidserfaringSearch />
                                        <SprakSearch />
                                        <ForerkortSearch />
                                        {USE_JANZZ ? <SertifikatSearch /> : ''}
                                        {!USE_JANZZ ? <KompetanseSearch /> : ''}
                                    </div>
                                    {USE_JANZZ ?
                                        <Hovedknapp
                                            onClick={this.onMatchClickMedScroll}
                                            className="send--sokekriterier--knapp"
                                            id="knapp-send--sokekriterier-knapp2"
                                            disabled={this.props.isSearching}
                                        >
                                            Finn kandidater
                                        </Hovedknapp> : ''}
                                </div>
                            </Column>
                            <Column xs="12" md="8">
                                <Media query={{ 'min-width': 992 }}>
                                    {this.props.visLenkeTilKandidatsokNext && !USE_JANZZ && <LenkeTilKandidatsokNext />}
                                </Media>
                                <KandidaterVisning />
                            </Column>
                        </Container>
                    </div>
                )}
            </div>
        );
    }
}

ResultatVisning.propTypes = {
    resetQuery: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    matchSearch: PropTypes.func.isRequired,
    performInitialSearch: PropTypes.func.isRequired,
    removeKompetanseSuggestions: PropTypes.func.isRequired,
    isInitialSearch: PropTypes.bool.isRequired,
    leggTilKandidatStatus: PropTypes.string.isRequired,
    antallLagredeKandidater: PropTypes.number.isRequired,
    isSearching: PropTypes.bool.isRequired,
    visLenkeTilKandidatsokNext: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isInitialSearch: state.search.isInitialSearch,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    antallLagredeKandidater: state.kandidatlister.leggTilKandidater.antallLagredeKandidater,
    isSearching: state.search.isSearching,
    visLenkeTilKandidatsokNext: state.search.featureToggles['vis-lenke-til-kandidatsok-next']
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    matchSearch: () => dispatch({ type: MATCH_SEARCH }),
    performInitialSearch: () => dispatch({ type: PERFORM_INITIAL_SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS })
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultatVisning);
