# language: no

Egenskap: Finne kandidater til en stilling

  @stilling @elastic @janzz
  Scenario: Søke etter kandidater basert på ønsket stilling
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til stillingen "Frisør"
    Så skal antall treff minke
    Og det skal være mulig å fjerne stillingen "Frisør"
