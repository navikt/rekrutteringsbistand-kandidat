import React, { FunctionComponent, useState } from 'react';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';

import { Nettressurs } from '../../../../felles/common/remoteData';
import { Tilgjengelighet } from '../../../sok/Søkeresultat';
import MerInformasjon from './MerInformasjon';
import './TilgjengelighetFlagg.less';
import { MidlertidigUtilgjengeligResponse } from '../../../kandidatside/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import TilgjengelighetIkon from '../../../kandidatside/midlertidig-utilgjengelig/tilgjengelighet-ikon/TilgjengelighetIkon';

type Props = {
    status: Tilgjengelighet;
    hentMerInformasjon: () => void;
    merInformasjon?: Nettressurs<MidlertidigUtilgjengeligResponse>;
};

const TilgjengelighetFlagg: FunctionComponent<Props> = ({
    status,
    merInformasjon,
    hentMerInformasjon,
}) => {
    const [anker, setAnker] = useState<any>(undefined);

    const togglePopover = (e: any) => {
        setAnker(!anker ? e.currentTarget : undefined);

        if (!merInformasjon) {
            hentMerInformasjon();
        }
    };

    const lukkPopover = () => {
        setAnker(undefined);
    };

    if (status === Tilgjengelighet.Tilgjengelig) return null;

    return (
        <>
            <button className="tilgjengelighet-flagg__knapp" onClick={togglePopover}>
                <TilgjengelighetIkon
                    tilgjengelighet={status}
                    className="tilgjengelighet-flagg__ikon"
                />
            </button>
            <div className="tilgjengelighet-flagg__popover">
                <Popover
                    ankerEl={anker}
                    onRequestClose={lukkPopover}
                    orientering={PopoverOrientering.Under}
                >
                    <div className="tilgjengelighet-flagg__popover-innhold">
                        <MerInformasjon status={status} merInformasjon={merInformasjon} />
                    </div>
                </Popover>
            </div>
        </>
    );
};

export default TilgjengelighetFlagg;
