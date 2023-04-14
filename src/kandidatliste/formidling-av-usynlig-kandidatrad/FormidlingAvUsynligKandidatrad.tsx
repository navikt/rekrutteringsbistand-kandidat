import React, { FunctionComponent, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Heading, Popover } from '@navikt/ds-react';
import { XMarkIcon } from '@navikt/aksel-icons';

import { formaterDatoNaturlig } from '../../utils/dateUtils';
import { FormidlingAvUsynligKandidat, Kandidatutfall } from '../domene/Kandidat';
import AppState from '../../AppState';
import DelingAvCv from '../kandidatrad/status-og-hendelser/hendelser/DelingAvCv';
import StatusOgHendelserKnapp from '../kandidatrad/status-og-hendelser/endre-status-og-hendelser/StatusOgHendelserKnapp';
import FåttJobben from '../kandidatrad/status-og-hendelser/hendelser/FåttJobben';
import Hendelse, { Hendelsesstatus } from '../kandidatrad/status-og-hendelser/hendelser/Hendelse';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import Hendelsesetikett from '../kandidatrad/status-og-hendelser/etiketter/Hendelsesetikett';
import endreStatusOgHendelserCss from '../kandidatrad/status-og-hendelser/endre-status-og-hendelser/EndreStatusOgHendelser.module.css';
import css from '../kandidatrad/status-og-hendelser/StatusOgHendelser.module.css';

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
    const popoverRef = useRef<HTMLButtonElement | null>(null);
    const [visPopover, setVisPopover] = useState<boolean>(false);

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
                <div className={css.statusOgHendelser}>
                    {formidling.utfall !== Kandidatutfall.IkkePresentert && (
                        <Hendelsesetikett utfall={formidling.utfall} utfallsendringer={[]} />
                    )}
                    <StatusOgHendelserKnapp
                        ref={popoverRef}
                        kanEndre={kanEditere}
                        onClick={() => setVisPopover(!visPopover)}
                    />
                    <Popover
                        open={visPopover}
                        anchorEl={popoverRef.current}
                        onClose={() => setVisPopover(false)}
                    >
                        <Popover.Content className={css.popover}>
                            <Heading spacing level="2" size="small">
                                Hendelser
                            </Heading>
                            <ol className={endreStatusOgHendelserCss.hendelsesliste}>
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
                            <Button
                                size="small"
                                variant="secondary"
                                className={css.lukkPopoverKnapp}
                                onClick={() => setVisPopover(false)}
                                icon={<XMarkIcon />}
                            ></Button>
                        </Popover.Content>
                    </Popover>
                </div>
            </div>
        </div>
    );
};

export default FormidlingAvUsynligKandidatrad;
