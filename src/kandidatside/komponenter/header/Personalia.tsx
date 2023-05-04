import Cv from '../../../cv/reducer/cv-typer';
import { capitalizePoststed } from '../../../utils/formateringUtils';

type Props = { cv: Cv };

const Personalia = ({ cv }: Props) => (
    <>
        {cv.epost && (
            <span>
                E-post:{' '}
                <a className="lenke" href={`mailto:${cv.epost}`}>
                    {cv.epost}
                </a>
            </span>
        )}
        {cv.telefon && (
            <span>
                Telefon: <strong>{formaterMobiltelefonnummer(cv.telefon)}</strong>
            </span>
        )}
        {cv.adresse && cv.adresse.adrlinje1 && (
            <span>
                Adresse:{' '}
                <strong>
                    {formaterAdresse(
                        cv.adresse.adrlinje1,
                        cv.adresse.postnr,
                        cv.adresse.poststednavn
                    )}
                </strong>
            </span>
        )}
    </>
);

const formaterMobiltelefonnummer = (input: string) => {
    const inputNoWhiteSpace = input.replace(/\s/g, '');
    const actualNumber = inputNoWhiteSpace.slice(-8);
    const countryCode = inputNoWhiteSpace.slice(-99, -8);
    const lastString = actualNumber.slice(-3);
    const midString = actualNumber.slice(-5, -3);
    const firstString = actualNumber.slice(-8, -5);

    return `${countryCode} ${firstString} ${midString} ${lastString}`;
};

const formaterAdresse = (gate: string, postnummer: string, poststed: string) => {
    const sisteDel = [postnummer, poststed ? capitalizePoststed(poststed) : null]
        .filter((string) => string)
        .join(' ');

    return [gate, sisteDel].filter((string) => string).join(', ');
};

export default Personalia;
