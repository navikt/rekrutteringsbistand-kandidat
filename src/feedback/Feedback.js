import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './Feedback.less';

class Feedback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldShowFeedback: !localStorage.getItem('showFeedback')
        };
    }

    hideFeedback = () => {
        localStorage.setItem('showFeedback', false);
        this.setState({ shouldShowFeedback: false });
    }

    render() {
        if (this.state.shouldShowFeedback) {
            return (
                <div className="FeedbackWrapper border--bottom--thin">
                    <div className="container">
                        <div role="alert" className="Feedback typo-normal">
                            <Element className="blokk-xxs">
                                Dette er en tidlig versjon av kandidatsøket.
                            </Element>
                            <Normaltekst className="blokk-xxs">
                                Vi trenger din tilbakemelding for å bli bedre
                            </Normaltekst>
                            <Normaltekst className="blokk-xxs">
                                <a href="https://in.hotjar.com/s?siteId=118350&surveyId=118054" className="lenke" target="_blank" rel="noopener noreferrer">
                                    Gi tilbakemelding her
                                </a>
                            </Normaltekst>
                            <Knapp mini onClick={this.hideFeedback}>Skjul</Knapp>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="FeedbackWrapper border--bottom--thin">
                <div className="container">
                    <div role="alert" className="Feedback--link typo-normal">
                        <Normaltekst className="blokk-xxs">
                            <a href="https://in.hotjar.com/s?siteId=118350&surveyId=118054" className="lenke" target="_blank" rel="noopener noreferrer">
                                Gi tilbakemelding her
                            </a>
                        </Normaltekst>
                    </div>
                </div>
            </div>
        );
    }
}

export default Feedback;
