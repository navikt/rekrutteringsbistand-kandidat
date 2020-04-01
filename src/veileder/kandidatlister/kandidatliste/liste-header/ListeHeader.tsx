import React, { FunctionComponent } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import StatusHjelpetekst from './StatusHjelpetekst';

interface Props {
    stillingsId: string | null;
    alleMarkert: boolean;
    onCheckAlleKandidater: () => void;
    visArkiveringskolonne: boolean;
}

export const modifierTilListeradGrid = (
    visUtfallskolonne: boolean,
    visArkiveringskolonne: boolean
) => {
    if (visUtfallskolonne) {
        return visArkiveringskolonne
            ? ' liste-rad--vis-utfall-og-arkivering'
            : ' liste-rad--vis-utfall';
    } else {
        return visArkiveringskolonne ? ' liste-rad--vis-arkivering' : '';
    }
};

const ListeHeader: FunctionComponent<Props> = ({
    stillingsId,
    alleMarkert,
    onCheckAlleKandidater,
    visArkiveringskolonne,
}) => {
    const klassenavnForListerad =
        'liste-rad' + modifierTilListeradGrid(stillingsId !== null, visArkiveringskolonne);

    return (
        <div className="liste-rad-wrapper liste-header">
            <div className={klassenavnForListerad}>
                <div className="kolonne-checkboks">
                    <Checkbox
                        label="&#8203;" // <- tegnet for tom streng
                        className="text-hide skjemaelement--pink"
                        checked={alleMarkert}
                        onChange={onCheckAlleKandidater}
                    />
                </div>
                <div className="kolonne-bred">
                    <Element>Navn</Element>
                </div>
                <div className="kolonne-dato">
                    <Element>Fødselsnummer</Element>
                </div>
                <div className="kolonne-bred">
                    <Element>Lagt til av</Element>
                </div>
                <div className="kolonne-middels">
                    <div className="status-overskrift">
                        Status
                        <StatusHjelpetekst />
                    </div>
                </div>
                {stillingsId && (
                    <div className="kolonne-bred">
                        <Element>Utfall</Element>
                    </div>
                )}
                <div className="kolonne-smal">
                    <Element>Notater</Element>
                </div>
                <div className="kolonne-smal">
                    <Element>Mer info</Element>
                </div>
                {visArkiveringskolonne && (
                    <div className="kolonne-smal">
                        <Element>Slett</Element>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListeHeader;
