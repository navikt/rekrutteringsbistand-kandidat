import React, { FunctionComponent } from 'react';
import { FormidlingAvUsynligKandidat } from '../kandidatlistetyper';
import UtfallMedEndreIkon from '../kandidatrad/utfall-med-endre-ikon/UtfallMedEndreIkon';
import './FormidlingAvUsynligKandidatrad.less';

type Props = {
    formidling: FormidlingAvUsynligKandidat;
    onUtfallChange: (formidling: FormidlingAvUsynligKandidat) => void;
    kandidatlistenErLukket: boolean;
    erEierAvKandidatlisten: boolean;
};

const FormidlingAvUsynligKandidatrad: FunctionComponent<Props> = ({
    formidling,
    onUtfallChange,
    kandidatlistenErLukket,
    erEierAvKandidatlisten,
}) => {
    let fulltNavn = `${formidling.etternavn}, ${formidling.fornavn}`;
    if (formidling.mellomnavn) {
        fulltNavn += ' ' + formidling.mellomnavn;
    }

    return (
        <div
            className={`formidling-av-usynlig-kandidatrad${
                kandidatlistenErLukket ? ' formidling-av-usynlig-kandidatrad--lukket-liste' : ''
            }`}
        >
            <span />
            <div className="formidling-av-usynlig-kandidatrad__navn">{fulltNavn}</div>
            <div className="formidling-av-usynlig-kandidatrad__ikkeSynlig">
                Ikke synlig i Rekrutteringsbistand
            </div>
            <div className="formidling-av-usynlig-kandidatrad__utfall">
                <UtfallMedEndreIkon
                    kanEndreUtfall={erEierAvKandidatlisten && !kandidatlistenErLukket}
                    utfall={formidling.utfall}
                    onClick={() => onUtfallChange(formidling)}
                />
            </div>
            <span />
        </div>
    );
};

export default FormidlingAvUsynligKandidatrad;
