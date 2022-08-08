import { lenkeTilCv } from '../../../app/paths';
import { sendEvent } from '../../../amplitude/amplitude';
import { useState, useEffect } from 'react';
import { Fritekststatus, Fritekstvalidering, validerFritekstfelt } from './validering';
import { useNavigate } from 'react-router-dom';

const useFritekstvalidering = (input: string, hasSubmit: boolean) => {
    const navigate = useNavigate();

    const [validering, setValidering] = useState<Fritekstvalidering>({
        status: Fritekststatus.IkkeEtFnr,
    });

    useEffect(() => {
        const valider = async () => {
            const validerer = {
                status: Fritekststatus.Validerer,
            };

            setValidering(validerer);
            setValidering(await validerFritekstfelt(input));
        };

        valider();
    }, [input]);

    useEffect(() => {
        if (
            hasSubmit &&
            validering.status === Fritekststatus.FantKandidat &&
            validering.kandidatnr
        ) {
            sendEvent('fødselsnummersøk', 'naviger_til_cv');
            navigate(lenkeTilCv(validering.kandidatnr));
        }
    }, [hasSubmit, validering, navigate]);

    return validering;
};

export default useFritekstvalidering;
