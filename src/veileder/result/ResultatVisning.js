import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Sidetittel, Normaltekst, Element } from 'nav-frontend-typografi';
import { Column, Container } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Flatknapp } from 'pam-frontend-knapper';
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
import { RESET_KANDIDATLISTER_SOKEKRITERIER } from '../kandidatlister/kandidatlisteReducer';
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
            visBeskrivelse: false
        };
    }

    componentDidMount() {
        const { stillingsId } = this.props.match.params;
        this.props.initialSearch(stillingsId);
        this.props.resetKandidatlisterSokekriterier();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.leggTilKandidatStatus !== this.props.leggTilKandidatStatus && this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS) {
            this.visAlertstripeLagreKandidater();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.suksessmeldingCallbackId);
    }

    onToggleVisBeskrivelse = () => {
        this.setState({ visBeskrivelse: !this.state.visBeskrivelse });
    };

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
        if (this.props.match.params.kandidatlisteId || this.props.match.params.stillingsId) {
            clearTimeout(this.suksessmeldingCallbackId);
            this.setState({
                suksessmeldingLagreKandidatVises: true
            });
            this.suksessmeldingCallbackId = setTimeout(() => {
                this.setState({
                    suksessmeldingLagreKandidatVises: false
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
            antallLagredeKandidater
        } = this.props;
        const kandidatlisteId = match.params.kandidatlisteId;
        const stillingsId = match.params.stillingsId;

        const VeilederHeaderInfo = () => (
            <div className="child-item__container--header">
                <div className="header__row--veileder">
                    <Element className="text">{`Finn kandidater til ${stillingsId ? 'stilling/' : ''}kandidatliste:`}</Element>
                </div>
                <div className="header__row--veileder">
                    <Sidetittel className="text">{kandidatliste.tittel}</Sidetittel>
                </div>
                <div className="header__row--veileder">
                    <div className="opprettet-av__row">
                        {kandidatliste.organisasjonNavn && <Normaltekst className="text">Arbeidsgiver: {`${capitalizeEmployerName(kandidatliste.organisasjonNavn)}`}</Normaltekst>}
                        <Normaltekst className="text">Veileder: {kandidatliste.opprettetAv.navn} ({kandidatliste.opprettetAv.ident})</Normaltekst>
                        {kandidatliste.beskrivelse && (
                            <Flatknapp className="beskrivelse--knapp" mini onClick={this.onToggleVisBeskrivelse}>
                                {this.state.visBeskrivelse ? 'Skjul beskrivelse' : 'Se beskrivelse'}
                                <NavFrontendChevron type={this.state.visBeskrivelse ? 'opp' : 'ned'} />
                            </Flatknapp>
                        )}
                    </div>
                </div>
                {this.state.visBeskrivelse && (
                    <div className="header__row--veileder">
                        <div>
                            <Element className="beskrivelse">Beskrivelse</Element>
                            <Normaltekst className="beskrivelse--text">{kandidatliste.beskrivelse}</Normaltekst>
                        </div>
                    </div>
                )}
            </div>
        );

        const HeaderLinker = () => (
            <div className="container--header__lenker">
                {stillingsId && (
                    <Lenke className="SeStilling" href={`/stilling/${stillingsId}`}>
                        <i className="SeStilling__icon" />
                        <span className="lenke">Se stilling</span>
                    </Lenke>
                )}
                <Lenke className="TilKandidater" href={`/kandidater/lister/detaljer/${kandidatliste.kandidatlisteId}`}>
                    <i className="TilKandidater__icon" />
                    <span className="lenke">Se kandidatliste</span>
                </Lenke>
            </div>
        );

        return (
            <div>
                <HjelpetekstFading
                    synlig={this.state.suksessmeldingLagreKandidatVises}
                    type="suksess"
                    tekst={`${antallLagredeKandidater > 1 ? `${antallLagredeKandidater} kandidater` : 'Kandidaten'} er lagret i kandidatlisten «${lagretKandidatliste.tittel}»`}
                    id="hjelpetekstfading"
                />
                <div className="ResultatVisning--hovedside--header">
                    {kandidatlisteId || stillingsId ? (
                        <Container className="container--header">
                            <VeilederHeaderInfo />
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
                            <Column xs="12" sm="4">
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
                                    <KandidaterVisning kandidatlisteId={kandidatlisteId} stillingsId={stillingsId} />
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
    kandidatliste: {
        opprettetAv: {
            navn: undefined,
            ident: undefined
        }
    },
    match: {
        params: {
            kandidatlisteId: undefined,
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
    lagretKandidatliste: PropTypes.shape({
        kandidatlisteId: PropTypes.string,
        tittel: PropTypes.string
    }).isRequired,
    harHentetStilling: PropTypes.bool.isRequired,
    kandidatliste: PropTypes.shape({
        opprettetAv: PropTypes.shape({
            navn: PropTypes.string,
            ident: PropTypes.string
        })
    }),
    match: PropTypes.shape({
        params: PropTypes.shape({
            kandidatlisteId: PropTypes.string,
            stillingsId: PropTypes.string
        })
    }),
    resetKandidatlisterSokekriterier: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isInitialSearch: state.search.isInitialSearch,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    antallLagredeKandidater: state.kandidatlister.leggTilKandidater.antallLagredeKandidater,
    lagretKandidatliste: state.kandidatlister.leggTilKandidater.lagretListe,
    harHentetStilling: state.search.harHentetStilling,
    kandidatliste: state.kandidatlister.detaljer.kandidatliste
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    initialSearch: (stillingsId) => { dispatch({ type: INITIAL_SEARCH_BEGIN, stillingsId }); },
    resetKandidatlisterSokekriterier: () => { dispatch({ type: RESET_KANDIDATLISTER_SOKEKRITERIER }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultatVisning);
