import React from 'react';
import { Container } from 'nav-frontend-grid';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import './Feilside.less';

const NedeSide = () => (
    <Container>
        <div className="panel side-nede">
            <Systemtittel>Kandidatsøket er ikke tilgjengelig</Systemtittel>
            <Normaltekst className="feilside">
                Vi har oppdaget en teknisk feil i kandidatsøket, og på grunn av ferieavvikling får vi dessverre ikke
                fikset den med én gang. Derfor er kandidatsøket utilgjengelig i noen uker.
            </Normaltekst>
            <Normaltekst className="feilside">
                I mellomtiden fungerer det eksisterende kandidatsøket på <a href="https://www.nav.no" className="lenke" >nav.no</a> som vanlig, det finner du &nbsp;
                <a href="https://www.nav.no/no/Bedrift/Rekruttering/Logg+inn+arbeidstjenester+for+arbeidsgivere" className="lenke">her</a>.
            </Normaltekst>
            <Normaltekst className="feilside">
            Vi takker for tålmodigheten og sier fra så fort kandidatsøket er tilgjengelig igjen, sannsynligvis i begynnelsen av august.
            Har du spørsmål til dette så ta gjerne kontakt med oss på <a href="mailto:plattform.for.arbeidsmarkedet@nav.no" className="link">plattform.for.arbeidsmarkedet@nav.no</a>.
            </Normaltekst>
        </div>
    </Container>
);

export default NedeSide;
