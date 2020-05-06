import React from 'react';
import './TilToppenKnapp.less';
import { Knapp } from 'nav-frontend-knapper';
import { TilToppenIkon } from './TilToppenIkon';

export const TilToppenKnapp = () => {
    return (
        <div className="test">
            <div className="tilToppenKnapp" >
            <TilToppenIkon/>
            </div>
        <Knapp type="hoved" className="tilToppenKnapp" onClick={() => window.scrollTo({ top: 0 })}>
            <TilToppenIkon />
        </Knapp>
            </div>
    );
};
