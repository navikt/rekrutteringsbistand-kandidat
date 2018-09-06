# language: no

Egenskap: Åpne CVen til en kandidat

  @åpnecv
  Scenario: Åpne CVen til den første kandidaten
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til stillingen "Kokk"
    Og jeg åpner CVen til den første kandidaten
    Så skal hele CVen vises