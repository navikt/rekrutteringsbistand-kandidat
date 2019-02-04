# language: no

Egenskap: Finne kandidater basert på språk

  @sprak
  Scenario: Søke etter kandidater basert på språk
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til språk "Engelsk"
    Så skal antall treff minke
    Når jeg legger til språk "Gresk"
    Så skal antall treff minke
