# language: no

Egenskap: Finne kandidater basert på språk

  @sprak
  Scenario: Søke etter kandidater basert på språk
    Gitt at jeg er logget inn i kandidatsøket som "10051400971"
    Når jeg legger til språk "Engelsk"
    Så skal antall treff minke
    Når jeg legger til språk "Gresk"
    Så skal antall treff minke
