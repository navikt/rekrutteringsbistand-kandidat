import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { Link } from 'react-router-dom';
import cvPropTypes from '../../../felles/PropTypes';
import './Resultstable.less';
import { SET_SCROLL_POSITION } from '../../sok/searchReducer';
import { capitalizeFirstLetter, capitalizePoststed } from '../../../felles/sok/utils';

class KandidaterTableRow extends React.Component {
    onCheck = (kandidatnr) => {
        this.props.onKandidatValgt(!this.props.markert, kandidatnr);
    };

    render() {
        const { kandidat, markert, nettoppValgt, setScrollPosition, stillingsId } = this.props;
        const kandidatnummer = kandidat.arenaKandidatnr;
        const fornavn = kandidat.fornavn ? capitalizeFirstLetter(kandidat.fornavn) : '';
        const etternavn = kandidat.etternavn ? capitalizeFirstLetter(kandidat.etternavn) : '';
        const fodselsdato = kandidat.fodselsdato;
        const innsatsgruppe = kandidat.servicebehov;
        const bosted = kandidat.poststed ? capitalizePoststed(kandidat.poststed) : '-';

        return (
            <Row className={`kandidater--row${markert ? ' kandidater--row--checked' : ''}${nettoppValgt ? ' kandidater--row--sett' : ''}`}>
                <Column xs="1" md="1">
                    <Checkbox
                        id={`marker-kandidat-${kandidatnummer}-checkbox`}
                        className="text-hide"
                        label="."
                        aria-label={`Marker kandidat med navn ${etternavn}, ${fornavn}`}
                        checked={markert}
                        onChange={() => { this.onCheck(kandidat.arenaKandidatnr); }}
                    />
                </Column>
                <Column className="lenke--kandidatnr--wrapper" xs="4" md="4">
                    <Link
                        className="lenke--kandidatnr"
                        to={stillingsId ? `/kandidater/stilling/${stillingsId}/cv?kandidatNr=${kandidatnummer}` : `/kandidater/cv?kandidatNr=${kandidatnummer}`}
                        onClick={() => setScrollPosition(window.pageYOffset)}
                        aria-label={`Se CV for ${etternavn}, ${fornavn}`}
                    >
                        <Normaltekst className="kandidater--row__col--navn">{`${etternavn}, ${fornavn}`}</Normaltekst>
                    </Link>
                </Column>
                <Column xs="2" md="2">
                    <Normaltekst className="text-overflow kandidater--row__col">{new Date(fodselsdato).toLocaleDateString('NB-no')}</Normaltekst>
                </Column>
                <Column xs="3" md="3">
                    <Normaltekst className="text-overflow kandidater--row__col">{`${innsatsgruppe}`}</Normaltekst>
                </Column>
                <Column xs="2" md="2">
                    <Normaltekst className="bosted text-overflow kandidater--row__col">{`${bosted}`}</Normaltekst>
                </Column>
            </Row>
        );
    }
}

KandidaterTableRow.defaultProps = {
    markert: false,
    stillingsId: undefined
};

KandidaterTableRow.propTypes = {
    kandidat: cvPropTypes.isRequired,
    onKandidatValgt: PropTypes.func.isRequired,
    markert: PropTypes.bool,
    nettoppValgt: PropTypes.bool.isRequired,
    setScrollPosition: PropTypes.func.isRequired,
    stillingsId: PropTypes.string
};

const mapStateToProps = (state) => ({
    query: state.query
});

const mapDispatchToProps = (dispatch) => ({
    setScrollPosition: (scrollPosisjon) => dispatch({ type: SET_SCROLL_POSITION, scrolletFraToppen: scrollPosisjon })
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidaterTableRow);
