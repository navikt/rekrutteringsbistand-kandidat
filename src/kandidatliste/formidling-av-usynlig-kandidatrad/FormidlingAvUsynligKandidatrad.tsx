import React, { FunctionComponent, useRef } from 'react';
import { Button } from '@navikt/ds-react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Undertittel } from 'nav-frontend-typografi';
import { useDispatch, useSelector } from 'react-redux';
import Popover from 'nav-frontend-popover';

import { formaterDatoNaturlig } from '../../utils/dateUtils';
import { FormidlingAvUsynligKandidat, Kandidatutfall } from '../domene/Kandidat';
import AppState from '../../AppState';
import DelingAvCv from '../kandidatrad/status-og-hendelser/hendelser/DelingAvCv';
import StatusOgHendelserKnapp from '../kandidatrad/status-og-hendelser/endre-status-og-hendelser/StatusOgHendelserKnapp';
import FåttJobben from '../kandidatrad/status-og-hendelser/hendelser/FåttJobben';
import Hendelse, { Hendelsesstatus } from '../kandidatrad/status-og-hendelser/hendelser/Hendelse';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import usePopoverAnker from '../kandidatrad/status-og-hendelser/usePopoverAnker';
import usePopoverOrientering from '../kandidatrad/status-og-hendelser/usePopoverOrientering';
import Hendelsesetikett from '../kandidatrad/status-og-hendelser/etiketter/Hendelsesetikett';
import css from '../kandidatrad/status-og-hendelser/StatusOgHendelser.module.css';
import '../kandidatrad/status-og-hendelser/endre-status-og-hendelser/EndreStatusOgHendelser.less';
import './FormidlingAvUsynligKandidatrad.less';

type Props = {
    kandidatlisteId: string;
    formidling: FormidlingAvUsynligKandidat;
    kandidatlistenErLukket: boolean;
    erEierAvKandidatlisten: boolean;
};

const FormidlingAvUsynligKandidatrad: FunctionComponent<Props> = ({
    formidling,
    kandidatlistenErLukket,
    erEierAvKandidatlisten,
    kandidatlisteId,
}) => {
    const dispatch = useDispatch();
    const valgtNavKontor = useSelector((state: AppState) => state.navKontor.valgtNavKontor);

    const popoverRef = useRef<HTMLDivElement | null>(null);
    const { popoverAnker, togglePopover, lukkPopover } = usePopoverAnker(popoverRef);
    const popoverOrientering = usePopoverOrientering(popoverAnker);

    const kanEditere = erEierAvKandidatlisten && !kandidatlistenErLukket;

    const endreFormidlingsutfallForUsynligKandidat = (utfall: Kandidatutfall) => {
        dispatch({
            type: KandidatlisteActionType.EndreFormidlingsutfallForUsynligKandidat,
            utfall,
            kandidatlisteId,
            formidlingId: formidling.id,
            navKontor: valgtNavKontor,
        });
    };

    const cvDeltBeskrivelse = `Lagt til i listen av ${formidling.lagtTilAvNavn} (${
        formidling.lagtTilAvIdent
    }) ${formaterDatoNaturlig(formidling.lagtTilTidspunkt)}`;

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
                <div className={css.statusOgHendelser} ref={popoverRef}>
                    {formidling.utfall !== Kandidatutfall.IkkePresentert && (
                        <Hendelsesetikett utfall={formidling.utfall} utfallsendringer={[]} />
                    )}
                    <StatusOgHendelserKnapp kanEndre={kanEditere} onClick={togglePopover} />
                    <Popover
                        orientering={popoverOrientering}
                        ankerEl={popoverAnker}
                        onRequestClose={lukkPopover}
                    >
                        <div className={css.popover}>
                            <div className="endre-status-og-hendelser__hendelser">
                                <Undertittel>Hendelser</Undertittel>
                                <ol className="endre-status-og-hendelser__hendelsesliste">
                                    <Hendelse
                                        status={Hendelsesstatus.Grønn}
                                        tittel="Ny kandidat"
                                        beskrivelse={cvDeltBeskrivelse}
                                    />
                                    <DelingAvCv
                                        kanEndre={kanEditere}
                                        utfall={formidling.utfall}
                                        utfallsendringer={[]}
                                        onEndreUtfall={endreFormidlingsutfallForUsynligKandidat}
                                        onSlettCv={() => {}}
                                    />
                                    <FåttJobben
                                        kanEndre={kanEditere}
                                        utfall={formidling.utfall}
                                        utfallsendringer={[]}
                                        navn={fulltNavn}
                                        onEndreUtfall={endreFormidlingsutfallForUsynligKandidat}
                                    />
                                </ol>
                            </div>
                            <Button
                                variant="secondary"
                                className={css.lukkPopoverKnapp}
                                onClick={lukkPopover}
                                icon={<XMarkIcon />}
                                size="small"
                            ></Button>
                        </div>
                    </Popover>
                </div>
            </div>
        </div>
    );
};

export default FormidlingAvUsynligKandidatrad;
