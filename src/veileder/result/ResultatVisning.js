import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Sidetittel, Normaltekst } from 'nav-frontend-typografi';
import { Row, Column, Container } from 'nav-frontend-grid';
import Lenke from 'nav-frontend-lenker';
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
import { INITIAL_SEARCH_BEGIN, REMOVE_KOMPETANSE_SUGGESTIONS, SEARCH, SET_STATE } from '../sok/searchReducer';
import './Resultat.less';

class ResultatVisning extends React.Component {
    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
        this.state = {
            suksessmeldingLagreKandidatVises: false
        };
    }

    componentDidMount() {
        const { stillingsId } = this.props.match.params;
        this.props.initialSearch(stillingsId);
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
            maaBoInnenforGeografi: false,
            harHentetStilling: this.props.harHentetStilling
        });
        this.props.removeKompetanseSuggestions();
        this.props.search();
    };

    render() {
        const { match, isInitialSearch, annonseoverskrift, arbeidsgiver, annonseOpprettetAvNavn, annonseOpprettetAvIdent } = this.props;
        const stillingsId = match.params.stillingsId;
        return (
            <div>
                <div className="ResultatVisning--hovedside--header">
                    {stillingsId ? (
                        <Container className="container--header">
                            <div className="child-item__container--header">
                                <div>
                                    <Row className="header__row--veileder">
                                        <Sidetittel>Søk etter kandidater til stilling</Sidetittel>
                                    </Row>
                                    <Row className="header__row--veileder">
                                        <Lenke href="/kandidater">{annonseoverskrift}</Lenke>
                                    </Row>
                                    <Row className="header__row--veileder">
                                        <div className="opprettet-av__row">
                                            <Normaltekst>Arbeidsgiver: {`${arbeidsgiver}`}</Normaltekst>
                                            <Normaltekst>Registrert av: {annonseOpprettetAvNavn} ({annonseOpprettetAvIdent})</Normaltekst>
                                        </div>
                                    </Row>
                                </div>
                            </div>
                        </Container>
                    ) : (
                        <Container className="container--header--uten-stilling">
                            <div className="child-item__container--header">
                                <Sidetittel> Kandidatsøk </Sidetittel>
                            </div>
                        </Container>
                    )}
                </div>
                {isInitialSearch ? (
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
                                    <KandidaterVisning stillingsId={stillingsId} />
                                </div>
                            </Column>
                        </Container>
                    </div>
                )}
            </div>
        );
    }
}

ResultatVisning.defaultProps = {
    annonseoverskrift: undefined,
    arbeidsgiver: undefined,
    annonseOpprettetAvNavn: undefined,
    annonseOpprettetAvIdent: undefined,
    match: {
        params: {
            stillingsId: undefined
        }
    }
};

ResultatVisning.propTypes = {
    resetQuery: PropTypes.func.isRequired,
    initialSearch: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    removeKompetanseSuggestions: PropTypes.func.isRequired,
    isInitialSearch: PropTypes.bool.isRequired,
    harHentetStilling: PropTypes.bool.isRequired,
    annonseoverskrift: PropTypes.string,
    arbeidsgiver: PropTypes.string,
    annonseOpprettetAvNavn: PropTypes.string,
    annonseOpprettetAvIdent: PropTypes.string,
    match: PropTypes.shape({
        params: PropTypes.shape({
            stillingsId: PropTypes.string
        })
    })
};

const mapStateToProps = (state) => ({
    isInitialSearch: state.search.isInitialSearch,
    harHentetStilling: state.search.harHentetStilling,
    annonseoverskrift: state.search.annonseoverskrift,
    arbeidsgiver: state.search.arbeidsgiver,
    annonseOpprettetAvNavn: state.search.annonseOpprettetAvNavn,
    annonseOpprettetAvIdent: state.search.annonseOpprettetAvIdent
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    initialSearch: (stillingsId) => { dispatch({ type: INITIAL_SEARCH_BEGIN, stillingsId }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultatVisning);
