export const matchProtocols = [
  // Матчи Лайт-лиги
  { homeSetsWon: 3, awaySetsWon: 1, sets: [{ home: 25, away: 20 }, { home: 23, away: 25 }, { home: 25, away: 18 }, { home: 25, away: 22 }] },
  { homeSetsWon: 3, awaySetsWon: 0, sets: [{ home: 25, away: 18 }, { home: 25, away: 20 }, { home: 25, away: 19 }] },
  { homeSetsWon: 2, awaySetsWon: 3, sets: [{ home: 25, away: 22 }, { home: 20, away: 25 }, { home: 25, away: 23 }, { home: 22, away: 25 }, { home: 13, away: 15 }] },
  { homeSetsWon: 3, awaySetsWon: 2, sets: [{ home: 22, away: 25 }, { home: 25, away: 20 }, { home: 25, away: 23 }, { home: 20, away: 25 }, { home: 15, away: 12 }] },
  { homeSetsWon: 3, awaySetsWon: 1, sets: [{ home: 25, away: 19 }, { home: 22, away: 25 }, { home: 25, away: 21 }, { home: 25, away: 18 }] },
  { homeSetsWon: 3, awaySetsWon: 0, sets: [{ home: 25, away: 16 }, { home: 25, away: 14 }, { home: 25, away: 17 }] },
  { homeSetsWon: 1, awaySetsWon: 3, sets: [{ home: 20, away: 25 }, { home: 25, away: 22 }, { home: 18, away: 25 }, { home: 21, away: 25 }] },
  { homeSetsWon: 3, awaySetsWon: 2, sets: [{ home: 25, away: 21 }, { home: 22, away: 25 }, { home: 23, away: 25 }, { home: 25, away: 20 }, { home: 15, away: 13 }] },
  { homeSetsWon: 3, awaySetsWon: 0, sets: [{ home: 25, away: 17 }, { home: 25, away: 19 }, { home: 25, away: 16 }] },
  { homeSetsWon: 2, awaySetsWon: 3, sets: [{ home: 21, away: 25 }, { home: 25, away: 23 }, { home: 20, away: 25 }, { home: 25, away: 22 }, { home: 11, away: 15 }] },
  // Хард-лига (аналогично)
  { homeSetsWon: 3, awaySetsWon: 1, sets: [{ home: 25, away: 18 }, { home: 22, away: 25 }, { home: 25, away: 20 }, { home: 25, away: 19 }] },
  { homeSetsWon: 3, awaySetsWon: 0, sets: [{ home: 25, away: 15 }, { home: 25, away: 17 }, { home: 25, away: 14 }] },
  { homeSetsWon: 2, awaySetsWon: 3, sets: [{ home: 25, away: 23 }, { home: 18, away: 25 }, { home: 25, away: 22 }, { home: 20, away: 25 }, { home: 12, away: 15 }] },
  { homeSetsWon: 3, awaySetsWon: 2, sets: [{ home: 23, away: 25 }, { home: 25, away: 19 }, { home: 22, away: 25 }, { home: 25, away: 21 }, { home: 15, away: 10 }] },
  { homeSetsWon: 3, awaySetsWon: 1, sets: [{ home: 25, away: 20 }, { home: 21, away: 25 }, { home: 25, away: 18 }, { home: 25, away: 17 }] },
  { homeSetsWon: 3, awaySetsWon: 0, sets: [{ home: 25, away: 13 }, { home: 25, away: 16 }, { home: 25, away: 15 }] },
];

export const testApplications = {
  light: {
    approved: [
      {
        teamName: 'Спартак Лайт',
        division: 'light',
        captainName: 'Иванов Иван',
        captainPhone: '+7 (999) 111-11-11',
        captainEmail: 'spartak@light.ru',
        players: [
          { fullName: 'Иванов Иван', birthDate: '1995-05-15', heightCm: 185, position: 'attacker', skillLevel: 'light' },
          { fullName: 'Петров Петр', birthDate: '1996-06-20', heightCm: 190, position: 'setter', skillLevel: 'light_plus' },
          { fullName: 'Сидоров Сидор', birthDate: '1997-07-25', heightCm: 188, position: 'blocker', skillLevel: 'light' },
        ],
      },
      {
        teamName: 'Динамо Лайт',
        division: 'light',
        captainName: 'Смирнов Алексей',
        captainPhone: '+7 (999) 222-22-22',
        captainEmail: 'dynamo@light.ru',
        players: [
          { fullName: 'Смирнов Алексей', birthDate: '1994-04-10', heightCm: 182, position: 'libero', skillLevel: 'light_plus' },
          { fullName: 'Козлов Дмитрий', birthDate: '1995-08-12', heightCm: 195, position: 'attacker', skillLevel: 'light' },
        ],
      },
      {
        teamName: 'Локомотив Лайт',
        division: 'light',
        captainName: 'Морозов Андрей',
        captainPhone: '+7 (999) 333-33-33',
        captainEmail: 'lokomotiv@light.ru',
        players: [
          { fullName: 'Морозов Андрей', birthDate: '1993-03-05', heightCm: 187, position: 'setter', skillLevel: 'light' },
          { fullName: 'Волков Сергей', birthDate: '1996-09-18', heightCm: 192, position: 'attacker', skillLevel: 'light_plus' },
        ],
      },
      {
        teamName: 'Зенит Лайт',
        division: 'light',
        captainName: 'Новиков Павел',
        captainPhone: '+7 (999) 444-44-44',
        captainEmail: 'zenit@light.ru',
        players: [
          { fullName: 'Новиков Павел', birthDate: '1995-11-22', heightCm: 189, position: 'blocker', skillLevel: 'light' },
          { fullName: 'Федоров Илья', birthDate: '1997-02-14', heightCm: 183, position: 'libero', skillLevel: 'light_plus' },
        ],
      },
      {
        teamName: 'ЦСКА Лайт',
        division: 'light',
        captainName: 'Орлов Роман',
        captainPhone: '+7 (999) 555-55-55',
        captainEmail: 'cska@light.ru',
        players: [
          { fullName: 'Орлов Роман', birthDate: '1994-07-30', heightCm: 191, position: 'attacker', skillLevel: 'light' },
          { fullName: 'Соколов Артем', birthDate: '1996-12-01', heightCm: 186, position: 'setter', skillLevel: 'light' },
        ],
      },
      {
        teamName: 'Торпедо Лайт',
        division: 'light',
        captainName: 'Кузьмин Егор',
        captainPhone: '+7 (999) 666-66-66',
        captainEmail: 'torpedo@light.ru',
        players: [
          { fullName: 'Кузьмин Егор', birthDate: '1995-01-25', heightCm: 194, position: 'attacker', skillLevel: 'light_plus' },
          { fullName: 'Тимофеев Денис', birthDate: '1998-03-17', heightCm: 181, position: 'libero', skillLevel: 'light' },
        ],
      },
    ],
    rejected: [
      {
        teamName: 'Отказник Лайт 1',
        division: 'light',
        captainName: 'Отказ Отказович',
        captainPhone: '+7 (999) 777-77-77',
        captainEmail: 'reject1@light.ru',
        players: [{ fullName: 'Отказ Отказович', birthDate: '1990-01-01', heightCm: 180, position: 'attacker', skillLevel: 'light' }],
        rejectionReason: 'Не соответствует требованиям лиги',
      },
      {
        teamName: 'Отказник Лайт 2',
        division: 'light',
        captainName: 'Неудачников Неудачник',
        captainPhone: '+7 (999) 888-88-88',
        captainEmail: 'reject2@light.ru',
        players: [{ fullName: 'Неудачников Неудачник', birthDate: '1991-02-02', heightCm: 175, position: 'setter', skillLevel: 'light' }],
        rejectionReason: 'Неполный состав команды',
      },
    ],
  },
  hard: {
    approved: [
      {
        teamName: 'Спартак Хард',
        division: 'hard',
        captainName: 'Иванов Иван',
        captainPhone: '+7 (999) 111-11-11',
        captainEmail: 'spartak@hard.ru',
        players: [
          { fullName: 'Иванов Иван', birthDate: '1992-05-15', heightCm: 195, position: 'attacker', skillLevel: 'hard' },
          { fullName: 'Петров Петр', birthDate: '1993-06-20', heightCm: 200, position: 'blocker', skillLevel: 'hard_plus' },
          { fullName: 'Сидоров Сидор', birthDate: '1994-07-25', heightCm: 188, position: 'setter', skillLevel: 'hard' },
        ],
      },
      {
        teamName: 'Динамо Хард',
        division: 'hard',
        captainName: 'Смирнов Алексей',
        captainPhone: '+7 (999) 222-22-22',
        captainEmail: 'dynamo@hard.ru',
        players: [
          { fullName: 'Смирнов Алексей', birthDate: '1991-04-10', heightCm: 192, position: 'libero', skillLevel: 'hard_plus' },
          { fullName: 'Козлов Дмитрий', birthDate: '1992-08-12', heightCm: 198, position: 'attacker', skillLevel: 'hard' },
        ],
      },
      {
        teamName: 'Локомотив Хард',
        division: 'hard',
        captainName: 'Морозов Андрей',
        captainPhone: '+7 (999) 333-33-33',
        captainEmail: 'lokomotiv@hard.ru',
        players: [
          { fullName: 'Морозов Андрей', birthDate: '1990-03-05', heightCm: 197, position: 'setter', skillLevel: 'hard' },
          { fullName: 'Волков Сергей', birthDate: '1993-09-18', heightCm: 202, position: 'attacker', skillLevel: 'hard_plus' },
        ],
      },
      {
        teamName: 'Зенит Хард',
        division: 'hard',
        captainName: 'Новиков Павел',
        captainPhone: '+7 (999) 444-44-44',
        captainEmail: 'zenit@hard.ru',
        players: [
          { fullName: 'Новиков Павел', birthDate: '1991-11-22', heightCm: 199, position: 'blocker', skillLevel: 'hard' },
          { fullName: 'Федоров Илья', birthDate: '1994-02-14', heightCm: 193, position: 'libero', skillLevel: 'hard' },
        ],
      },
      {
        teamName: 'ЦСКА Хард',
        division: 'hard',
        captainName: 'Орлов Роман',
        captainPhone: '+7 (999) 555-55-55',
        captainEmail: 'cska@hard.ru',
        players: [
          { fullName: 'Орлов Роман', birthDate: '1992-07-30', heightCm: 201, position: 'attacker', skillLevel: 'hard_plus' },
          { fullName: 'Соколов Артем', birthDate: '1993-12-01', heightCm: 196, position: 'setter', skillLevel: 'hard' },
        ],
      },
      {
        teamName: 'Торпедо Хард',
        division: 'hard',
        captainName: 'Кузьмин Егор',
        captainPhone: '+7 (999) 666-66-66',
        captainEmail: 'torpedo@hard.ru',
        players: [
          { fullName: 'Кузьмин Егор', birthDate: '1992-01-25', heightCm: 204, position: 'attacker', skillLevel: 'hard' },
          { fullName: 'Тимофеев Денис', birthDate: '1995-03-17', heightCm: 191, position: 'libero', skillLevel: 'hard_plus' },
        ],
      },
    ],
    rejected: [
      {
        teamName: 'Отказник Хард 1',
        division: 'hard',
        captainName: 'Отказ Отказович',
        captainPhone: '+7 (999) 777-77-77',
        captainEmail: 'reject1@hard.ru',
        players: [{ fullName: 'Отказ Отказович', birthDate: '1988-01-01', heightCm: 185, position: 'attacker', skillLevel: 'hard' }],
        rejectionReason: 'Недостаточный уровень мастерства',
      },
      {
        teamName: 'Отказник Хард 2',
        division: 'hard',
        captainName: 'Неудачников Неудачник',
        captainPhone: '+7 (999) 888-88-88',
        captainEmail: 'reject2@hard.ru',
        players: [{ fullName: 'Неудачников Неудачник', birthDate: '1989-02-02', heightCm: 178, position: 'setter', skillLevel: 'hard' }],
        rejectionReason: 'Неполный состав команды',
      },
    ],
  },
};