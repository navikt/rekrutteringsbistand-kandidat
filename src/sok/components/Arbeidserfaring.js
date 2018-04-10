import React from 'react';
import PropTypes from 'prop-types';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';

class Arbeidserfaring extends React.Component {

    onArbeidserfaringClick = (e) => {

    };

    render() {
        const { sokeResultat } = this.props;
        return (
            sokeResultat.aggregeringer.map((aggregat) => (
                <div key={aggregat.navn}>
                    <Ekspanderbartpanel
                        tittel={`${aggregat.navn} (${aggregat.felt.length})`}
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
                                            label={a.feltnavn}
                                            // value=
                                            // onChange=
                                            // checked=
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

Arbeidserfaring.propTypes = {
    sokeResultat: PropTypes.shape(
        PropTypes.arrayOf(PropTypes.object).isRequired,
        PropTypes.arrayOf(PropTypes.object)
    ).isRequired
};

const mapStateToProps = (state) => ({
    sokeResultat: state.elasticSearchResultat.resultat
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Arbeidserfaring);
