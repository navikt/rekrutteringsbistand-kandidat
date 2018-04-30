import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Innholdstittel } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import YrkeSearch from './components/YrkeSearch';
import UtdanningSearch from './components/UtdanningSearch';
import ArbeidserfaringSearch from './components/ArbeidserfaringSearch';
import KompetanseSearch from './components/KompetanseSearch';
import GeografiSearch from './components/GeografiSearch';
import KandidaterVisning from './components/KandidaterVisning';
import { SEARCH, SEARCH_BEGIN } from './domene';

class ResultatVisning extends React.Component {
    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
    }

    onRemoveCriteriaClick = () => {
        this.props.resetQuery({
            yrkeserfaring: '',
            yrkeserfaringer: [],
            arbeidserfaringer: [],
            arbeidserfaring: '',
            utdanning: '',
            utdanninger: [],
            kompetanse: '',
            kompetanser: [],
            sprak: '',
            sprakList: [],
            sertifikat: '',
            sertifikater: [],
            geografi: '',
            geografiList: [],
            styrkKode: '',
            nusKode: ''
        });
        this.props.search();
    };

    render() {
        return (
            <div>
                <Row>
                    <Column className="text-center">
                        <Innholdstittel>Aktuelle kandidater</Innholdstittel>
                    </Column>
                </Row>
                <Row className="resultatvisning--body">
                    <Column xs="4">
                        <button
                            className="lenke lenke--slett--kriterier"
                            onClick={this.onRemoveCriteriaClick}
                        >
                            Slett alle kriterier
                        </button>
                        <div className="resultatvisning--sokekriterier">
                            <YrkeSearch />
                            <UtdanningSearch />
                            <ArbeidserfaringSearch />
                            <KompetanseSearch />
                            <GeografiSearch />
                        </div>
                    </Column>
                    <Column xs="8">
                        <KandidaterVisning />
                    </Column>
                </Row>
            </div>
        );
    }
}

ResultatVisning.propTypes = {
    resetQuery: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    // No props
});

const mapDispatchToProps = (dispatch) => ({
    resetQuery: (query) => dispatch({ type: SEARCH_BEGIN, query }),
    search: () => dispatch({ type: SEARCH })
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultatVisning);
