import React, { FunctionComponent, useState } from 'react';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';

import { MidlertidigUtilgjengeligResponse } from '../../../cv/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { Nettressurs } from '../../../../felles/common/remoteData';
import { Tilgjengelighet } from '../../../sok/tilgjengelighet/midlertidig-utilgjengelig/MidlertidigUtilgjengeligSearch';
import Flagg from './Flagg';
import MerInformasjon from './MerInformasjon';
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
                <Flagg status={status} />
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
