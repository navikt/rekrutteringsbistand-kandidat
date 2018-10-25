# language: no

Egenskap: Opprette og slette kandidatlister

    Scenario: Opprette og slette kandidatliste
        Gitt at jeg er logget inn i kandidatsøket som "08044601975"
        Når jeg går til siden for kandidatlister
        Og jeg oppretter en kandidatliste
            | Navn        | Beskrivelse              | Oppdragsgiver |
            | Auto test 1 | Liste laget av auto test | Test auto     |
        Og jeg åpner kandidatlisten "Auto test 1"
        Så skal navn på listen være "Auto test 1"
        Og beskrivelse av listen være "Liste laget av auto test"
        Og oppdragsgiver for listen være "Test auto"
        Når jeg går til siden for kandidatlister
        Og jeg sletter alle kandidatlister med navn "Auto test 1"
        Så skal det ikke lenger eksistere kandidatlister med navn "Auto test 1"
