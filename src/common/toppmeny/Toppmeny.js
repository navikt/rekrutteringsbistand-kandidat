import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import './Toppmeny.less';
import { LOGOUT_URL, PAMPORTAL_URL } from '../fasitProperties';
import ArbeidsgiverSelect from '../../arbeidsgiver/ArbeidsgiverSelect';

const Toppmeny = ({ loggUtSynlig, arbeidsgivere, valgtArbeidsgiverId }) => (
    <div className="header">
        <span className="pilot typo-element">Tidlig versjon</span>
        <Row className="header__row">
            <Column xs="3" sm="1">
                <div className="header__logo">
                    <a id="goto-forsiden" href={PAMPORTAL_URL} title="Gå til forsiden" className="logo" >
                        Arbeidsplassen
                    </a>
                </div>
            </Column>
            <Column xs="9" sm="11" className="pull">
                <div className="header__right">
                    {arbeidsgivere.length === 1 ? (
                        <Normaltekst className="topmeny-navn">
                            {arbeidsgivere[0].orgnavn}
                        </Normaltekst>
                    ) :
                        (arbeidsgivere.length > 1 && valgtArbeidsgiverId !== undefined && (
                            <ArbeidsgiverSelect />
                        ))}
                </div>
                {loggUtSynlig && (
                    <div className="header__right">
                        <a id="logg-ut" href={LOGOUT_URL} className="knapp knapp--mini knapp--loggut">
                            Logg ut
                        </a>
                    </div>
                )}
            </Column>
        </Row>
    </div>
);

Toppmeny.defaultProps = {
    loggUtSynlig: true,
    valgtArbeidsgiverId: undefined
};

Toppmeny.propTypes = {
    loggUtSynlig: PropTypes.bool,
    arbeidsgivere: PropTypes.arrayOf(PropTypes.shape({
        orgnr: PropTypes.string,
        orgnavn: PropTypes.string
    })).isRequired,
    valgtArbeidsgiverId: PropTypes.string
};

const mapStateToProps = (state) => ({
    arbeidsgivere: state.mineArbeidsgivere.arbeidsgivere,
    valgtArbeidsgiverId: state.mineArbeidsgivere.valgtArbeidsgiverId
});

export default connect(mapStateToProps)(Toppmeny);
