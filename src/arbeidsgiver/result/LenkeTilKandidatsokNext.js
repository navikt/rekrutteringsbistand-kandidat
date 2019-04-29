import React from 'react';
import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import './LenkeTilKandidatsokNext.less';

const LenkeTilKandidatsokNext = () => (
    <LenkepanelBase href="/kandidater-next" border={false} className="LenkeTilKandidatsokNext">
        <div>
            <h2 className="LenkeTilKandidatsokNext-header">Kandidatmatch</h2>
            <p className="LenkeTilKandidatsokNext-body">Vil du teste vår nye eksperimentelle søkemotor med kunstig intelligens?</p>
        </div>
    </LenkepanelBase>
);

export default LenkeTilKandidatsokNext;
