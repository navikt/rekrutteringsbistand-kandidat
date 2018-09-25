import Knapp from 'nav-frontend-knapper';
import { Row } from 'nav-frontend-grid';
import Normaltekst from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import './HideText.less';

class HideText extends React.Component {
    constructor() {
        super();
        this.state = {
            hideText: true
        };
    }

    hideTextToggle = () => {
        this.setState({
            hideText: !this.state.hideText
        });
    };

    render() {
        const showButton = this.props.text.length > this.props.textLength;

        return (
            <div>
                <Row className="row--hideText">
                    <Normaltekst type="normaltekst">
                        {this.state.hideText ?
                            this.props.text.slice(0, this.props.textLength)
                                .join(', ')
                            : this.props.text.join(', ')
                        }
                    </Normaltekst>
                </Row>
                <Row>
                    <Knapp className={[showButton ? '' : 'hidden', 'knapp--seAlle'].join(' ')} type="standard" mini onClick={this.hideTextToggle}>
                        {this.state.hideText ? 'Se alle' : 'Skjul'}
                    </Knapp>
                </Row>
            </div>
        );
    }
}

HideText.defaultProps = {
    textLength: 10
};

HideText.propTypes = {
    text: PropTypes.arrayOf(String).isRequired,
    textLength: PropTypes.number
};

export default (HideText);
