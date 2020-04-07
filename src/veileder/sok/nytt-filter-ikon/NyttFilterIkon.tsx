import React, { FunctionComponent } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import './NyttFilterIkon.less';

const NyttFilterIkon: FunctionComponent = () => {
    return (
        <div className="nytt-filter-ikon">
            <Normaltekst tag="span">NY</Normaltekst>
        </div>
    );
};

export default NyttFilterIkon;
