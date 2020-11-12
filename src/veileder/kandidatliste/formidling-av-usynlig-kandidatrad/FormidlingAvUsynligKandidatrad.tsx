import React, { FunctionComponent } from 'react';
import { FormidlingAvUsynligKandidat } from '../kandidatlistetyper';
import UtfallMedEndreIkon from '../kandidatrad/utfall-med-endre-ikon/UtfallMedEndreIkon';
import './FormidlingAvUsynligKandidatrad.less';

type Props = {
    formidling: FormidlingAvUsynligKandidat;
    visEndreUtfallModalUsynligKandidat: (formidling: FormidlingAvUsynligKandidat) => void;
    kandidatlistenErLukket: boolean;
    erEierAvKandidatlisten: boolean;
};

const FormidlingAvUsynligKandidatrad: FunctionComponent<Props> = ({
    formidling,
    visEndreUtfallModalUsynligKandidat,
    kandidatlistenErLukket,
    erEierAvKandidatlisten,
}) => {
    let fulltNavn = `${formidling.etternavn}, ${formidling.fornavn}`;
    if (formidling.mellomnavn) {
        fulltNavn += ' ' + formidling.mellomnavn;
    }

    return (
        <div
            role="row"
            className={`formidling-av-usynlig-kandidatrad${
                kandidatlistenErLukket ? ' formidling-av-usynlig-kandidatrad--lukket-liste' : ''
            }`}
        >
            <span />
            <div
                role="cell"
                className="formidling-av-usynlig-kandidatrad__navn formidling-av-usynlig-kandidatrad__kolonne"
            >
                {fulltNavn}
            </div>
            <div role="cell" className="formidling-av-usynlig-kandidatrad__ikkeSynlig">
                Ikke synlig i Rekrutteringsbistand
            </div>
            <div
                role="cell"
                className="formidling-av-usynlig-kandidatrad__utfall formidling-av-usynlig-kandidatrad__kolonne"
            >
                <UtfallMedEndreIkon
                    kanEndreUtfall={erEierAvKandidatlisten && !kandidatlistenErLukket}
                    utfall={formidling.utfall}
                    onClick={() => visEndreUtfallModalUsynligKandidat(formidling)}
                />
            </div>
            <span />
        </div>
    );
};

export default FormidlingAvUsynligKandidatrad;
