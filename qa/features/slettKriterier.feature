# language: no

Egenskap: Slette alle søkekriterier

  Scenario: Slette alle søkekriterier
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til stillingen "Ingeniør"
    Og jeg legger til utdanning "Mastergrad"
    Og jeg legger til sted "Oslo"
    Og jeg trykker Se kandidatene
    Så skal antall treff minke
    Når jeg trykker Slett alle kriterier
    Så skal antall treff være det samme som alle kandidater

