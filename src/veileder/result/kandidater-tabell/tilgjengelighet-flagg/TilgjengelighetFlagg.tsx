import React, { FunctionComponent, useState } from 'react';
import { Tilgjengelighet } from '../../../sok/tilgjengelighet/midlertidig-utilgjengelig/MidlertidigUtilgjengeligSearch';
import TilgjengelighetIkon from '../../../cv/midlertidig-utilgjengelig/tilgjengelighet-ikon/TilgjengelighetIkon';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './TilgjengelighetFlagg.less';

interface Props {
    status: Tilgjengelighet;
}

const hentPopovertittel = (tilgjengelighet: Tilgjengelighet) => {
    switch (tilgjengelighet) {
        case Tilgjengelighet.TilgjengeligInnen1Uke:
            return 'Tilgjengelig innen 1 uke';
        case Tilgjengelighet.MidlertidigUtilgjengelig:
            return 'Midlertidig utilgjengelig';
    }
};

const TilgjengelighetFlagg: FunctionComponent<Props> = ({ status }) => {
    const [anker, setAnker] = useState<any>(undefined);

    let midlertidigUtilgjengeligFlagg;
    if (status === Tilgjengelighet.Tilgjengelig) {
        midlertidigUtilgjengeligFlagg = null;
    } else if (status === Tilgjengelighet.TilgjengeligInnen1Uke) {
        midlertidigUtilgjengeligFlagg = (
            <TilgjengelighetIkon
                tilgjengelighet={Tilgjengelighet.TilgjengeligInnen1Uke}
                className="tilgjengelighet-flagg--snart-tilgjengelig"
            />
        );
    } else if (status === Tilgjengelighet.MidlertidigUtilgjengelig) {
        midlertidigUtilgjengeligFlagg = (
            <TilgjengelighetIkon
                tilgjengelighet={Tilgjengelighet.MidlertidigUtilgjengelig}
                className="tilgjengelighet-flagg--utilgjengelig"
            />
        );
    } else {
        return null;
    }

    const togglePopover = (e: any) => {
        setAnker(!anker ? e.currentTarget : undefined);
    };

    const lukkPopover = () => {
        setAnker(undefined);
    };

    return (
        <>
            <button className="tilgjengelighet-flagg__knapp" onClick={togglePopover}>
                {midlertidigUtilgjengeligFlagg}
            </button>
            {midlertidigUtilgjengeligFlagg !== null && (
                <div className="tilgjengelighet-flagg__popover">
                    <Popover
                        ankerEl={anker}
                        onRequestClose={lukkPopover}
                        orientering={PopoverOrientering.Under}
                    >
                        <div className="tilgjengelighet-flagg__popover-innhold">
                            <Element>{hentPopovertittel(status)}</Element>
                            <Normaltekst>
                                Tilgjengelig om: <b>... dager</b> (...)
                            </Normaltekst>
                        </div>
                    </Popover>
                </div>
            )}
        </>
    );
};

export default TilgjengelighetFlagg;
