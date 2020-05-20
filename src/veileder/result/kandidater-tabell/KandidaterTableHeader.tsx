import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import './KandidaterTabell.less';
import { Checkbox } from 'nav-frontend-skjema';

interface Props {
    alleKandidaterMarkert: boolean;
    onToggleMarkeringAlleKandidater: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const KandidaterTableHeader: FunctionComponent<Props> = ({
    alleKandidaterMarkert,
    onToggleMarkeringAlleKandidater,
}) => {
    return (
        <div className="kandidater-tabell__rad kandidater-tabell__rad--header">
            <div className="skjemaelement skjemaelement--horisontal text-hide">
                <Checkbox
                    label="&#8203;"
                    id="marker-alle-kandidater-checkbox"
                    aria-label="Marker alle kandidater"
                    checked={alleKandidaterMarkert}
                    onChange={onToggleMarkeringAlleKandidater}
                />
            </div>
            <div />
            <Element className="kandidater-tabell__kolonne-tekst">Navn</Element>
            <Element className="kandidater-tabell__kolonne-tekst">Fødselsnummer</Element>
            <Element className="kandidater-tabell__kolonne-tekst">Innsatsgruppe</Element>
            <Element className="kandidater-tabell__kolonne-tekst">Bosted</Element>
        </div>
    );
};

export default KandidaterTableHeader;
