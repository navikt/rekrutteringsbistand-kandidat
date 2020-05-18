import { Utfall } from '../../kandidatlister/kandidatliste/kandidatrad/KandidatRad';
import { Status } from '../../kandidatlister/kandidatliste/kandidatrad/statusSelect/StatusSelect';

export interface KandidatlisteForKandidat {
     kandidatnr: string;
     fornavn: string;
     etternavn: string;
     lagtTilTidspunkt: string;
     lagtTilAvIdent: string;
     lagtTilAvEpost: string;
     lagtTilAvNavn: string;
     status: Status;
     utfall: Utfall;
     uuid: string;
     tittel: string;
     organisasjonReferanse?: string;
     organisasjonNavn?: string;
     stillingId?: string;
     slettet?: boolean;
}
