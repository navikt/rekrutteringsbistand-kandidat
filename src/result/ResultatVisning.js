import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Innholdstittel } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import StillingSearch from '../sok/stilling/StillingSearch';
import UtdanningSearch from '../sok/utdanning/UtdanningSearch';
import ArbeidserfaringSearch from '../sok/arbeidserfaring/ArbeidserfaringSearch';
import KompetanseSearch from '../sok/kompetanse/KompetanseSearch';
import GeografiSearch from '../sok/geografi/GeografiSearch';
import KandidaterVisning from './KandidaterVisning';
import { REMOVE_KOMPETANSE_SUGGESTIONS, INITIAL_SEARCH, SEARCH, SET_STATE } from '../sok/domene';
import './Resultat.less';

class ResultatVisning extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialSearch();
        window.scrollTo(0, 0);
    }

    onRemoveCriteriaClick = () => {
        this.props.resetQuery({
            stillinger: [],
            arbeidserfaringer: [],
            utdanninger: [],
            kompetanser: [],
            geografiList: [],
            geografiListKomplett: [],
            totalErfaring: '',
            utdanningsniva: []
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
                    <Container className="blokk-s container--wide">
                        <Row>
                            <Column className="text-center">
                                <Innholdstittel>Aktuelle kandidater</Innholdstittel>
                            </Column>
                        </Row>
                        <Row className="resultatvisning--body">
                            <Column xs="12" md="4">
                                <button
                                    className="lenke lenke--slett--kriterier"
                                    onClick={this.onRemoveCriteriaClick}
                                >
                                    Slett alle kriterier
                                </button>
                                <div className="resultatvisning--sokekriterier">
                                    <StillingSearch />
                                    <UtdanningSearch />
                                    <ArbeidserfaringSearch />
                                    <KompetanseSearch />
                                    <GeografiSearch />
                                </div>
                            </Column>
                            <Column xs="12" md="8">
                                <KandidaterVisning />
                            </Column>
                        </Row>
                    </Container>
                )}
            </div>
        );
    }
}

ResultatVisning.propTypes = {
    initialSearch: PropTypes.func.isRequired,
    resetQuery: PropTypes.func.isRequired,
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
    initialSearch: (query) => dispatch({ type: INITIAL_SEARCH, query }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS })
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultatVisning);
