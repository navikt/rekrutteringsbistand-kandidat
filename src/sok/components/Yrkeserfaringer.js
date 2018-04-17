import React from 'react';
import PropTypes from 'prop-types';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import { CHECK_YRKESERFARING, SEARCH, UNCHECK_YRKESERFARING } from '../domene';

class Yrkeserfaringer extends React.Component {
    onYrkeserfaringClick = (e) => {
        const { value } = e.target;
        if (e.target.checked) {
            this.props.checkYrkeserfaring(value);
        } else {
            this.props.uncheckYrkeserfaring(value);
        }
        this.props.search(false);
    };

    render() {
        const { aggregations, styrkKoder } = this.props;
        return (
            <Ekspanderbartpanel
                tittel="Yrkeserfaring"
                tittelProps="element"
                className="panel--white-bg panel--gray-border blokk-xs"
                apen
            >
                <div
                    role="group"
                    aria-labelledby="yrkeserfaring-filter-header"
                    className="search-page-filter"
                >
                    <div className="filter-utdanning">
                        {aggregations[1] && aggregations[1].felt.map((yrke, i) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={i} className="aggregering-niva-1">
                                <Checkbox
                                    name="yrkeserfaring"
                                    label={`${yrke.feltnavn} (${yrke.antall})`}
                                    value={yrke.feltnavn}
                                    onChange={this.onYrkeserfaringClick}
                                    checked={styrkKoder.includes(yrke.feltnavn)}
                                />
                                {styrkKoder.includes(yrke.feltnavn) && (
                                    yrke.subfelt && yrke.subfelt.map((sub, i2) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <div key={i2} className="aggregering-niva-2">
                                            <Checkbox
                                                name="yrkeserfaring"
                                                label={`${sub.feltnavn} (${sub.antall})`}
                                                value={sub.feltnavn}
                                                onChange={this.onYrkeserfaringClick}
                                                checked={styrkKoder.includes(sub.feltnavn)}
                                            />
                                            {styrkKoder.includes(sub.feltnavn) && (
                                                sub.subfelt && sub.subfelt.map((sub2, i3) => (
                                                    // eslint-disable-next-line react/no-array-index-key
                                                    <div key={i3} className="aggregering-niva-3">
                                                        <Checkbox
                                                            name="yrkeserfaring"
                                                            label={`${sub2.feltnavn} (${sub2.antall})`}
                                                            value={sub2.feltnavn}
                                                            onChange={this.onYrkeserfaringClick}
                                                            checked={styrkKoder.includes(sub2.feltnavn)}
                                                        />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Ekspanderbartpanel>
        );
    }
}

Yrkeserfaringer.propTypes = {
    aggregations: PropTypes.arrayOf(PropTypes.object).isRequired,
    search: PropTypes.func.isRequired,
    checkYrkeserfaring: PropTypes.func.isRequired,
    uncheckYrkeserfaring: PropTypes.func.isRequired,
    styrkKoder: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    aggregations: state.aggregations,
    styrkKoder: state.query.styrkKoder
});

const mapDispatchToProps = (dispatch) => ({
    checkYrkeserfaring: (value) => dispatch({ type: CHECK_YRKESERFARING, value }),
    uncheckYrkeserfaring: (value) => dispatch({ type: UNCHECK_YRKESERFARING, value }),
    search: (fritekstSok) => dispatch({ type: SEARCH, fritekstSok })
});

export default connect(mapStateToProps, mapDispatchToProps)(Yrkeserfaringer);
