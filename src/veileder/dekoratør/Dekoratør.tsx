import * as React from 'react';
import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import NAVSPA from '@navikt/navspa';

import { NavKontorAction, NavKontorActionTypes } from '../navKontor/navKontorReducer';
import DekoratørProps, { EnhetDisplay } from './DecoratørProps';
import AppState from '../AppState';

const InternflateDecorator = NAVSPA.importer<DekoratørProps>('internarbeidsflatefs');

const Dekoratør = () => {
    const { valgtNavKontor } = useSelector((state: AppState) => state.navKontor);
    const dispatch = useDispatch<Dispatch<NavKontorAction>>();

    const onEnhetChange = (enhet: string) => {
        dispatch({
            type: NavKontorActionTypes.VelgNavKontor,
            valgtNavKontor: enhet,
        });
    };

    return (
        <InternflateDecorator
            appname="Rekrutteringsbistand"
            enhet={{
                initialValue: valgtNavKontor,
                display: EnhetDisplay.ENHET_VALG,
                onChange: onEnhetChange,
            }}
            toggles={{
                visVeileder: true,
            }}
        />
    );
};

export default Dekoratør;
