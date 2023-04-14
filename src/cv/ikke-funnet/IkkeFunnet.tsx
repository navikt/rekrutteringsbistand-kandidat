import React, { FunctionComponent } from 'react';
import css from './IkkeFunnet.module.css';
import { BodyShort, Heading, Label } from '@navikt/ds-react';

const IkkeFunnet: FunctionComponent = () => {
    return (
        <div className={css.cvIkkeFunnet}>
            <div className={css.content}>
                <Heading level="3" size="medium" spacing>
                    Kandidaten kan ikke vises
                </Heading>
                <div>
                    <Label>Mulige årsaker:</Label>
                    <ul>
                        <li>
                            <BodyShort>Kandidaten har skiftet status</BodyShort>
                        </li>
                        <li>
                            <BodyShort>Tekniske problemer</BodyShort>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default IkkeFunnet;
