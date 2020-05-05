import React, { FunctionComponent, useState } from 'react';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';

import { MidlertidigUtilgjengeligResponse } from '../../../cv/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { Nettressurs } from '../../../../felles/common/remoteData';
import { Tilgjengelighet } from '../../../sok/Søkeresultat';
import MerInformasjon from './MerInformasjon';
import TilgjengelighetIkon from '../../../cv/midlertidig-utilgjengelig/tilgjengelighet-ikon/TilgjengelighetIkon';
import './TilgjengelighetFlagg.less';

type Props = {
    status: Tilgjengelighet;
    merInformasjon?: Nettressurs<MidlertidigUtilgjengeligResponse>;
    hentMerInformasjon: () => void;
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

    return (
        <>
            <button className="tilgjengelighet-flagg__knapp" onClick={togglePopover}>
                <TilgjengelighetIkon
                    tilgjengelighet={status}
                    className="tilgjengelighet-flagg__ikon"
                />
            </button>
            {status !== Tilgjengelighet.Tilgjengelig && (
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
            )}
        </>
    );
};

export default TilgjengelighetFlagg;
