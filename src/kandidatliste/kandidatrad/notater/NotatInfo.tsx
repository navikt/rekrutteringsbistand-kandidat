import React, { FunctionComponent } from 'react';
import { Notat } from '../../domene/Kandidatressurser';
import { formaterTidspunkt } from '../../../utils/dateUtils';

interface NotatInfoProps {
    notat: Notat;
}

const NotatInfo: FunctionComponent<NotatInfoProps> = ({ notat }) => {
    const fulltNavn = `${notat.lagtTilAv.navn} (${notat.lagtTilAv.ident})`;
    const datovisning = formaterTidspunkt(notat.lagtTilTidspunkt);

    return (
        <div className="notater__notatinfo">
            <span>{fulltNavn}</span>
            <span> {datovisning}</span>
            {notat.notatEndret && (
                <span>
                    <span> - </span>
                    <span className="notater__notatinfo--red-tekst">redigert</span>
                </span>
            )}
        </div>
    );
};

export default NotatInfo;
