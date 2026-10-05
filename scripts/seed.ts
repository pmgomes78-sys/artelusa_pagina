import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // --- Hidden test account (mandatory, do not surface) ---
  const hiddenHash = await bcrypt.hash('2#KXwCUG9r', 12)
  await prisma.user.upsert({
    where: { email: 'abacus-768d3487@example.com' },
    update: {},
    create: {
      email: 'abacus-768d3487@example.com',
      name: 'Test Account',
      passwordHash: hiddenHash,
      role: 'admin',
    },
  })

  // --- Admin ---
  const adminHash = await bcrypt.hash('Admin2024!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@artelusa.pt' },
    update: {},
    create: {
      email: 'admin@artelusa.pt',
      name: 'Administrador Arte Lusa',
      passwordHash: adminHash,
      role: 'admin',
    },
  })

  // --- Responsável Famalicão ---
  const respAHash = await bcrypt.hash('Resp2024A!', 12)
  const respA = await prisma.user.upsert({
    where: { email: 'responsavel.famalicao@artelusa.pt' },
    update: {},
    create: {
      email: 'responsavel.famalicao@artelusa.pt',
      name: 'Responsável Famalicão',
      passwordHash: respAHash,
      role: 'responsavel',
    },
  })

  // --- Responsável Vizela ---
  const respBHash = await bcrypt.hash('Resp2024B!', 12)
  const respB = await prisma.user.upsert({
    where: { email: 'responsavel.vizela@artelusa.pt' },
    update: {},
    create: {
      email: 'responsavel.vizela@artelusa.pt',
      name: 'Responsável Vizela',
      passwordHash: respBHash,
      role: 'responsavel',
    },
  })

  // --- Academia Famalicão ---
  const acadFamalicao = await prisma.academy.upsert({
    where: { id: 'acad-famalicao' },
    update: {},
    create: {
      id: 'acad-famalicao',
      nome: 'Academia Arte Lusa Famalicão',
      localidade: 'Vila Nova de Famalicão',
      descricao: 'Academia de teste para a PoC — Famalicão',
      morada: 'Rua de Teste 123, 4760 Vila Nova de Famalicão',
      telefone: '+351 252 000 001',
      emailContacto: 'famalicao@artelusa.pt',
    },
  })

  // --- Academia Vizela ---
  const acadVizela = await prisma.academy.upsert({
    where: { id: 'acad-vizela' },
    update: {},
    create: {
      id: 'acad-vizela',
      nome: 'Academia Arte Lusa Vizela',
      localidade: 'Vizela',
      descricao: 'Academia de teste para a PoC — Vizela',
      morada: 'Rua de Teste 456, 4815 Vizela',
      telefone: '+351 253 000 002',
      emailContacto: 'vizela@artelusa.pt',
    },
  })

  // --- Atribuições ---
  await prisma.academyAssignment.upsert({
    where: { userId_academyId: { userId: respA.id, academyId: acadFamalicao.id } },
    update: {},
    create: { userId: respA.id, academyId: acadFamalicao.id },
  })

  await prisma.academyAssignment.upsert({
    where: { userId_academyId: { userId: respB.id, academyId: acadVizela.id } },
    update: {},
    create: { userId: respB.id, academyId: acadVizela.id },
  })

  // --- Notícias de teste ---
  await prisma.noticia.upsert({
    where: { id: 'noticia-famalicao-1' },
    update: {},
    create: {
      id: 'noticia-famalicao-1',
      academyId: acadFamalicao.id,
      titulo: 'Abertura de inscrições em Famalicão',
      corpo: 'As inscrições para a nova temporada estão abertas. Venha conhecer as nossas modalidades de artes marciais!',
      criadoPor: respA.id,
    },
  })

  await prisma.noticia.upsert({
    where: { id: 'noticia-vizela-1' },
    update: {},
    create: {
      id: 'noticia-vizela-1',
      academyId: acadVizela.id,
      titulo: 'Novo horário em Vizela',
      corpo: 'A partir deste mês temos novos horários para Muay Thai e Ju Jitsu. Consulte a tabela de horários.',
      criadoPor: respB.id,
    },
  })

  // --- Eventos de teste ---
  await prisma.evento.upsert({
    where: { id: 'evento-famalicao-1' },
    update: {},
    create: {
      id: 'evento-famalicao-1',
      academyId: acadFamalicao.id,
      titulo: 'Treino aberto em Famalicão',
      descricao: 'Aula experimental aberta ao público. Traga roupa confortável.',
      dataInicio: new Date('2026-11-15T10:00:00'),
      local: 'Pavilhão Municipal de Famalicão',
    },
  })

  await prisma.evento.upsert({
    where: { id: 'evento-vizela-1' },
    update: {},
    create: {
      id: 'evento-vizela-1',
      academyId: acadVizela.id,
      titulo: 'Campeonato inter-academias',
      descricao: 'Campeonato amigável entre todas as academias Arte Lusa.',
      dataInicio: new Date('2026-12-01T09:00:00'),
      local: 'Ginásio Municipal de Vizela',
    },
  })

  // --- Horários de teste ---
  const horariosFamalicao = [
    { id: 'h-fam-1', modalidade: 'Tai Jutsu', diaSemana: 'Segunda-feira', horaInicio: '18:00', horaFim: '19:30' },
    { id: 'h-fam-2', modalidade: 'KickBoxing', diaSemana: 'Quarta-feira', horaInicio: '19:00', horaFim: '20:30' },
    { id: 'h-fam-3', modalidade: 'Muay Thai', diaSemana: 'Sexta-feira', horaInicio: '18:30', horaFim: '20:00' },
  ]

  for (const h of horariosFamalicao) {
    await prisma.horario.upsert({
      where: { id: h.id },
      update: {},
      create: { ...h, academyId: acadFamalicao.id },
    })
  }

  const horariosVizela = [
    { id: 'h-viz-1', modalidade: 'Ju Jitsu', diaSemana: 'Terça-feira', horaInicio: '19:00', horaFim: '20:30' },
    { id: 'h-viz-2', modalidade: 'Muay Thai', diaSemana: 'Quinta-feira', horaInicio: '18:00', horaFim: '19:30' },
    { id: 'h-viz-3', modalidade: 'KickBoxing', diaSemana: 'Sábado', horaInicio: '10:00', horaFim: '11:30' },
  ]

  for (const h of horariosVizela) {
    await prisma.horario.upsert({
      where: { id: h.id },
      update: {},
      create: { ...h, academyId: acadVizela.id },
    })
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
