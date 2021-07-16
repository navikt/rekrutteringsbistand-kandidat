import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import moment from 'moment';
import 'nav-datovelger/lib/styles/datovelger.less';

import {
    MidlertidigUtilgjengeligAction,
    MidlertidigUtilgjengeligActionType,
    MidlertidigUtilgjengeligResponse,
} from './midlertidigUtilgjengeligReducer';
import { antallDagerMellom, dagensDato } from './validering';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { sendEvent } from '../../amplitude/amplitude';
import { Tilgjengelighet } from '../cv/reducer/cv-typer';
import AppState from '../../AppState';
import EndreMidlertidigUtilgjengelig from './endre-midlertidig-utilgjengelig/EndreMidlertidigUtilgjengelig';
import MidlertidigUtilgjengeligKnapp from './midlertidig-utilgjengelig-knapp/MidlertidigUtilgjengeligKnapp';
import RegistrerMidlertidigUtilgjengelig from './registrer-midlertidig-utilgjengelig/RegistrerMidlertidigUtilgjengelig';
import './MidlertidigUtilgjengelig.less';

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
    if (response.kind !== Nettstatus.Suksess) {
        return undefined;
    }

    const registrertData = response.data.midlertidigUtilgjengelig;
    if (registrertData === null) {
        return Tilgjengelighet.Tilgjengelig;
    }

    const idag = dagensDato();
    const fraDato = moment(registrertData.fraDato).startOf('day');
    const tilDato = moment(registrertData.tilDato).startOf('day');

    if (!idag.isBetween(fraDato, tilDato, 'days', '[]')) {
        return Tilgjengelighet.Tilgjengelig;
    }

    if (tilDato.diff(idag, 'days') < 7) {
        return Tilgjengelighet.TilgjengeligInnen1Uke;
    }

    return Tilgjengelighet.MidlertidigUtilgjengelig;
};

const kandidatErRegistrertSomUtilgjengeligMenDatoErUtløpt = (
    midlertidigUtilgjengelig: Nettressurs<MidlertidigUtilgjengeligResponse>
) => {
    return (
        midlertidigUtilgjengelig.kind === Nettstatus.Suksess &&
        midlertidigUtilgjengelig.data.midlertidigUtilgjengelig !== null &&
        getTilgjengelighet(midlertidigUtilgjengelig) === Tilgjengelighet.Tilgjengelig
    );
};

const MidlertidigUtilgjengelig: FunctionComponent<Props> = ({
    kandidatnr,
    aktørId,
    midlertidigUtilgjengelig,
    lagreMidlertidigUtilgjengelig,
    endreMidlertidigUtilgjengelig,
    slettMidlertidigUtilgjengelig,
}) => {
    const [anker, setAnker] = useState<any>(undefined);

    if (!midlertidigUtilgjengelig) {
        return null;
    }

    const lukkPopup = () => setAnker(undefined);

    const endre = (tilOgMedDato: string) => {
        const dato = new Date(tilOgMedDato).toISOString();
        endreMidlertidigUtilgjengelig(kandidatnr, aktørId, dato);

        sendEvent('cv_midlertidig_utilgjengelig', 'endre', {
            antallDager: antallDagerMellom(dagensDato(), tilOgMedDato),
        });

        lukkPopup();
    };

    const registrer = (tilOgMedDato: string) => {
        const dato = new Date(tilOgMedDato).toISOString();
        sendEvent('cv_midlertidig_utilgjengelig', 'registrer', {
            antallDager: antallDagerMellom(dagensDato(), tilOgMedDato),
        });

        if (kandidatErRegistrertSomUtilgjengeligMenDatoErUtløpt(midlertidigUtilgjengelig)) {
            endreMidlertidigUtilgjengelig(kandidatnr, aktørId, dato);
        } else {
            lagreMidlertidigUtilgjengelig(kandidatnr, aktørId, dato);
        }

        lukkPopup();
    };

    const slett = () => {
        slettMidlertidigUtilgjengelig(kandidatnr, aktørId);
        sendEvent('cv_midlertidig_utilgjengelig', 'slett');
        lukkPopup();
    };

    const tilgjengelighet = midlertidigUtilgjengelig
        ? getTilgjengelighet(midlertidigUtilgjengelig)
        : undefined;

    const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const skalÅpnes = !anker;
        if (skalÅpnes) {
            sendEvent('cv_midlertidig_utilgjengelig', 'åpne');
        }
        setAnker(skalÅpnes ? e.currentTarget : undefined);
    };

    return (
        <div className="midlertidig-utilgjengelig">
            <MidlertidigUtilgjengeligKnapp
                chevronType={anker ? 'opp' : 'ned'}
                onClick={onClick}
                tilgjengelighet={tilgjengelighet}
            />
            <Popover
                ankerEl={anker}
                onRequestClose={lukkPopup}
                orientering={PopoverOrientering.UnderHoyre}
                avstandTilAnker={16}
            >
                {midlertidigUtilgjengelig.kind === Nettstatus.Suksess &&
                midlertidigUtilgjengelig.data.midlertidigUtilgjengelig !== null &&
                tilgjengelighet !== Tilgjengelighet.Tilgjengelig ? (
                    <EndreMidlertidigUtilgjengelig
                        onAvbryt={lukkPopup}
                        className="midlertidig-utilgjengelig__popup-innhold"
                        endreMidlertidigUtilgjengelig={endre}
                        slettMidlertidigUtilgjengelig={slett}
                        midlertidigUtilgjengelig={
                            midlertidigUtilgjengelig.data.midlertidigUtilgjengelig
                        }
                    />
                ) : (
                    <RegistrerMidlertidigUtilgjengelig
                        onAvbryt={lukkPopup}
                        className="midlertidig-utilgjengelig__popup-innhold"
                        registrerMidlertidigUtilgjengelig={registrer}
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
                type: MidlertidigUtilgjengeligActionType.LagreMidlertidigUtilgjengelig,
                kandidatnr,
                aktørId,
                tilDato,
            }),
        endreMidlertidigUtilgjengelig: (kandidatnr: string, aktørId: string, tilDato: string) =>
            dispatch({
                type: MidlertidigUtilgjengeligActionType.EndreMidlertidigUtilgjengelig,
                kandidatnr,
                aktørId,
                tilDato,
            }),
        slettMidlertidigUtilgjengelig: (kandidatnr: string, aktørId: string) => {
            dispatch({
                type: MidlertidigUtilgjengeligActionType.SlettMidlertidigUtilgjengelig,
                kandidatnr,
                aktørId,
            });
        },
    })
)(MidlertidigUtilgjengelig);
