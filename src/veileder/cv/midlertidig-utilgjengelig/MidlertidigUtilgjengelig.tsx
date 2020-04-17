import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import { Knapp } from 'pam-frontend-knapper';
import Chevron from 'nav-frontend-chevron';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import 'nav-datovelger/lib/styles/datovelger.less';

import EndreMidlertidigUtilgjengelig from './endre-midlertidig-utilgjengelig/EndreMidlertidigUtilgjengelig';
import RegistrerMidlertidigUtilgjengelig from './registrer-midlertidig-utilgjengelig/RegistrerMidlertidigUtilgjengelig';
import TilgjengelighetIkon, { Tilgjengelighet } from './tilgjengelighet-ikon/TilgjengelighetIkon';
import useFeatureToggle from '../../result/useFeatureToggle';
import './MidlertidigUtilgjengelig.less';
import {
    CvAction,
    CvActionType,
    MidlertidigUtilgjengelig as Midlertidig,
} from '../reducer/cvReducer';
import AppState from '../../AppState';
import { RemoteData, RemoteDataTypes } from '../../../felles/common/remoteData';

interface Props {
    aktørId: string;
    kandidatnummer: string;
    lagreMidlertidigUtilgjengelig: (aktørId: string, tilDato: string) => void;
    midlertidigUtilgjengelig: RemoteData<Midlertidig>;
}

const MidlertidigUtilgjengelig: FunctionComponent<Props> = (props) => {
    const [anker, setAnker] = useState<any>(undefined);
    const erToggletPå = useFeatureToggle('vis-midlertidig-utilgjengelig');
    const [endre, setEndre] = useState<boolean>(
        props.midlertidigUtilgjengelig.kind === RemoteDataTypes.SUCCESS
    ); // TODO Endre-komponent skal vises hviss bruker er registrert som utilgjengelig

    if (!erToggletPå) {
        return null;
    }

    const { kandidatnummer, aktørId, lagreMidlertidigUtilgjengelig } = props;

    const registrerMidlertidigUtilgjengelig = (tilOgMedDato: string) => {
        const dato = new Date(tilOgMedDato).toISOString();

        lagreMidlertidigUtilgjengelig(aktørId, dato);
    };

    const slettMidlertidigUtilgjengelig = () => {
        // putMidlertidigUtilgjengelig(kandidatnummer, null);
    };

    return (
        <div className="midlertidig-utilgjengelig">
            <Knapp type="flat" onClick={(e) => setAnker(anker ? undefined : e.currentTarget)}>
                <TilgjengelighetIkon
                    tilgjengelighet={Tilgjengelighet.UTILGJENGELIG}
                    className="midlertidig-utilgjengelig__ikon"
                />
                Registrer som utilgjengelig
                <Chevron
                    type={anker ? 'opp' : 'ned'}
                    className="midlertidig-utilgjengelig__chevron"
                />
            </Knapp>
            <Popover
                ankerEl={anker}
                onRequestClose={() => setAnker(undefined)}
                orientering={PopoverOrientering.UnderHoyre}
                avstandTilAnker={16}
            >
                {endre ? (
                    <EndreMidlertidigUtilgjengelig
                        onAvbryt={() => setAnker(undefined)}
                        className="midlertidig-utilgjengelig__popup-innhold"
                        registrerMidlertidigUtilgjengelig={registrerMidlertidigUtilgjengelig}
                        slettMidlertidigUtilgjengelig={slettMidlertidigUtilgjengelig}
                    />
                ) : (
                    <RegistrerMidlertidigUtilgjengelig
                        onAvbryt={() => setAnker(undefined)}
                        className="midlertidig-utilgjengelig__popup-innhold"
                        registrerMidlertidigUtilgjengelig={registrerMidlertidigUtilgjengelig}
                    />
                )}
            </Popover>
        </div>
    );
};

export default connect(
    (state: AppState) => ({
        aktørId: state.cv.cv.aktorId,
    }),
    (dispatch: (action: CvAction) => void) => ({
        lagreMidlertidigUtilgjengelig: (aktørId: string, tilDato: string) =>
            dispatch({
                type: CvActionType.LAGRE_MIDLERTIDIG_UTILGJENGELIG,
                aktørId,
                tilDato,
            }),
    })
)(MidlertidigUtilgjengelig);
