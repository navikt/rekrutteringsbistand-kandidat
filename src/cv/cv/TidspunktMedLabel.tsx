import { FunctionComponent } from 'react';
import { formaterDatoTilMånedOgÅr } from '../../utils/dateUtils';

type Props = {
    tidspunkt: Date | null;
    labelTekst: string;
};

const TidspunktMedLabel: FunctionComponent<Props> = ({ tidspunkt, labelTekst }) => {
    let tidspunktSomString =
        tidspunkt == null ? 'dato mangler' : formaterDatoTilMånedOgÅr(tidspunkt.toISOString());

    return (
        <span>
            {labelTekst} {tidspunktSomString}
        </span>
    );
};

export default TidspunktMedLabel;
