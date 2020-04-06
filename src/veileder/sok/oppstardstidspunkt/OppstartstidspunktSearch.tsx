import React, { FunctionComponent, useState } from 'react';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import { all } from 'redux-saga/effects';

import "./OppstartstidspunktSearch.less";

enum Oppstartstidspunkt {
    LEDIG_NAA = 'LEDIG_NAA',
    ETTER_TRE_MND = 'ETTER_TRE_MND',
    ETTER_AVTALE = 'ETTER_AVTALE',
}

interface Props {
    oppstartstidspunkter: Oppstartstidspunkt[];
    checkOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) => void;
    uncheckOppstartstidspunkt: (tidspunkt: Oppstartstidspunkt) => void;
}

const OppstartstidspunktSearch: FunctionComponent<Props | any> = props => {
    const [åpen, setÅpen] = useState<boolean>(false);

    const alleOppstartstidspunkter = [
        { label: "Ledig nå", value: Oppstartstidspunkt.LEDIG_NAA },
        { label: "Ledig om 3 måneder", value: Oppstartstidspunkt.LEDIG_NAA },
        { label: "Ledig etter avtale", value: Oppstartstidspunkt.LEDIG_NAA },
    ]

    return (
        <SokekriteriePanel
            apen={åpen}
            id="Oppstartstidspunkt__SokekriteriePanel"
            tittel="Tilgjengelighet"
            onClick={() => setÅpen(!åpen)}
        >
            <SkjemaGruppe title="Registrert i kandidatens jobbprofil">
                {
                    alleOppstartstidspunkter.map(tidspunkt =>
                        <Checkbox
                            key={tidspunkt.value}
                            id={`oppstartstidspunkt-${tidspunkt.value.toLowerCase()}-checkbox`}
                            className="oppstartstidspunkt-search__checkbox skjemaelement--pink"
                            label={tidspunkt.label}
                            value={tidspunkt.value}
                            checked={true}
                            // onChange={onChange}
                        />
                    )
                }
            </SkjemaGruppe>
        </SokekriteriePanel>
    );
};

export default OppstartstidspunktSearch;
