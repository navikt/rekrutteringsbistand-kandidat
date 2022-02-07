import React, { FunctionComponent } from 'react';

type Synlighetsevaluering = {
    harAktivCv: boolean;
    harJobbprofil: boolean;
    harSettHjemmel: boolean;
    maaIkkeBehandleTidligereCv: boolean;
    erIkkefritattKandidatsøk: boolean;
    erUnderOppfoelging: boolean;
    harRiktigFormidlingsgruppe: boolean;
    erIkkeKode6eller7: boolean;
    erIkkeSperretAnsatt: boolean;
    erIkkeDoed: boolean;
    erFerdigBeregnet: boolean;
};

type Props = {
    synlighetsevaluering: Synlighetsevaluering;
};

const KandidatenFinnesIkke: FunctionComponent<Props> = ({ synlighetsevaluering }) => (
    <div className="skjemaelement__feilmelding">
        <div className="blokk-xxs">Kandidaten kan ikke legges til.</div>
        <div>Mulige årsaker:</div>
        <ul className="leggTilKandidatModal--feilmelding__ul">
            <li>Fødselsnummeret er feil</li>
            <li>Kandidaten mangler CV eller jobbprofil</li>
            <li>Kandidaten har ikke blitt informert om NAVs behandlingsgrunnlag</li>
            <li>Kandidaten har personforhold "Fritatt for kandidatsøk" i Arena</li>
            <li>Kandidaten er sperret "Egen ansatt"</li>
            <li>Kandidaten har diskresjonskode (kode 6 og 7)</li>
        </ul>
    </div>
);

export default KandidatenFinnesIkke;
