import React, { FunctionComponent, useState } from 'react';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';

import { MidlertidigUtilgjengeligResponse } from '../../../kandidat/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { Nettressurs } from '../../../../felles/common/remoteData';
import { Tilgjengelighet } from '../../../sok/Søkeresultat';
import MerInformasjon from './MerInformasjon';
import TilgjengelighetIkon from '../../../kandidat/midlertidig-utilgjengelig/tilgjengelighet-ikon/TilgjengelighetIkon';
import './TilgjengelighetFlagg.less';

type Props = {
    status: Tilgjengelighet;
    hentMerInformasjon: () => void;
    merInformasjon?: Nettressurs<MidlertidigUtilgjengeligResponse>;
    visMidlertidigUtilgjengeligPopover: boolean;
};

const TilgjengelighetFlagg: FunctionComponent<Props> = ({
    status,
    merInformasjon,
    hentMerInformasjon,
    visMidlertidigUtilgjengeligPopover,
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

    const renderPopover =
        visMidlertidigUtilgjengeligPopover && status !== Tilgjengelighet.Tilgjengelig;

    if (!renderPopover) {
        return (
            <TilgjengelighetIkon tilgjengelighet={status} className="tilgjengelighet-flagg__ikon" />
        );
    }

    return (
        <>
            <button className="tilgjengelighet-flagg__knapp" onClick={togglePopover}>
                <TilgjengelighetIkon
                    tilgjengelighet={status}
                    className="tilgjengelighet-flagg__ikon"
                />
            </button>
            {renderPopover && (
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
