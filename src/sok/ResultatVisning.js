import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Innholdstittel } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import YrkeSearch from './components/YrkeSearch';
import UtdanningSearch from './components/UtdanningSearch';
import ArbeidserfaringSearch from './components/ArbeidserfaringSearch';
import KompetanseSearch from './components/KompetanseSearch';
import GeografiSearch from './components/GeografiSearch';
import KandidaterVisning from './components/KandidaterVisning';
import { INITIAL_SEARCH, SEARCH, SEARCH_BEGIN } from './domene';

class ResultatVisning extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialSearch(props.urlParams);
        window.scrollTo(0, 0);
    }

    onRemoveCriteriaClick = () => {
        this.props.resetQuery({
            yrkeserfaringer: [],
            arbeidserfaringer: [],
            utdanninger: [],
            kompetanser: [],
            sprakList: [],
            sertifikater: [],
            geografiList: [],
            styrkKode: '',
            nusKode: ''
        });
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
                            <Column xs="4">
                                <button
                                    className="lenke lenke--slett--kriterier"
                                    onClick={this.onRemoveCriteriaClick}
                                >
                                    Slett alle kriterier
                                </button>
                                <div className="resultatvisning--sokekriterier">
                                    <YrkeSearch />
                                    <UtdanningSearch />
                                    <ArbeidserfaringSearch />
                                    <KompetanseSearch />
                                    <GeografiSearch />
                                </div>
                            </Column>
                            <Column xs="8">
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
    urlParams: PropTypes.shape({
        yrkeserfaringer: PropTypes.arrayOf(PropTypes.string),
        arbeidserfaringer: PropTypes.arrayOf(PropTypes.string),
        utdanninger: PropTypes.arrayOf(PropTypes.string),
        kompetanser: PropTypes.arrayOf(PropTypes.string),
        sprakList: PropTypes.arrayOf(PropTypes.string),
        sertifikater: PropTypes.arrayOf(PropTypes.string),
        geografiList: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    isInitialSearch: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isInitialSearch: state.isInitialSearch
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SEARCH_BEGIN, query }),
    search: () => dispatch({ type: SEARCH }),
    initialSearch: (query) => dispatch({ type: INITIAL_SEARCH, query })
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultatVisning);
