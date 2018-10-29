import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Panel } from 'nav-frontend-paneler';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { GODTA_VILKAR, HENT_VILKARSTEKST } from './samtykkeReducer';
import Vilkar from './Vilkar';
import './samtykke.less';

import AvgiSamtykkeRad from './AvgiSamtykkeRad';

class GiSamtykke extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: true,
            vilkarstekst: undefined,
            isAdding: false
        };
    }

    componentDidMount() {
        this.props.hentVilkarstekst();
    }

  onSamtykkeChange = (e) => {
      this.setState({
          isSamtykkeChecked: e.target.checked
      });
  };

    handleClick = (e) => {
        e.preventDefault();
        if (this.state.isSamtykkeChecked) {
            this.props.godtaVilkar();
        }
    };

    render() {
        if (this.props.vilkarstekst === undefined) {
            return (
                <Container>
                    <Row>
                        <Column xs="12">
                            <div className="text-center">
                                <NavFrontendSpinner type="M" />
                            </div>
                        </Column>
                    </Row>
                </Container>
            );
        } else if (this.props.vilkarstekst) {
            const avgiSamtykkeRadProps = {
                isAdding: this.state.isAdding,
                onSamtykkeChange: this.onSamtykkeChange,
                isSamtykkeChecked: this.state.isSamtykkeChecked,
                handleClick: this.handleClick
            };
            return (
                <Container className="container-vilkar">
                    <Panel className="panel--vilkar">
                        <Vilkar samtykkeTekst={this.props.vilkarstekst.tekst} />
                        <AvgiSamtykkeRad {...avgiSamtykkeRadProps} />
                    </Panel>
                </Container>
            );
        }
        return (
            <div />
        );
    }
}

GiSamtykke.defaultProps = {
    vilkarstekst: undefined
};

GiSamtykke.propTypes = {
    vilkarstekst: PropTypes.shape({
        ressurs: PropTypes.string,
        tekst: PropTypes.string,
        versjon: PropTypes.string
    }),
    hentVilkarstekst: PropTypes.func.isRequired,
    godtaVilkar: PropTypes.func.isRequired,
    vilkarGodtatt: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    vilkarstekst: state.samtykke.vilkarstekst,
    vilkarGodtatt: state.samtykke.vilkarGodtatt
});

const mapDispatchToProps = (dispatch) => ({
    godtaVilkar: () => dispatch({ type: GODTA_VILKAR }),
    hentVilkarstekst: () => dispatch({ type: HENT_VILKARSTEKST })
});


export default connect(mapStateToProps, mapDispatchToProps)(GiSamtykke);
