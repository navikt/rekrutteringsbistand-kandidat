import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Element, Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import { Column, Container } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import KnappBase from 'nav-frontend-knapper';
import StillingSearch from '../sok/stilling/StillingSearch';
import UtdanningSearch from '../sok/utdanning/UtdanningSearch';
import ArbeidserfaringSearch from '../sok/arbeidserfaring/ArbeidserfaringSearch';
import KompetanseSearch from '../sok/kompetanse/KompetanseSearch';
import GeografiSearch from '../sok/geografi/GeografiSearch';
import SprakSearch from '../sok/sprak/SprakSearch';
import ForerkortSearch from '../sok/forerkort/ForerkortSearch';
import KandidaterVisning from './KandidaterVisning';
import { INITIAL_SEARCH_BEGIN, REMOVE_KOMPETANSE_SUGGESTIONS, SEARCH, MATCH_SEARCH, SET_STATE } from '../sok/searchReducer';
import './Resultat.less';
import { USE_JANZZ } from '../common/fasitProperties';
import ListeIkon from '../../felles/common/ikoner/ListeIkon';

class ResultatVisning extends React.Component {
    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
        this.state = {
            suksessmeldingLagreKandidatVises: false
        };
    }

    componentDidMount() {
        this.props.initialSearch();
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

    render() {
        return (
            <div>
                <div className="ResultatVisning--hovedside--header">
                    <Container className="container--header">
                        <div className="child-item__container--header">
                            <div className="no-content" />
                        </div>
                        <div className="child-item__container--header">
                            <Sidetittel> Kandidatsøk </Sidetittel>
                        </div>
                        <div className="child-item__container--header lenke--lagrede-kandidatlister">
                            <div className="ikonlenke">
                                <ListeIkon fargeKode="white" className="ListeIkon" />
                                <Link to={'/kandidater/lister'} className="lenke">
                                    <Normaltekst>Lagrede kandidatlister</Normaltekst>
                                </Link>
                            </div>
                        </div>
                    </Container>
                </div>
                {this.props.isInitialSearch ? (
                    <div className="fullscreen-spinner">
                        <NavFrontendSpinner type="L" />
                    </div>
                ) : (
                    <div>
                        <Container className="blokk-s">
                            <Column xs="12" md="4">
                                <div className="sokekriterier--column">
                                    <div className="knapp-wrapper">
                                        <KnappBase
                                            mini
                                            type="flat"
                                            className="lenke lenke--slett--kriterier typo-normal"
                                            id="slett-alle-kriterier-lenke"
                                            onClick={this.onRemoveCriteriaClick}
                                        >
                                            <Element>
                                                Slett alle kriterier
                                            </Element>
                                        </KnappBase>
                                    </div>
                                    {USE_JANZZ ? <KnappBase
                                        type="hoved"
                                        onClick={this.onMatchClick}
                                        className="send--sokekriterier--knapp"
                                        id="knapp-send--sokekriterier-knapp"
                                    >
                                        Finn kandidater
                                    </KnappBase> : ''}
                                    <div className="resultatvisning--sokekriterier">
                                        <StillingSearch />
                                        <GeografiSearch />
                                        <UtdanningSearch />
                                        <ArbeidserfaringSearch />
                                        <SprakSearch />
                                        <ForerkortSearch />
                                        <KompetanseSearch />
                                    </div>
                                </div>
                            </Column>
                            <Column xs="12" md="8">
                                <div className="kandidatervisning--column">
                                    <KandidaterVisning />
                                </div>
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
    initialSearch: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    matchSearch: PropTypes.func.isRequired,
    removeKompetanseSuggestions: PropTypes.func.isRequired,
    isInitialSearch: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isInitialSearch: state.search.isInitialSearch
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    matchSearch: () => dispatch({ type: MATCH_SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    initialSearch: () => { dispatch({ type: INITIAL_SEARCH_BEGIN }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultatVisning);
