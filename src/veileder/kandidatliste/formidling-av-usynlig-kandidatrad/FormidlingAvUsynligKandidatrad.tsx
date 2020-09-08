import React, { FunctionComponent } from 'react';
import { FormidlingAvUsynligKandidat } from '../kandidatlistetyper';
import UtfallSelect, { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import './FormidlingAvUsynligKandidatrad.less';
import AppState from '../../AppState';
import { useSelector } from 'react-redux';
import { Nettstatus, Nettressurs } from '../../../felles/common/remoteData';

type Props = {
    formidling: FormidlingAvUsynligKandidat;
    onUtfallChange: (
        utfall: Utfall,
        formidling: FormidlingAvUsynligKandidat,
        visModal: boolean
    ) => void;
};

const FormidlingAvUsynligKandidatrad: FunctionComponent<Props> = ({
    formidling,
    onUtfallChange,
}) => {
    let fulltNavn = `${formidling.etternavn}, ${formidling.fornavn}`;
    if (formidling.mellomnavn) {
        fulltNavn += ' ' + formidling.mellomnavn;
    }

    const endreState: Nettressurs<string> | undefined = useSelector(
        (state: AppState) =>
            state.kandidatliste.endreFormidlingsutfallForUsynligKandidat[formidling.id]
    );

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
                    disabled={endreState?.kind === Nettstatus.SenderInn}
                    value={formidling.utfall}
                    onChange={(utfall, visModal) => onUtfallChange(utfall, formidling, visModal)}
                />
            </div>
            <span />
        </div>
    );
};

export default FormidlingAvUsynligKandidatrad;
