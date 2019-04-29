import React from 'react';
import Proptypes from 'prop-types';
import { Container } from 'nav-frontend-grid';
import { Panel } from 'nav-frontend-paneler';
import Vilkar from '../Vilkar';
import AvgiSamtykkeRad from './AvgiSamtykkeRad';

const AvgiSamtykke = ({ godtaVilkar, isSavingVilkar, vilkarstekst }) => (
    <Container className="container-vilkar">
        <Panel className="panel--vilkar">
            <Vilkar samtykkeTekst={vilkarstekst} />
            <AvgiSamtykkeRad isSavingVilkar={isSavingVilkar} onGodtaVilkar={godtaVilkar} />
        </Panel>
    </Container>
);

AvgiSamtykke.propTypes = {
    vilkarstekst: Proptypes.string.isRequired,
    isSavingVilkar: Proptypes.bool.isRequired,
    godtaVilkar: Proptypes.func.isRequired
};

export default AvgiSamtykke;
