import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cvPropTypes from '../../../felles/PropTypes';
import './Resultstable.less';
import { SET_SCROLL_POSITION } from '../../sok/searchReducer';
import { capitalizeFirstLetter, capitalizePoststed } from '../../../felles/sok/utils';

class KandidaterTableRow extends React.Component {
    onCheck = kandidatnr => {
        this.props.onKandidatValgt(!this.props.markert, kandidatnr);
    };

    checkedClass = (markert, nettoppValgt) => {
        if (nettoppValgt) {
            return 'nettopp-valgt';
        } else if (markert) {
            return 'checked';
        }
        return '';
    };

    render() {
        const {
            kandidat,
            markert,
            nettoppValgt,
            setScrollPosition,
            kandidatlisteId,
            stillingsId,
        } = this.props;
        const kandidatnummer = kandidat.arenaKandidatnr;
        const fornavn = kandidat.fornavn ? capitalizeFirstLetter(kandidat.fornavn) : '';
        const etternavn = kandidat.etternavn ? capitalizeFirstLetter(kandidat.etternavn) : '';
        const navn = `${etternavn}, ${fornavn}`;
        const fodselsnummer = kandidat.fodselsnummer;
        const innsatsgruppe = kandidat.servicebehov;
        const bosted = kandidat.poststed ? capitalizePoststed(kandidat.poststed) : '-';
        const linkTilKandidat = () => {
            if (kandidatlisteId) {
                return `/kandidater/kandidatliste/${kandidatlisteId}/cv?kandidatNr=${kandidatnummer}`;
            } else if (stillingsId) {
                return `/kandidater/stilling/${stillingsId}/cv?kandidatNr=${kandidatnummer}`;
            }
            return `/kandidater/cv?kandidatNr=${kandidatnummer}`;
        };

        return (
            <div className={`NyKandidaterTableRow ${this.checkedClass(markert, nettoppValgt)}`}>
                <div className="kandidat-content">
                    <div className="kolonne-checkbox skjemaelement--pink">
                        <div className="skjemaelement skjemaelement--horisontal text-hide">
                            <input
                                type="checkbox"
                                id={`marker-kandidat-${kandidatnummer}-checkbox`}
                                className="skjemaelement__input checkboks"
                                aria-label={`Marker kandidat med navn ${navn}`}
                                checked={markert}
                                onChange={() => {
                                    this.onCheck(kandidat.arenaKandidatnr);
                                }}
                            />
                            <label
                                className="skjemaelement__label"
                                htmlFor={`marker-kandidat-${kandidatnummer}-checkbox`}
                                aria-hidden="true"
                            >
                                .
                            </label>
                        </div>
                    </div>
                    <div className="kolonne-navn kolonne-tekst">
                        <Link
                            className="kolonne-lenke link"
                            to={linkTilKandidat()}
                            onClick={() => setScrollPosition(window.pageYOffset)}
                            aria-label={`Se CV for ${navn}`}
                        >
                            {navn}
                        </Link>
                    </div>
                    <div className="kolonne-dato kolonne-tekst">{fodselsnummer}</div>
                    <div className="kolonne-innsatsgruppe kolonne-tekst">{innsatsgruppe}</div>
                    <div className="kolonne-bosted kolonne-tekst">{bosted}</div>
                </div>
            </div>
        );
    }
}

KandidaterTableRow.defaultProps = {
    markert: false,
    kandidatlisteId: undefined,
    stillingsId: undefined,
};

KandidaterTableRow.propTypes = {
    kandidat: cvPropTypes.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    markert: PropTypes.bool,
    nettoppValgt: PropTypes.bool.isRequired,
    setScrollPosition: PropTypes.func.isRequired,
    kandidatlisteId: PropTypes.string,
    stillingsId: PropTypes.string,
};

const mapStateToProps = state => ({
    query: state.query,
});

const mapDispatchToProps = dispatch => ({
    setScrollPosition: scrollPosisjon =>
        dispatch({ type: SET_SCROLL_POSITION, scrolletFraToppen: scrollPosisjon }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterTableRow);
