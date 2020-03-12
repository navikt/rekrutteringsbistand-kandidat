import * as React from 'react';
// import { Dispatch } from 'redux';
// import { useSelector, useDispatch } from 'react-redux';
import NAVSPA from '@navikt/navspa';

// import { NavKontorAction, NavKontorActionTypes } from '../navKontor/navKontorReducer';
import DekoratørProps, { EnhetDisplay } from './DecoratørProps';
// import State from '../State';

const InternflateDecorator = NAVSPA.importer<DekoratørProps>('internarbeidsflatefs');

const Dekoratør = () => {
    // const { valgtKontor } = useSelector((state: State) => state.navKontor);
    // const dispatch = useDispatch<Dispatch<NavKontorAction>>();

    const onEnhetChange = (enhet: string) => {
        /*dispatch({
            type: NavKontorActionTypes.VelgNavKontor,
            valgtKontor: enhet,
        });*/

        console.log('Valgt enhet:', enhet);
    };

    return (
        <InternflateDecorator
            appname="Rekrutteringsbistand"
            enhet={{
                initialValue: null, //valgtKontor, // TODO: hent initial fra state
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
