import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import 'nav-datovelger/lib/styles/datovelger.less';

import {
    MidlertidigUtilgjengeligAction,
    MidlertidigUtilgjengeligResponse,
} from './midlertidigUtilgjengeligReducer';
import { Nettressurs, Nettstatus } from '../../../felles/common/remoteData';
import AppState from '../../AppState';
import EndreMidlertidigUtilgjengelig from './endre-midlertidig-utilgjengelig/EndreMidlertidigUtilgjengelig';
import RegistrerMidlertidigUtilgjengelig from './registrer-midlertidig-utilgjengelig/RegistrerMidlertidigUtilgjengelig';
import { Tilgjengelighet } from './tilgjengelighet-ikon/TilgjengelighetIkon';
import useFeatureToggle from '../../result/useFeatureToggle';
import './MidlertidigUtilgjengelig.less';
import MidlertidigUtilgjengeligKnapp from './midlertidig-utilgjengelig-knapp/MidlertidigUtilgjengeligKnapp';
import moment from 'moment';
import { dagensDato } from './validering';

interface Props {
    aktørId: string;
    kandidatnr: string;
    lagreMidlertidigUtilgjengelig: (kandidatnr: string, aktørId: string, tilDato: string) => void;
    endreMidlertidigUtilgjengelig: (kandidatnr: string, aktørId: string, tilDato: string) => void;
    slettMidlertidigUtilgjengelig: (kandidatnr: string, aktørId: string) => void;
    midlertidigUtilgjengelig?: Nettressurs<MidlertidigUtilgjengeligResponse>;
}

const getTilgjengelighet = (
    response: Nettressurs<MidlertidigUtilgjengeligResponse>
): Tilgjengelighet | undefined => {
    if (response.kind === Nettstatus.FinnesIkke) {
        return Tilgjengelighet.TILGJENGELIG;
    } else if (response.kind !== Nettstatus.Suksess) {
        return undefined;
    }

    const idag = dagensDato();
    const fraDato = moment(response.data.fraDato).startOf('day');
    const tilDato = moment(response.data.tilDato).startOf('day');


    if (!idag.isBetween(fraDato, tilDato, 'days', '[]')) {
        return Tilgjengelighet.TILGJENGELIG;
    }
    if (tilDato.diff(idag, 'days') < 7) {
        return Tilgjengelighet.SNART_TILGJENGELIG;
    }
    return Tilgjengelighet.UTILGJENGELIG;
};

const MidlertidigUtilgjengelig: FunctionComponent<Props> = (props) => {
    const { kandidatnr, aktørId, midlertidigUtilgjengelig, lagreMidlertidigUtilgjengelig } = props;

    const [anker, setAnker] = useState<any>(undefined);
    const erToggletPå = useFeatureToggle('vis-midlertidig-utilgjengelig');

    if (!erToggletPå || midlertidigUtilgjengelig === undefined) {
        return null;
    }

    const lukkPopup = () => setAnker(undefined);

    const registrerMidlertidigUtilgjengelig = (tilOgMedDato: string) => {
        const dato = new Date(tilOgMedDato).toISOString();
        lagreMidlertidigUtilgjengelig(kandidatnr, aktørId, dato);
        lukkPopup();
    };

    const endreMidlertidigUtilgjengelig = (tilOgMedDato: string) => {
        const dato = new Date(tilOgMedDato).toISOString();
        props.endreMidlertidigUtilgjengelig(kandidatnr, aktørId, dato);
        lukkPopup();
    };

    const slettMidlertidigUtilgjengelig = () => {
        props.slettMidlertidigUtilgjengelig(kandidatnr, aktørId);
        lukkPopup();
    };

    const tilgjengelighet = midlertidigUtilgjengelig
        ? getTilgjengelighet(midlertidigUtilgjengelig)
        : undefined;
    return (
        <div className="midlertidig-utilgjengelig">
            <MidlertidigUtilgjengeligKnapp
                chevronType={anker ? 'opp' : 'ned'}
                onClick={(e) => setAnker(anker ? undefined : e.currentTarget)}
                tilgjengelighet={tilgjengelighet}
            />
            <Popover
                ankerEl={anker}
                onRequestClose={lukkPopup}
                orientering={PopoverOrientering.UnderHoyre}
                avstandTilAnker={16}
            >
                {!!midlertidigUtilgjengelig &&
                midlertidigUtilgjengelig.kind === Nettstatus.Suksess ? (
                    <EndreMidlertidigUtilgjengelig
                        onAvbryt={lukkPopup}
                        className="midlertidig-utilgjengelig__popup-innhold"
                        endreMidlertidigUtilgjengelig={endreMidlertidigUtilgjengelig}
                        slettMidlertidigUtilgjengelig={slettMidlertidigUtilgjengelig}
                        midlertidigUtilgjengelig={midlertidigUtilgjengelig.data}
                    />
                ) : (
                    <RegistrerMidlertidigUtilgjengelig
                        onAvbryt={lukkPopup}
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
    (dispatch: (action: MidlertidigUtilgjengeligAction) => void) => ({
        lagreMidlertidigUtilgjengelig: (kandidatnr: string, aktørId: string, tilDato: string) =>
            dispatch({
                type: 'LAGRE_MIDLERTIDIG_UTILGJENGELIG',
                kandidatnr,
                aktørId,
                tilDato,
            }),
        endreMidlertidigUtilgjengelig: (kandidatnr: string, aktørId: string, tilDato: string) =>
            dispatch({
                type: 'ENDRE_MIDLERTIDIG_UTILGJENGELIG',
                kandidatnr,
                aktørId,
                tilDato,
            }),
        slettMidlertidigUtilgjengelig: (kandidatnr: string, aktørId: string) => {
            dispatch({
                type: 'SLETT_MIDLERTIDIG_UTILGJENGELIG',
                kandidatnr,
                aktørId,
            });
        },
    })
)(MidlertidigUtilgjengelig);
