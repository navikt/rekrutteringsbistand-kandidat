import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CONTEXT_ROOT, LOGIN_URL, LOGOUT_URL } from '../fasitProperties';
import { useTokenChecker } from '../hooks';
import SesjonUtgaarModal from './SesjonUtgaarModal';

const SesjonUtgaarModalWrapper = ({ children }) => {
    const [sesjonUtloper, setSesjonUtloper] = useState(false);
    const [sesjonHarUtlopt, setSesjonHarUtlopt] = useState(false);

    const visUtloperSnartModal = () => {
        setSesjonUtloper(true);
    };

    const visSesjonUtgaattModal = () => {
        setSesjonHarUtlopt(true);
        setSesjonUtloper(false);
    };

    const redirectToLogin = () => {
        window.location.href = `${LOGIN_URL}&redirect=${window.location.href}`;
    };

    const redirectToLoginMedForsideCallback = () => {
        window.location.href = `${LOGIN_URL}&redirect=${window.location.origin}/${CONTEXT_ROOT}`;
    };

    const loggUt = () => {
        sessionStorage.clear();
        window.location.href = LOGOUT_URL;
    };

    useTokenChecker(visUtloperSnartModal, visSesjonUtgaattModal);

    return (
        <React.Fragment>
            {sesjonHarUtlopt ? (
                <SesjonUtgaarModal
                    tittelTekst="Du har blitt logget ut"
                    innholdTekst="Denne sesjonen har utløpt. Gå til forsiden for å logge inn på nytt."
                    primaerKnappTekst="Til forsiden"
                    onPrimaerKnappClick={redirectToLoginMedForsideCallback}
                    isOpen={sesjonHarUtlopt}
                />
            ) : (sesjonUtloper && (
                <SesjonUtgaarModal
                    tittelTekst="Du blir snart logget ut"
                    innholdTekst="Vil du fortsette å bruke tjenesten?"
                    primaerKnappTekst="Forbli innlogget"
                    onPrimaerKnappClick={redirectToLogin}
                    isOpen={sesjonUtloper}
                    sekundaerKnappTekst="Logg ut"
                    onSekundaerKnappClick={loggUt}
                    sekundaerKnapp
                />
            ))}
            {children}
        </React.Fragment>
    );
};

SesjonUtgaarModalWrapper.propTypes = {
    children: PropTypes.node.isRequired
};

export default SesjonUtgaarModalWrapper;
