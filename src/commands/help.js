/* eslint-disable no-unused-vars */
import {
  ActionRowBuilder,
  ButtonBuilder,
  ComponentType,
  EmbedBuilder,
  StringSelectMenuBuilder
} from 'discord.js'
import {
  MsgCommand
} from '../structures/msgcommands.js'

export default new MsgCommand({
  name: 'help',
  description: 'Permet de voir les membres dans une team.',
  userPermssions: 'EVERYONE',
  commandCategory: 'INFORMATIONS',

  /**
   * @param { { commands: Collection, events: Collection, db: QuickDB} & Client } client
   * @param { CommandInteraction } interaction
   */

  async callback (client, message, args) {
    const embed = new EmbedBuilder()
      .setTitle('Page d\'Aide')
      .setDescription(`Bonjour ${message.member} !\nBienvenue dans la page d'aide !\nCliquez sur le selecteur ci-dessous pour obtenir de l'aide sur les différents jeux du bot.`)
      .setColor('#FF0000')

    const embedFoot = new EmbedBuilder()
      .setTitle('Jeu -> Football')
      .setDescription('Afin de jouer à un jeu de football, il faut faire la commande **`!foot`**\nLe bot vous répondra avec un message contenant des boutons ( voir image ).\nIl y a **3** boutons, **Droite**, **Milieu** et **Gauche**, vous devez faire un choix entres ces 3 boutons.\nSi le ballon atteint les cages avant que le gardien ne touche le ballon **vous gagnez entre 1 et 8 points pour votre team**.')
      .setImage('https://media.discordapp.net/attachments/1084310097716584520/1089947250731520030/foot.PNG')
      .setColor('#FF0000')

    const embedAnimalRace = new EmbedBuilder()
      .setTitle('Jeu -> Course d\'Animaux')
      .setDescription('Afin de jouer à un jeu de course d\'animaux, il faut faire la commande **`!course`**\nLe bot vous répondra avec un message contenant des animaux sous forme de liste ( voir image )\nIl y a **7** animaux, **Cheval**, **Lion**, **Tortue**, **Renard**, **Tigre**, **Aigle**, **Loup**, vous devez faire un choix entres ces 7 animaux.\nAprès que le bot ai envoyé la liste des animaux comme indiqué sur l\'image, vous devez donc faire un choix, **si vous voulez par exemple prédire une victoire du Lion, envoyez simplement 1**, **si vous voulez prédire une victoire du tigre, envoyez simplement 5**.\nSi votre animal atteint la ligne d\'arrivée avant les autres, **vous gagnez entre 1 et 100 points pour votre team**.')
      .setImage('https://media.discordapp.net/attachments/1084310097716584520/1089949634962661436/course.PNG')
      .setColor('#FF0000')

    const embedCombat = new EmbedBuilder()
      .setTitle('Jeu -> Combat 1vs1')
      .setDescription('Afin de jouer à un jeu de combat, il faut faire la commande **`!combat`**\nLe bot vous répondra avec un message vous demandant de mentionner le membre que vous souhaitez combattre\nSi la mention est valide, le combat pourra commencer ( voir image )\nVous avez deux choix : **Attaquer** ou **Se Soigner**, **notez que vous ne pouvez pas vous soigner si vous avez 200pv ou moins de 20pv**\nDès qu\'un des deux joueurs possède 0pv, le combat s\'arrête et **le gagnant remporte entre 1 et 100 points pour sa team**.')
      .setImage('https://media.discordapp.net/attachments/1084310097716584520/1089958579164938441/combat.PNG')
      .setColor('#FF0000')

    const embedDvn = new EmbedBuilder()
      .setTitle('Jeu -> Devine le nombre')
      .setDescription('Afin de jouer à un jeu pour deviner le nombre, il faut faire la commande **`!dvn`**\nLe bot vous répondra avec un message vous demandant d\'envoyer **un nombre entre 1 et 100** ( voir image )\nAfin de vous aider, le bot vous répondra si votre chiffre d\'avant était plus grand ou plus petit que le nombre à deviner, **vous possédez 10 essais**\nSi vous trouvez le nombre avant les 10 essais, **vous remportez entre 1 et 100 points pour votre team**.')
      .setImage('https://media.discordapp.net/attachments/1084310097716584520/1089961799790645369/dvn.PNG')
      .setColor('#FF0000')

    const embedSlot = new EmbedBuilder()
      .setTitle('Jeu -> Slot')
      .setDescription('Afin de jouer à un jeu de slot type casino, il faut faire la commande **`!slot`**\nLe bot vous répondra avec un message contenant 3 symboles ( emoji ).\nSi les 3 symboles sont identiques **vous remportez entre 1 et 50 points pour votre team**.')
      .setImage('https://media.discordapp.net/attachments/1084310097716584520/1089963825744314418/slot.PNG')
      .setColor('#FF0000')

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Cliquez ici pour obtenir de l\'aide sur les jeux')
          .addOptions({
            label: 'Football',
            emoji: '⚽',
            value: 'foot'
          }, {
            label: 'Course d\'Animaux',
            emoji: '🏁',
            value: 'course'
          }, {
            label: 'Combat 1vs1',
            emoji: '🥊',
            value: 'combat'
          }, {
            label: 'Devine le nombre',
            emoji: '1️⃣',
            value: 'dvn'
          }, {
            label: 'Slot',
            emoji: '🎰',
            value: 'slot'
          })
      )
    const msg = await message.channel.send({
      embeds: [embed],
      components: [row]
    })

    const filter = (m) => m.user.id === message.author.id
    const collector = await msg.createMessageComponentCollector({
      filter,
      time: 360000,
      componentType: ComponentType.StringSelect
    })

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'select') {
        if (interaction.values[0] === 'foot') {
          await msg.edit({
            embeds: [embedFoot],
            components: [row]
          })
          await interaction.deferUpdate()
        }
        if (interaction.values[0] === 'course') {
          await msg.edit({
            embeds: [embedAnimalRace],
            components: [row]
          })
          await interaction.deferUpdate()
        }
        if (interaction.values[0] === 'combat') {
          await msg.edit({
            embeds: [embedCombat],
            components: [row]
          })
          await interaction.deferUpdate()
        }
        if (interaction.values[0] === 'dvn') {
          await msg.edit({
            embeds: [embedDvn],
            components: [row]
          })
          await interaction.deferUpdate()
        }
        if (interaction.values[0] === 'slot') {
          await msg.edit({
            embeds: [embedSlot],
            components: [row]
          })
          await interaction.deferUpdate()
        }
      }
    })
  }
})
