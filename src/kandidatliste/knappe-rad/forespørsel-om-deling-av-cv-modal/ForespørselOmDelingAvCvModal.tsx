import React, { FunctionComponent } from 'react';
import Lenkeknapp from '../../../common/lenkeknapp/Lenkeknapp';
import MedPopover from '../../../common/med-popover/MedPopover';
import useMinstEnKandidatErMarkert from '../useMinstEnKandidatErMarkert';

const ForespørselOmDelingAvCvModal: FunctionComponent = () => {
    const minstEnKandidatErMarkert = useMinstEnKandidatErMarkert();

    return minstEnKandidatErMarkert ? (
        <Lenkeknapp className="kandidatlisteknapper__knapp DelMedKandidat" onClick={() => {}}>
            <ForespørselOmDelingAvCvIkon />
        </Lenkeknapp>
    ) : (
        <MedPopover
            hjelpetekst="Du må huke av for kandidatene du ønsker å dele stillingen med."
            tittel="Del stillingen med de markerte kandidatene"
        >
            <Lenkeknapp className="kandidatlisteknapper__knapp DelMedKandidat">
                <ForespørselOmDelingAvCvIkon />
            </Lenkeknapp>
        </MedPopover>
    );
};

const ForespørselOmDelingAvCvIkon: FunctionComponent = () => (
    <>
        <i className="DelMedKandidat__icon" />
        Del med kandidat
    </>
);

export default ForespørselOmDelingAvCvModal;
