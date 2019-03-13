import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp, Flatknapp } from 'nav-frontend-knapper';
import { Fieldset, Radio } from 'nav-frontend-skjema';
import { HENT_KANDIDATLISTER, RESET_LAGRE_STATUS } from './kandidatlisteReducer';
import { formatterDato } from '../../felles/common/dateUtils';
import './Kandidatlister.less';
import OpprettModal from './OpprettModal';
import { LAGRE_STATUS } from '../../felles/konstanter';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';
import { REMOVE_KOMPETANSE_SUGGESTIONS, SET_STATE } from '../sok/searchReducer';

const MODALVISING = {
    INGEN_MODAL: 'INGEN_MODAL',
    OPPRETT_MODAL: 'OPPRETT_MODAL'
};

const SokKandidatlisterInput = ({ sokeOrd, onSokeOrdChange, onSubmitSokKandidatlister }) => (
    <form className="kandidatlister__sok" onSubmit={onSubmitSokKandidatlister}>
        <input
            id={'sok-kandidatlister-input'}
            value={sokeOrd}
            onChange={onSokeOrdChange}
            className="skjemaelement__input"
            placeholder="Skriv inn navn på kandidatliste"
        />
        <Knapp
            aria-label="sok-kandidatlister-knapp"
            className="search-button"
            id="sok-kandidatlister-knapp"
            onClick={onSubmitSokKandidatlister}
        >
            <i className="search-button__icon" />
        </Knapp>
    </form>
);

const SideHeader = ({ sokeOrd, onSokeOrdChange, onSubmitSokKandidatlister, nullstillSok, opprettListe }) => (
    <div className="side-header">
        <div className="side-header__innhold">
            <div className="header-child" />
            <div className="header-child tittel-wrapper">
                <SokKandidatlisterInput sokeOrd={sokeOrd} onSokeOrdChange={onSokeOrdChange} onSubmitSokKandidatlister={onSubmitSokKandidatlister} />
            </div>
            <div className="header-child knapp-wrapper">
                <Flatknapp onClick={nullstillSok} className="nullstill-sok__knapp" mini>Nullstill søk</Flatknapp>
                <Hovedknapp onClick={opprettListe} id="opprett-ny-liste">Opprett ny</Hovedknapp>
            </div>
        </div>
    </div>
);

const KandidatlisterRadioFilter = ({ kandidatlisterSokeKriterier, onFilterChange }) => (
    <div className="kandidatlister__filter">
        <Fieldset legend="Kandidatlister">
            <Radio
                id="alle-kandidatlister-radio"
                label="Alle kandidatlister"
                name="kandidatlisterFilter"
                value=""
                checked={kandidatlisterSokeKriterier.type === ''}
                onChange={onFilterChange}
            />
            <Radio
                id="kandidatlister-til-stilling-radio"
                label="Kandidatlister knyttet til stilling"
                name="kandidatlisterFilter"
                value="MED_STILLING"
                checked={kandidatlisterSokeKriterier.type === 'MED_STILLING'}
                onChange={onFilterChange}
            />
            <Radio
                id="kandidatlister-uten-stilling-radio"
                label="Kandidatlister uten stilling"
                name="kandidatlisterFilter"
                value="UTEN_STILLING"
                checked={kandidatlisterSokeKriterier.type === 'UTEN_STILLING'}
                onChange={onFilterChange}
            />
        </Fieldset>
    </div>
);

const Kandidatlistevisning = ({ fetching, kandidatlister }) => {
    if (fetching !== 'SUCCESS' || kandidatlister === undefined) {
        return <div className="hent-kandidatlister--spinner"><NavFrontendSpinner type="L" /></div>;
    } else if (kandidatlister.length === 0) {
        return (
            <div className="liste-rad__tom">
                <Systemtittel>Fant ingen kandidatlister som matcher søket ditt.</Systemtittel>
            </div>
        );
    }

    return (
        kandidatlister.map((kandidatliste) => (
            <KandidatlisteRad kandidatliste={kandidatliste} key={JSON.stringify(kandidatliste)} />
        ))
    );
};

const ListeHeader = () => (
    <div className="liste-header liste-rad-innhold">
        <div className="kolonne-middels"><Element>Dato opprettet</Element></div>
        <div className="kolonne-bred"><Element>Navn på kandidatliste</Element></div>
        <div className="kolonne-middels"><Element>Antall kandidater</Element></div>
        <div className="kolonne-bred"><Element>Opprettet av</Element></div>
        <div className="kolonne-middels"><Element>Finn kandidater</Element></div>
    </div>
);

const KandidatlisteRad = ({ kandidatliste }) => (
    <div className="liste-rad liste-rad-innhold">
        <div className="kolonne-middels"><Normaltekst>{`${formatterDato(new Date(kandidatliste.opprettetTidspunkt))}`}</Normaltekst></div>
        <div className="kolonne-bred">
            <Link
                to={`/kandidater/lister/detaljer/${kandidatliste.kandidatlisteId}`}
                className="lenke"
            >
                <Normaltekst>{kandidatliste.tittel}</Normaltekst>
            </Link>
        </div>
        <div className="kolonne-middels"><Normaltekst>{kandidatliste.kandidater.length}</Normaltekst></div>
        <div className="kolonne-bred">{`${kandidatliste.opprettetAv.navn} (${kandidatliste.opprettetAv.ident})`}</div>
        <div className="kolonne-middels">
            <Link
                aria-label={`Finn kandidater til listen ${kandidatliste.tittel}`}
                to={kandidatliste.stillingId ? `/kandidater/stilling/${kandidatliste.stillingId}` : `/kandidater/kandidatliste/${kandidatliste.kandidatlisteId}`}
                className="FinnKandidater"
            >
                <i className="FinnKandidater__icon" />
            </Link>
        </div>
    </div>
);

const KandidatlisterKnappeFilter = ({ kandidatlisterSokeKriterier, onVisMineKandidatlister, onVisAlleKandidatlister }) => (
    <div>
        <Flatknapp
            mini
            className={`kandidatlister-table--top__knapper${kandidatlisterSokeKriterier.kunEgne ? ' knapp--aktiv' : ''}`}
            onClick={onVisMineKandidatlister}
        >
            <Element>Mine kandidatlister</Element>
        </Flatknapp>
        <Flatknapp
            mini
            className={`kandidatlister-table--top__knapper${kandidatlisterSokeKriterier.kunEgne ? '' : ' knapp--aktiv'}`}
            onClick={onVisAlleKandidatlister}
        >
            <Element>Alle kandidatlister</Element>
        </Flatknapp>
    </div>
);

class Kandidatlister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalstatus: MODALVISING.INGEN_MODAL,
            visSuccessMelding: false,
            sokeOrd: this.props.kandidatlisterSokeKriterier.query
        };
    }

    componentDidMount() {
        const { query, type, kunEgne } = this.props.kandidatlisterSokeKriterier;
        this.resetSearchQuery();
        this.props.hentKandidatlister(query, type, kunEgne);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lagreStatus === LAGRE_STATUS.LOADING && this.props.lagreStatus === LAGRE_STATUS.SUCCESS) {
            const { query, type, kunEgne } = this.props.kandidatlisterSokeKriterier;
            this.props.hentKandidatlister(query, type, kunEgne);
            this.visSuccessMelding();
            this.onLukkModalClick();
            this.props.resetLagreStatus();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.skjulSuccessMeldingCallbackId);
    }

    onFilterChange = (e) => {
        const { query, kunEgne } = this.props.kandidatlisterSokeKriterier;
        this.props.hentKandidatlister(query, e.target.value, kunEgne);
    };

    onSokeOrdChange = (e) => {
        this.setState({ sokeOrd: e.target.value });
    };

    onSubmitSokKandidatlister = (e) => {
        e.preventDefault();
        const { type, kunEgne } = this.props.kandidatlisterSokeKriterier;
        this.props.hentKandidatlister(this.state.sokeOrd, type, kunEgne);
    };

    onNullstillSokClick = () => {
        const { query, type, kunEgne } = this.props.kandidatlisterSokeKriterier;
        if (this.state.sokeOrd !== '') {
            this.setState({ sokeOrd: '' });
        }
        if (query !== '' || type !== '' || !kunEgne) {
            this.props.hentKandidatlister('', '', true);
        }
    };

    onOpprettClick = () => {
        this.setState({
            modalstatus: MODALVISING.OPPRETT_MODAL
        });
    };

    onLukkModalClick = () => {
        this.setState({
            modalstatus: MODALVISING.INGEN_MODAL
        });
    };

    onVisMineKandidatlister = () => {
        const { query, type, kunEgne } = this.props.kandidatlisterSokeKriterier;
        if (!kunEgne) {
            this.props.hentKandidatlister(query, type, true);
        }
    };

    onVisAlleKandidatlister = () => {
        const { query, type, kunEgne } = this.props.kandidatlisterSokeKriterier;
        if (kunEgne) {
            this.props.hentKandidatlister(query, type, false);
        }
    };

    resetSearchQuery = () => {
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
            harHentetStilling: false
        });
        this.props.removeKompetanseSuggestions();
    };

    visSuccessMelding = () => {
        this.setState({ visSuccessMelding: true });
        this.skjulSuccessMeldingCallbackId = setTimeout(this.skjulSuccessMelding, 5000);
    };

    skjulSuccessMelding = () => {
        this.setState({ visSuccessMelding: false });
    };

    render() {
        const { kandidatlister, fetchingKandidatlister, opprettetTittel, kandidatlisterSokeKriterier } = this.props;
        return (
            <div>
                {this.state.modalstatus === MODALVISING.OPPRETT_MODAL && <OpprettModal onAvbrytClick={this.onLukkModalClick} />}
                <HjelpetekstFading
                    id="kandidatliste-lagret-melding"
                    synlig={this.state.visSuccessMelding}
                    type="suksess"
                    tekst={`Kandidatliste "${opprettetTittel}" opprettet`}
                />
                <div className="Kandidatlister">
                    <SideHeader
                        sokeOrd={this.state.sokeOrd}
                        onSokeOrdChange={this.onSokeOrdChange}
                        onSubmitSokKandidatlister={this.onSubmitSokKandidatlister}
                        nullstillSok={this.onNullstillSokClick}
                        opprettListe={this.onOpprettClick}
                    />
                    <div className="kandidatlister-wrapper">
                        <KandidatlisterRadioFilter kandidatlisterSokeKriterier={kandidatlisterSokeKriterier} onFilterChange={this.onFilterChange} />
                        <div className="kandidatlister-table__wrapper">
                            <div className="kandidatlister-table--top">
                                <Systemtittel>{`${kandidatlister.length} kandidatliste${kandidatlister.length === 1 ? '' : 'r'}`}</Systemtittel>
                                <KandidatlisterKnappeFilter
                                    kandidatlisterSokeKriterier={kandidatlisterSokeKriterier}
                                    onVisMineKandidatlister={this.onVisMineKandidatlister}
                                    onVisAlleKandidatlister={this.onVisAlleKandidatlister}
                                />
                            </div>
                            <div className="kandidatlister-table">
                                <ListeHeader />
                                <Kandidatlistevisning kandidatlister={kandidatlister} fetching={fetchingKandidatlister} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatlister.opprett.lagreStatus,
    opprettetTittel: state.kandidatlister.opprett.opprettetKandidatlisteTittel,
    kandidatlister: state.kandidatlister.kandidatlister.liste,
    fetchingKandidatlister: state.kandidatlister.hentListerStatus,
    kandidatlisterSokeKriterier: state.kandidatlister.kandidatlisterSokeKriterier
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    removeKompetanseSuggestions: () => dispatch({ type: REMOVE_KOMPETANSE_SUGGESTIONS }),
    hentKandidatlister: (query, type, kunEgne) => dispatch({ type: HENT_KANDIDATLISTER, query, listetype: type, kunEgne }),
    resetLagreStatus: () => dispatch({ type: RESET_LAGRE_STATUS })
});

export const KandidatlisteBeskrivelse = PropTypes.shape({
    tittel: PropTypes.string.isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    opprettetTidspunkt: PropTypes.string.isRequired,
    opprettetAv: PropTypes.shape({
        navn: PropTypes.string,
        ident: PropTypes.string
    }).isRequired
});

SideHeader.defaultProps = {
    sokeOrd: ''
};

SideHeader.propTypes = {
    sokeOrd: PropTypes.string,
    onSokeOrdChange: PropTypes.func.isRequired,
    onSubmitSokKandidatlister: PropTypes.func.isRequired,
    nullstillSok: PropTypes.func.isRequired,
    opprettListe: PropTypes.func.isRequired
};

KandidatlisterRadioFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    kandidatlisterSokeKriterier: PropTypes.shape({
        query: PropTypes.string,
        type: PropTypes.string,
        kunEgne: PropTypes.bool
    }).isRequired
};

SokKandidatlisterInput.propTypes = {
    sokeOrd: PropTypes.string.isRequired,
    onSokeOrdChange: PropTypes.func.isRequired,
    onSubmitSokKandidatlister: PropTypes.func.isRequired
};

KandidatlisterKnappeFilter.propTypes = {
    kandidatlisterSokeKriterier: PropTypes.shape({
        query: PropTypes.string,
        type: PropTypes.string,
        kunEgne: PropTypes.bool
    }).isRequired,
    onVisMineKandidatlister: PropTypes.func.isRequired,
    onVisAlleKandidatlister: PropTypes.func.isRequired
};

KandidatlisteRad.propTypes = {
    kandidatliste: KandidatlisteBeskrivelse.isRequired
};

Kandidatlister.defaultProps = {
    kandidatlister: undefined,
    opprettetTittel: undefined
};

Kandidatlister.propTypes = {
    resetQuery: PropTypes.func.isRequired,
    removeKompetanseSuggestions: PropTypes.func.isRequired,
    hentKandidatlister: PropTypes.func.isRequired,
    fetchingKandidatlister: PropTypes.string.isRequired,
    kandidatlister: PropTypes.arrayOf(KandidatlisteBeskrivelse),
    lagreStatus: PropTypes.string.isRequired,
    resetLagreStatus: PropTypes.func.isRequired,
    opprettetTittel: PropTypes.string,
    kandidatlisterSokeKriterier: PropTypes.shape({
        query: PropTypes.string,
        type: PropTypes.string,
        kunEgne: PropTypes.bool
    }).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatlister);
