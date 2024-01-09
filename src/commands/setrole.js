import { Command } from '../structures/commands.js'

export default new Command(
  {
    name: 'setrole',
    description: 'Permet de changer les rôles des résultats des questions.',
    slash: 'non',
    options: [
      {
        name: 'cafard',
        description: 'Indiquez le rôle de la team des cafards',
        required: true,
        type: 8
      },
      {
        name: 'rat',
        description: 'Indiquez le rôle de la team des rats',
        required: true,
        type: 8
      },
      {
        name: 'crapaud',
        description: 'Indiquez le rôle de la team des crapauds',
        required: true,
        type: 8
      },
      {
        name: 'batard',
        description: 'Indiquez le rôle de la team des batards',
        required: true,
        type: 8
      }
    ],
    userPermssions: 'Administrator',
    commandCategory: 'INFORMATIONS',

    /**
         * @param { { commands: Collection, events: Collection, db: QuickDB} & Client } client
         * @param { CommandInteraction } interaction
        */

    async callback (client, interaction) {
      interaction.reply({ content: `Les rôles suivant : **\`${interaction.options.get('cafard').role.name}\`**, **\`${interaction.options.get('rat').role.name}\`**, **\`${interaction.options.get('crapaud').role.name}\`** ont bien été définis comme nouveau rôle de team.` })
      await client.db.set(`roleteama_${interaction.guild.id}`, interaction.options.get('cafard').role.id)
      await client.db.set(`roleteamb_${interaction.guild.id}`, interaction.options.get('rat').role.id)
      await client.db.set(`roleteamc_${interaction.guild.id}`, interaction.options.get('crapaud').role.id)
      await client.db.set(`roleteamd_${interaction.guild.id}`, interaction.options.get('batard').role.id)
      const roleid = await client.db.get(`roleteama_${interaction.guild.id}`)
      await interaction.guild.roles.fetch(roleid)
      const role = interaction.guild.roles.cache.get(roleid)
      interaction.guild.members.cache.forEach(async m => {
        await m.fetch(true)
        if (m.roles.cache.find(r => r.id === role?.id)) {
          await m.roles.add(interaction.options.get('cafard').role)
        }
      })
      const roleeid = await client.db.get(`roleteamb_${interaction.guild.id}`)
      await interaction.guild.roles.fetch(roleeid)
      const rolee = interaction.guild.roles.cache.get(roleeid)
      interaction.guild.members.cache.forEach(async m => {
        if (m.roles.cache.find(r => r.id === rolee?.id)) {
          await m.fetch(true)
          await m.roles.add(interaction.options.get('rat').role)
        }
      })
      const roleeeid = await client.db.get(`roleteamc_${interaction.guild.id}`)
      await interaction.guild.roles.fetch(roleeeid)
      const roleee = interaction.guild.roles.cache.get(roleeeid)
      interaction.guild.members.cache.forEach(async m => {
        await m.fetch(true)
        if (m.roles.cache.find(r => r.id === roleee?.id)) {
          await m.roles.add(interaction.options.get('crapaud').role)
        }
      })

      const roleeeeid = await client.db.get(`roleteamd_${interaction.guild.id}`)
      await interaction.guild.roles.fetch(roleeeeid)
      const roleeee = interaction.guild.roles.cache.get(roleeeeid)
      interaction.guild.members.cache.forEach(async m => {
        await m.fetch(true)
        if (m.roles.cache.find(r => r.id === roleeee?.id)) {
          await m.roles.add(interaction.options.get('batard').role)
        }
      })
      interaction.guild.members.cache.forEach(async m => {
        await m.roles.remove(role).catch(err => console.log(err))
        await m.roles.remove(rolee).catch(err => console.log(err))
        await m.roles.remove(roleee).catch(err => console.log(err))
        await m.roles.remove(roleeee).catch(err => console.log(err))
      })
    }
  })
