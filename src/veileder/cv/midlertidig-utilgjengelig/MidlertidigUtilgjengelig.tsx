import React, { FunctionComponent, useState } from 'react';
import { Knapp } from 'pam-frontend-knapper';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import './MidlertidigUtilgjengelig.less';
import Chevron from 'nav-frontend-chevron';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import useFeatureToggle from '../../result/useFeatureToggle';
import { Datovelger } from 'nav-datovelger';
import 'nav-datovelger/lib/styles/datovelger.less';
import moment from 'moment';
import TilgjengelighetIkon, { Tilgjengelighet } from './tilgjengelighet-ikon/TilgjengelighetIkon';
import RegistrerMidlertidigUtilgjengelig from './registrer-midlertidig-utilgjengelig/RegistrerMidlertidigUtilgjengelig';
import EndreMidlertidigUtilgjengelig from './endre-midlertidig-utilgjengelig/EndreMidlertidigUtilgjengelig';
import { putMidlertidigUtilgjengelig } from '../../api';

const MidlertidigUtilgjengelig: FunctionComponent = () => {
    const [anker, setAnker] = useState<any>(undefined);
    const erToggletPå = useFeatureToggle('vis-midlertidig-utilgjengelig');

    const [endre, setEndre] = useState<boolean>(false); // TODO Endre skal vises hviss bruker er registrert som utilgjengelig

    if (!erToggletPå) {
        return null;
    }

    const registrerMidlertidigUtilgjengelig = (tilOgMedDato: string): void => {
        // TODO Burde kanskje erstattes med dispatch til redux state, men kan bli litt vanskelig
        putMidlertidigUtilgjengelig("01245", tilOgMedDato);
    };

    const slettMidlertidigUtilgjengelig = () => {
        putMidlertidigUtilgjengelig("012345", null);
    };

    return (
        <div className="midlertidig-utilgjengelig">
            <Knapp type="flat" onClick={e => setAnker(anker ? undefined : e.currentTarget)}>
                <TilgjengelighetIkon
                    tilgjengelighet={Tilgjengelighet.UTILGJENGELIG}
                    className="midlertidig-utilgjengelig__ikon"
                />
                Registrer som utilgjengelig
                <Chevron
                    type={anker ? 'opp' : 'ned'}
                    className="midlertidig-utilgjengelig__chevron"
                />
            </Knapp>
            <Popover
                ankerEl={anker}
                onRequestClose={() => setAnker(undefined)}
                orientering={PopoverOrientering.UnderHoyre}
                avstandTilAnker={16}
            >
                <button onClick={() => setEndre(!endre)}>bytt view</button>
                {endre ? (
                    <EndreMidlertidigUtilgjengelig
                        onAvbryt={() => setAnker(undefined)}
                        className="midlertidig-utilgjengelig__popup-innhold"
                        registrerMidlertidigUtilgjengelig={registrerMidlertidigUtilgjengelig}
                        slettMidlertidigUtilgjengelig={slettMidlertidigUtilgjengelig}
                    />
                ) : (
                    <RegistrerMidlertidigUtilgjengelig
                        onAvbryt={() => setAnker(undefined)}
                        className="midlertidig-utilgjengelig__popup-innhold"
                        registrerMidlertidigUtilgjengelig={registrerMidlertidigUtilgjengelig}
                    />
                )}
            </Popover>
        </div>
    );
};

export default MidlertidigUtilgjengelig;
