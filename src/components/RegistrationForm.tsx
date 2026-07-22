import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2, User, Phone, Mail, Building, Award, ShieldCheck, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Hackathon, Registration } from '../types';
import logoImg from '../assets/images/techx_academy_logo_1784655126257.jpg';

interface RegistrationFormProps {
  hackathons: Hackathon[];
  selectedHackathonId?: string;
  onClose: () => void;
  onSuccess: (reg: Registration, waDirectUrl: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  hackathons,
  selectedHackathonId,
  onClose,
  onSuccess
}) => {
  const openHackathons = hackathons.filter(h => h.status === 'open' || h.status === 'upcoming');
  const defaultHackathon = openHackathons.find(h => h.id === selectedHackathonId) || openHackathons[0] || hackathons[0];

  const [activeHackathon, setActiveHackathon] = useState<Hackathon | undefined>(defaultHackathon);

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    email: '',
    phone: '',
    whatsapp: '',
    city: 'Karachi',
    institution: '',
    courseOrMajor: 'Graphic Design Student',
    experienceLevel: 'Intermediate' as Registration['experienceLevel'],
    age: 20,
    gender: 'Male' as Registration['gender'],
    teamType: 'individual' as Registration['teamType'],
    teamName: '',
    roleInTeam: 'Individual Designer',
    teamMembersCount: 1,
    portfolioUrl: '',
    cnicOrStudentId: '',
    notes: '',
    paymentMethod: 'jazzcash' as 'jazzcash' | 'campus_desk',
    paymentTransactionId: '',
    paymentScreenshotUrl: '',
    consentAccepted: false
  });

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please upload a smaller image screenshot.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, paymentScreenshotUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update when selected hackathon changes
  const handleHackathonChange = (id: string) => {
    const found = hackathons.find(h => h.id === id);
    setActiveHackathon(found);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!activeHackathon) {
      setErrorMsg('Please select a valid hackathon.');
      return;
    }

    if (!formData.fullName.trim() || !formData.fatherName.trim() || !formData.email.trim() || !formData.whatsapp.trim() || !formData.institution.trim()) {
      setErrorMsg('Please fill in all mandatory fields (Full Name, Father Name, Email Address, WhatsApp Number, Institution).');
      return;
    }

    if (!formData.consentAccepted) {
      setErrorMsg('You must agree to the Terms & Code of Conduct before registering.');
      return;
    }

    const defaultTrack = activeHackathon.tracks && activeHackathon.tracks[0] ? activeHackathon.tracks[0] : { id: 'general-track', name: 'Graphic Design Competition' };

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          hackathonId: activeHackathon.id,
          trackId: defaultTrack.id,
          trackName: defaultTrack.name
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      // Confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Pass along success
      onSuccess(data.registration, data.whatsappDirectUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-200 my-8">
        
        {/* Header Bar */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden p-0.5 bg-gradient-to-tr from-cyan-500 to-blue-600 shrink-0">
              <img src={logoImg} alt="Tech X Logo" className="w-full h-full object-cover rounded-[10px]" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Participant Registration</h2>
              <p className="text-xs text-cyan-400 font-medium">Tech X Arena • Tech X Academy Karachi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold text-white">Registration Error</strong>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Event Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Award className="w-4 h-4" />
              1. Hackathon Event Selection
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Hackathon <span className="text-rose-400">*</span>
              </label>
              <select
                value={activeHackathon?.id || ''}
                onChange={(e) => handleHackathonChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {hackathons.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.title} ({h.mode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Personal Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <User className="w-4 h-4" />
              2. Personal Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ali"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Father Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Ahmed"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="ali@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WhatsApp Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="+92 300 1234567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value, phone: formData.phone || e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  City <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Karachi, Hyderabad, etc."
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    min={12}
                    max={60}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Academic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Building className="w-4 h-4" />
              3. Academy & Educational Info
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Institution / College / University <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tech X Academy, FAST, KU, Ned, etc."
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level</label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Beginner">Beginner (1st / 2nd Competition)</option>
                  <option value="Intermediate">Intermediate (Decent Graphic Experience)</option>
                  <option value="Advanced">Advanced / Professional Designer</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Portfolio or Behance / Instagram Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://behance.net/username or Instagram design page"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Team Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              4. Team Name & Participation
            </div>

            {/* Fee Highlight Box */}
            {activeHackathon?.registrationFee && (
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-white space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-cyan-400">Registration Fee: {activeHackathon.registrationFee}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">Entry Mandatory</span>
                </div>
                <p className="text-white/60 text-[11px]">
                  Fee payable at Tech X Academy Karachi Campus or via WhatsApp confirmation (+92 327 2979729).
                </p>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Team Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your team or artist alias (e.g. Pixel Crafters, DesignStudio)"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-white/30"
                />
                <p className="text-[10px] text-white/40 mt-1">
                  {activeHackathon?.teamSizeLimit === 1
                    ? "For Aghaaz '26, entry is 1 solo designer per team, but a Team Name is required."
                    : "Specify your official team name."}
                </p>
              </div>

              {activeHackathon && activeHackathon.teamSizeLimit > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-3">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">Your Role in Team</label>
                    <input
                      type="text"
                      placeholder="e.g. Team Lead / UI Lead"
                      value={formData.roleInTeam}
                      onChange={(e) => setFormData({ ...formData, roleInTeam: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white mb-1">Total Team Members</label>
                    <input
                      type="number"
                      min={1}
                      max={activeHackathon.teamSizeLimit}
                      value={formData.teamMembersCount}
                      onChange={(e) => setFormData({ ...formData, teamMembersCount: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Payment Options & Screenshot Invoice */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              5. Registration Fee Payment ({activeHackathon?.registrationFee || 'PKR 200'})
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option A: JazzCash */}
                <label 
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.paymentMethod === 'jazzcash'
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="jazzcash"
                      checked={formData.paymentMethod === 'jazzcash'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'jazzcash' })}
                      className="accent-amber-400"
                    />
                    <span className="font-extrabold text-xs text-amber-300">JazzCash Online Payment</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Number: <strong className="text-white bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">03212260509</strong>
                  </p>
                  <p className="text-[10px] text-amber-300 font-bold mt-1">Title: Muhammad Sufiyan</p>
                </label>

                {/* Option B: Pay on Hackathon Day */}
                <label 
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.paymentMethod === 'campus_desk'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="campus_desk"
                      checked={formData.paymentMethod === 'campus_desk'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'campus_desk' })}
                      className="accent-cyan-400"
                    />
                    <span className="font-extrabold text-xs text-cyan-300">Pay on Hackathon Day</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Pay cash at Karachi Campus Desk</p>
                  <p className="text-[10px] text-slate-400 mt-1">Pay PKR 200 on event morning</p>
                </label>
              </div>

              {/* If JazzCash Selected */}
              {formData.paymentMethod === 'jazzcash' && (
                <div className="p-4 rounded-xl bg-black/80 border border-amber-500/20 space-y-3 pt-3">
                  <div className="text-xs text-amber-300 font-bold flex items-center justify-between">
                    <span>Send PKR 200 to JazzCash: 03212260509</span>
                    <span className="text-[10px] text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 font-extrabold">Title: Muhammad Sufiyan</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Transaction ID / Reference No.
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 03214569871"
                        value={formData.paymentTransactionId}
                        onChange={(e) => setFormData({ ...formData, paymentTransactionId: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Upload Payment Invoice / Screenshot
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30"
                      />
                    </div>
                  </div>

                  {formData.paymentScreenshotUrl && (
                    <div className="mt-2 p-2 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center gap-3">
                      <img 
                        src={formData.paymentScreenshotUrl} 
                        alt="Payment Screenshot Preview" 
                        className="w-12 h-12 object-cover rounded-lg border border-amber-500/50 shrink-0" 
                      />
                      <div className="text-[10px]">
                        <span className="font-bold text-amber-400 block">Payment Screenshot Attached</span>
                        <span className="text-slate-400">Invoice image will be saved in database for organizer verification.</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Section 6: Consent Checkbox */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                required
                checked={formData.consentAccepted}
                onChange={(e) => setFormData({ ...formData, consentAccepted: e.target.checked })}
                className="mt-0.5 accent-cyan-400 w-4 h-4 rounded"
              />
              <span>
                I agree to the Tech X Arena Code of Conduct, confirm that all provided details are true, and understand that registration updates will be sent to email & WhatsApp number <strong>+92 327 2979729</strong>.
              </span>
            </label>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-xl shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Unique Hackathon Pass...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Registration & Get Digital Pass
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
