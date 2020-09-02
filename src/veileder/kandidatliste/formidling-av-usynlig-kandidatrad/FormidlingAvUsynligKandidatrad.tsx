import React, { FunctionComponent } from 'react';
import { FormidlingAvUsynligKandidat } from '../kandidatlistetyper';
import UtfallSelect from '../kandidatrad/utfall-select/UtfallSelect';
import './FormidlingAvUsynligKandidatrad.less';

type Props = {
    formidlingAvUsynligKandidat: FormidlingAvUsynligKandidat;
};

const FormidlingAvUsynligKandidatrad: FunctionComponent<Props> = ({
    formidlingAvUsynligKandidat,
}) => {
    const fulltNavn = `${formidlingAvUsynligKandidat.fornavn}${
        formidlingAvUsynligKandidat.mellomnavn ? ' ' + formidlingAvUsynligKandidat.mellomnavn : ''
    } ${formidlingAvUsynligKandidat.etternavn}`;

    return (
        <div className="formidling-av-usynlig-kandidatrad">
            <span />
            <div className="formidling-av-usynlig-kandidatrad__navn">{fulltNavn}</div>
            <div className="formidling-av-usynlig-kandidatrad__ikkeSynlig">
                Ikke synlig i Rekrutteringsbistand
            </div>
            <div className="formidling-av-usynlig-kandidatrad__utfall">
                <UtfallSelect
                    value={formidlingAvUsynligKandidat.utfall}
                    onChange={() => {}}
                    kanEndreUtfall={false}
                />
            </div>
        </div>
    );
};

export default FormidlingAvUsynligKandidatrad;
