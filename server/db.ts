import fs from 'fs';
import path from 'path';
import { Hackathon, Registration, Announcement } from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface Schema {
  hackathons: Hackathon[];
  registrations: Registration[];
  announcements: Announcement[];
  counter: number;
}

const DEFAULT_HACKATHONS: Hackathon[] = [
  {
    id: 'txa-aghaaz-26',
    title: 'Graphic Design Hackathon - Aghaaz \'26',
    shortDescription: 'Karachi\'s premier Graphic Design competition by Tech X Academy. Ideas meet creativity!',
    fullDescription: 'Aghaaz \'26 is Tech X Academy\'s official inaugural Graphic Design Hackathon in Karachi, Pakistan. Created for passionate visual designers, UI/UX creators, and digital artists. Demonstrate your mastery in branding, poster graphics, visual storytelling, and digital creative tools. WIN PKR 5,000 CASH PRIZE + OFFICIAL GRAPHIC DESIGN INTERNSHIP OFFER AT TECH X ACADEMY KARACHI! Event Timing: 3:00 PM to 5:00 PM on 1st August 2026. Results announced at 6:00 PM!',
    bannerUrl: '/images/aghaaz26_poster.jpg',
    startDate: '2026-08-01T15:00:00Z',
    endDate: '2026-08-01T17:00:00Z',
    registrationStartDate: '2026-07-20T00:00:00Z',
    registrationEndDate: '2026-07-31T23:59:59Z',
    venue: 'New Karachi Ikhwan Masjid (Females: 1st Floor Hall | Males: Ground Floor Digital Lab)',
    mode: 'In-Person (Karachi)',
    maxParticipants: 150,
    teamSizeLimit: 1,
    allowTeams: true,
    registrationFee: 'PKR 200',
    prizes: [
      { title: '1st Place Winner (Aghaaz Champion)', amount: 'PKR 5,000 CASH PRIZE', description: 'PKR 5,000 Cash Prize + Official Graphic Designing Internship Offer at Tech X Academy Karachi + Winner Shield' },
      { title: 'Graphic Design Internship', amount: 'Guaranteed Internship Offer', description: 'Direct internship placement offer at Tech X Academy Karachi for top performer' }
    ],
    rules: [
      'Registration fee is PKR 200 per participant (Pay via JazzCash 03212260509 Title: Muhammad Sufiyan or at Campus Desk).',
      'Registration Deadline: 31st July 2026 until 11:59 PM (Rat 12 baje tak).',
      'Event Timing: 3:00 PM to 5:00 PM on 1st August 2026.',
      'Result Announcement: 6:00 PM Sharp on event day.',
      'Location: New Karachi Ikhwan Masjid (Females: 1st Floor Ikhwan Masjid Hall | Males: Ground Floor Ikhwan Digital Lab).',
      'Team size is 1 member (solo entry), but a team name or artist alias is required.',
      'All graphic design submissions must be created during the hackathon duration using design software (Photoshop, Illustrator, Figma, Canva, etc.).',
      'Original assets only. Plagiarism will result in immediate disqualification.',
      'Decisions made by Tech X Academy jury panel are final.'
    ],
    eligibility: [
      'Students, FIT enrollees, visual artists, and graphic designers in Karachi & Sindh.'
    ],
    tracks: [
      { id: 'track-branding', name: 'Brand Identity & Visual Design', description: 'Create full brand identity systems and logo concepts.' },
      { id: 'track-poster', name: 'Event Posters & Key Visuals', description: 'Craft compelling promotional posters and key visual graphics.' },
      { id: 'track-uiux', name: 'UI/UX & Web Graphics', description: 'Design modern web and mobile user interface visuals.' }
    ],
    timeline: [
      { title: 'Registration Opens', date: 'July 20, 2026', description: 'Submit online application & pay PKR 200 fee.', isCompleted: true },
      { title: 'Registration Deadline', date: 'July 31, 2026 (11:59 PM Midnight)', description: 'Final deadline to register and submit payment proof.', isCompleted: false },
      { title: 'Hackathon Starts', date: 'August 1, 2026 (03:00 PM)', description: 'Graphic design challenge kicks off at New Karachi Ikhwan Masjid.', isCompleted: false },
      { title: 'Hackathon Concludes & Submissions', date: 'August 1, 2026 (05:00 PM)', description: 'Final artwork submission and jury evaluation.', isCompleted: false },
      { title: 'Result Announcement & Award Ceremony', date: 'August 1, 2026 (06:00 PM)', description: 'PKR 5,000 Cash Prize & Graphic Design Internship ceremony.', isCompleted: false }
    ],
    status: 'open',
    featured: true,
    organizer: 'Tech X Academy, Karachi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'txa-fit-clash-2026',
    title: 'FIT Code Clash 2026',
    shortDescription: 'The flagship IT & Coding competition organized by Tech X Academy Karachi for FIT students & young developers.',
    fullDescription: 'FIT Code Clash 2026 brings together the brightest minds from Tech X Academy and IT institutes across Karachi. Build groundbreaking web applications, AI automation tools, and real-world software solutions over 36 intensive hours.',
    bannerUrl: '/images/fit_code_clash.jpg',
    startDate: '2026-08-15T09:00:00Z',
    endDate: '2026-08-16T18:00:00Z',
    registrationStartDate: '2026-07-01T00:00:00Z',
    registrationEndDate: '2026-08-10T23:59:59Z',
    venue: 'Tech X Academy Campus, Shahrah-e-Faisal, Karachi',
    mode: 'In-Person (Karachi Campus)',
    maxParticipants: 200,
    teamSizeLimit: 4,
    allowTeams: true,
    registrationFee: 'Free',
    prizes: [
      { title: '1st Place Champion', amount: 'PKR 150,000', description: 'Cash Prize + Tech X Academy Advanced Internship & Trophy' },
      { title: '2nd Place Runner Up', amount: 'PKR 75,000', description: 'Cash Prize + Shield + Swag Kit' },
      { title: '3rd Place', amount: 'PKR 35,000', description: 'Cash Prize + Merit Certificate' }
    ],
    rules: [
      'All code must be written during the 36-hour hackathon duration.',
      'Teams must consist of 1 to 4 members.'
    ],
    eligibility: [
      'Students enrolled in Foundation In Information Technology (FIT) at Tech X Academy.'
    ],
    tracks: [
      { id: 'track-1', name: 'Web Apps & Full-Stack Solutions', description: 'Build responsive, scalable web applications.' }
    ],
    timeline: [
      { title: 'Registration Opens', date: 'July 1, 2026', description: 'Online applications open on Tech X Arena portal.', isCompleted: true }
    ],
    status: 'upcoming',
    featured: true,
    organizer: 'Tech X Academy, Karachi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-0001',
    hackathonId: 'txa-fit-clash-2026',
    hackathonTitle: 'FIT Code Clash 2026',
    hackathonIdCode: 'TXA-ARENA-2026-0001',
    fullName: 'Muhammad Hamza Khan',
    fatherName: 'Tariq Mahmood Khan',
    email: 'hamza.khan@gmail.com',
    phone: '+923001234567',
    whatsapp: '+923001234567',
    city: 'Karachi',
    institution: 'Tech X Academy (FIT Batch 4)',
    courseOrMajor: 'FIT (Foundation In Information Technology)',
    experienceLevel: 'Intermediate',
    age: 21,
    gender: 'Male',
    teamType: 'team',
    teamName: 'ByteBusters Karachi',
    roleInTeam: 'Team Lead / Full Stack Developer',
    teamMembersCount: 3,
    trackId: 'track-1',
    trackName: 'Web Apps & Full-Stack Solutions',
    portfolioUrl: 'https://github.com/hamzakhan-dev',
    consentAccepted: true,
    registrationDate: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    status: 'confirmed',
    whatsappNotificationSent: true
  },
  {
    id: 'reg-0002',
    hackathonId: 'txa-fit-clash-2026',
    hackathonTitle: 'FIT Code Clash 2026',
    hackathonIdCode: 'TXA-ARENA-2026-0002',
    fullName: 'Syeda Ayesha Fatima',
    fatherName: 'Syed Raza Hussain',
    email: 'ayesha.fatima@techx.edu.pk',
    phone: '+923339876543',
    whatsapp: '+923339876543',
    city: 'Karachi',
    institution: 'Tech X Academy',
    courseOrMajor: 'FIT Course',
    experienceLevel: 'Beginner',
    age: 19,
    gender: 'Female',
    teamType: 'individual',
    trackId: 'track-3',
    trackName: 'FIT Student Showcase',
    consentAccepted: true,
    registrationDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'registered',
    whatsappNotificationSent: true
  }
];

class JsonDb {
  private data: Schema;

  constructor() {
    this.data = { hackathons: [], registrations: [], announcements: [], counter: 100 };
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      this.data = {
        hackathons: DEFAULT_HACKATHONS,
        registrations: DEFAULT_REGISTRATIONS,
        announcements: [],
        counter: 1003
      };
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading database file, resetting defaults:', err);
        this.data = {
          hackathons: DEFAULT_HACKATHONS,
          registrations: DEFAULT_REGISTRATIONS,
          announcements: [],
          counter: 1003
        };
        this.save();
      }
    }
  }

  private save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  // Hackathons
  public getHackathons(): Hackathon[] {
    return this.data.hackathons;
  }

  public getHackathonById(id: string): Hackathon | undefined {
    return this.data.hackathons.find(h => h.id === id);
  }

  public createHackathon(h: Omit<Hackathon, 'id' | 'createdAt' | 'updatedAt'>): Hackathon {
    const id = 'txa-' + h.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    const newHackathon: Hackathon = {
      ...h,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.hackathons.unshift(newHackathon);
    this.save();
    return newHackathon;
  }

  public updateHackathon(id: string, updates: Partial<Hackathon>): Hackathon | null {
    const idx = this.data.hackathons.findIndex(h => h.id === id);
    if (idx === -1) return null;
    this.data.hackathons[idx] = {
      ...this.data.hackathons[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.hackathons[idx];
  }

  public deleteHackathon(id: string): boolean {
    const initialLen = this.data.hackathons.length;
    this.data.hackathons = this.data.hackathons.filter(h => h.id !== id);
    if (this.data.hackathons.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Registrations
  public getRegistrations(): Registration[] {
    return this.data.registrations;
  }

  public checkDuplicate(hackathonId: string, email: string, whatsapp: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = whatsapp.replace(/[^0-9]/g, '');
    return this.data.registrations.some(r => 
      r.hackathonId === hackathonId && 
      (r.email.trim().toLowerCase() === normalizedEmail || r.whatsapp.replace(/[^0-9]/g, '') === normalizedPhone)
    );
  }

  public generateHackathonIdCode(): string {
    this.data.counter += 1;
    const year = new Date().getFullYear();
    const seq = this.data.counter.toString().padStart(4, '0');
    return `TXA-ARENA-${year}-${seq}`;
  }

  public createRegistration(regData: Omit<Registration, 'id' | 'hackathonIdCode' | 'registrationDate' | 'status' | 'whatsappNotificationSent'>): Registration {
    const id = 'reg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const hackathonIdCode = this.generateHackathonIdCode();
    
    // Format WhatsApp message text for quick copy / auto dispatch
    const paymentLabel = regData.paymentMethod === 'jazzcash'
      ? `JAZZCASH (03212260509 - Title: Muhammad Sufiyan) - TxID: ${regData.paymentTransactionId || 'Pending'}`
      : `PAY ON HACKATHON DAY (Campus Desk)`;

    const waText = 
`*NEW REGISTRATION - TECH X ARENA*
----------------------------------------
*Hackathon ID:* ${hackathonIdCode}
*Event:* ${regData.hackathonTitle}

*PARTICIPANT DETAILS*
- *Name:* ${regData.fullName}
- *Father Name:* ${regData.fatherName}
- *Email:* ${regData.email}
- *Phone:* ${regData.phone}
- *WhatsApp:* ${regData.whatsapp}
- *City:* ${regData.city}
- *Institution:* ${regData.institution}

*TEAM INFORMATION*
- *Team Name:* ${regData.teamName || 'Solo Entry'}

*PAYMENT DETAILS*
- *Method:* ${paymentLabel}
- *Status:* ${regData.paymentStatus || 'pending'}

*TECH X ACADEMY KARACHI*
----------------------------------------`;

    const registration: Registration = {
      ...regData,
      id,
      hackathonIdCode,
      registrationDate: new Date().toISOString(),
      status: 'confirmed',
      whatsappNotificationSent: true,
      whatsappMessageText: waText
    };

    this.data.registrations.unshift(registration);
    this.save();
    return registration;
  }

  public deleteRegistration(id: string): boolean {
    const initialLen = this.data.registrations.length;
    this.data.registrations = this.data.registrations.filter(r => r.id !== id);
    if (this.data.registrations.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public findRegistrationByQuery(query: string): Registration[] {
    const q = query.trim().toLowerCase();
    return this.data.registrations.filter(r => 
      r.hackathonIdCode.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.whatsapp.includes(q) ||
      r.fullName.toLowerCase().includes(q)
    );
  }

  public updateRegistrationStatus(id: string, status: Registration['status']): Registration | null {
    const reg = this.data.registrations.find(r => r.id === id);
    if (!reg) return null;
    reg.status = status;
    this.save();
    return reg;
  }

  // Announcements
  public getAnnouncements(hackathonId?: string): Announcement[] {
    if (hackathonId) {
      return this.data.announcements.filter(a => a.hackathonId === hackathonId);
    }
    return this.data.announcements;
  }

  public createAnnouncement(ann: Omit<Announcement, 'id' | 'createdAt'>): Announcement {
    const newAnn: Announcement = {
      ...ann,
      id: 'ann-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    this.data.announcements.unshift(newAnn);
    this.save();
    return newAnn;
  }
}

export const db = new JsonDb();
