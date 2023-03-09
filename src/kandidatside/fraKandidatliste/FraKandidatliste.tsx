import { Label, Tabs } from '@navikt/ds-react';
import React, { Dispatch, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { lenkeTilKandidatliste } from '../../app/paths';
import AppState from '../../AppState';
import Sidefeil from '../../common/sidefeil/Sidefeil';
import Sidelaster from '../../common/sidelaster/Sidelaster';
import useScrollTilToppen from '../../common/useScrollTilToppen';
import Cv from '../../cv/reducer/cv-typer';
import { Kandidat, Kandidatstatus } from '../../kandidatliste/domene/Kandidat';
import {
    erKobletTilStilling,
    Kandidatliste,
    Kandidatlistestatus,
} from '../../kandidatliste/domene/Kandidatliste';
import { filterTilQueryParams } from '../../kandidatliste/filter/filter-utils';
import StatusOgHendelser from '../../kandidatliste/kandidatrad/status-og-hendelser/StatusOgHendelser';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import useCv from '../hooks/useCv';
import Kandidatheader from '../komponenter/header/Kandidatheader';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import useForespørselOmDelingAvCv from './useForespørselOmDelingAvCv';
import useKandidatliste from '../hooks/useKandidatliste';
import useNavigerbareKandidater from './useNavigerbareKandidater';
import useSendtKandidatmelding from './useSendtKandidatmelding';
import useValgtKandidatIKandidatliste from './useValgtKandidatIKandidatliste';
import useFaner from '../hooks/useFaner';
import css from './FraKandidatliste.module.css';

type Props = {
    tabs: ReactNode;
    kandidatnr: string;
    kandidatlisteId: string;
    children: React.ReactNode;
};

const FraKandidatliste = ({ tabs, kandidatnr, kandidatlisteId, children, ...props }: Props) => {
    useScrollTilToppen(kandidatnr);
    useValgtKandidatIKandidatliste(kandidatnr, kandidatlisteId);

    const cv = useCv(kandidatnr);
    const kandidatliste = useKandidatliste(kandidatlisteId);

    if (kandidatliste.kind === Nettstatus.LasterInn) {
        return <Sidelaster />;
    } else if (kandidatliste.kind === Nettstatus.FinnesIkke) {
        return <Sidefeil feilmelding={`Fant ikke kandidatlisten med id ${kandidatlisteId}`} />;
    } else if (kandidatliste.kind === Nettstatus.Feil) {
        return (
            <Sidefeil
                feilmelding={`Klarte ikke å laste kandidatlisten med id ${kandidatlisteId}`}
            />
        );
    } else if (kandidatliste.kind === Nettstatus.Suksess) {
        const kandidat = kandidatliste.data.kandidater.find((k) => k.kandidatnr === kandidatnr);

        if (!kandidat) {
            return <Sidefeil feilmelding={`Fant ikke kandidat med kandidatnr ${kandidatnr}`} />;
        }

        return (
            <FraKandidatlisteInner
                tabs={tabs}
                cv={cv}
                kandidat={kandidat}
                kandidatliste={kandidatliste.data}
            >
                {children}
            </FraKandidatlisteInner>
        );
    } else {
        return null;
    }
};

const FraKandidatlisteInner = ({
    tabs,
    cv,
    kandidat,
    kandidatliste,
    children,
}: {
    tabs: ReactNode;
    cv: Nettressurs<Cv>;
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
    children: React.ReactNode;
}) => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();
    const state = useSelector((state: AppState) => state.kandidatliste);

    const [fane, setFane] = useFaner();
    const forespørsel = useForespørselOmDelingAvCv(kandidat, kandidatliste);
    const melding = useSendtKandidatmelding(kandidat, kandidatliste);
    const navigering = useNavigerbareKandidater(kandidat.kandidatnr, kandidatliste);

    const onKandidatStatusChange = (status: Kandidatstatus) => {
        dispatch({
            type: KandidatlisteActionType.EndreStatusKandidat,
            status,
            kandidatlisteId: kandidatliste.kandidatlisteId,
            kandidatnr: kandidat.kandidatnr,
        });
    };

    const tilbakelenke = lenkeTilKandidatliste(
        kandidatliste.kandidatlisteId,
        filterTilQueryParams(state.filter)
    );

    const endreStatusTekst = erKobletTilStilling(kandidatliste) ? 'Status/hendelse:' : 'Status:';

    return (
        <>
            <Kandidatheader
                cv={cv}
                kandidatnavigering={navigering}
                tilbakelenkeTekst="Til kandidatlisten"
                tilbakelenke={{
                    to: tilbakelenke,
                }}
            />
            <Tabs value={fane} onChange={setFane}>
                <Kandidatmeny tabs={tabs} cv={cv}>
                    <div className={css.velgStatus}>
                        <Label htmlFor="cv-status-og-hendelse">{endreStatusTekst}</Label>
                        <StatusOgHendelser
                            id="cv-status-og-hendelse"
                            kandidat={kandidat}
                            kandidatliste={kandidatliste}
                            forespørselOmDelingAvCv={forespørsel}
                            onStatusChange={onKandidatStatusChange}
                            sms={melding}
                            kanEditere={
                                kandidatliste.kanEditere &&
                                kandidatliste.status === Kandidatlistestatus.Åpen
                            }
                        />
                    </div>
                </Kandidatmeny>
                <Tabs.Panel value={fane}>{children}</Tabs.Panel>
            </Tabs>
        </>
    );
};

export default FraKandidatliste;
