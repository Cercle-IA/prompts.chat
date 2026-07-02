import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

const DEMO_USERS = [
  { name: "Margrethe Testager", username: "margrethe_testager", email: "margrethe.testager@gp-prompts.chat" },
  { name: "Joaquín Al-Mergia", username: "joaquin_al_mergia", email: "joaquin.al.mergia@gp-prompts.chat" },
  { name: "Neelie Kroes-Ex-Officio", username: "neelie_kroes_ex_officio", email: "neelie.kroes.ex.officio@gp-prompts.chat" },
  { name: "Mario Monti-Poly", username: "mario_monti_poly", email: "mario.monti.poly@gp-prompts.chat" },
  { name: "Karel Van Cartelproof", username: "karel_van_cartelproof", email: "karel.van.cartelproof@gp-prompts.chat" },
  { name: "Koen Len-Arts", username: "koen_len_arts", email: "koen.len.arts@gp-prompts.chat" },
  { name: "Nils Wahl-of-Law", username: "nils_wahl_of_law", email: "nils.wahl.of.law@gp-prompts.chat" },
  { name: "Marc van der Wood", username: "marc_van_der_wood", email: "marc.van.der.wood@gp-prompts.chat" },
  { name: "Peter Suther-Lenience", username: "peter_suther_lenience", email: "peter.suther.lenience@gp-prompts.chat" },
  { name: "Pascal Lamy-cus", username: "pascal_lamy_cus", email: "pascal.lamy.cus@gp-prompts.chat" },
];

async function main() {
  for (const u of DEMO_USERS) {
    const randomPassword = crypto.randomBytes(24).toString("hex");
    const passwordHash = await bcrypt.hash(randomPassword, 12);

    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        email: u.email,
        username: u.username,
        name: u.name,
        password: passwordHash,
        role: "USER",
        locale: "en",
        verified: false,
      },
    });
    console.log(`OK: ${user.username} (${user.id})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
