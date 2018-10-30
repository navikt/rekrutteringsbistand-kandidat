# language: no

Egenskap: Lagre og slette kandidater fra kandidatlister

    @leggtilkandidater @elastic @janzz @ignore
    Scenario: Lagre og slette kandidater
        Gitt at jeg er logget inn i kandidatsøket som "08044601975"
        Når jeg lagrer "25" kandidater i kandidatlisten "Auto test 2"
        Og jeg går til siden for kandidatlister
        Og jeg åpner kandidatlisten "Auto test 2"
        Så skal listen inneholde "25" kandidater
        Når jeg sletter en kandidat fra listen
        Så skal listen inneholde "24" kandidater
        Når jeg går til siden for kandidatlister
        Og jeg sletter alle kandidatlister med navn "Auto test 2"
        Så skal det ikke lenger eksistere kandidatlister med navn "Auto test 2"
