/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Media from 'react-media';
import { Sidetittel, Normaltekst } from 'nav-frontend-typografi';
import { Row, Column, Container } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Flatknapp } from 'nav-frontend-knapper';
import NavFrontendChevron from 'nav-frontend-chevron';
import Lenke from 'nav-frontend-lenker';
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
import { LAGRE_STATUS } from '../../felles/konstanter';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';
import { capitalizeEmployerName } from '../../felles/sok/utils';
import InnsatsgruppeSearch from '../sok/innsatsgruppe/InnsatsgruppeSearch';
import FritekstSearch from '../sok/fritekst/FritekstSearch';

class ResultatVisning extends React.Component {
    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
        this.state = {
            suksessmeldingLagreKandidatVises: false,
            lagreSuksessmeldingText: ''
        };
    }

    componentDidMount() {
        const { stillingsId } = this.props.match.params;
        this.props.initialSearch(stillingsId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.leggTilKandidatStatus !== this.props.leggTilKandidatStatus && this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            let suksessmeldingText;
            if (this.props.match.params.stillingsId) {
                suksessmeldingText = this.props.antallLagredeKandidater > 1
                    ? `${this.props.antallLagredeKandidater} kandidater er lagt til i kandidatlisten «${this.props.stillingsoverskrift}»`
                    : `Kandidaten er lagt til i kandidatlisten «${this.props.stillingsoverskrift}»`;
            } else {
                suksessmeldingText = this.props.antallLagredeKandidater > 1
                    ? `${this.props.antallLagredeKandidater} kandidater er lagt til`
                    : 'Kandidaten er lagt til';
            }
            this.setState({ lagreSuksessmeldingText: suksessmeldingText });
            this.visAlertstripeLagreKandidater();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.suksessmeldingCallbackId);
    }

    onRemoveCriteriaClick = () => {
        this.props.resetQuery({
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
            harHentetStilling: this.props.harHentetStilling
        });
        this.props.removeKompetanseSuggestions();
        this.props.search();
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
        const { match, isInitialSearch, stillingsoverskrift, arbeidsgiver, annonseOpprettetAvNavn, annonseOpprettetAvIdent } = this.props;
        const stillingsId = match.params.stillingsId;

        const LinkTilMineStillinger = () => (
            <div className="container--header__lenke--mine-stillinger">
                <Lenke href="/minestillinger">
                    <NavFrontendChevron type="venstre" />Til mine stillinger
                </Lenke>
            </div>
        );

        const VeilederHeader = () => (
            <div className="child-item__container--header">
                <div>
                    <Row className="header__row--veileder">
                        <Sidetittel>Søk etter kandidater til stilling</Sidetittel>
                    </Row>
                    <Row className="header__row--veileder">
                        <Lenke href={`/stilling/${stillingsId}`}>
                            <span>{stillingsoverskrift}</span>
                        </Lenke>
                    </Row>
                    <Row className="header__row--veileder">
                        <div className="opprettet-av__row">
                            <Normaltekst>Arbeidsgiver: {`${capitalizeEmployerName(arbeidsgiver)}`}</Normaltekst>
                            <Normaltekst>Registrert av: {annonseOpprettetAvNavn} ({annonseOpprettetAvIdent})</Normaltekst>
                        </div>
                    </Row>
                </div>
            </div>
        );

        const LinkSeKandidatliste = () => (
            <div className="container--header__lenke--kandidatliste">
                <Link className="TilKandidater" to={`/kandidater/lister/stilling/${stillingsId}/detaljer`}>
                    <i className="TilKandidater__icon" />
                    <span className="lenke">Se kandidatliste</span>
                </Link>
            </div>
        );

        return (
            <div>
                <HjelpetekstFading
                    synlig={this.state.suksessmeldingLagreKandidatVises}
                    type="suksess"
                    tekst={this.state.lagreSuksessmeldingText}
                    id="hjelpetekstfading"
                />
                <div className="ResultatVisning--hovedside--header">
                    {stillingsId ? (
                        <Media query="(max-width: 991px)">
                            {(matches) =>
                                (matches ? (
                                    <Container className="container--header">
                                        <div className="header--links">
                                            <LinkTilMineStillinger />
                                            <LinkSeKandidatliste />
                                        </div>
                                        <div>
                                            <VeilederHeader />
                                            <FritekstSearch />
                                        </div>
                                    </Container>
                                ) : (
                                    <div>
                                        <Container className="container--header">
                                            <LinkTilMineStillinger />
                                            <VeilederHeader />
                                            <LinkSeKandidatliste />
                                        </Container>
                                        <FritekstSearch />
                                    </div>
                                ))
                            }
                        </Media>
                    ) : (
                        <div>
                            <Container className="container--header--uten-stilling">
                                <div className="child-item__container--header">
                                    <Sidetittel> Kandidatsøk </Sidetittel>
                                </div>
                            </Container>
                            <FritekstSearch />
                        </div>
                    )}
                </div>
                {isInitialSearch ? (
                    <div className="fullscreen-spinner">
                        <NavFrontendSpinner type="L" />
                    </div>
                ) : (
                    <div>
                        <Container className="blokk-l">
                            <Column xs="12" sm="4">
                                <div className="sokekriterier--column">
                                    <div className="knapp-wrapper">
                                        <Flatknapp
                                            mini
                                            className="lenke--slett--kriterier"
                                            id="slett-alle-kriterier-lenke"
                                            onClick={this.onRemoveCriteriaClick}
                                        >
                                            Slett alle kriterier
                                        </Flatknapp>
                                    </div>
                                    <div className="resultatvisning--sokekriterier">
                                        <StillingSearch stillingsId={stillingsId} />
                                        <GeografiSearch />
                                        <UtdanningSearch />
                                        <ArbeidserfaringSearch />
                                        <SprakSearch />
                                        <ForerkortSearch />
                                        <KompetanseSearch />
                                        <InnsatsgruppeSearch />
                                    </div>
                                </div>
                            </Column>
                            <Column xs="12" sm="8">
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
    stillingsoverskrift: undefined,
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
    leggTilKandidatStatus: PropTypes.string.isRequired,
    antallLagredeKandidater: PropTypes.number.isRequired,
    harHentetStilling: PropTypes.bool.isRequired,
    stillingsoverskrift: PropTypes.string,
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
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    antallLagredeKandidater: state.kandidatlister.leggTilKandidater.antallLagredeKandidater,
    harHentetStilling: state.search.harHentetStilling,
    stillingsoverskrift: state.search.stillingsoverskrift,
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
