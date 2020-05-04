import React, { FunctionComponent } from 'react';
import './Resultstable.less';
import { Element } from 'nav-frontend-typografi';

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
            {/*<div className="kandidat-content">*/}
            <div className="kolonne-checkbox skjemaelement--pink">
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
            </div>
            <div className="kolonne-tilgjengelitghet-spacer" />
            <Element className="kolonne-navn kolonne-tekst">Navn</Element>
            <Element className="kolonne-dato kolonne-tekst">Fødselsnummer</Element>
            <Element className="kolonne-innsatsgruppe kolonne-tekst">Innsatsgruppe</Element>
            <Element className="kolonne-bosted kolonne-tekst">Bosted</Element>
            {/*</div>*/}
        </div>
    );
};

export default KandidaterTableHeader;
