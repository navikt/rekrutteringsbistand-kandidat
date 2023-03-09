import { formaterDato } from '../../../utils/dateUtils';
import Cv from '../../../cv/reducer/cv-typer';

type Props = {
    cv: Cv;
};

const Fødselsinfo = ({ cv }: Props) =>
    cv.fodselsdato ? (
        <span>
            Fødselsdato:{' '}
            <strong>
                {formaterDato(cv.fodselsdato)} {cv.fodselsnummer && <>({cv.fodselsnummer})</>}
            </strong>
        </span>
    ) : (
        <span>
            Fødselsnummer: <strong>{cv.fodselsnummer}</strong>
        </span>
    );

export default Fødselsinfo;
