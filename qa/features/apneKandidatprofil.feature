# language: no

Egenskap: Åpne profilen til en kandidat

  @profil @elastic @janzz
  Scenario: Åpne profilen til den første kandidaten
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til stillingen "Kokk"
    Og jeg åpner profilen til den første kandidaten
    Så skal profilen vise kontaktinfo, jobbprofil og CV
