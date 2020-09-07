import React, { FunctionComponent } from 'react';
import { FormidlingAvUsynligKandidat } from '../kandidatlistetyper';
import UtfallSelect, { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import './FormidlingAvUsynligKandidatrad.less';

type Props = {
    formidlingAvUsynligKandidat: FormidlingAvUsynligKandidat;
    onUtfallChange: (
        utfall: Utfall,
        formidling: FormidlingAvUsynligKandidat,
        visModal: boolean
    ) => void;
};

const FormidlingAvUsynligKandidatrad: FunctionComponent<Props> = ({
    formidlingAvUsynligKandidat,
    onUtfallChange,
}) => {
    let fulltNavn = `${formidlingAvUsynligKandidat.etternavn}, ${formidlingAvUsynligKandidat.fornavn}`;
    if (formidlingAvUsynligKandidat.mellomnavn) {
        fulltNavn += ' ' + formidlingAvUsynligKandidat.mellomnavn;
    }

    return (
        <div className="formidling-av-usynlig-kandidatrad">
            <span />
            <div className="formidling-av-usynlig-kandidatrad__navn">{fulltNavn}</div>
            <div className="formidling-av-usynlig-kandidatrad__ikkeSynlig">
                Ikke synlig i Rekrutteringsbistand
            </div>
            <div className="formidling-av-usynlig-kandidatrad__utfall">
                <UtfallSelect
                    kanEndreUtfall
                    value={formidlingAvUsynligKandidat.utfall}
                    onChange={(utfall, visModal) =>
                        onUtfallChange(utfall, formidlingAvUsynligKandidat, visModal)
                    }
                />
            </div>
            <span />
        </div>
    );
};

export default FormidlingAvUsynligKandidatrad;
