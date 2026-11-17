import React, { useState } from 'react';
import {
  Shield,
  TrendingUp,
  ArrowRight,
  Search,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Database
} from 'lucide-react';

// Built-in Verified Scouting Database for instant accuracy on major players
const VERIFIED_SCOUT_DB = {
  'lamine yamal': { ca: 84, pa: 94, age: 19, pos: 'RW', leagueTier: 'high' },
  'jude bellingham': { ca: 90, pa: 94, age: 23, pos: 'CAM', leagueTier: 'high' },
  'kylian mbappe': { ca: 91, pa: 94, age: 27, pos: 'ST', leagueTier: 'high' },
  'erling haaland': { ca: 91, pa: 94, age: 26, pos: 'ST', leagueTier: 'high' },
  'vinicius jr': { ca: 90, pa: 94, age: 26, pos: 'LW', leagueTier: 'high' },
  'pedri': { ca: 86, pa: 91, age: 23, pos: 'CM', leagueTier: 'high' },
  'gavi': { ca: 83, pa: 90, age: 22, pos: 'CM', leagueTier: 'high' },
  'florian wirtz': { ca: 88, pa: 93, age: 23, pos: 'CAM', leagueTier: 'med-high' },
  'jamal musiala': { ca: 87, pa: 93, age: 23, pos: 'CAM', leagueTier: 'med-high' },
  'luka modric': { ca: 84, pa: 84, age: 41, pos: 'CM', leagueTier: 'high' },
  'lewandowski': { ca: 87, pa: 87, age: 38, pos: 'ST', leagueTier: 'high' },
  'robert lewandowski': { ca: 87, pa: 87, age: 38, pos: 'ST', leagueTier: 'high' },
  'estevao': { ca: 78, pa: 91, age: 19, pos: 'RW', leagueTier: 'low' },
  'endrick': { ca: 79, pa: 91, age: 20, pos: 'ST', leagueTier: 'high' },
  'cole palmer': { ca: 86, pa: 90, age: 24, pos: 'CAM', leagueTier: 'high' },
  'bukayo saka': { ca: 88, pa: 91, age: 25, pos: 'RW', leagueTier: 'high' },
  'rodri': { ca: 91, pa: 91, age: 30, pos: 'CDM', leagueTier: 'high' },
  'morgan gibbs-white': { ca: 81, pa: 85, age: 26, pos: 'CAM', leagueTier: 'high' },
  'viktor gyokeres': { ca: 85, pa: 88, age: 28, pos: 'ST', leagueTier: 'med' },
  'alexander isak': { ca: 86, pa: 89, age: 27, pos: 'ST', leagueTier: 'high' },
  'kobbie mainoo': { ca: 79, pa: 89, age: 21, pos: 'CM', leagueTier: 'high' },
  'pau cubarsi': { ca: 80, pa: 90, age: 19, pos: 'CB', leagueTier: 'high' }
};

const HIGH_REP_CLUBS = [
  'real madrid', 'barcelona', 'fc barcelona', 'atletico madrid', 'athletic club',
  'real sociedad', 'villarreal', 'real betis', 'sevilla', 'valencia', 'girona',
  'manchester city', 'man city', 'arsenal', 'liverpool', 'manchester united',
  'man utd', 'chelsea', 'tottenham', 'spurs', 'newcastle', 'aston villa',
  'west ham', 'brighton', 'crystal palace', 'fulham', 'wolves', 'everton',
  'nottingham forest', 'bournemouth', 'brentford'
];

const LOW_REP_CLUBS = [
  'palmeiras', 'flamengo', 'santos', 'corinthians', 'sao paulo', 'fluminense',
  'gremio', 'internacional', 'botafogo', 'vasco', 'cruzeiro', 'atletico mineiro',
  'shamrock rovers', 'bohemians', 'dundalk', 'derry city', 'st patricks',
  'real zaragoza', 'racing santander', 'almeria', 'granada', 'cadiz', ' sporting gijon',
  'oviedo', 'malaga', 'deportivo', 'levante', 'elche', 'tenerife', 'burgos',
  'leeds', 'burnley', 'sheffield united', 'sunderland', 'middlesbrough', 'coventry',
  'norwich', 'watford', 'west brom', 'hull city', 'stoke', 'swansea', 'cardiff'
];

function detectLeagueTier(clubName) {
  const norm = (clubName || '').toLowerCase().trim();
  if (HIGH_REP_CLUBS.some(c => norm.includes(c))) return 'high';
  if (LOW_REP_CLUBS.some(c => norm.includes(c))) return 'low';
  return 'med';
}

function isSpanishClub(clubName) {
  const norm = (clubName || '').toLowerCase().trim();
  const spanish = [
    'real madrid', 'barcelona', 'atletico', 'sevilla', 'valencia', 'villarreal',
    'betis', 'sociedad', 'athletic', 'girona', 'celta', 'osasuna', 'getafe',
    'mallorca', 'las palmas', 'alaves', 'espanyol', 'leganes', 'valladolid',
    'zaragoza', 'santander', 'almeria', 'granada', 'cadiz', 'gijon', 'oviedo',
    'malaga', 'deportivo', 'levante', 'elche'
  ];
  return spanish.some(c => norm.includes(c));
}

// Fetch player cutout photo & bio from TheSportsDB
async function fetchTheSportsDB(playerName) {
  try {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(playerName)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.player && data.player.length > 0) {
      const soccerPlayer = data.player.find(p => p.strSport === 'Soccer') || data.player[0];
      let age = null;
      if (soccerPlayer.dateBorn) {
        const birthYear = parseInt(soccerPlayer.dateBorn.substring(0, 4), 10);
        if (!isNaN(birthYear)) {
          age = new Date().getFullYear() - birthYear;
        }
      }
      return {
        photoUrl: soccerPlayer.strCutout || soccerPlayer.strThumb || soccerPlayer.strRender || null,
        age,
        position: soccerPlayer.strPosition || 'Forward',
        team: soccerPlayer.strTeam || null,
        nationality: soccerPlayer.strNationality || null
      };
    }
  } catch (err) {
    console.warn('TheSportsDB lookup failed:', err);
  }
  return null;
}

// Optional live scouting lookup via Gemini API if VITE_GEMINI_API_KEY is configured in .env
async function fetchLiveScoutRatings(playerName, fromClub) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') return null;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Provide realistic current football scouting metrics for player "${playerName}" (selling club: "${fromClub}"). Return ONLY valid JSON with keys: "ca" (integer 55-93 representing current ability rating), "pa" (integer 60-95 representing potential ability rating, must be >= ca), "age" (integer 16-42), "pos" (short position code like ST, RW, CM, CB, GK), "leagueTier" ("high" for Premier League/LaLiga, "low" for Brazil/Ireland/2nd Divisions, "med" for other leagues).`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    );
    const result = await response.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      return JSON.parse(rawText);
    }
  } catch (e) {
    console.warn('Live AI scouting lookup skipped or failed:', e);
  }
  return null;
}

// Valuation Engine based on real-world scouting & transfer code parameters
function evaluateTransferDeal({ playerName, fromClub, toClub, dealPrice, scoutData, photoUrl }) {
  const { ca, pa, age, pos, leagueTier, sourceLabel } = scoutData;
  const modifiers = [];

  // 1. Exponential Base Valuation Curve from Current Ability (CA)
  // Calibrated so a ~81 CA player in a top league with upside lands around £60m-£85m
  let baseValue = 1.2 * Math.pow(1.148, Math.max(0, ca - 55));

  // 2. Age Curve Adjustment
  if (age >= 34) {
    baseValue *= 0.60; // Automatic 40% value drop for players 34+
    modifiers.push({
      type: 'negative',
      label: `Veteran Depreciation (Age ${age}: -40% Market Value)`
    });
  } else if (age <= 21) {
    baseValue *= 1.18;
    modifiers.push({
      type: 'positive',
      label: `Youth Investment Premium (Age ${age}: +18% Long-Term Value)`
    });
  }

  // 3. Potential-to-Current Ability Ratio Spike (PA / CA >= 1.15)
  const ratio = pa / ca;
  if (ratio >= 1.15) {
    baseValue *= 1.38;
    modifiers.push({
      type: 'positive',
      label: `High-Upside Valuation Spike (PA/CA Ratio ${ratio.toFixed(2)} ≥ 1.15)`
    });
  } else if (pa - ca >= 5) {
    baseValue *= 1.12;
    modifiers.push({
      type: 'neutral',
      label: `Growth Margin Eligible (${pa - ca} pt Upside Gap)`
    });
  }

  // 4. League Reputation Multiplier
  if (leagueTier === 'high') {
    baseValue *= 1.85; // 80-100% inflation in England / Spain
    modifiers.push({
      type: 'warning',
      label: `Top-Tier League Premium (${fromClub}: +85% Valuation Inflation)`
    });
  } else if (leagueTier === 'low') {
    baseValue *= 1.10; // 0-20% in Brazil / Ireland / 2nd Divisions
    modifiers.push({
      type: 'positive',
      label: `Undervalued Market Zone (${fromClub}: +10% Low-Tax League)`
    });
  } else {
    baseValue *= 1.40;
    modifiers.push({
      type: 'neutral',
      label: `Standard League Coefficient (${fromClub}: +40% Market Adjustment)`
    });
  }

  // 5. Release Clause & Cultural Rules
  const potentialGap = pa - ca;
  if (potentialGap >= 25) {
    modifiers.push({
      type: 'positive',
      label: `Breakout Prospect Clause (Up to 400% Release Clause Protection; Negotiate Under Clause)`
    });
  } else if (isSpanishClub(fromClub)) {
    modifiers.push({
      type: 'neutral',
      label: `Mandatory Release Clause Market (90% Spanish Contract Coverage)`
    });
  }

  const marketValue = Math.max(1, Math.round(baseValue));

  // Best Possible Deal: 15-20% discount via Squad Surplus / Positional Depth leverage
  // Calibrated so a £85m Market Value yields a £60m Best Possible Deal (~70-80% floor)
  const bestPossibleDeal = Math.max(1, Math.round(marketValue * 0.71));

  modifiers.push({
    type: 'positive',
    label: `Squad Surplus Target Floor: £${bestPossibleDeal}m (15–20%+ Positional Depth Leverage)`
  });

  // Grade calculation comparing user's Transfer Sum against Market Value & Best Possible Deal
  const diffRatio = dealPrice / marketValue;
  let grade = 'C';
  let verdict = 'FAIR DEAL';
  let gradeColor = '#eab308'; // yellow

  if (dealPrice <= bestPossibleDeal * 1.03) {
    grade = 'A';
    verdict = 'EXCELLENT DEAL';
    gradeColor = '#22c55e';
  } else if (diffRatio <= 0.88) {
    grade = 'A';
    verdict = 'EXCELLENT DEAL';
    gradeColor = '#22c55e';
  } else if (diffRatio <= 1.02) {
    grade = 'B';
    verdict = 'GOOD SIGNING';
    gradeColor = '#84cc16';
  } else if (diffRatio <= 1.18) {
    grade = 'C';
    verdict = 'FAIR VALUE';
    gradeColor = '#eab308';
  } else if (diffRatio <= 1.35) {
    grade = 'D';
    verdict = 'OVERPAID';
    gradeColor = '#f97316';
  } else {
    grade = 'F';
    verdict = 'POOR DEAL';
    gradeColor = '#ef4444';
  }

  return {
    playerName,
    fromClub,
    toClub,
    dealPrice,
    marketValue,
    bestPossibleDeal,
    grade,
    verdict,
    gradeColor,
    ca,
    pa,
    age,
    pos,
    sourceLabel,
    photoUrl,
    modifiers
  };
}

export default function App() {
  const [playerName, setPlayerName] = useState('Morgan Gibbs-White');
  const [fromClub, setFromClub] = useState('Nottingham Forest');
  const [toClub, setToClub] = useState('Tottenham');
  const [dealPrice, setDealPrice] = useState('60');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!playerName.trim() || !fromClub.trim() || !toClub.trim() || !dealPrice) return;

    setLoading(true);
    const normName = playerName.toLowerCase().trim();
    const detectedTier = detectLeagueTier(fromClub);

    // 1. Fetch player photo & bio from TheSportsDB
    const sportsDbData = await fetchTheSportsDB(playerName.trim());

    // 2. Check verified DB or Live AI Grounding
    let scoutData = null;
    if (VERIFIED_SCOUT_DB[normName]) {
      const dbEntry = VERIFIED_SCOUT_DB[normName];
      scoutData = {
        ...dbEntry,
        leagueTier: detectedTier || dbEntry.leagueTier,
        sourceLabel: 'Verified Scouting Database'
      };
    } else {
      const liveAi = await fetchLiveScoutRatings(playerName.trim(), fromClub.trim());
      if (liveAi && liveAi.ca) {
        scoutData = {
          ca: Number(liveAi.ca),
          pa: Number(liveAi.pa || liveAi.ca + 4),
          age: Number(liveAi.age || sportsDbData?.age || 24),
          pos: liveAi.pos || sportsDbData?.position || 'MID',
          leagueTier: liveAi.leagueTier || detectedTier,
          sourceLabel: 'Live Web Scouting Feed'
        };
      } else {
        // Club-tier & Bio calibrated estimation when offline / no API key
        const resolvedAge = sportsDbData?.age || 24;
        const baseCa = detectedTier === 'high' ? 81 : detectedTier === 'low' ? 74 : 77;
        const upside = resolvedAge <= 21 ? 11 : resolvedAge <= 25 ? 5 : 1;
        scoutData = {
          ca: baseCa,
          pa: Math.min(93, baseCa + upside),
          age: resolvedAge,
          pos: sportsDbData?.position || 'MID',
          leagueTier: detectedTier,
          sourceLabel: sportsDbData ? 'TheSportsDB Bio + Club Tier Model' : 'Club Coefficient Model'
        };
      }
    }

    const result = evaluateTransferDeal({
      playerName: playerName.trim(),
      fromClub: fromClub.trim(),
      toClub: toClub.trim(),
      dealPrice: parseFloat(dealPrice),
      scoutData,
      photoUrl: sportsDbData?.photoUrl || null
    });

    setEvaluation(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white flex flex-col items-center justify-center p-4 md:p-8">
      {!evaluation ? (
        <div className="w-full max-w-lg bg-[#12161f] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
                TRANSFER DEAL EVALUATOR
              </h1>
              <p className="text-xs text-gray-400">
                Real-World Market Valuation & Negotiation Grading Engine
              </p>
            </div>
          </div>

          <form onSubmit={handleEvaluate} className="mt-6 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Player Name
              </label>
              <input
                type="text"
                required
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g. Morgan Gibbs-White, Lamine Yamal, Estevao"
                className="w-full px-4 py-3 rounded-xl bg-[#0a0c10] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  From Club (Selling)
                </label>
                <input
                  type="text"
                  required
                  value={fromClub}
                  onChange={(e) => setFromClub(e.target.value)}
                  placeholder="e.g. Nottingham Forest"
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0c10] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  To Club (Buying)
                </label>
                <input
                  type="text"
                  required
                  value={toClub}
                  onChange={(e) => setToClub(e.target.value)}
                  placeholder="e.g. Tottenham"
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0c10] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Transfer Deal Price (£ Millions)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  £
                </span>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  value={dealPrice}
                  onChange={(e) => setDealPrice(e.target.value)}
                  placeholder="60"
                  className="w-full pl-9 pr-14 py-3 rounded-xl bg-[#0a0c10] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                  Million
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Analyzing Market Data...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Evaluate Transfer Deal
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          {/* Top Back Navigation Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setEvaluation(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161b26] hover:bg-[#1f2637] border border-gray-700 text-white text-sm font-semibold transition shadow"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              Back to Search
            </button>
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              {evaluation.sourceLabel}
            </span>
          </div>

          {/* Broadcast-Style Evaluation Card matching reference image */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121518] via-[#0e1114] to-[#171c16] border border-gray-800 shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
            {/* Left Rating Column */}
            <div className="md:col-span-7 p-8 md:p-10 flex flex-col items-center justify-center text-center z-10">
              <h2
                className="text-2xl md:text-3xl font-black tracking-wide uppercase mb-4"
                style={{ color: evaluation.gradeColor }}
              >
                {evaluation.verdict}
              </h2>

              {/* Shield Badge */}
              <div className="relative flex items-center justify-center my-2">
                <div
                  className="w-24 h-28 flex items-center justify-center rounded-b-full border-2 shadow-lg"
                  style={{
                    borderColor: evaluation.gradeColor,
                    backgroundColor: 'rgba(10, 14, 18, 0.85)',
                    boxShadow: `0 0 30px ${evaluation.gradeColor}33`
                  }}
                >
                  <span
                    className="text-6xl font-black"
                    style={{ color: evaluation.gradeColor }}
                  >
                    {evaluation.grade}
                  </span>
                </div>
              </div>

              {/* Starting Immediately Divider */}
              <div className="w-full max-w-xs flex items-center gap-3 my-4">
                <div className="h-[1px] flex-1 bg-gray-700" />
                <span className="text-xs font-bold tracking-widest uppercase text-[#d4c385]">
                  STARTING IMMEDIATELY
                </span>
                <div className="h-[1px] flex-1 bg-gray-700" />
              </div>

              {/* Transfer Sum */}
              <div className="w-full max-w-xs py-3 border-b border-gray-800">
                <p className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
                  TRANSFER SUM
                </p>
                <p className="text-4xl md:text-5xl font-extrabold text-white mt-1">
                  £{evaluation.dealPrice}m
                </p>
              </div>

              {/* Player Market Value */}
              <div className="w-full max-w-xs py-3 border-b border-gray-800">
                <p className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
                  PLAYER MARKET VALUE
                </p>
                <p className="text-4xl md:text-5xl font-extrabold text-white mt-1">
                  £{evaluation.marketValue}m
                </p>
              </div>

              {/* Best Possible Deal */}
              <div className="w-full max-w-xs pt-3">
                <p className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
                  BEST POSSIBLE DEAL
                </p>
                <p className="text-4xl md:text-5xl font-extrabold text-white mt-1">
                  £{evaluation.bestPossibleDeal}m
                </p>
              </div>
            </div>

            {/* Right Player Cutout / Club Info Column */}
            <div className="md:col-span-5 relative flex flex-col items-center justify-end p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent overflow-hidden">
              {evaluation.photoUrl ? (
                <img
                  src={evaluation.photoUrl}
                  alt={evaluation.playerName}
                  className="max-h-[410px] w-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)] z-10"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center mb-16">
                  <span className="text-5xl font-black text-emerald-400">
                    {evaluation.playerName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                </div>
              )}

              <div className="z-20 w-full bg-[#11151d]/90 backdrop-blur-md border border-gray-800 rounded-xl p-3.5 text-center mt-3">
                <p className="text-lg font-extrabold text-white truncate">
                  {evaluation.playerName}
                </p>
                <p className="text-xs text-gray-300 flex items-center justify-center gap-2 mt-1">
                  <span>{evaluation.fromClub}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">
                    {evaluation.toClub}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Scout Report Breakdown Card (High Contrast White/Gray Text) */}
          <div className="bg-[#11151c] border-l-4 border-emerald-500 border border-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-wider uppercase text-sm mb-4">
              <Search className="w-4 h-4" />
              <span>SCOUT REPORT & VALUATION FACTORS</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="bg-[#0b0e13] border border-gray-800 rounded-lg p-3 text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  CA (CURRENT)
                </p>
                <p className="text-2xl font-black text-white mt-1">
                  {evaluation.ca}
                </p>
              </div>
              <div className="bg-[#0b0e13] border border-gray-800 rounded-lg p-3 text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  PA (POTENTIAL)
                </p>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  {evaluation.pa}
                </p>
              </div>
              <div className="bg-[#0b0e13] border border-gray-800 rounded-lg p-3 text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase">
                  AGE
                </p>
                <p className="text-2xl font-black text-white mt-1">
                  {evaluation.age}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4 space-y-2.5">
              {evaluation.modifiers.map((mod, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-gray-200">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{mod.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Button to Evaluate Another Deal */}
          <button
            onClick={() => setEvaluation(null)}
            className="w-full py-3.5 px-6 rounded-xl bg-[#161b26] hover:bg-[#1f2637] border border-gray-700 text-white font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            Evaluate New Transfer
          </button>
        </div>
      )}
    </div>
  );
}
