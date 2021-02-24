import React, { FunctionComponent } from 'react';
import { CheckboxGruppe, Checkbox } from 'nav-frontend-skjema';
import { FormidlingAvUsynligKandidatOutboundDto } from './LeggTilKandidatModal';

type Props = {
    formidling: FormidlingAvUsynligKandidatOutboundDto;
    onChange: (formidling: FormidlingAvUsynligKandidatOutboundDto) => void;
};

const RegistrerFormidlingAvUsynligKandidat: FunctionComponent<Props> = ({
    formidling,
    onChange,
}) => (
    <div className="LeggTilKandidatModal__registrer-usynlig-kandidat">
        <CheckboxGruppe>
            <Checkbox
                label="Registrer likevel at personen har blitt presentert"
                checked={formidling.presentert}
                onChange={() =>
                    onChange({
                        ...formidling,
                        presentert: !formidling.presentert,
                    })
                }
            />
            <Checkbox
                label="Registrer likevel at personen har fått jobb"
                checked={formidling.fåttJobb}
                onChange={() => onChange({ ...formidling, fåttJobb: !formidling.fåttJobb })}
            />
        </CheckboxGruppe>
    </div>
);

export default RegistrerFormidlingAvUsynligKandidat;
