import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed işlemi başlatılıyor...');

  const adminUsername = 'admin';

  const adminExists = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (adminExists) {
    console.log('🛑 Admin kullanıcısı zaten mevcut. Seed işlemi atlanıyor.');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10); // admin şifresi

  await prisma.user.create({
    data: {
      username: adminUsername,
      password: hashedPassword,
      role: Role.ADMINUSER,
      refreshToken: null,
    },
  });

  console.log('✅ Admin kullanıcısı başarıyla oluşturuldu!');
  console.log('⭐ Seed işlemi tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
