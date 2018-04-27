import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Undertittel } from 'nav-frontend-typografi';
import LeggTilKnapp from '../../common/LeggTilKnapp';
import Typeahead from '../../common/Typeahead';
import { SEARCH } from '../domene';

class UtdanningSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
    }

    render() {
        return (
            <div>
                <Undertittel>Utdanning</Undertittel>
                <div className="panel panel--sokekriterier">
                    <Element>Utdanningsnivå</Element>
                </div>
            </div>
        );
    }
}

UtdanningSearch.propTypes = {
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    query: state.query
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH })
});

export default connect(mapStateToProps, mapDispatchToProps)(UtdanningSearch);
