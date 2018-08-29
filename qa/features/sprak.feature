# language: no

Egenskap: Finne kandidater basert på språk

  Scenario: Søke etter kandidater basert på språk
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til språk "Engelsk"
    #Og jeg trykker Se kandidatene
    Så skal antall treff minke
    Når jeg legger til språk "Gresk"
    Så skal antall treff minke

  @janzz @språk
  Scenario: Søke på språk
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til språk "Engelsk"
    Så skal antall treff øke