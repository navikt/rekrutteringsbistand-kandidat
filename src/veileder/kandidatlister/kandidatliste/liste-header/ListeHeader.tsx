import React, { FunctionComponent, ReactNode } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import StatusHjelpetekst from './StatusHjelpetekst';

interface Props {
    stillingsId: string | null;
    alleMarkert: boolean;
    onCheckAlleKandidater: () => void;
    visArkiveringskolonne: boolean;
}

export const modifierTilListeradGrid = (
    visUtfallskolonne: boolean,
    visArkiveringskolonne: boolean
) => {
    if (visUtfallskolonne) {
        return visArkiveringskolonne
            ? ' liste-rad--vis-utfall-og-arkivering'
            : ' liste-rad--vis-utfall';
    } else {
        return visArkiveringskolonne ? ' liste-rad--vis-arkivering' : '';
    }
};

const Kolonnetittel = ({ className, children }: { className?: string; children: ReactNode }) => (
    <div className={className ? className : ''}>
        <Element className="kolonne-tittel">{children}</Element>
    </div>
);

const ListeHeader: FunctionComponent<Props> = ({
    stillingsId,
    alleMarkert,
    onCheckAlleKandidater,
    visArkiveringskolonne,
}) => {
    const klassenavnForListerad =
        'liste-rad' + modifierTilListeradGrid(stillingsId !== null, visArkiveringskolonne);

    return (
        <div className="liste-rad-wrapper liste-header">
            <div className={klassenavnForListerad}>
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide skjemaelement--pink"
                    checked={alleMarkert}
                    onChange={() => onCheckAlleKandidater()}
                />
                <Kolonnetittel>Navn</Kolonnetittel>
                <Kolonnetittel>Fødselsnummer</Kolonnetittel>
                <Kolonnetittel>Lagt til av</Kolonnetittel>
                <Kolonnetittel>Lagt til</Kolonnetittel>
                <Kolonnetittel className="kolonne-middels">
                    <div className="status-overskrift">
                        Status
                        <StatusHjelpetekst />
                    </div>
                </Kolonnetittel>

                {stillingsId && <Kolonnetittel>Utfall</Kolonnetittel>}
                <Kolonnetittel>Notater</Kolonnetittel>
                <Kolonnetittel className="kolonne-midtstilt">Mer info</Kolonnetittel>
                {visArkiveringskolonne && (
                    <Kolonnetittel className="kolonne-midtstilt">Slett</Kolonnetittel>
                )}
            </div>
        </div>
    );
};

export default ListeHeader;
