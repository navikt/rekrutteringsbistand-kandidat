import React from 'react';
import PropTypes from 'prop-types';
import { Hovedknapp } from 'nav-frontend-knapper';
import { PopoverOrientering } from 'nav-frontend-popover';
import HjelpetekstMedAnker from '../../../felles/common/hjelpetekst-med-anker/HjelpetekstMedAnker';
import './KnappMedHjelpetekst.less';

const KnappMedHjelpetekst = ({ disabled, onClick, children, spinner, hjelpetekst, id, tittel }) =>
    disabled ? (
        <HjelpetekstMedAnker innhold={hjelpetekst} orientering={PopoverOrientering.Under}>
            <div title={tittel} className="knapp-med-hjelpetekst__knapp knapp knapp--disabled">
                {children}
            </div>
        </HjelpetekstMedAnker>
    ) : (
        <Hovedknapp
            id={id}
            className="knapp-med-hjelpetekst__knapp"
            spinner={spinner}
            onClick={onClick}
            title={tittel}
        >
            {children}
        </Hovedknapp>
    );

KnappMedHjelpetekst.propTypes = {
    disabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    hjelpetekst: PropTypes.string.isRequired,
    tittel: PropTypes.string.isRequired,
    children: PropTypes.string,
    spinner: PropTypes.bool,
    id: PropTypes.string,
};

KnappMedHjelpetekst.defaultProps = {
    children: '',
    spinner: false,
    id: undefined,
};

export default KnappMedHjelpetekst;
