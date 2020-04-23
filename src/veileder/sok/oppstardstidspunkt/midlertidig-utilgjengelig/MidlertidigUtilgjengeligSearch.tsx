import React, { FunctionComponent } from 'react';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';

interface Props {}

export enum MidlertidigUtilgjengelig {
    Tilgjengelig = 'tilgjengelig',
    TilgjengeligInnen1Uke = 'tilgjengeliginnen1uke',
    MidlertidigUtilgjengelig = 'midlertidigutilgjengelig',
}

const MidlertidigUtilgjengeligSearch: FunctionComponent<Props> = () => {
    const midlertidigUtilgjengeligStatuser = [
        { label: 'Tilgjengelig', value: MidlertidigUtilgjengelig.Tilgjengelig },
        {
            label: 'Tilgjengelig innen 1 uke',
            value: MidlertidigUtilgjengelig.TilgjengeligInnen1Uke,
        },
        {
            label: 'Midlertidig utilgjengelig',
            value: MidlertidigUtilgjengelig.MidlertidigUtilgjengelig,
        },
    ];

    return (
        <SkjemaGruppe title="Registrert av NAV">
            {midlertidigUtilgjengeligStatuser.map((tidspunkt) => (
                <Checkbox
                    key={tidspunkt.value}
                    // id={`oppstartstidspunkt-${tidspunkt.value.toLowerCase()}-checkbox`}
                    // className="oppstartstidspunkt-search__checkbox"
                    label={tidspunkt.label}
                    value={tidspunkt.value}
                    // checked={oppstartstidspunkter.includes(tidspunkt.value)}
                    // onChange={onOppstartstidspunktChange}
                />
            ))}
        </SkjemaGruppe>
    );
};

export default MidlertidigUtilgjengeligSearch;
