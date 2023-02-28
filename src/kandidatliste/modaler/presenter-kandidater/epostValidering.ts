export const erGyldigEpost = (epost: string): boolean => {
    // Tatt fra https://emailregex.com/
    const regex = RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regex.test(epost);
};

export const inneholderSærnorskeBokstaver = (tekst: string): boolean => /[æøå]/.test(tekst);
