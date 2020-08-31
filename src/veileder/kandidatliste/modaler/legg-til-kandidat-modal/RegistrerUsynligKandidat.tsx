import React, { FunctionComponent, useState } from 'react';
import { CheckboxGruppe, Checkbox } from 'nav-frontend-skjema';
import { NyUsynligKandidat } from './LeggTilKandidatModal';

type Props = {
    nyUsynligKandidat: NyUsynligKandidat;
    onChange: (nyUsynligKandidat: NyUsynligKandidat) => void;
};

const RegistrerUsynligKandidat: FunctionComponent<Props> = ({ nyUsynligKandidat, onChange }) => (
    <div className="LeggTilKandidatModal__registrer-usynlig-kandidat">
        <CheckboxGruppe>
            <Checkbox
                label="Registrer likevel at personen har blitt presentert"
                checked={nyUsynligKandidat.harBlittPresentert}
                onChange={() =>
                    onChange({
                        ...nyUsynligKandidat,
                        harBlittPresentert: !nyUsynligKandidat.harBlittPresentert,
                    })
                }
            />
            <Checkbox
                label="Registrer likevel at personen har fått jobb"
                checked={nyUsynligKandidat.harFåttJobb}
                onChange={() =>
                    onChange({ ...nyUsynligKandidat, harFåttJobb: !nyUsynligKandidat.harFåttJobb })
                }
            />
        </CheckboxGruppe>
    </div>
);

export default RegistrerUsynligKandidat;
