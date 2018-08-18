import React from 'react';
import { connect } from 'react-redux';
import { Sidetittel } from 'nav-frontend-typografi';
import { Container, Row } from 'nav-frontend-grid';

import { MatchexplainProptypesGrouped } from './Proptypes';
import Matchforklaring from './Matchforklaring';

const Matchdetaljer = ({ matchforklaring }) => (
    <div>
        <div className="search-page-header" />
        <Container className="search-page-margin">
            <Sidetittel>Matchdetaljer</Sidetittel>
        </Container>
        <Container className="container-width">
            <Row>
                        (matchforklaring && <Matchforklaring matchforklaring={matchforklaring} />)
            </Row>
        </Container>
    </div>
);

Matchdetaljer.defaultProps = {
    matchforklaring: undefined
};

Matchdetaljer.propTypes = {
    matchforklaring: MatchexplainProptypesGrouped
};

const mapStateToProps = (state) => ({
    matchforklaring: state.cvReducer.matchforklaring
});

export default connect(mapStateToProps)(Matchdetaljer);
