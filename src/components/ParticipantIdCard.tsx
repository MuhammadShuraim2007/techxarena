import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, MessageSquare, CheckCircle2, ShieldCheck, Sparkles, Copy, ExternalLink, X } from 'lucide-react';
import { Registration } from '../types';
import logoImg from '../assets/images/techx_academy_logo_1784655126257.jpg';

interface ParticipantIdCardProps {
  registration: Registration;
  whatsappDirectUrl?: string;
  onClose?: () => void;
}

export const ParticipantIdCard: React.FC<ParticipantIdCardProps> = ({
  registration,
  whatsappDirectUrl,
  onClose
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const passCardRef = useRef<HTMLDivElement>(null);

  // Generate QR Code
  useEffect(() => {
    const payload = JSON.stringify({
      id: registration.hackathonIdCode,
      name: registration.fullName,
      event: registration.hackathonTitle,
      track: registration.trackName,
      status: registration.status,
      academy: 'Tech X Academy Karachi'
    });

    QRCode.toDataURL(payload, {
      width: 200,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.error('QR code generation failed:', err));
  }, [registration]);

  const copyHackathonId = () => {
    navigator.clipboard.writeText(registration.hackathonIdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Canvas Image Download
  const handleDownloadImage = async () => {
    if (!passCardRef.current) return;

    try {
      // Create canvas offscreen
      const canvas = document.createElement('canvas');
      canvas.width = 650;
      canvas.height = 850;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw Background
      const grad = ctx.createLinearGradient(0, 0, 650, 850);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 650, 850);

      // Border & Header Gradient line
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 610, 810);

      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(20, 20, 610, 10);

      // Tech X Header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('TECH X ARENA', 40, 75);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('POWERED BY TECH X ACADEMY', 40, 100);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText('Karachi, Sindh, Pakistan', 40, 120);

      // Pass Tag
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(440, 50, 170, 36);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('OFFICIAL PASS', 465, 73);

      // Divider Line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, 140);
      ctx.lineTo(610, 140);
      ctx.stroke();

      // Event Details
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('EVENT TITLE', 40, 170);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(registration.hackathonTitle, 40, 198);

      // ID Box Highlight
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, 220, 570, 60);
      ctx.strokeStyle = '#0284c7';
      ctx.strokeRect(40, 220, 570, 60);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('UNIQUE PARTICIPANT HACKATHON ID', 60, 242);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'extrabold 24px monospace';
      ctx.fillText(registration.hackathonIdCode, 60, 268);

      // Participant Info Column
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('PARTICIPANT NAME', 40, 320);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(registration.fullName, 40, 345);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('FATHER NAME', 40, 385);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(registration.fatherName, 40, 408);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('INSTITUTION / CAMPUS', 40, 448);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(registration.institution, 40, 471);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('TRACK / CATEGORY', 40, 511);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(registration.trackName, 40, 534);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('TEAM NAME', 40, 574);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(registration.teamName || 'Individual Solo Entry', 40, 597);

      // QR Code Placement
      if (qrCodeDataUrl) {
        const qrImage = new Image();
        qrImage.onload = () => {
          ctx.drawImage(qrImage, 420, 320, 180, 180);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '11px sans-serif';
          ctx.fillText('Scan at Check-in', 460, 520);

          // Footer Notice
          ctx.fillStyle = '#0f2942';
          ctx.fillRect(40, 680, 570, 100);

          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('VERIFICATION & WHATSAPP SUPPORT', 60, 710);

          ctx.fillStyle = '#cbd5e1';
          ctx.font = '12px sans-serif';
          ctx.fillText('Tech X Academy • Karachi Campus • Official WhatsApp: +92 327 2979729', 60, 735);
          ctx.fillText('Please present this card or digital pass during hackathon check-in.', 60, 755);

          // Trigger download link
          const link = document.createElement('a');
          link.download = `TechX_Pass_${registration.hackathonIdCode}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        };
        qrImage.src = qrCodeDataUrl;
      }
    } catch (err) {
      console.error('Failed to export card image:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const targetWaUrl = whatsappDirectUrl || `https://wa.me/923272979729?text=${encodeURIComponent(registration.whatsappMessageText || '')}`;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Success Notification */}
      <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <strong className="font-extrabold text-sm text-white block">Registration Successfully Confirmed!</strong>
            <span>Your unique Hackathon Pass has been generated. Details sent to admin database.</span>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-1 rounded-full hover:bg-emerald-900 text-emerald-400">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Printable Digital ID Pass Card Container */}
      <div 
        ref={passCardRef} 
        id="printable-id-card"
        className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl border-2 border-cyan-500/50 p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden space-y-6"
      >
        {/* Card Header Top */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="Tech X Logo" 
              className="w-12 h-12 rounded-xl object-cover border border-cyan-400/40 shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-black text-xl tracking-tight text-white">TECH X ARENA</h3>
              <p className="text-xs font-bold text-cyan-400">Powered By Tech X Academy Karachi</p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-xs font-bold text-cyan-300 uppercase tracking-wider">
            OFFICIAL PASS
          </div>
        </div>

        {/* Unique Hackathon ID Highlight Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 block">
              Participant Hackathon ID
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
              {registration.hackathonIdCode}
            </span>
          </div>

          <button
            onClick={copyHackathonId}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-cyan-300 font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Copy ID'}
          </button>
        </div>

        {/* Info Grid + QR Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2 space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Event Name</span>
              <strong className="text-base text-white font-bold block">{registration.hackathonTitle}</strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Participant Name</span>
              <strong className="text-sm text-cyan-300 font-bold block">{registration.fullName}</strong>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Father Name</span>
                <span className="text-slate-200 font-medium">{registration.fatherName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">City</span>
                <span className="text-slate-200 font-medium">{registration.city}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Institution</span>
                <span className="text-slate-200 font-medium line-clamp-1">{registration.institution}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Course / Major</span>
                <span className="text-slate-200 font-medium">{registration.courseOrMajor}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Track Category</span>
              <span className="text-cyan-400 font-bold">{registration.trackName}</span>
            </div>

            {registration.teamName && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Team Name</span>
                <span className="text-amber-400 font-bold">{registration.teamName} ({registration.roleInTeam})</span>
              </div>
            )}
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-slate-950 space-y-2 text-center">
            {qrCodeDataUrl ? (
              <img src={qrCodeDataUrl} alt="Participant QR Code" className="w-32 h-32" />
            ) : (
              <div className="w-32 h-32 bg-slate-200 animate-pulse rounded-lg"></div>
            )}
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              Scan for Check-in
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Registered: {new Date(registration.registrationDate).toLocaleDateString()}</span>
          <span className="text-cyan-400 font-semibold">Karachi Campus Desk • +92 327 2979729</span>
        </div>

      </div>

      {/* Pass Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <a
          href={targetWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:flex-1 py-3 px-4 rounded-2xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>Send Details To WhatsApp (+923272979729)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={handleDownloadImage}
          className="w-full sm:flex-1 py-3 px-4 rounded-2xl font-bold text-xs text-white bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          Download ID Pass (PNG)
        </button>

        <button
          onClick={handlePrint}
          className="py-3 px-4 rounded-2xl font-bold text-xs text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

    </div>
  );
};
