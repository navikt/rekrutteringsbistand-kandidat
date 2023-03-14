import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import './TruncatedTextList.less';

class TruncatedTextList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hideText: true,
        };
    }

    hideTextToggle = () => {
        this.setState({
            hideText: !this.state.hideText,
        });
    };

    render() {
        if (this.props.tekstElementer.length > this.props.antallElementerSomVisesMinimert) {
            return (
                <>
                    <Row>
                        <Normaltekst>
                            {this.state.hideText
                                ? this.props.tekstElementer
                                      .slice(0, this.props.antallElementerSomVisesMinimert)
                                      .join(', ')
                                : this.props.tekstElementer.join(', ')}
                        </Normaltekst>
                    </Row>
                    <Row>
                        <Knapp
                            className="knapp--seAlle"
                            type="standard"
                            mini
                            onClick={this.hideTextToggle}
                        >
                            {this.state.hideText ? 'Se alle' : 'ikke-vis'}
                        </Knapp>
                    </Row>
                </>
            );
        }
        return (
            <Row>
                <Normaltekst>{this.props.tekstElementer.join(', ')}</Normaltekst>
            </Row>
        );
    }
}

TruncatedTextList.defaultProps = {
    antallElementerSomVisesMinimert: 10,
};

TruncatedTextList.propTypes = {
    tekstElementer: PropTypes.arrayOf(String).isRequired,
    antallElementerSomVisesMinimert: PropTypes.number,
};

export default TruncatedTextList;
