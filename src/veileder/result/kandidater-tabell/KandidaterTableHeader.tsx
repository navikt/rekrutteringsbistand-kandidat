import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import './KandidaterTabell.less';

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
                <input
                    type="checkbox"
                    id="marker-alle-kandidater-checkbox"
                    className="skjemaelement__input checkboks"
                    aria-label="Marker alle kandidater"
                    checked={alleKandidaterMarkert}
                    onChange={onToggleMarkeringAlleKandidater}
                />
                <label
                    className="skjemaelement__label"
                    htmlFor="marker-alle-kandidater-checkbox"
                    aria-hidden="true"
                >
                    .
                </label>
            </div>
            <div />
            <Element className="kandidater-tabell__kolonne-tekst">Navn</Element>
            <div />
            <Element className="kandidater-tabell__kolonne-tekst">Fødselsnummer</Element>
            <Element className="kandidater-tabell__kolonne-tekst">Innsatsgruppe</Element>
            <Element className="kandidater-tabell__kolonne-tekst">Bosted</Element>
        </div>
    );
};

export default KandidaterTableHeader;
