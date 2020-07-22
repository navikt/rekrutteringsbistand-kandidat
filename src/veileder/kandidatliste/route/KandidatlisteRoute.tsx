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
import Kandidatlisteside from '../Kandidatlisteside';
import NavFrontendSpinner from 'nav-frontend-spinner';

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
    hentSendteMeldinger: (kandidatlisteId: string) => void;
    sistValgteKandidat?: {
        kandidatlisteId: string;
        kandidatnr: string;
    };
};

type Props = OwnProps & ConnectedProps;

const KandidatlisteRoute: FunctionComponent<Props> = (props) => {
    const {
        stillingsId: stillingsIdFraUrl,
        kandidatlisteId: kandidatlisteIdFraUrl,
        hentKandidatlisteMedStilling,
        hentKandidatlisteUtenStilling,
        hentSendteMeldinger,

        kandidatliste,
        kandidattilstander,
        kandidatnotater,
        kandidatmeldinger,
        sistValgteKandidat,
    } = props;
    const kandidatlisteId =
        kandidatlisteIdFraUrl ||
        (kandidatliste.kind === Nettstatus.Suksess
            ? kandidatliste.data.kandidatlisteId
            : undefined);
    const [kandidaterMedState, setKandidaterMedState] = useState<KandidatIKandidatliste[]>([]);

    useEffect(() => {
        if (stillingsIdFraUrl) {
            hentKandidatlisteMedStilling(stillingsIdFraUrl);
        } else if (kandidatlisteIdFraUrl) {
            hentKandidatlisteUtenStilling(kandidatlisteIdFraUrl);
        }
    }, [
        stillingsIdFraUrl,
        kandidatlisteIdFraUrl,
        hentKandidatlisteMedStilling,
        hentKandidatlisteUtenStilling,
    ]);

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

    useEffect(() => {
        if (
            kandidatliste.kind === Nettstatus.Suksess &&
            kandidatmeldinger.kind === Nettstatus.IkkeLastet
        ) {
            hentSendteMeldinger(kandidatliste.data.kandidatlisteId);
        }
    }, [kandidatliste, kandidatmeldinger, hentSendteMeldinger]);

    // Scoll til toppen hvis ny kandidat
    useEffect(() => {
        if (kandidatliste.kind === Nettstatus.Suksess) {
            const ingenKandidatHarBlittValgt =
                !sistValgteKandidat || sistValgteKandidat.kandidatlisteId !== kandidatlisteId;

            if (ingenKandidatHarBlittValgt) {
                window.scrollTo(0, 0);
            }
        }
    }, [kandidatliste.kind, kandidatlisteId, sistValgteKandidat]);

    if (kandidatliste.kind === Nettstatus.LasterInn) {
        return (
            <div className="fullscreen-spinner">
                <NavFrontendSpinner type="L" />
            </div>
        );
    } else if (kandidatliste.kind !== Nettstatus.Suksess) {
        return null;
    }

    return (
        <div>
            <Kandidatlisteside kandidatliste={kandidatliste.data} kandidater={kandidaterMedState} />
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    kandidatliste: state.kandidatliste.kandidatliste,
    kandidattilstander: state.kandidatliste.kandidattilstander,
    kandidatnotater: state.kandidatliste.kandidatnotater,
    kandidatmeldinger: state.kandidatliste.sms.sendteMeldinger,
    sistValgteKandidat: state.kandidatliste.sistValgteKandidat,
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
    hentSendteMeldinger: (kandidatlisteId: string) => {
        dispatch({
            type: KandidatlisteActionType.HENT_SENDTE_MELDINGER,
            kandidatlisteId,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteRoute);
