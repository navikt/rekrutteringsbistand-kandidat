import React from 'react';
import PropTypes from 'prop-types';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { CHECK_AGGREGERING, SEARCH, UNCHECK_AGGREGERING } from '../domene';

class Aggregeringer extends React.Component {
    onAggregeringClick = (e) => {
        const { value } = e.target;
        if (e.target.name === 'utdanning') {
            if (e.target.checked) {
                this.props.checkAggregering('nusKoder', value);
            } else {
                this.props.uncheckAggregering('nusKoder', value);
            }
        } else if (e.target.checked) {
            this.props.checkAggregering('styrkKoder', value);
        } else {
            this.props.uncheckAggregering('styrkKoder', value);
        }
        this.props.search(false);
    };

    render() {
        const { aggregations, query } = this.props;
        return (
            aggregations.map((aggregat) => (
                <div key={aggregat.navn}>
                    <Ekspanderbartpanel
                        tittel={aggregat.navn}
                        tittelProps="element"
                        className="panel--white-bg panel--gray-border blokk-xs"
                        apen
                    >
                        <div
                            role="group"
                            aria-labelledby="arbeidserfaring-filter-header"
                            className="search-page-filter"
                        >
                            <div className="filter-arbeidserfaring">
                                {aggregat.felt.map((a) => (
                                    <div key={a.feltnavn}>
                                        <Checkbox
                                            name={aggregat.navn}
                                            label={`${a.feltnavn} (${a.antall})`}
                                            value={a.feltnavn}
                                            onChange={this.onAggregeringClick}
                                            checked={query.nusKoder.includes(a.feltnavn) || query.styrkKoder.includes(a.feltnavn)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Ekspanderbartpanel>
                </div>
            ))
        );
    }
}

Aggregeringer.propTypes = {
    aggregations: PropTypes.arrayOf(PropTypes.object).isRequired,
    checkAggregering: PropTypes.func.isRequired,
    uncheckAggregering: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    query: PropTypes.shape({
        nusKoder: PropTypes.arrayOf(PropTypes.string),
        styrkKoder: PropTypes.arrayOf(PropTypes.string)
    }).isRequired
};

const mapStateToProps = (state) => ({
    aggregations: state.aggregations,
    query: state.query
});

const mapDispatchToProps = (dispatch) => ({
    checkAggregering: (name, value) => dispatch({ type: CHECK_AGGREGERING, name, value }),
    uncheckAggregering: (name, value) => dispatch({ type: UNCHECK_AGGREGERING, name, value }),
    search: (fritekstSok) => dispatch({ type: SEARCH, fritekstSok })
});

export default connect(mapStateToProps, mapDispatchToProps)(Aggregeringer);
