/*
  Esto es demasiado experimental :T
*/
import { getUserOrCreate, saveUser } from '../db/user.js';
import { UserAttributes } from '../types/Database.js';

async function _getXPNeeded(level: number) {
  return 5 * level ** 2 + 50 * level + 100;
}

async function giveUserXP(userID: string) {
  const user = await getUserOrCreate(userID)

  const xpGained = Math.floor(Math.random() * 5) + 1;
  let xpNeededToLevelUp = await _getXPNeeded(user.level);

  user.xp += xpGained;

  while (user.xp >= xpNeededToLevelUp) {
    user.xp -= xpNeededToLevelUp;
    user.level++;
    xpNeededToLevelUp = await _getXPNeeded(user.level);
  }

  saveUser(user);
}

function getUserXPNeeded(user: UserAttributes) {
  return _getXPNeeded(user.level)
}

export default {
  giveUserXP,
  getUserXPNeeded
};