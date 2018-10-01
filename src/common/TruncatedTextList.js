import React from 'react';
import PropTypes from 'prop-types';
import Knapp from 'nav-frontend-knapper';
import { Row } from 'nav-frontend-grid';
import Normaltekst from 'nav-frontend-typografi';
import './TruncatedTextList.less';

class TruncatedTextList extends React.Component {
    constructor(props) {
        super(props);
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
        if (this.props.tekstElementer.length > this.props.antallElementerSomVisesMinimert) {
            return (
                <div>
                    <Row className="row--truncatedTextList">
                        <Normaltekst type="normaltekst">
                            {this.state.hideText ?
                                this.props.tekstElementer.slice(0, this.props.antallElementerSomVisesMinimert)
                                    .join(', ')
                                : this.props.tekstElementer.join(', ')
                            }
                        </Normaltekst>
                    </Row>
                    <Row>
                        <Knapp className="knapp--seAlle" type="standard" mini onClick={this.hideTextToggle}>
                            {this.state.hideText ? 'Se alle' : 'Skjul'}
                        </Knapp>
                    </Row>
                </div>
            );
        }
        return (
            <div>
                <Row className="row--truncatedTextList">
                    <Normaltekst type="normaltekst">
                        {this.props.tekstElementer.join(', ')}
                    </Normaltekst>
                </Row>
            </div>
        );
    }
}

TruncatedTextList.defaultProps = {
    antallElementerSomVisesMinimert: 10
};

TruncatedTextList.propTypes = {
    tekstElementer: PropTypes.arrayOf(String).isRequired,
    antallElementerSomVisesMinimert: PropTypes.number
};

export default TruncatedTextList;
