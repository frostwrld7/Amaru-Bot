'use strict'
import Discord, {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder
} from 'discord.js'
import { Evenement } from '../structures/evenements.js'
import { questions } from '../utils/questions.js'
import { shuffleArray } from '../utils/shuffleArray.js'

async function askQuestion (client, interaction, channel, question, number) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('one')
      .setLabel('1')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('two')
      .setLabel('2')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('three')
      .setLabel('3')
      .setStyle(ButtonStyle.Danger)
  )
  const questionEmbed = new EmbedBuilder()
    .setTitle(`Question ${number + 1}`)
    .setDescription(
            `${question.question}\n${question.options
                .map((e, i) => `${i + 1}. ${e.name}`)
                .join('\n')}`
    )
    .setColor('#2F3136')
  const msg = await channel.send({
    embeds: [questionEmbed],
    components: [row]
  })

  const filter = (int) => int.user.id === interaction.user.id
  const collected = await channel.awaitMessageComponent({
    filter,
    time: 360000
  })

  await msg.delete()
  const answer = collected.customId
  const answerToIndex = {
    one: 0,
    two: 1,
    three: 2
  }
  const numb = answerToIndex[answer]
  const quest = question.options[numb].value

  return quest
}

function determineResult (responseCounters) {
  const { Cafard, Rat, Crapaud } = responseCounters

  const maxValue = Math.max(Cafard, Rat, Crapaud)

  const resultMap = {
    [Cafard]: 'Cafard',
    [Rat]: 'Rat',
    [Crapaud]: 'Crapaud'
  }

  if (Cafard === Rat && Rat === Crapaud) return 'Rat'

  return resultMap[maxValue]
}

export default new Evenement({
  eventName: { interactionCreate: 0 },

  /**
     * @param { Discord.Interaction } interaction
     * @param { { commands: Collection, events: Collection } & Client } client
     */

  async callback (client, interaction) {
    if (interaction.isButton()) {
      if (interaction.customId === 'questions') {
        await interaction.guild.fetch()

        const [teamarole, teambrole, teamcrole] = await Promise.all([
          client.db.get(`roleteama_${interaction.guild.id}`),
          client.db.get(`roleteamb_${interaction.guild.id}`),
          client.db.get(`roleteamc_${interaction.guild.id}`)
        ])

        const rolea = interaction.member.roles.cache.get(teamarole)
        const roleb = interaction.member.roles.cache.get(teambrole)
        const rolec = interaction.member.roles.cache.get(teamcrole)

        const chan = interaction.guild.channels.cache.find(
          (e) => e.name === interaction.user.id
        )
        const hasStarted = interaction.guild.channels.cache.get(
          chan?.id
        )

        if (hasStarted) {
          return interaction.reply({
            content:
                            'Vous avez déjà lancé le test de personnalité.',
            ephemeral: true
          })
        }

        const hasRole = Boolean(rolea || roleb || rolec)
        if (hasRole) {
          return interaction.reply({
            content:
                            'Vous avez déjà répondu au test de personnalité.',
            ephemeral: true
          })
        }

        const channel = await interaction.guild.channels.create({
          name: `${interaction.user.id}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [
                Discord.PermissionsBitField.Flags.ViewChannel
              ]
            },
            {
              id: interaction.user.id,
              allow: [
                Discord.PermissionsBitField.Flags.ViewChannel,
                Discord.PermissionsBitField.Flags.SendMessages,
                Discord.PermissionsBitField.Flags.ReadMessageHistory
              ]
            },
            {
              id: client.user.id,
              allow: [
                Discord.PermissionsBitField.Flags.ViewChannel,
                Discord.PermissionsBitField.Flags.SendMessages,
                Discord.PermissionsBitField.Flags.ReadMessageHistory
              ]
            }
          ],
          topic: `Salon des questions de test de personnalité pour ${interaction.user.username}`,
          reason: 'Salon de test de personnalité'
        })
        interaction.reply({
          content: `Questionnaire lancé --> ${channel}`,
          ephemeral: true
        })
        await channel
          .send({ content: `${interaction.user}` })
          .then((m) => {
            setTimeout(() => {
              m.delete()
            }, 1000)
          })

        const responseCounters = {
          Cafard: 0,
          Rat: 0,
          Crapaud: 0
        }

        const questionsShuffled = shuffleArray(questions)
        for (let i = 0; i < questionsShuffled.length; i++) {
          const number = i
          const question = questionsShuffled[i]
          const quest = await askQuestion(
            client,
            interaction,
            channel,
            question,
            number
          )

          responseCounters[quest]++

          const confirmationEmbed = new EmbedBuilder()
            .setTitle(`Question ${i + 1}`)
            .setDescription('Enregistré.')
            .setColor('#2F3136')
          await channel
            .send({ embeds: [confirmationEmbed] })
            .then(async (m) =>
              setTimeout(async () => {
                await m.delete()
              }, 2000)
            )
        }
        const result = determineResult(responseCounters)

        const roleKeys = {
          Cafard: `roleteama_${interaction.guild.id}`,
          Rat: `roleteamb_${interaction.guild.id}`,
          Crapaud: `roleteamc_${interaction.guild.id}`
        }

        const roleID = await client.db.get(roleKeys[result])
        const role = interaction.guild.roles.cache.get(roleID)
        const embedTestFinished = new EmbedBuilder()
          .setTitle('Test terminé')
          .setImage(
            result === 'Cafard'
              ? 'https://media.discordapp.net/attachments/986969362890096670/1085999882231365783/cafard.png'
              : result === 'Rat'
                ? 'https://media.discordapp.net/attachments/986969362890096670/1085999882915041371/rat.png'
                : 'https://media.discordapp.net/attachments/986969362890096670/1085999882617233508/crapaud_1.png'
          )
          .setDescription(
                        `Le test est maintenant terminé, vous êtes de la team **${result}**\nVous recevez donc le rôle ${role}\nVoici vos réponses :\nCafard : **${responseCounters.Cafard}** réponses\nRat : **${responseCounters.Rat}** réponses\nCrapaud : **${responseCounters.Crapaud}** réponses`
          )
          .setColor('#2F3136')

        await interaction.member.roles.add(role)
        channel.send({ embeds: [embedTestFinished] })
        await client.db.set(`test_${interaction.user.id}`, 'oui')
        await client.guilds.cache
          .get('514923211050188822')
          .channels.cache.get('986968877525258292')
          ?.send(
                        `\`${interaction.user.tag}\` fait maintenant parti de la team des **${result}**`
          )
        setTimeout(async () => {
          await channel.delete()
        }, 20000)
      }
    }
    if (
      interaction.isCommand() &&
            client.commands.get(interaction.commandName)
    ) {
      const command = client.commands.get(interaction.commandName)
      const requiredPermission = command.userPermssions

      if (
        requiredPermission !== 'EVERYONE' &&
                !interaction.member.permissions.has(
                  Discord.PermissionsBitField.Flags[
                    requiredPermission.toString()
                  ]
                )
      ) {
        const embed = new Discord.EmbedBuilder()
          .setTitle('Permission requise')
          .setDescription(
                        `Vous n'avez pas la permission requise pour utiliser cette commande\nPermission requise : \`${requiredPermission}\``
          )
          .setColor('#2F3136')
        return interaction.reply({ ephemeral: true, embeds: [embed] })
      } else {
        command.callback(client, interaction)
      }
    }
  }
})
