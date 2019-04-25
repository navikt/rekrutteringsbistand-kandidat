import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GODTA_VILKAR, HENT_VILKARSTEKST } from './samtykkeReducer';
import AvgiSamtykke from './avgiSamtykke/AvgiSamtykke';
import './SamtykkeSide.less';
import TomToppmeny from '../common/toppmeny/TomToppmeny';
import { Footer } from 'pam-frontend-footer';
import SubHeader from '../common/subHeader/SubHeader';
import Spinner from '../../felles/common/Spinner';

const SamtykkeSide = ({ godtaVilkar, hentVilkarstekst, isSavingVilkar, vilkarstekst }) => {
    useEffect(() => {
        hentVilkarstekst();
    }, []);

    return (
        <div className="Application SamtykkeSide">
            <div className="Application__main">
                <TomToppmeny />
                <SubHeader
                    backLink="/"
                    backLinkText="Til forsiden"
                    title="Vilkår"
                />
                {vilkarstekst ? (
                    <AvgiSamtykke
                        isSavingVilkar={isSavingVilkar}
                        godtaVilkar={godtaVilkar}
                        vilkarstekst={vilkarstekst}
                    />
                ) : (
                    <Spinner />
                )}
            </div>
            <Footer />
        </div>
    );
};

SamtykkeSide.defaultProps = {
    vilkarstekst: undefined
};

SamtykkeSide.propTypes = {
    vilkarstekst: PropTypes.string,
    hentVilkarstekst: PropTypes.func.isRequired,
    godtaVilkar: PropTypes.func.isRequired,
    isSavingVilkar: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    vilkarstekst: state.samtykke.vilkarstekst ? state.samtykke.vilkarstekst.tekst : undefined,
    isSavingVilkar: state.samtykke.isSavingVilkar
});

const mapDispatchToProps = (dispatch) => ({
    godtaVilkar: () => dispatch({ type: GODTA_VILKAR }),
    hentVilkarstekst: () => dispatch({ type: HENT_VILKARSTEKST })
});


export default connect(mapStateToProps, mapDispatchToProps)(SamtykkeSide);
