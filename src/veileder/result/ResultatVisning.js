import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Sidetittel } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import StillingSearch from '../sok/stilling/StillingSearch';
import UtdanningSearch from '../sok/utdanning/UtdanningSearch';
import ArbeidserfaringSearch from '../sok/arbeidserfaring/ArbeidserfaringSearch';
import KompetanseSearch from '../sok/kompetanse/KompetanseSearch';
import GeografiSearch from '../sok/geografi/GeografiSearch';
import SprakSearch from '../sok/sprak/SprakSearch';
import ForerkortSearch from '../sok/forerkort/ForerkortSearch';
import KandidaterVisning from './KandidaterVisning';
import { INITIAL_SEARCH_BEGIN, REMOVE_KOMPETANSE_SUGGESTIONS, SEARCH, SET_STATE } from '../sok/searchReducer';
import './Resultat.less';

class ResultatVisning extends React.Component {
    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
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
            sprak: []
        });
        this.props.removeKompetanseSuggestions();
        this.props.search();
    };

    render() {
        return (
            <div>
                {this.props.isInitialSearch ? (
                    <div className="text-center">
                        <NavFrontendSpinner type="L" />
                    </div>
                ) : (
                    <div>
                        <Container className="blokk-s container--wide">
                            <Row>
                                <Column className="text-center">
                                    <Sidetittel>Aktuelle kandidater</Sidetittel>
                                </Column>
                            </Row>
                            <Row className="resultatvisning--body">
                                <Column xs="12" md="4">
                                    <button
                                        className="lenke lenke--slett--kriterier typo-normal"
                                        id="slett-alle-kriterier-lenke"
                                        onClick={this.onRemoveCriteriaClick}
                                    >
                                        Slett alle kriterier
                                    </button>
                                    <div className="resultatvisning--sokekriterier">
                                        <StillingSearch />
                                        <GeografiSearch />
                                        <UtdanningSearch />
                                        <ArbeidserfaringSearch />
                                        <SprakSearch />
                                        <ForerkortSearch />
                                        <KompetanseSearch />
                                    </div>
                                </Column>
                                <Column xs="12" md="8">
                                    <KandidaterVisning />
                                </Column>
                            </Row>
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
    removeKompetanseSuggestions: PropTypes.func.isRequired,
    isInitialSearch: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isInitialSearch: state.search.isInitialSearch
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    initialSearch: () => { dispatch({ type: INITIAL_SEARCH_BEGIN }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultatVisning);
