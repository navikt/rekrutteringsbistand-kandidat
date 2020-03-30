import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst, Element } from 'nav-frontend-typografi';
import { Column, Container } from 'nav-frontend-grid';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Flatknapp } from 'pam-frontend-knapper';
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
import TilretteleggingsbehovSearch from '../sok/tilretteleggingsbehov/TilretteleggingsbehovSearch.tsx';
import {
    INITIAL_SEARCH_BEGIN,
    REMOVE_KOMPETANSE_SUGGESTIONS,
    SEARCH,
    SET_STATE,
} from '../sok/searchReducer';
import './Resultat.less';
import { LAGRE_STATUS } from '../../felles/konstanter';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading.tsx';
import { capitalizeEmployerName } from '../../felles/sok/utils';
import InnsatsgruppeSearch from '../sok/innsatsgruppe/InnsatsgruppeSearch';
import FritekstSearch from '../sok/fritekst/FritekstSearch';
import Sidetittel from '../../felles/common/Sidetittel.tsx';
import { RemoteDataTypes } from '../../felles/common/remoteData.ts';
import FantFåKandidater from './fant-få-kandidater/FantFåKandidater.tsx';
import ViktigeYrker from './viktigeyrker/ViktigeYrker';
import KandidatlisteActionType from '../kandidatlister/reducer/KandidatlisteActionType';
import { LUKK_ALLE_SOKEPANEL } from '../sok/konstanter';

export const hentQueryUtenKriterier = harHentetStilling => ({
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

class ResultatVisning extends React.Component {
    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
        this.state = {
            suksessmeldingLagreKandidatVises: false,
            visBeskrivelse: false,
        };
    }

    componentDidMount() {
        const { stillingsId } = this.props.match.params;
        this.props.initialSearch(stillingsId);
        this.props.resetKandidatlisterSokekriterier();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.leggTilKandidatStatus !== this.props.leggTilKandidatStatus &&
            this.props.leggTilKandidatStatus === LAGRE_STATUS.SUCCESS
        ) {
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

        const VeilederHeaderInfo = () => (
            <div className="child-item__container--header">
                <div className="header__row--veileder">
                    <Element className="text">{`Finn kandidater til ${
                        stillingsId ? 'stilling/' : ''
                    }kandidatliste:`}</Element>
                </div>
                <div className="header__row--veileder">
                    <Sidetittel className="text">{kandidatliste.tittel}</Sidetittel>
                </div>
                <div className="header__row--veileder">
                    <div className="opprettet-av__row">
                        {kandidatliste.organisasjonNavn && (
                            <Normaltekst className="text">
                                Arbeidsgiver:{' '}
                                {`${capitalizeEmployerName(kandidatliste.organisasjonNavn)}`}
                            </Normaltekst>
                        )}
                        <Normaltekst className="text">
                            Veileder: {kandidatliste.opprettetAv.navn} (
                            {kandidatliste.opprettetAv.ident})
                        </Normaltekst>
                        {kandidatliste.beskrivelse && (
                            <Flatknapp
                                className="beskrivelse--knapp"
                                mini
                                onClick={this.onToggleVisBeskrivelse}
                            >
                                {this.state.visBeskrivelse ? 'Skjul beskrivelse' : 'Se beskrivelse'}
                                <NavFrontendChevron
                                    type={this.state.visBeskrivelse ? 'opp' : 'ned'}
                                />
                            </Flatknapp>
                        )}
                    </div>
                </div>
                {this.state.visBeskrivelse && (
                    <div className="header__row--veileder">
                        <div>
                            <Element className="beskrivelse">Beskrivelse</Element>
                            <Normaltekst className="beskrivelse--text">
                                {kandidatliste.beskrivelse}
                            </Normaltekst>
                        </div>
                    </div>
                )}
            </div>
        );

        const HeaderLinker = () => (
            <div className="container--header__lenker">
                {stillingsId && (
                    <a className="SeStilling" href={`/stilling/${stillingsId}`}>
                        <i className="SeStilling__icon" />
                        <span className="link">Se stilling</span>
                    </a>
                )}
                <a
                    className="TilKandidater"
                    href={`/kandidater/lister/detaljer/${kandidatliste.kandidatlisteId}`}
                >
                    <i className="TilKandidater__icon" />
                    <span className="link">Se kandidatliste</span>
                </a>
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
                            <Column xs="12" sm="8">
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

ResultatVisning.defaultProps = {
    kandidatliste: {
        opprettetAv: {
            navn: undefined,
            ident: undefined,
        },
    },
    match: {
        params: {
            kandidatlisteId: undefined,
            stillingsId: undefined,
        },
    },
};

ResultatVisning.propTypes = {
    resetQuery: PropTypes.func.isRequired,
    initialSearch: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    maksAntallTreff: PropTypes.number.isRequired,
    search: PropTypes.func.isRequired,
    removeKompetanseSuggestions: PropTypes.func.isRequired,
    isInitialSearch: PropTypes.bool.isRequired,
    leggTilKandidatStatus: PropTypes.string.isRequired,
    antallLagredeKandidater: PropTypes.number.isRequired,
    lagretKandidatliste: PropTypes.shape({
        kandidatlisteId: PropTypes.string,
        tittel: PropTypes.string,
    }).isRequired,
    harHentetStilling: PropTypes.bool.isRequired,
    kandidatliste: PropTypes.shape({
        organisasjonNavn: PropTypes.string,
        tittel: PropTypes.string,
        beskrivelse: PropTypes.string,
        kandidatlisteId: PropTypes.string,
        opprettetAv: PropTypes.shape({
            navn: PropTypes.string,
            ident: PropTypes.string,
        }),
    }),
    match: PropTypes.shape({
        params: PropTypes.shape({
            kandidatlisteId: PropTypes.string,
            stillingsId: PropTypes.string,
        }),
    }),
    resetKandidatlisterSokekriterier: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isInitialSearch: state.search.isInitialSearch,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    maksAntallTreff: state.search.maksAntallTreff,
    leggTilKandidatStatus: state.kandidatlister.leggTilKandidater.lagreStatus,
    antallLagredeKandidater: state.kandidatlister.leggTilKandidater.antallLagredeKandidater,
    lagretKandidatliste: state.kandidatlister.leggTilKandidater.lagretListe,
    harHentetStilling: state.search.harHentetStilling,
    kandidatliste:
        state.kandidatlister.detaljer.kandidatliste.kind === RemoteDataTypes.SUCCESS
            ? state.kandidatlister.detaljer.kandidatliste.data
            : undefined,
});

const mapDispatchToProps = dispatch => ({
    resetQuery: query => dispatch({ type: SET_STATE, query }),
    search: () => dispatch({ type: SEARCH }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    initialSearch: stillingsId => {
        dispatch({ type: INITIAL_SEARCH_BEGIN, stillingsId });
    },
    resetKandidatlisterSokekriterier: () => {
        dispatch({ type: KandidatlisteActionType.RESET_KANDIDATLISTER_SOKEKRITERIER });
    },
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultatVisning);
