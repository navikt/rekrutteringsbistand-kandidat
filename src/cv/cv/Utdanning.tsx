import React, { FunctionComponent } from 'react';
import Tidsperiode from './Tidsperiode';
import { Utdanning as UtdanningType } from '../reducer/cv-typer';
import { Detail, BodyShort } from '@navikt/ds-react';
import css from './Cv.module.css';

type Props = { utdanning: UtdanningType };

const Utdanning: FunctionComponent<Props> = ({ utdanning }) => {
    return (
        <>
            <Detail className={css.tidsperiode}>
                <Tidsperiode fradato={utdanning.fraDato} tildato={utdanning.tilDato} />
            </Detail>
            <div className={css.erfaring}>
                {utdanning.utdannelsessted && <BodyShort>{utdanning.utdannelsessted}</BodyShort>}
                <BodyShort className={css.bold}>
                    {utdanning.alternativtUtdanningsnavn
                        ? utdanning.alternativtUtdanningsnavn
                        : utdanning.nusKodeUtdanningsnavn}
                </BodyShort>
                {utdanning.beskrivelse && <BodyShort>{utdanning.beskrivelse}</BodyShort>}
            </div>
        </>
    );
};

export default Utdanning;
