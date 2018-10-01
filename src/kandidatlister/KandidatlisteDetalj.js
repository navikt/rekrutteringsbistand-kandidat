import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
/** nav komponenter */
import { Panel } from 'nav-frontend-paneler';
import { Checkbox } from 'nav-frontend-skjema';
import { Normaltekst, Undertekst, UndertekstBold, Sidetittel } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';

/** prosjekt */
import TilbakeLenke from '../common/TilbakeLenke';
import SlettIkon from '../common/ikoner/SlettIkon';
import PrinterIkon from '../common/ikoner/PrinterIkon';
import { HENT_KANDIDATLISTE, SLETT_KANDIDATER, CLEAR_KANDIDATLISTE } from './kandidatlisteReducer';

import './kandidatlister.less';

class KandidatlisteDetalj extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markerAlleChecked: false,
            kandidater: []
        };
    }

    componentWillMount() {
        this.props.hentKandidatliste(this.props.kandidatlisteId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.kandidatliste) {
            this.setState({
                markerAlleChecked: false,
                kandidater: nextProps.kandidatliste.kandidater.map((k) => ({ ...k, checked: false }))
            });
        }
    }

    componentWillUnmount() {
        this.props.clearKandidatliste();
    }

    onKandidatCheckboxClicked = (valgtKandidat) => {
        this.setState({
            markerAlleChecked: false,
            kandidater: this.state.kandidater.map((k) => {
                if (k.kandidatnr === valgtKandidat.kandidatnr) {
                    return {
                        ...k,
                        checked: !k.checked
                    };
                }
                return { ...k };
            })
        });
    }

    markerAlleClicked = () => {
        this.setState({
            markerAlleChecked: !this.state.markerAlleChecked,
            kandidater: this.state.kandidater.map((k) => ({ ...k, checked: !this.state.markerAlleChecked }))
        });
    }

    slettMarkerteKandidaterClicked = () => {
        const { kandidatlisteId } = this.props;
        const kandidater = this.state.kandidater.filter((k) => k.checked);
        if (kandidatlisteId && kandidater.length > 0) {
            this.props.slettKandidater(this.props.kandidatlisteId, kandidater);
        }
    }

    render() {
        if (this.props.kandidatliste === undefined) {
            return (
                <NavFrontendSpinner />
            );
        }

        const { markerAlleChecked, kandidater } = this.state;
        const { tittel, beskrivelse, organisasjonNavn } = this.props.kandidatliste;
        const valgteKandidater = kandidater.filter((k) => k.checked);

        const ToppRad = () => (
            <Panel className="KandidatPanel KandidatPanel__header">
                <div className="left">
                    <Checkbox label="Navn" checked={markerAlleChecked} onChange={this.markerAlleClicked} />
                </div>
                <UndertekstBold>Arbeidserfaring</UndertekstBold>
            </Panel>
        );

        const KandidatListe = () => (
            kandidater && kandidater.map((kandidat) => (
                <Panel className="KandidatPanel" key={JSON.stringify(kandidat)}>
                    <div className="left">
                        <Checkbox className="text-hide" label="." checked={kandidat.checked} onChange={() => this.onKandidatCheckboxClicked(kandidat)} />
                        <Link to={`/pam-kandidatsok/cv?kandidatNr=${kandidat.kandidatnr}`}>{kandidat.kandidatnr}</Link>
                    </div>
                    <Undertekst >{kandidat.sisteArbeidserfaring}</Undertekst>
                </Panel>
            ))
        );

        const ToppMeny = () => (
            <div className="KandidatlisteHeader">
                <div className="KandidatlisteDetalj__header--innhold">
                    <TilbakeLenke tekst="Til kandidatlistene" href="/pam-kandidatsok/lister" />
                    <Sidetittel>{tittel}</Sidetittel>
                    <Undertekst className="undertittel">{beskrivelse || ''}</Undertekst>
                    <div className="inforad">
                        <Normaltekst>{kandidater.length} kandidater</Normaltekst>
                        <Normaltekst>Oppdragsgiver: <Link to="#">{organisasjonNavn}</Link></Normaltekst>
                    </div>
                </div>
            </div>
        );

        const Knapper = () => (
            <div className="knapperad">
                <div
                    role="button"
                    tabIndex="0"
                    className="knapp--ikon"
                    onKeyPress={() => {}}
                    onClick={() => {}}
                >
                    <PrinterIkon />
                    <Normaltekst>Skriv ut</Normaltekst>
                </div>
                <div
                    role="button"
                    tabIndex="0"
                    className={valgteKandidater.length > 0 ? 'knapp--ikon' : 'knapp--ikon disabled'}
                    onKeyPress={this.slettMarkerteKandidaterClicked}
                    onClick={this.slettMarkerteKandidaterClicked}
                >
                    <SlettIkon />
                    <Normaltekst>Slett</Normaltekst>
                </div>
            </div>
        );

        return (
            <div>
                <ToppMeny />
                <div className="KandidatlisteDetalj__container">
                    <Knapper />
                    <ToppRad />
                    <KandidatListe />
                </div>
            </div>
        );
    }
}

KandidatlisteDetalj.defaultProps = {
    kandidatliste: undefined
};

KandidatlisteDetalj.propTypes = {
    kandidatlisteId: PropTypes.string.isRequired,
    kandidatliste: PropTypes.shape({
        tittel: PropTypes.string,
        beskrivelse: PropTypes.string,
        organisasjonNavn: PropTypes.string,
        kandidater: PropTypes.arrayOf(
            PropTypes.shape({
                lagtTilAv: PropTypes.string,
                kandidatnr: PropTypes.string,
                sisteArbeidserfaring: PropTypes.string
            })
        )
    }),
    hentKandidatliste: PropTypes.func.isRequired,
    slettKandidater: PropTypes.func.isRequired,
    clearKandidatliste: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => ({
    ...props,
    kandidatlisteId: props.match.params.listeid,
    kandidatliste: state.kandidatlister.kandidatlisteDetalj
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatliste: (kandidatlisteId) => dispatch({ type: HENT_KANDIDATLISTE, kandidatlisteId }),
    slettKandidater: (kandidatlisteId, kandidater) => dispatch({ type: SLETT_KANDIDATER, kandidatlisteId, kandidater }),
    clearKandidatliste: () => dispatch({ type: CLEAR_KANDIDATLISTE })
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteDetalj);
