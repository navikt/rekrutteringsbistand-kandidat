import React, { FunctionComponent } from 'react';
import { FormidlingAvUsynligKandidat } from '../kandidatlistetyper';
import UtfallSelect, { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import './FormidlingAvUsynligKandidatrad.less';
import AppState from '../../AppState';
import { useSelector } from 'react-redux';
import { Nettstatus, Nettressurs } from '../../../felles/common/remoteData';
import UtfallVisning from '../kandidatrad/utfall-select/UtfallVisning';

type Props = {
    formidling: FormidlingAvUsynligKandidat;
    onUtfallChange: (
        utfall: Utfall,
        formidling: FormidlingAvUsynligKandidat,
        visModal: boolean
    ) => void;
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

    const endreState: Nettressurs<string> | undefined = useSelector(
        (state: AppState) =>
            state.kandidatliste.endreFormidlingsutfallForUsynligKandidat[formidling.id]
    );

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
                {erEierAvKandidatlisten ? (
                    <UtfallSelect
                        kanEndreUtfall={!kandidatlistenErLukket}
                        disabled={endreState?.kind === Nettstatus.SenderInn}
                        value={formidling.utfall}
                        onChange={(utfall, visModal) =>
                            onUtfallChange(utfall, formidling, visModal)
                        }
                    />
                ) : (
                    <UtfallVisning utfall={formidling.utfall} />
                )}
            </div>
            <span />
        </div>
    );
};

export default FormidlingAvUsynligKandidatrad;
