# language: no

Egenskap: Åpne profilen til en kandidat

  @profil
  Scenario: Åpne profilen til den første kandidaten
    Gitt at jeg er logget inn i kandidatsøket som "10051400971"
    Når jeg åpner profilen til den første kandidaten
    Så skal profilen vise kontaktinfo, jobbprofil og CV
