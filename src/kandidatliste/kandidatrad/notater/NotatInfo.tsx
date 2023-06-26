import { FunctionComponent } from 'react';
import { Notat } from '../../domene/Kandidatressurser';
import { formaterTidspunkt } from '../../../utils/dateUtils';
import { Detail } from '@navikt/ds-react';
import css from './Notatliste.module.css';

interface NotatInfoProps {
    notat: Notat;
}

const NotatInfo: FunctionComponent<NotatInfoProps> = ({ notat }) => {
    const fulltNavn = `${notat.lagtTilAv.navn} (${notat.lagtTilAv.ident})`;
    const datovisning = formaterTidspunkt(notat.lagtTilTidspunkt);

    return (
        <Detail>
            <span>{fulltNavn}</span>
            <span> {datovisning}</span>
            {notat.notatEndret && (
                <span>
                    <span> - </span>
                    <span className={css.erRedigert}>redigert</span>
                </span>
            )}
        </Detail>
    );
};

export default NotatInfo;
