/* eslint-disable no-useless-escape */
import {
  Evenement
} from '../structures/evenements.js'

export default new Evenement({
  eventName: {
    guildMemberAdd: 0
  },

  /**
   * @param { GuildMember } member
   * @param { { commands: Collection, events: Collection } & Client } client
   */

  async callback (client, member) {
    const btrd = await client.db.get(`test_${member.user.id}`)
    const roleid = '1086599128076783626'
    if (btrd === 'oui') {
      const role = member.guild.roles.cache.get(roleid)
      await member.roles.add(role).catch(e => console.log(e))
      member.user.send({
        content: `Salut ${member.user}.\nIl semble que tu aies essayé de quitter le serveur pour refaire le questionnaire.\nMalgré cela je suis assez intelligent et je l'ai donc remarqué.\nJe t'ai donc donné le rôle **\`${role?.name}\`** car tu le mérites \:).`
      })
        .catch(err => console.log(err))
      await client.guilds.cache.get('514923211050188822').channels.cache.get('1087762485987250216')?.send(`\`${member.user.tag}\` fait maintenant parti de la team des **${role?.name}** car il a essayé de refaire le questionnaire`)
    }
  }
})
