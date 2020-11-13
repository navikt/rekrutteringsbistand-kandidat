import React, { FunctionComponent } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import { Kandidatliste, Kandidatlistestatus } from '../kandidatlistetyper';
import StatusHjelpetekst from './StatusHjelpetekst';
import { Sorteringsalgoritme, Sorteringsvariant } from '../kandidatsortering';
import SorterbarKolonne from './SorterbarKolonne';
import { Kandidatsortering } from '../Kandidatliste';
import './../kandidatrad/Kandidatrad.less';

interface Props {
    kandidatliste: Kandidatliste;
    alleMarkert: boolean;
    onCheckAlleKandidater: () => void;
    visArkiveringskolonne: boolean;
    sortering: Kandidatsortering;
    setSortering: (sortering: Kandidatsortering) => void;
}

export const modifierTilListeradGrid = (
    visUtfallskolonne: boolean,
    visArkiveringskolonne: boolean
) => {
    if (visUtfallskolonne) {
        return visArkiveringskolonne
            ? ' kandidatliste-kandidat__rad--vis-utfall-og-arkivering'
            : ' kandidatliste-kandidat__rad--vis-utfall';
    } else {
        return visArkiveringskolonne ? ' kandidatliste-kandidat__rad--vis-arkivering' : '';
    }
};

const Kolonne: FunctionComponent<{
    tekst: string;
    className?: string;
}> = ({ tekst, className, children }) => {
    return (
        <Element
            role="columnheader"
            tag="div"
            className={`kandidatliste-kandidat__kolonne-tittel${className ? ' ' + className : ''}`}
        >
            {tekst}
            {children}
        </Element>
    );
};

const ListeHeader: FunctionComponent<Props> = ({
    kandidatliste,
    alleMarkert,
    onCheckAlleKandidater,
    visArkiveringskolonne,
    sortering,
    setSortering,
}) => {
    const klassenavn =
        'kandidatliste-kandidat kandidatliste-kandidat__header' +
        (kandidatliste.status === Kandidatlistestatus.Lukket
            ? ' kandidatliste-kandidat--disabled'
            : '');

    const klassenavnForListerad =
        'kandidatliste-kandidat__rad' +
        modifierTilListeradGrid(kandidatliste.stillingId !== null, visArkiveringskolonne);

    const endreSortering = (sorteringsalgoritme: Sorteringsalgoritme) => {
        if (sortering === null || sortering.algoritme !== sorteringsalgoritme) {
            setSortering({
                algoritme: sorteringsalgoritme,
                variant: Sorteringsvariant.Stigende,
            });
        } else if (sortering.variant === Sorteringsvariant.Stigende) {
            setSortering({
                algoritme: sorteringsalgoritme,
                variant: Sorteringsvariant.Synkende,
            });
        } else {
            setSortering(null);
        }
    };

    return (
        <div role="rowgroup" className={klassenavn}>
            <div role="row" className={klassenavnForListerad}>
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide"
                    checked={alleMarkert}
                    disabled={kandidatliste.status === Kandidatlistestatus.Lukket}
                    onChange={() => onCheckAlleKandidater()}
                />
                <div />
                <SorterbarKolonne
                    tekst="Navn"
                    sortering={sortering}
                    sorteringsalgoritme={Sorteringsalgoritme.Navn}
                    onClick={endreSortering}
                />
                <SorterbarKolonne
                    tekst="Fødselsnr."
                    sortering={sortering}
                    sorteringsalgoritme={Sorteringsalgoritme.Fødselsnummer}
                    onClick={endreSortering}
                />
                <SorterbarKolonne
                    tekst="Lagt til av"
                    sortering={sortering}
                    sorteringsalgoritme={Sorteringsalgoritme.LagtTilAv}
                    onClick={endreSortering}
                />
                <SorterbarKolonne
                    tekst="Lagt til"
                    sortering={sortering}
                    sorteringsalgoritme={Sorteringsalgoritme.LagtTilTidspunkt}
                    onClick={endreSortering}
                />
                <SorterbarKolonne
                    tekst="Status"
                    sortering={sortering}
                    sorteringsalgoritme={Sorteringsalgoritme.Status}
                    onClick={endreSortering}
                    className="kandidatliste-kandidat__kolonne-med-hjelpetekst"
                >
                    <StatusHjelpetekst />
                </SorterbarKolonne>
                {kandidatliste.stillingId && (
                    <SorterbarKolonne
                        sortering={sortering}
                        sorteringsalgoritme={Sorteringsalgoritme.Utfall}
                        onClick={endreSortering}
                        tekst="Utfall"
                    />
                )}
                <Kolonne tekst="Notater" />
                <Kolonne tekst="Info" className="kandidatliste-kandidat__kolonne-midtstilt" />
                {visArkiveringskolonne && (
                    <Kolonne tekst="Slett" className="kandidatliste-kandidat__kolonne-høyrestilt" />
                )}
            </div>
        </div>
    );
};

export default ListeHeader;
