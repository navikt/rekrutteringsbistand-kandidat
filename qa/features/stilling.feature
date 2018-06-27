# language: no

Egenskap: Finne kandidater til en stilling

  Scenario:
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til stillingen "frisør"
    Og jeg trykker Se kandidatene
    Så skal antall treff minke
    Når jeg legger til stillingen "servitør"
    Så skal stillingen "servitør" vises
    Og antall treff skal øke
    Og det skal være mulig å fjerne stillingen "servitør"
