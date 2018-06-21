import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { HIDE_DISCLAIMER } from './disclaimerReducer';
import './Disclaimer.less';

function Disclaimer({ shouldShow, hideDisclaimer }) {
    if (shouldShow) {
        return (
            <div className="DisclaimerWrapper border--top--thin">
                <div className="container">
                    <div role="alert" className="Disclaimer typo-normal">
                        <Element className="blokk-xxs">Dette er en tidlig versjon av tjenesten</Element>
                        <Normaltekst className="blokk-xxs">
                            Vi trenger din tilbakemelding for å bli bedre
                        </Normaltekst>
                        <Normaltekst className="blokk-xxs">
                            <a href="https://insights.hotjar.com/s?siteId=118350&surveyId=70090" className="lenke">
                                Gi tilbakemelding her
                            </a>
                        </Normaltekst>
                        <Knapp mini onClick={hideDisclaimer}>Skjul</Knapp>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="DisclaimerWrapper border--top--thin">
            <div className="container">
                <div role="alert" className="Feedback typo-normal">
                    <Normaltekst className="blokk-xxs">
                        <a href="https://insights.hotjar.com/s?siteId=118350&surveyId=70090" className="lenke">
                            Gi tilbakemelding her
                        </a>
                    </Normaltekst>
                </div>
            </div>
        </div>
    );
}

Disclaimer.propTypes = {
    shouldShow: PropTypes.bool.isRequired,
    hideDisclaimer: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    shouldShow: state.disclaimer.shouldShow
});

const mapDispatchToProps = (dispatch) => ({
    hideDisclaimer: () => dispatch({ type: HIDE_DISCLAIMER })
});

export default connect(mapStateToProps, mapDispatchToProps)(Disclaimer);
