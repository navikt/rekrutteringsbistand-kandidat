import { Label } from '@navikt/ds-react';
import React, { Dispatch } from 'react';
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
import Kandidatheader from '../komponenter/header/Kandidatheader';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import useCv from './useCv';
import useForespørselOmDelingAvCv from './useForespørselOmDelingAvCv';
import useKandidatliste from './useKandidatliste';
import useNavigerbareKandidater from './useNavigerbareKandidater';
import useSendtKandidatmelding from './useSendtKandidatmelding';

type Props = {
    kandidatnr: string;
    kandidatlisteId: string;
    children: React.ReactNode;
};

const FraKandidatliste = ({ kandidatnr, kandidatlisteId, children }: Props) => {
    useScrollTilToppen(kandidatnr);

    const cv = useCv(kandidatnr, kandidatlisteId);
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
            <FraKandidatlisteInner cv={cv} kandidat={kandidat} kandidatliste={kandidatliste.data}>
                {children}
            </FraKandidatlisteInner>
        );
    } else {
        return null;
    }
};

const FraKandidatlisteInner = ({
    cv,
    kandidat,
    kandidatliste,
    children,
}: {
    cv: Nettressurs<Cv>;
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
    children: React.ReactNode;
}) => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();
    const state = useSelector((state: AppState) => state.kandidatliste);

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
                tilbakelenke={{
                    to: tilbakelenke,
                }}
            />
            <Kandidatmeny cv={cv}>
                <div className="kandidatside__status-select">
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
            {children}
        </>
    );
};

export default FraKandidatliste;
