export type Status = {
  hp: number
  mp: number
  attack: number
  defense: number
  magic: number
  speed: number
  luck: number
}

export const PLAYER_STATUS: Status = {
  hp: 100,
  mp: 50,
  attack: 20,
  defense: 10,
  magic: 15,
  speed: 12,
  luck: 8,
}

export const SLIME_STATUS: Status = {
  hp: 15,
  mp: 30,
  attack: 10,
  defense: 5,
  magic: 10,
  speed: 8,
  luck: 5,
}

export const WIZARD_STATUS: Status = {
  hp: 80,
  mp: 100,
  attack: 15,
  defense: 8,
  magic: 25,
  speed: 10,
  luck: 10,
}
