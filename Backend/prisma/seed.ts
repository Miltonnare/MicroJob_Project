import { PrismaClient, Role, BudgetType, UrgencyLevel, JobStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MicroJob Kenya database...');

  // 1. Seed Counties & SubCounties & Wards
  const countiesData = [
    {
      name: 'Nairobi',
      code: 47,
      subCounties: [
        { name: 'Westlands', wards: ['Parklands/Highridge', 'Kangemi', 'Karura', 'Kitisuru', 'Mountain View'] },
        { name: 'Dagoretti North', wards: ['Kilimani', 'Kawangware', 'Gatina', 'Kileleshwa', 'Lavington'] },
        { name: 'Starehe', wards: ['Nairobi Central', 'Ngara', 'Pangani', 'Ziwani/Kariokor', 'Landimawe'] },
        { name: 'Embakasi Central', wards: ['Kayole North', 'Kayole South', 'Komarock', 'Matopeni'] }
      ]
    },
    {
      name: 'Mombasa',
      code: 1,
      subCounties: [
        { name: 'Mzizima/Island', wards: ['Old Town', 'Ganjoni', 'Tononoka', 'Majengo'] },
        { name: 'Nyali', wards: ['Frere Town', 'Ziwa la Ng\'ombe', 'Mkomani', 'Kongowea'] },
        { name: 'Kisauni', wards: ['Junda', 'Bamburi', 'Magogoni'] }
      ]
    },
    {
      name: 'Kisumu',
      code: 42,
      subCounties: [
        { name: 'Kisumu Central', wards: ['Railways', 'Migosi', 'Shauri Moyo', 'Market Milimani', 'Kondele'] },
        { name: 'Kisumu East', wards: ['Kajulu', 'Kolwa East', 'Kolwa Central', 'Manyatta B'] }
      ]
    },
    {
      name: 'Nakuru',
      code: 32,
      subCounties: [
        { name: 'Nakuru East', wards: ['Biashara', 'Kivumbini', 'Flamingo', 'Menengai'] },
        { name: 'Nakuru West', wards: ['Barut', 'Kaptembwo', 'Rhoda', 'Shauri Yako'] }
      ]
    },
    {
      name: 'Kiambu',
      code: 22,
      subCounties: [
        { name: 'Ruiru', wards: ['Gitothua', 'Biashara', 'Gatongora', 'Kahawa Sukari', 'Kahawa Wendani'] },
        { name: 'Thika Town', wards: ['Township', 'Kamenu', 'Hospital', 'Gatuanyaga'] }
      ]
    },
    {
      name: 'Uasin Gishu',
      code: 27,
      subCounties: [
        { name: 'Ainabkoi', wards: ['Kapsoya', 'Kaptagat', 'Ainabkoi/Olare'] },
        { name: 'Kapseret', wards: ['Simat/Kapseret', 'Kipkenyo', 'Langas'] }
      ]
    }
  ];

  for (const c of countiesData) {
    const county = await prisma.county.upsert({
      where: { code: c.code },
      update: { name: c.name },
      create: { name: c.name, code: c.code },
    });

    for (const sc of c.subCounties) {
      const subCounty = await prisma.subCounty.upsert({
        where: { name_countyId: { name: sc.name, countyId: county.id } },
        update: {},
        create: { name: sc.name, countyId: county.id },
      });

      for (const wName of sc.wards) {
        await prisma.ward.upsert({
          where: { name_subCountyId: { name: wName, subCountyId: subCounty.id } },
          update: {},
          create: { name: wName, subCountyId: subCounty.id },
        });
      }
    }
  }

  // 2. Categories & Informal Skills
  const categoriesData = [
    {
      name: 'Construction & Masonry',
      slug: 'construction-masonry',
      description: 'Mjengo, building, masonry, roofing, tiling, and structural repairs.',
      icon: 'Hammer',
      skills: [
        { name: 'Mason (Kazi ya Mawe)', slug: 'mason' },
        { name: 'Carpenter (Fundi Mbao)', slug: 'carpenter' },
        { name: 'Painter (Fundi Rangi)', slug: 'painter' },
        { name: 'Welder (Fundi Chuma)', slug: 'welder' },
        { name: 'Electrician (Fundi Stima)', slug: 'electrician' },
        { name: 'Plumber (Fundi Bomba)', slug: 'plumber' },
        { name: 'Tiler (Fundi Taa)', slug: 'tiler' },
        { name: 'Roofer', slug: 'roofer' },
        { name: 'Steel Fixer', slug: 'steel-fixer' }
      ]
    },
    {
      name: 'Domestic & Household Services',
      slug: 'domestic-services',
      description: 'Home cleaning, laundry, cooking, nanny, gardening, and house management.',
      icon: 'Home',
      skills: [
        { name: 'House Cleaner (Mama Fua)', slug: 'house-cleaner' },
        { name: 'Nanny / Baby Care', slug: 'nanny' },
        { name: 'Gardener / Landscaper', slug: 'gardener' },
        { name: 'Domestic Cook', slug: 'cook' },
        { name: 'Home Organizer', slug: 'home-organizer' }
      ]
    },
    {
      name: 'Transport & Logistics',
      slug: 'transport-logistics',
      description: 'Boda boda riders, drivers, loaders, and moving assistants.',
      icon: 'Truck',
      skills: [
        { name: 'Delivery Rider (Boda Boda)', slug: 'delivery-rider' },
        { name: 'Personal Driver', slug: 'driver' },
        { name: 'Mover / Heavy Loader', slug: 'loader' }
      ]
    },
    {
      name: 'Repairs & Technical Services',
      slug: 'repairs-technical',
      description: 'Appliance repair, phone/laptop fix, solar installation, and CCTV.',
      icon: 'Wrench',
      skills: [
        { name: 'Appliance Repair Technician', slug: 'appliance-repair' },
        { name: 'Phone Repair Technician', slug: 'phone-repair' },
        { name: 'CCTV Installer', slug: 'cctv-installer' },
        { name: 'Solar System Installer', slug: 'solar-installer' },
        { name: 'Mechanic (Fundi Gari)', slug: 'mechanic' }
      ]
    },
    {
      name: 'Agriculture & Farm Work',
      slug: 'agriculture-farm',
      description: 'Farm hands, weeding, harvesting, livestock care, and irrigation.',
      icon: 'Sprout',
      skills: [
        { name: 'Farm Casual Labourer', slug: 'farm-labourer' },
        { name: 'Dairy / Livestock Helper', slug: 'livestock-helper' },
        { name: 'Irrigation Technician', slug: 'irrigation-technician' }
      ]
    }
  ];

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, icon: cat.icon },
      create: { name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon },
    });

    for (const s of cat.skills) {
      await prisma.skill.upsert({
        where: { slug: s.slug },
        update: { name: s.name, categoryId: category.id },
        create: { name: s.name, slug: s.slug, categoryId: category.id },
      });
    }
  }

  // 3. Badges
  const badges = [
    { name: 'Verified Fundi', code: 'VERIFIED_FUNDI', description: 'National ID and Phone numbers fully verified.', icon: 'CheckCircle' },
    { name: 'Top Rated', code: 'TOP_RATED', description: 'Maintains 4.8+ rating across 10+ jobs.', icon: 'Star' },
    { name: 'High Reliability', code: 'HIGH_RELIABILITY', description: '98%+ job completion rate without cancellations.', icon: 'ShieldCheck' },
    { name: 'Emergency Ready', code: 'EMERGENCY_READY', description: 'Available for immediate 1-hour dispatch.', icon: 'Zap' }
  ];

  for (const b of badges) {
    await prisma.badge.upsert({
      where: { code: b.code },
      update: { name: b.name, description: b.description, icon: b.icon },
      create: { name: b.name, code: b.code, description: b.description, icon: b.icon },
    });
  }

  // 4. Demo Accounts
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const nairobiCounty = await prisma.county.findUnique({ where: { code: 47 } });
  const kisumuCounty = await prisma.county.findUnique({ where: { code: 42 } });

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@microjob.co.ke' },
    update: {},
    create: {
      email: 'admin@microjob.co.ke',
      phone: '+254700000001',
      fullName: 'System Administrator',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      isVerified: true
    }
  });

  // Moderator
  await prisma.user.upsert({
    where: { email: 'moderator@microjob.co.ke' },
    update: {},
    create: {
      email: 'moderator@microjob.co.ke',
      phone: '+254700000002',
      fullName: 'Dispute Moderator',
      passwordHash: hashedPassword,
      role: Role.MODERATOR,
      isVerified: true
    }
  });

  // Worker 1: John Omondi (Mason & Plumber in Kisumu)
  const worker1User = await prisma.user.upsert({
    where: { email: 'john.omondi@fundi.co.ke' },
    update: {},
    create: {
      email: 'john.omondi@fundi.co.ke',
      phone: '+254712345678',
      fullName: 'John Omondi',
      passwordHash: hashedPassword,
      role: Role.WORKER,
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'
    }
  });

  const worker1Profile = await prisma.workerProfile.upsert({
    where: { userId: worker1User.id },
    update: {},
    create: {
      userId: worker1User.id,
      nationalId: '29876543',
      isIdVerified: true,
      isPhoneVerified: true,
      isEmailVerified: true,
      bio: 'Experienced Master Mason and Licensed Plumber with 8+ years working on residential and commercial sites in Kisumu and western Kenya.',
      yearsExperience: 8,
      hourlyRate: 350,
      dailyRate: 1800,
      travelRadiusKm: 25,
      emergencyAvailable: true,
      trustScore: 94.5,
      countyId: kisumuCounty?.id,
      latitude: -0.0917,
      longitude: 34.7680,
      languages: ['Swahili', 'English', 'Luo']
    }
  });

  // Attach skills to Worker 1
  const masonSkill = await prisma.skill.findUnique({ where: { slug: 'mason' } });
  const plumberSkill = await prisma.skill.findUnique({ where: { slug: 'plumber' } });
  if (masonSkill) {
    await prisma.workerSkill.upsert({
      where: { workerProfileId_skillId: { workerProfileId: worker1Profile.id, skillId: masonSkill.id } },
      update: {},
      create: { workerProfileId: worker1Profile.id, skillId: masonSkill.id, yearsExperience: 8, proficiencyLevel: 'EXPERT' }
    });
  }
  if (plumberSkill) {
    await prisma.workerSkill.upsert({
      where: { workerProfileId_skillId: { workerProfileId: worker1Profile.id, skillId: plumberSkill.id } },
      update: {},
      create: { workerProfileId: worker1Profile.id, skillId: plumberSkill.id, yearsExperience: 6, proficiencyLevel: 'ADVANCED' }
    });
  }

  // Worker 2: Mary Wambui (Cleaner & Cook in Nairobi)
  const worker2User = await prisma.user.upsert({
    where: { email: 'mary.wambui@fundi.co.ke' },
    update: {},
    create: {
      email: 'mary.wambui@fundi.co.ke',
      phone: '+254723456789',
      fullName: 'Mary Wambui',
      passwordHash: hashedPassword,
      role: Role.WORKER,
      isVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'
    }
  });

  const worker2Profile = await prisma.workerProfile.upsert({
    where: { userId: worker2User.id },
    update: {},
    create: {
      userId: worker2User.id,
      nationalId: '31234567',
      isIdVerified: true,
      isPhoneVerified: true,
      isEmailVerified: true,
      bio: 'Professional house cleaner, laundry expert, and traditional catering cook serving Kilimani, Westlands, and Lavington.',
      yearsExperience: 5,
      hourlyRate: 250,
      dailyRate: 1400,
      travelRadiusKm: 15,
      emergencyAvailable: false,
      trustScore: 91.0,
      countyId: nairobiCounty?.id,
      latitude: -1.2921,
      longitude: 36.8219,
      languages: ['Swahili', 'English', 'Kikuyu']
    }
  });

  const cleanerSkill = await prisma.skill.findUnique({ where: { slug: 'house-cleaner' } });
  if (cleanerSkill) {
    await prisma.workerSkill.upsert({
      where: { workerProfileId_skillId: { workerProfileId: worker2Profile.id, skillId: cleanerSkill.id } },
      update: {},
      create: { workerProfileId: worker2Profile.id, skillId: cleanerSkill.id, yearsExperience: 5, proficiencyLevel: 'EXPERT' }
    });
  }

  // Employer 1: David Mutua (Homeowner in Nairobi)
  const employer1User = await prisma.user.upsert({
    where: { email: 'david.mutua@gmail.com' },
    update: {},
    create: {
      email: 'david.mutua@gmail.com',
      phone: '+254734567890',
      fullName: 'David Mutua',
      passwordHash: hashedPassword,
      role: Role.EMPLOYER,
      isVerified: true
    }
  });

  await prisma.employerProfile.upsert({
    where: { userId: employer1User.id },
    update: {},
    create: {
      userId: employer1User.id,
      organizationType: 'Individual Homeowner',
      countyId: nairobiCounty?.id
    }
  });

  // Employer 2: Lakeview Construction Ltd (Contractor in Kisumu)
  const contractorUser = await prisma.user.upsert({
    where: { email: 'contracts@lakeview.co.ke' },
    update: {},
    create: {
      email: 'contracts@lakeview.co.ke',
      phone: '+254745678901',
      fullName: 'Peter Otieno',
      passwordHash: hashedPassword,
      role: Role.CONTRACTOR,
      isVerified: true
    }
  });

  await prisma.contractorProfile.upsert({
    where: { userId: contractorUser.id },
    update: {},
    create: {
      userId: contractorUser.id,
      companyName: 'Lakeview Construction Ltd',
      registrationNumber: 'NCA-49821-BUILD',
      projectsCount: 14
    }
  });

  // 5. Sample Jobs
  const constCategory = await prisma.category.findUnique({ where: { slug: 'construction-masonry' } });
  const domesticCategory = await prisma.category.findUnique({ where: { slug: 'domestic-services' } });

  if (constCategory) {
    const job1 = await prisma.job.create({
      data: {
        title: 'Perimeter Wall Masonry Repair & Plastering',
        description: 'Looking for 2 reliable masons to repair a fallen section of stone wall and apply smooth plastering.',
        employerId: contractorUser.id,
        categoryId: constCategory.id,
        budgetType: BudgetType.DAILY,
        budgetAmount: 1800,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 3),
        numWorkersNeeded: 2,
        urgency: UrgencyLevel.HIGH,
        status: JobStatus.OPEN,
        countyId: kisumuCounty?.id,
        address: 'Milimani, Kisumu near Kisumu Hotel',
        latitude: -0.0950,
        longitude: 34.7620,
        skills: {
          create: [{ skillId: masonSkill!.id }]
        }
      }
    });
    console.log(`Created Job 1: ${job1.title}`);
  }

  if (domesticCategory && cleanerSkill) {
    const job2 = await prisma.job.create({
      data: {
        title: 'Full House Deep Cleaning & Carpet Washing',
        description: 'Need a thorough domestic cleaner for a 3-bedroom apartment in Kilimani. Includes window washing and balcony cleaning.',
        employerId: employer1User.id,
        categoryId: domesticCategory.id,
        budgetType: BudgetType.FIXED,
        budgetAmount: 2500,
        startDate: new Date(),
        numWorkersNeeded: 1,
        urgency: UrgencyLevel.MEDIUM,
        status: JobStatus.OPEN,
        countyId: nairobiCounty?.id,
        address: 'Wood Avenue, Kilimani, Nairobi',
        latitude: -1.2950,
        longitude: 36.7900,
        skills: {
          create: [{ skillId: cleanerSkill.id }]
        }
      }
    });
    console.log(`Created Job 2: ${job2.title}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
