import {
    Kandidattilstander,
    Kandidatliste,
    Kandidatnotater,
    KandidatIKandidatliste,
    Sms,
} from '../kandidatlistetyper';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AppState from '../../AppState';
import KandidatlisteAction from '../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import { RemoteData, Nettstatus } from '../../../felles/common/remoteData';

const hentMeldingForKandidat = (
    kandidatmeldinger: RemoteData<Sms[]>,
    fnr: string
): Sms | undefined =>
    kandidatmeldinger.kind === Nettstatus.Suksess
        ? kandidatmeldinger.data.find((melding) => melding.fnr === fnr)
        : undefined;

type OwnProps = {
    stillingsId?: string;
    kandidatlisteId?: string;
};

type ConnectedProps = {
    kandidatliste: RemoteData<Kandidatliste>;
    kandidattilstander: Kandidattilstander;
    kandidatnotater: Kandidatnotater;
    kandidatmeldinger: RemoteData<Sms[]>;
    hentKandidatlisteMedStilling: (stillingsId: string) => void;
    hentKandidatlisteUtenStilling: (kandidatlisteId: string) => void;
};

type Props = OwnProps & ConnectedProps;

const KandidatlisteRoute: FunctionComponent<Props> = (props) => {
    const {
        stillingsId,
        kandidatlisteId,
        hentKandidatlisteMedStilling,
        hentKandidatlisteUtenStilling,

        kandidatliste,
        kandidattilstander,
        kandidatnotater,
        kandidatmeldinger,
    } = props;

    const [kandidaterMedState, setKandidaterMedState] = useState<KandidatIKandidatliste[]>([]);

    useEffect(() => {
        if (stillingsId) {
            hentKandidatlisteMedStilling(stillingsId);
        } else if (kandidatlisteId) {
            hentKandidatlisteUtenStilling(kandidatlisteId);
        }
    }, [stillingsId, kandidatlisteId, hentKandidatlisteMedStilling, hentKandidatlisteUtenStilling]);

    useEffect(() => {
        if (kandidatliste.kind === Nettstatus.Suksess) {
            const kandidaterMedState: KandidatIKandidatliste[] = kandidatliste.data.kandidater.map(
                (kandidat) => ({
                    ...kandidat,
                    tilstand: kandidattilstander[kandidat.kandidatnr],
                    notater: kandidatnotater[kandidat.kandidatnr],
                    sms: hentMeldingForKandidat(kandidatmeldinger, kandidat.fodselsnr),
                })
            );

            setKandidaterMedState(kandidaterMedState);
        }
    }, [kandidatliste, kandidattilstander, kandidatnotater, kandidatmeldinger]);

    return (
        <div>
            <KandidatlistesideRouter
                kandidatliste={kandidatliste}
                kandidater={kandidaterMedState}
            />
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    kandidatliste: state.kandidatliste.kandidatliste,
    kandidattilstander: state.kandidatliste.kandidattilstander,
    kandidatnotater: state.kandidatliste.kandidatnotater,
    kandidatmeldinger: state.kandidatliste.sms.sendteMeldinger,
});

const mapDispatchToProps = (dispatch: (action: KandidatlisteAction) => void) => ({
    hentKandidatlisteMedStilling: (stillingsId: string) => {
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID,
            stillingsId,
        });
    },
    hentKandidatlisteUtenStilling: (kandidatlisteId: string) => {
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID,
            kandidatlisteId,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteRoute);
