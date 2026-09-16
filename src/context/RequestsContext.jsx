import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const RequestsContext = createContext(null);

const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    hospital: 'City Hospital, Andheri',
    area: 'Andheri',
    group: 'O−',
    units: 2,
    component: 'Whole blood',
    urgency: 'Critical',
    postedMinAgo: 6,
    note: 'Trauma case, surgery scheduled.',
    eligibleDonorsNearby: 7,
    nearestStock: { label: 'Sanjeevani', distanceKm: 4.1 },
    etaMin: 18,
    donorsNotified: 7,
    autoEscalateAtMin: 10,
  },
  {
    id: 'req-2',
    hospital: 'Sanjeevani Blood Bank, Thane',
    area: 'Thane',
    group: 'B+',
    units: 1,
    component: 'Whole blood',
    urgency: 'Medium',
    postedMinAgo: 22,
    note: 'Scheduled transfusion, non-critical.',
    eligibleDonorsNearby: 4,
    nearestStock: { label: 'City Hospital', distanceKm: 3.2 },
    etaMin: 25,
    donorsNotified: 3,
    autoEscalateAtMin: null,
  },
  {
    id: 'req-3',
    hospital: 'Apex Care Hospital, Vashi',
    area: 'Vashi',
    group: 'AB−',
    units: 1,
    component: 'Plasma',
    urgency: 'Medium',
    postedMinAgo: 40,
    note: 'Post-surgical recovery support.',
    eligibleDonorsNearby: 2,
    nearestStock: { label: 'Apex Care', distanceKm: 0, onSite: true },
    etaMin: 12,
    donorsNotified: 2,
    autoEscalateAtMin: null,
  },
];

const INITIAL_DONORS = {
  'req-1': [
    { id: 'd1', name: 'A. Kulkarni', distanceKm: 1.2, lastDonatedAgo: '4mo ago', eligible: true },
    { id: 'd2', name: 'M. Shaikh', distanceKm: 2.3, lastDonatedAgo: '5mo ago', eligible: true },
    { id: 'd3', name: 'R. Patil', distanceKm: 1.8, lastDonatedAgo: '3wks ago', eligible: false },
    { id: 'd4', name: 'D. Nair', distanceKm: 3.6, lastDonatedAgo: '7mo ago', eligible: true },
  ],
  'req-2': [
    { id: 'd5', name: 'S. Iyer', distanceKm: 2.8, lastDonatedAgo: '6mo ago', eligible: true },
    { id: 'd6', name: 'K. Verma', distanceKm: 4.1, lastDonatedAgo: '2mo ago', eligible: false },
  ],
  'req-3': [
    { id: 'd7', name: 'P. Joshi', distanceKm: 0.9, lastDonatedAgo: '8mo ago', eligible: true },
  ],
};

const INITIAL_BLOOD_BANKS = [
  {
    id: 'bank-1',
    name: 'City Hospital Blood Bank',
    distanceKm: 1.8,
    area: 'Andheri West',
    updatedMinAgo: 3,
    stock: { 'A+': 82, 'B+': 48, 'O−': 11, 'AB+': 70 },
    linkedRequestId: 'req-1',
  },
  {
    id: 'bank-2',
    name: 'Sanjeevani Blood Bank',
    distanceKm: 4.1,
    area: 'Vile Parle',
    updatedMinAgo: 5,
    stock: { 'A+': 65, 'B+': 74, 'O−': 41, 'AB+': 16 },
    linkedRequestId: 'req-2',
  },
  {
    id: 'bank-3',
    name: 'Apex Care Hospital',
    distanceKm: 6.3,
    area: 'Vashi',
    updatedMinAgo: 2,
    stock: { 'A+': 88, 'B+': 60, 'O−': 38, 'AB+': 55 },
    linkedRequestId: 'req-3',
  },
];

const FORECAST_ZONE = {
  name: 'Andheri – Vile Parle zone',
  groups: [
    { group: 'A+', pct: 82, risk: 'stable' },
    { group: 'B+', pct: 55, risk: 'moderate' },
    { group: 'O−', pct: 14, risk: 'high' },
    { group: 'AB+', pct: 70, risk: 'stable' },
    { group: 'B−', pct: 46, risk: 'moderate' },
    { group: 'AB−', pct: 60, risk: 'stable' },
  ],
  recommendedActions: [
    'Schedule O− donation drive in Andheri zone within 3 days',
    'Notify Rotary/college camp partners within a 10 km radius',
    'Pre-alert Sanjeevani Blood Bank of expected B− dip next week',
  ],
};

export function riskForPct(pct) {
  if (pct < 20) return 'high';
  if (pct <= 55) return 'moderate';
  return 'stable';
}

export function RequestsProvider({ children }) {
  const [requests] = useState(INITIAL_REQUESTS);
  const [donorsByRequest, setDonorsByRequest] = useState(INITIAL_DONORS);
  const [bloodBanks] = useState(INITIAL_BLOOD_BANKS);
  const [forecastZone] = useState(FORECAST_ZONE);

  const [activeRequestId, setActiveRequestId] = useState('req-1');
  const [escalated, setEscalated] = useState({});
  const [responseLog, setResponseLog] = useState([]);
  const [donorResponses, setDonorResponses] = useState({});

  const escalateRequest = useCallback((id) => {
    setEscalated((prev) => ({ ...prev, [id]: true }));
  }, []);

  const isEscalated = useCallback((id) => Boolean(escalated[id]), [escalated]);

  const logResponse = useCallback((entry) => {
    setResponseLog((prev) => [
      { id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, time: new Date(), ...entry },
      ...prev,
    ]);
  }, []);

  const respondAsDonor = useCallback(
    (requestId, donorId, status) => {
      setDonorResponses((prev) => ({ ...prev, [`${requestId}|${donorId}`]: status }));
    },
    [],
  );

  const getDonorResponse = useCallback(
    (requestId, donorId) => donorResponses[`${requestId}|${donorId}`] || null,
    [donorResponses],
  );

  const getRequestById = useCallback((id) => requests.find((r) => r.id === id), [requests]);
  const getDonorsForRequest = useCallback((id) => donorsByRequest[id] || [], [donorsByRequest]);

  const value = useMemo(
    () => ({
      requests,
      bloodBanks,
      forecastZone,
      activeRequestId,
      setActiveRequestId,
      getRequestById,
      getDonorsForRequest,
      escalateRequest,
      isEscalated,
      responseLog,
      logResponse,
      respondAsDonor,
      getDonorResponse,
    }),
    [
      requests,
      bloodBanks,
      forecastZone,
      activeRequestId,
      getRequestById,
      getDonorsForRequest,
      escalateRequest,
      isEscalated,
      responseLog,
      logResponse,
      respondAsDonor,
      getDonorResponse,
    ],
  );

  return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>;
}

export function useRequests() {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error('useRequests must be used within RequestsProvider');
  return ctx;
}
