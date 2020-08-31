import React from 'react';

const KandidatenFinnesIkke = () => (
    <div className="skjemaelement__feilmelding">
        <div className="blokk-xxs">
            Du kan ikke legge til kandidaten, fordi personen ikke er synlig i Rekrutteringsbistand.
        </div>
        <div>Mulige årsaker:</div>
        <ul className="leggTilKandidatModal--feilmelding__ul">
            <li>Fødselsnummeret er feil</li>
            <li>Kandidaten har ikke jobbprofil</li>
            <li>Kandidaten har ikke CV</li>
            <li>Kandidaten har ikke lest hjemmel i ny CV-løsning</li>
            <li>Kandidaten er egen ansatt, og du har ikke tilgang</li>
            <li>Kandidaten har "Nei nav.no" i Formidlingsinformasjon i Arena</li>
            <li>Kandidaten har personforhold "Fritatt for kandidatsøk" i Arena</li>
            <li>Kandidaten er sperret "Egen ansatt"</li>
        </ul>
    </div>
);

export default KandidatenFinnesIkke;
