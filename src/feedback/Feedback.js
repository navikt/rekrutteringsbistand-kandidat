import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './Feedback.less';
import { HIDE_FEEDBACK } from './feedbackReducer';

function Feedback({ shouldShowFeedback, hideFeedback }) {
    if (shouldShowFeedback) {
        return (
            <div className="FeedbackWrapper border--top--thin">
                <div className="container">
                    <div role="alert" className="Feedback typo-normal">
                        <Element className="blokk-xxs">
                            Dette er en tidlig versjon av kandidatsøket.
                        </Element>
                        <Normaltekst className="blokk-xxs">
                            Vi trenger din tilbakemelding for å bli bedre
                        </Normaltekst>
                        <Normaltekst className="blokk-xxs">
                            <a href="https://insights.hotjar.com/s?siteId=118350&surveyId=70090" className="lenke">
                                Gi tilbakemelding her
                            </a>
                        </Normaltekst>
                        <Knapp mini onClick={hideFeedback}>Skjul</Knapp>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="FeedbackWrapper border--top--thin">
            <div className="container">
                <div role="alert" className="Feedback--link typo-normal">
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

Feedback.propTypes = {
    shouldShowFeedback: PropTypes.bool.isRequired,
    hideFeedback: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    shouldShowFeedback: state.feedback.shouldShowFeedback
});

const mapDispatchToProps = (dispatch) => ({
    hideFeedback: () => dispatch({ type: HIDE_FEEDBACK })
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
