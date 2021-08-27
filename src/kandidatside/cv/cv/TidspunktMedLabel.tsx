import React, { FunctionComponent } from 'react';
import { formatISOString } from '../../../utils/dateUtils';

type Props = {
    tidspunkt: Date | null;
    labelTekst: string;
};

const TidspunktMedLabel: FunctionComponent<Props> = ({ tidspunkt, labelTekst }) => {
    let tidspunktSomString =
        tidspunkt == null ? 'dato mangler' : formatISOString(tidspunkt.toISOString());
    return (
        <span>
            {labelTekst} {tidspunktSomString}
        </span>
    );
};

export default TidspunktMedLabel;
