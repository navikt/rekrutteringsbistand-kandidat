# language: no

Egenskap: Lagre og slette kandidater fra kandidatlister

    Scenario: Lagre og slette kandidater
        Gitt at jeg er logget inn i kandidatsøket som "08044601975"
        Når jeg lagrer "25" kandidater i kandidatlisten "Auto test 2"
        Og jeg går til siden for kandidatlister
        Og jeg åpner kandidatlisten "Auto test 2"
        Så skal listen inneholde "25" kandidater
        Når jeg sletter "2" kandidater fra listen
        Så skal listen inneholde "23" kandidater
        Når jeg sletter alle kandidatlister med navn "Auto test 2"
        Så skal det ikke lenger eksistere kandidatlister med navn "Auto test 2"
