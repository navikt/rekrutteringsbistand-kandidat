import * as React from 'react';
import { Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import NAVSPA from '@navikt/navspa';

import { NavKontorAction, NavKontorActionTypes } from '../navKontor/navKontorReducer';
import DekoratørProps, { EnhetDisplay } from './DecoratørProps';

const InternflateDecorator = NAVSPA.importer<DekoratørProps>('internarbeidsflatefs');

const Dekoratør = () => {
    const { valgtKontor } = useSelector((state: any) => state.navKontor);
    const dispatch = useDispatch<Dispatch<NavKontorAction>>();

    const onEnhetChange = (enhet: string) => {
        dispatch({
            type: NavKontorActionTypes.VelgNavKontor,
            valgtKontor: enhet,
        });
    };

    return (
        <InternflateDecorator
            appname="Rekrutteringsbistand"
            enhet={{
                initialValue: valgtKontor,
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
