import React from 'react';
import './FantFåKandidater.less';
import { Innholdstittel, Normaltekst, Ingress, Element } from 'nav-frontend-typografi';
import { Knapp } from 'pam-frontend-knapper';

const KRITERIER_TMP = {
    utdanningsniva: ['Videregaende'],
    hovedmal: ['SKAFFEA'],
    tilretteleggingsbehov: true,
    kategorier: ['arbeidstid'],
};

const Kriterie = ({ label, verdi, onFjernKriterie }) => {
    return (
        <button onClick={onFjernKriterie} type="button" className="fant-få-kandidater__kriterie">
            <Element className="fant-få-kandidater__kriterie-label">{`${label}: ${verdi}`}</Element>
            <svg height="18" width="18">
                <circle cx="9" cy="9" r="8" stroke="black" strokeWidth="1" fill="none" />
            </svg>
        </button>
    );
};

const ValgteKriterier = ({ kriterier }) => {
    return (
        <div className="fant-få-kandidater__valgte-kriterier">
            {Object.entries(kriterier).map(([key, value]) => (
                <Kriterie
                    key={`${key}-${value}`}
                    label={key}
                    verdi={value}
                    onFjernKriterie={() => {
                        console.log('Fjerner', key, value);
                    }}
                />
            ))}
        </div>
    );
};

const fjernFelterFraObjekt = (objekt, felter, omvendt = false) => {
    const nyttObject = {};

    for (let [key, value] of Object.entries(objekt)) {
        if (omvendt ? felter.includes(key) : !felter.includes(key)) {
            nyttObject[key] = value;
        }
    }

    return nyttObject;
};

const beholdFelterHosObjekt = (objekt, felter) => fjernFelterFraObjekt(objekt, felter, true);

const FantFåKandidater = ({ antallKandidater = 0 }) => {
    const andreKriterier = fjernFelterFraObjekt(KRITERIER_TMP, [
        'tilretteleggingsbehov',
        'kategorier',
    ]);
    const tilretteleggingsbehovKriterier = beholdFelterHosObjekt(KRITERIER_TMP, ['kategorier']);

    return (
        <div className="fant-få-kandidater">
            <i className="fant-få-kandidater__ikon">Ikon her</i>
            <Innholdstittel className="fant-få-kandidater__overskrift">
                {antallKandidater === 0
                    ? 'Fant ingen kandidater'
                    : `Fant kun ${antallKandidater} kandidater`}
            </Innholdstittel>
            <Ingress className="fant-få-kandidater__ingress">
                For å få treff på flere kandidater, fjern et eller flere kriterier,´.
            </Ingress>
            <Normaltekst className="fant-få-kandidater__valgte-kriterier-tittel">
                Disse kriteriene er valgt:
            </Normaltekst>
            <ValgteKriterier kriterier={andreKriterier} />
            {KRITERIER_TMP.tilretteleggingsbehov && (
                <>
                    <Normaltekst className="fant-få-kandidater__valgte-kriterier-tittel">
                        Disse kriteriene er valgt for tilretteleggingsbehov:
                    </Normaltekst>
                    <ValgteKriterier kriterier={tilretteleggingsbehovKriterier} />
                </>
            )}
            <Knapp onClick={() => {}}>Slett alle kriterier</Knapp>
        </div>
    );
};

export default FantFåKandidater;
