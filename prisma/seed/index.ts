import { PrismaClient } from '@prisma/client';
import { fakeCustomers } from './data/fake-customers.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed işlemi başlatılıyor...');
  for (const customer of fakeCustomers) {
    await prisma.customer.create({
      data: customer,
    });
  }

  console.log('✅ Tüm müşteriler başarıyla eklendi.');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
