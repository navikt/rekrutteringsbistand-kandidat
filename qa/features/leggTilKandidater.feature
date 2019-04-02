# language: no

Egenskap: Lagre og slette kandidater fra kandidatlister

    @leggtilkandidater
    Scenario: Lagre og slette kandidater
        Gitt at jeg er logget inn i kandidatsøket som "10051400971"
        Når jeg lagrer "3" kandidater i kandidatlisten "Auto test 2"
        Og jeg går til siden for kandidatlister
        Og jeg åpner kandidatlisten "Auto test 2"
        Så skal listen inneholde "3" kandidater
        Når jeg sletter en kandidat fra listen
        Så skal listen inneholde "2" kandidater
        Når jeg går til siden for kandidatlister
        Og jeg sletter alle kandidatlister med navn "Auto test 2"
        Så skal det ikke lenger eksistere kandidatlister med navn "Auto test 2"
