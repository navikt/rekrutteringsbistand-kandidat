import React, { FunctionComponent } from 'react';
import './Resultstable.less';

interface Props {
    alleKandidaterMarkert: boolean;
    onToggleMarkeringAlleKandidater: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const KandidaterTableHeader: FunctionComponent<Props> = ({
    alleKandidaterMarkert,
    onToggleMarkeringAlleKandidater,
}) => {
    return (
        <div className="NyKandidaterTableRow overskrift">
            <div className="kandidat-content">
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
                <div className="kolonne-navn kolonne-tekst kolonne-overskrift">Navn </div>
                <div className="kolonne-dato kolonne-tekst kolonne-overskrift">Fødselsnummer</div>
                <div className="kolonne-innsatsgruppe kolonne-tekst kolonne-overskrift">
                    Innsatsgruppe
                </div>
                <div className="kolonne-bosted kolonne-tekst kolonne-overskrift">Bosted</div>
            </div>
        </div>
    );
};

export default KandidaterTableHeader;
