import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const comp1 = await prisma.competitor.upsert({
    where: {
      platform_channelId: {
        platform: 'youtube',
        channelId: 'UCAuUUnT6oDeKwE6v1NGQxug'
      }
    },
    update: {},
    create: {
      name: 'TED',
      platform: 'youtube',
      channelId: 'UCAuUUnT6oDeKwE6v1NGQxug',
      url: 'https://www.youtube.com/user/TEDtalksDirector'
    }
  });

  const comp2 = await prisma.competitor.upsert({
    where: {
      platform_channelId: {
        platform: 'youtube',
        channelId: 'UCsT0YIqwnpJCM-Rx7PSZaWw'
      }
    },
    update: {},
    create: {
      name: 'Marques Brownlee',
      platform: 'youtube',
      channelId: 'UCsT0YIqwnpJCM-Rx7PSZaWw',
      url: 'https://www.youtube.com/c/mkbhd'
    }
  });

  console.log('Seeded competitors:', comp1.name, comp2.name);
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
