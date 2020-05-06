import React from 'react';
import './TilToppenKnapp.less';
import { Knapp } from 'nav-frontend-knapper';

export const TilToppenKnapp = () => {
    return (
        <Knapp
            type="hoved"
            className="tilToppenKnapp"
            onClick={() => window.scrollTo({ top: 0 })}
        >
            til toppen
        </Knapp>
    );
};
