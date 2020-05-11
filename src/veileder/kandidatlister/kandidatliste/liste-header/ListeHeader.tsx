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
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide skjemaelement--pink"
                    checked={alleMarkert}
                    onChange={() => onCheckAlleKandidater()}
                />
                <div/>
                <Element>Navn</Element>
                <Element>Fødselsnummer</Element>
                <Element>Lagt til av</Element>
                <Element>Lagt til</Element>
                <div className="kolonne-middels">
                    <div className="status-overskrift">
                        Status
                        <StatusHjelpetekst />
                    </div>
                </div>
                
                {stillingsId && <Element>Utfall</Element>}
                <Element>Notater</Element>
                <Element className="kolonne-midtstilt">Mer info</Element>
                {visArkiveringskolonne && <Element className="kolonne-midtstilt">Slett</Element>}
            </div>
        </div>
    );
};

export default ListeHeader;
