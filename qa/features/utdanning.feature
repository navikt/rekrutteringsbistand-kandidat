# language: no

Egenskap: Finne kandidater basert på utdanningsnivå og fagfelt

  Bakgrunn: Logge inn
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"

  Scenario: Søke etter kandidater basert på utdanningsnivå
    Når jeg legger til utdanning "Bachelorgrad"
    Og jeg trykker Se kandidatene
    Så skal det vises treff på kandidater som matcher "Bachelorgrad"
    Og antall treff skal minke
    Når jeg legger til utdanning "Mastergrad"
    Så skal antall treff øke

  Scenario: Søke etter kandidater basert på fagfelt
    Når jeg legger til fagfelt "Pedagogikk"
    Og jeg trykker Se kandidatene
    Så skal det vises treff på kandidater som matcher "Pedagogikk"
    Når jeg legger til fagfelt "Undervisning"
    Så skal antall treff minke
