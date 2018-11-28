import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ArbeidsgiverHeaderMeny, ArbeidsgiverTabId } from 'pam-frontend-header';
import 'pam-frontend-header/dist/style.css';
import { LOGOUT_URL } from '../fasitProperties';
import { RESET_ARBEIDSGIVER, VELG_ARBEIDSGIVER } from '../../arbeidsgiver/arbeidsgiverReducer';
import './Toppmeny.less';

const loggUt = () => {
    sessionStorage.removeItem('orgnr');
    window.location.href = LOGOUT_URL;
};

const Toppmeny = ({ arbeidsgivere, valgtArbeidsgiverId, velgArbeidsgiver, resetArbeidsgiver, activeTabID }) => {
    const onArbeidsgiverSelect = (orgNummer) => {
        if (orgNummer) {
            velgArbeidsgiver(orgNummer);
        } else {
            resetArbeidsgiver();
        }
    };
    const mappedeArbeidsgivere = arbeidsgivere.map((arbeidsgiver) => ({
        navn: arbeidsgiver.orgnavn,
        orgNummer: arbeidsgiver.orgnr
    }));
    return (
        <div>
            <span className="pilot typo-element">Tidlig versjon</span>
            <ArbeidsgiverHeaderMeny
                onLoggUt={loggUt}
                onArbeidsgiverSelect={onArbeidsgiverSelect}
                arbeidsgivere={mappedeArbeidsgivere}
                valgtArbeidsgiverId={valgtArbeidsgiverId}
                activeTabID={activeTabID}
            />
        </div>
    );
};

Toppmeny.defaultProps = {
    valgtArbeidsgiverId: undefined,
    arbeidsgivere: []
};

Toppmeny.propTypes = {
    arbeidsgivere: PropTypes.arrayOf(PropTypes.shape({
        orgnavn: PropTypes.string,
        orgnr: PropTypes.string
    })),
    valgtArbeidsgiverId: PropTypes.string,
    velgArbeidsgiver: PropTypes.func.isRequired,
    resetArbeidsgiver: PropTypes.func.isRequired,
    activeTabID: PropTypes.string.isRequired
};


const mapStateToProps = (state) => ({
    arbeidsgivere: state.mineArbeidsgivere.arbeidsgivere,
    valgtArbeidsgiverId: state.mineArbeidsgivere.valgtArbeidsgiverId
});

const mapDispatchToProps = (dispatch) => ({
    velgArbeidsgiver: (orgnr) => dispatch({ type: VELG_ARBEIDSGIVER, data: orgnr }),
    resetArbeidsgiver: () => dispatch({ type: RESET_ARBEIDSGIVER })
});

const KandidatsokHeaderComponent = (props) => (
    <Toppmeny {...props} activeTabID={ArbeidsgiverTabId.KANDIDATSOK} />
);

const KandidatlisteHeaderComponent = (props) => (
    <Toppmeny {...props} activeTabID={ArbeidsgiverTabId.KANDIDATLISTER} />
);

export const KandidatsokHeader = connect(mapStateToProps, mapDispatchToProps)(KandidatsokHeaderComponent);

export const KandidatlisteHeader = connect(mapStateToProps, mapDispatchToProps)(KandidatlisteHeaderComponent);
