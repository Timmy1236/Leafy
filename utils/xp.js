/*
  Esto es demasiado experimental :T
*/
const User = require('../db/models/user.js');

async function getXPNeeded(level) {
  return 5 * level ** 2 + 50 * level + 100;
}

async function giveUserXP(userID) {
  const [user] = await User.findOrCreate({ where: { id: userID } });

  let xpGained = Math.floor(Math.random() * 5) + 1;
  let xpNeededToLevelUp = await getXPNeeded(user.level);

  user.xp += xpGained;

  while (user.xp >= xpNeededToLevelUp) {
    user.xp -= xpNeededToLevelUp;
    user.level++;
    xpNeededToLevelUp = getXPNeeded(user.level);
  }

  user.save();
}

function getUserXPNeeded(user) {
  return getXPNeeded(user.level)
}

module.exports = {
  giveUserXP,
  getUserXPNeeded
};