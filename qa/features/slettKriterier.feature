# language: no

Egenskap: Slette alle søkekriterier

  Scenario: Slette alle søkekriterier
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Så skal antall treff vise alle kandidater
    Når jeg legger til stillingen "Ingeniør"
    Når jeg legger til utdanning "Mastergrad"
    Og jeg legger til sted "Oslo"
    Og jeg trykker Se kandidatene
    Når jeg trykker Slett alle kriterier
    Så skal antall treff være det samme som alle kandidater

