import React, { FunctionComponent } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './IkkeFunnet.less';

const IkkeFunnet: FunctionComponent = () => {
    return (
        <div className="cv-ikke-funnet">
            <div className="cv-ikke-funnet__content">
                <Element tag="h2" className="blokk-s">
                    Kandidaten kan ikke vises
                </Element>
                <div>
                    <Normaltekst>Mulige årsaker:</Normaltekst>
                    <ul>
                        <li className="blokk-xxs">
                            <Normaltekst>Kandidaten har skiftet status</Normaltekst>
                        </li>
                        <li>
                            <Normaltekst>Tekniske problemer</Normaltekst>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default IkkeFunnet;
