import React from 'react';
import PropTypes from 'prop-types';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';

class Arbeidserfaring extends React.Component {

    onArbeidserfaringClick = (e) => {

    };

    render() {
        return (
            <Ekspanderbartpanel
                tittel="Velg arbeidserfaring"
                tittelProps="element"
                className="panel--white-bg panel--gray-border blokk-xs"
                apen
            >
                <div
                    role="group"
                    aria-labelledby="arbeidserfaring-filter-header"
                    className="kandidatsok-filter"
                >
                    <div className="filter-arbeidserfaring">
                        <Checkbox
                            name="arbeidserfaring"
                            label="Brannmann"
                        />
                        <Checkbox
                            name="arbeidserfaring"
                            label="Gartner"
                        />
                        <Checkbox
                            name="arbeidserfaring"
                            label="Lærer"
                        />
                        <Checkbox
                            name="arbeidserfaring"
                            label="Sykepleier"
                        />
                        <Checkbox
                            name="arbeidserfaring"
                            label="Javautvikler"
                        />
                    </div>
                </div>
            </Ekspanderbartpanel>
        );
    }
}

Arbeidserfaring.propTypes = {
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Arbeidserfaring);
