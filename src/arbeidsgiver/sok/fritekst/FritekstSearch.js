import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';
import { connect } from 'react-redux';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import { SEARCH } from '../../../arbeidsgiver/sok/searchReducer';
import { SET_FRITEKST_SOKEORD, TOGGLE_FRITEKST_PANEL } from '../../../arbeidsgiver/sok/fritekst/fritekstReducer';
import FritekstSearchFelles from '../../../felles/sok/fritekst/FritekstSearch';
import './Fritekst.less';

const FritekstSearch = ({ fritekstSokeord, search, setFritekstSokeord, togglePanelOpen, panelOpen }) => (
    <SokekriteriePanel
        id="FritekstSearch__SokekriteriePanel"
        tittel="Fritekst"
        onClick={togglePanelOpen}
        apen={panelOpen}
    >
        <Element>
            Fritekstsøk i kandidatenes CV
        </Element>
        <FritekstSearchFelles
            setFritekstSokeord={setFritekstSokeord}
            fritekstSokeord={fritekstSokeord}
            search={search}
            placeholderTekst="Skriv inn søkeord"
        />
    </SokekriteriePanel>
);

FritekstSearch.propTypes = {
    search: PropTypes.func.isRequired,
    fritekstSokeord: PropTypes.string.isRequired,
    setFritekstSokeord: PropTypes.func.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    panelOpen: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    fritekstSokeord: state.fritekst.fritekst,
    panelOpen: state.fritekst.panelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_FRITEKST_PANEL }),
    setFritekstSokeord: (fritekstSokeord) => dispatch({ type: SET_FRITEKST_SOKEORD, fritekst: fritekstSokeord })
});

export default connect(mapStateToProps, mapDispatchToProps)(FritekstSearch);
