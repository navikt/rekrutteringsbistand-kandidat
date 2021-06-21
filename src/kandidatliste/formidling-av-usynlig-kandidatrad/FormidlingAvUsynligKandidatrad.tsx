import React, { FunctionComponent, useRef } from 'react';
import { Close } from '@navikt/ds-icons';
import { Knapp } from 'nav-frontend-knapper';
import Popover from 'nav-frontend-popover';

import { FormidlingAvUsynligKandidat } from '../kandidatlistetyper';
import CvDeltEtikett from '../kandidatrad/status-og-hendelser/CvDeltEtikett';
import EndreStatusOgHendelserKnapp from '../kandidatrad/status-og-hendelser/endre-status-og-hendelser/EndreStatusOgHendelserKnapp';
import FåttJobbenEtikett from '../kandidatrad/status-og-hendelser/FåttJobbenEtikett';
import SeHendelserKnapp from '../kandidatrad/status-og-hendelser/se-hendelser/SeHendelserKnapp';
import usePopoverAnker from '../kandidatrad/status-og-hendelser/usePopoverAnker';
import usePopoverOrientering from '../kandidatrad/status-og-hendelser/usePopoverOrientering';
import Hendelse from '../kandidatrad/status-og-hendelser/endre-status-og-hendelser/Hendelse';
import UtfallMedEndreIkon, {
    Utfall,
} from '../kandidatrad/utfall-med-endre-ikon/UtfallMedEndreIkon';
import { Undertittel } from 'nav-frontend-typografi';
import DelingAvCv from '../kandidatrad/status-og-hendelser/endre-status-og-hendelser/DelingAvCv';
import { datoformatNorskLang } from '../../utils/dateUtils';
import { useDispatch, useSelector } from 'react-redux';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import AppState from '../../AppState';
import './FormidlingAvUsynligKandidatrad.less';
import '../kandidatrad/status-og-hendelser/StatusOgHendelser.less';
import '../kandidatrad/status-og-hendelser/endre-status-og-hendelser/EndreStatusOgHendelser.less';

type Props = {
    kandidatlisteId: string;
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
    kandidatlisteId,
}) => {
    const dispatch = useDispatch();
    const valgtNavKontor = useSelector((state: AppState) => state.navKontor.valgtNavKontor);
    const visNyttKandidatstatusLayout = useSelector(
        (state: AppState) => state.søk.featureToggles['nytt-kandidatstatus-layout']
    );

    const popoverRef = useRef<HTMLDivElement | null>(null);
    const { popoverAnker, togglePopover, lukkPopover } = usePopoverAnker(popoverRef);
    const popoverOrientering = usePopoverOrientering(popoverAnker);

    const kanEditere = erEierAvKandidatlisten && !kandidatlistenErLukket;

    const endreFormidlingsutfallForUsynligKandidat = (utfall: Utfall) => {
        dispatch({
            type: KandidatlisteActionType.ENDRE_FORMIDLINGSUTFALL_FOR_USYNLIG_KANDIDAT,
            utfall,
            kandidatlisteId,
            formidlingId: formidling.id,
            navKontor: valgtNavKontor,
        });
    };

    const cvDeltBeskrivelse = `Lagt til i listen av ${formidling.lagtTilAvNavn} (${
        formidling.lagtTilAvIdent
    }) ${datoformatNorskLang(formidling.lagtTilTidspunkt)}`;

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
            <span className="formidling-av-usynlig-kandidatrad__før-navn" />
            <div
                role="cell"
                className="formidling-av-usynlig-kandidatrad__navn formidling-av-usynlig-kandidatrad__kolonne"
            >
                {fulltNavn}
            </div>
            <div role="cell" className="formidling-av-usynlig-kandidatrad__ikke-synlig">
                Ikke synlig i Rekrutteringsbistand
            </div>
            <div
                role="cell"
                className="formidling-av-usynlig-kandidatrad__utfall formidling-av-usynlig-kandidatrad__kolonne"
            >
                {visNyttKandidatstatusLayout ? (
                    <div className="status-og-hendelser">
                        {formidling.utfall === Utfall.Presentert && <CvDeltEtikett />}
                        {formidling.utfall === Utfall.FåttJobben && <FåttJobbenEtikett />}
                        {kanEditere ? (
                            <EndreStatusOgHendelserKnapp onClick={togglePopover} />
                        ) : (
                            <SeHendelserKnapp onClick={togglePopover} />
                        )}
                        <Popover
                            orientering={popoverOrientering}
                            ankerEl={popoverAnker}
                            onRequestClose={lukkPopover}
                        >
                            <div className="status-og-hendelser__popover" ref={popoverRef}>
                                <div className="endre-status-og-hendelser">
                                    {
                                        <div className="endre-status-og-hendelser__hendelser">
                                            <Undertittel>Hendelser</Undertittel>
                                            <ol className="endre-status-og-hendelser__hendelsesliste">
                                                <Hendelse
                                                    checked
                                                    tittel="Ny kandidat"
                                                    beskrivelse={cvDeltBeskrivelse}
                                                />
                                                <DelingAvCv
                                                    kanEndre={kanEditere}
                                                    utfall={formidling.utfall}
                                                    onEndreUtfall={
                                                        endreFormidlingsutfallForUsynligKandidat
                                                    }
                                                />
                                            </ol>
                                        </div>
                                    }
                                </div>
                                <Knapp
                                    mini
                                    className="status-og-hendelser__lukk-popover-knapp"
                                    onClick={lukkPopover}
                                >
                                    <Close />
                                </Knapp>
                            </div>
                        </Popover>
                    </div>
                ) : (
                    <UtfallMedEndreIkon
                        kanEndreUtfall={erEierAvKandidatlisten && !kandidatlistenErLukket}
                        utfall={formidling.utfall}
                        onClick={() => visEndreUtfallModalUsynligKandidat(formidling)}
                    />
                )}
            </div>
        </div>
    );
};

export default FormidlingAvUsynligKandidatrad;
