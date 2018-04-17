import React from 'react';
import PropTypes from 'prop-types';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { CHECK_UTDANNING, SEARCH, UNCHECK_UTDANNING } from '../domene';

class Utdanninger extends React.Component {
    onUtdanningerClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkUtdanning(value);
        } else {
            this.props.uncheckUtdanning(value);
        }
        this.props.search(false);
    };

    render() {
        const { aggregations, checkedNusKoder } = this.props;
        return (
            <Ekspanderbartpanel
                tittel="Utdanning"
                tittelProps="element"
                className="panel--white-bg panel--gray-border blokk-xs"
                apen
            >
                <div
                    role="group"
                    aria-labelledby="yrkeserfaring-filter-header"
                    className="search-page-filter"
                >
                    <div className="aggregation-filter">
                        { aggregations[0] && aggregations[0].felt.map((utdanning, i) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={i} className="aggregering-niva-1">
                                <Checkbox
                                    name="utdanning"
                                    label={`${utdanning.feltnavn} (${utdanning.antall})`}
                                    value={utdanning.feltnavn}
                                    onChange={this.onUtdanningerClick}
                                    checked={checkedNusKoder.includes(utdanning.feltnavn)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Ekspanderbartpanel>
        );
    }
}

Utdanninger.propTypes = {
    aggregations: PropTypes.arrayOf(PropTypes.object).isRequired,
    search: PropTypes.func.isRequired,
    checkUtdanning: PropTypes.func.isRequired,
    uncheckUtdanning: PropTypes.func.isRequired,
    checkedNusKoder: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    aggregations: state.aggregations,
    checkedNusKoder: state.query.nusKoder
});

const mapDispatchToProps = (dispatch) => ({
    checkUtdanning: (value) => dispatch({ type: CHECK_UTDANNING, value }),
    uncheckUtdanning: (value) => dispatch({ type: UNCHECK_UTDANNING, value }),
    search: (fritekstSok) => dispatch({ type: SEARCH, fritekstSok })
});

export default connect(mapStateToProps, mapDispatchToProps)(Utdanninger);
