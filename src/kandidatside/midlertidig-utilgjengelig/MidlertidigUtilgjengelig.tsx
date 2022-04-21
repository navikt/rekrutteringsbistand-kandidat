import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import moment from 'moment';
// import 'nav-datovelger/lib/styles/datovelger.less'; // TODO Fiks

import {
    MidlertidigUtilgjengeligAction,
    MidlertidigUtilgjengeligActionType,
    MidlertidigUtilgjengeligResponse,
} from './midlertidigUtilgjengeligReducer';
import { antallDagerMellom, dagensDato } from './validering';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { sendEvent } from '../../amplitude/amplitude';
import Cv, { Tilgjengelighet } from '../cv/reducer/cv-typer';
import EndreMidlertidigUtilgjengelig from './endre-midlertidig-utilgjengelig/EndreMidlertidigUtilgjengelig';
import MidlertidigUtilgjengeligKnapp from './midlertidig-utilgjengelig-knapp/MidlertidigUtilgjengeligKnapp';
import RegistrerMidlertidigUtilgjengelig from './registrer-midlertidig-utilgjengelig/RegistrerMidlertidigUtilgjengelig';
import './MidlertidigUtilgjengelig.less';

export const tillatRegistreringAvMidlertidigUtilgjengelig = false;

type OwnProps = {
    cv: Cv;
    midlertidigUtilgjengelig?: Nettressurs<MidlertidigUtilgjengeligResponse>;
};

type ConnectedProps = {
    lagreMidlertidigUtilgjengelig: (kandidatnr: string, aktørId: string, tilDato: string) => void;
    endreMidlertidigUtilgjengelig: (kandidatnr: string, aktørId: string, tilDato: string) => void;
    slettMidlertidigUtilgjengelig: (kandidatnr: string, aktørId: string) => void;
};

type Props = OwnProps & ConnectedProps;

const MidlertidigUtilgjengelig: FunctionComponent<Props> = ({
    cv,
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
        endreMidlertidigUtilgjengelig(cv.kandidatnummer, cv.aktorId, dato);

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
            endreMidlertidigUtilgjengelig(cv.kandidatnummer, cv.aktorId, dato);
        } else {
            lagreMidlertidigUtilgjengelig(cv.kandidatnummer, cv.aktorId, dato);
        }

        lukkPopup();
    };

    const slett = () => {
        slettMidlertidigUtilgjengelig(cv.kandidatnummer, cv.aktorId);
        sendEvent('cv_midlertidig_utilgjengelig', 'slett');
        lukkPopup();
    };

    const tilgjengelighet = getTilgjengelighet(midlertidigUtilgjengelig);

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

export default connect(
    () => ({}),
    (dispatch: Dispatch<MidlertidigUtilgjengeligAction>) => ({
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
