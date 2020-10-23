import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { utfallToDisplayName } from '../kandidatrad/utfall-select/UtfallVisning';
import { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import './EndreUtfallModal.less';
import { KandidatIKandidatliste } from '../kandidatlistetyper';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';

interface Props {
    vis: boolean;
    utfall: Utfall;
    kandidat: KandidatIKandidatliste;
    fornavn?: string;
    etternavn?: string;
    onBekreft: (utfall: Utfall, kandidat: KandidatIKandidatliste) => void;
    onLukk: () => void;
}

const EndreUtfallModal: FunctionComponent<Props> = ({
    vis,
    fornavn,
    etternavn,
    utfall,
    onBekreft,
    onLukk,
    kandidat,
}) => {
    const [nyttUtfall, setNyttUtfall] = useState<Utfall>(utfall);

    const onEndreUtfall = (event: ChangeEvent<HTMLInputElement>) => {
        setNyttUtfall(event.target.value as Utfall);
    };

    const navn = `${fornavn || ''} ${etternavn || ''}`;

    return (
        <NavFrontendModal
            closeButton
            isOpen={vis}
            contentLabel="Endre utfall for kandidat"
            onRequestClose={onLukk}
            className="endreUtfallModal"
        >
            <Systemtittel className="endreUtfallModal__tittel">Endre utfall</Systemtittel>
            <Normaltekst className="endreUtfallModal__beskrivelse">
                Utfallet du registrerer på {navn} vil bli telt, og tellingen vil bli brukt til
                statistikk.
            </Normaltekst>
            {/* TODO: Alertstripe og rett tekst */}
            {(nyttUtfall === Utfall.Presentert || nyttUtfall === Utfall.FåttJobben) && (
                <div>
                    Endrer du utfallet til «ikke presentert», vil tellingen på «presentert» tas
                    bort.
                </div>
            )}
            <RadioGruppe legend="Velg utfall:">
                {/* TODO: Farget prikk bak labelen */}
                <Radio
                    label={utfallToDisplayName(Utfall.IkkePresentert)}
                    value={Utfall.IkkePresentert}
                    checked={nyttUtfall === Utfall.IkkePresentert}
                    onChange={onEndreUtfall}
                    name="endreUtfall"
                />
                <Radio
                    label={utfallToDisplayName(Utfall.Presentert)}
                    value={Utfall.Presentert}
                    checked={nyttUtfall === Utfall.Presentert}
                    onChange={onEndreUtfall}
                    name="endreUtfall"
                />
                <Radio
                    label={utfallToDisplayName(Utfall.FåttJobben)}
                    value={Utfall.FåttJobben}
                    checked={nyttUtfall === Utfall.FåttJobben}
                    onChange={onEndreUtfall}
                    name="endreUtfall"
                />
                {/* TODO Beskrivelse om fått jobben */}
            </RadioGruppe>
            <div className="endreUtfallModal__knapper">
                <Hovedknapp
                    onClick={() => {
                        onBekreft(utfall, kandidat);
                    }}
                    className="endreUtfallModal__bekreftknapp"
                >
                    Endre utfall
                </Hovedknapp>
                <Flatknapp onClick={onLukk}>Avbryt</Flatknapp>
            </div>
        </NavFrontendModal>
    );
};

export default EndreUtfallModal;
