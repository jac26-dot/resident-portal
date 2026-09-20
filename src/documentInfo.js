export const DOC_INFO = {
  'Barangay Clearance': {
    desc: 'General-purpose clearance certifying you have no derogatory record with the barangay.',
    requirements: ['Valid government-issued ID', 'Proof of residency (utility bill or lease, if requested)'],
    processing: '1–2 working days',
  },
  'Certificate of Residency': {
    desc: 'Certifies that you are a resident of this barangay — commonly required for school, work, or government transactions.',
    requirements: ['Valid government-issued ID'],
    processing: '1–2 working days',
  },
  'Certificate of Indigency': {
    desc: 'For residents seeking free medical, legal, or educational assistance based on financial need.',
    requirements: ['Valid government-issued ID', 'Proof of income status, if available'],
    processing: '1–2 working days',
  },
  'Business Clearance': {
    desc: 'Required for registering or renewing a business permit within the barangay.',
    requirements: ['Valid government-issued ID', 'DTI/SEC registration (for new businesses)', 'Previous business permit (for renewals)'],
    processing: '2–3 working days',
  },
  'Good Moral Certificate': {
    desc: 'Certifies good moral standing — commonly required for school, employment, or other applications.',
    requirements: ['Valid government-issued ID'],
    processing: '1–2 working days',
  },
};

export const DOCUMENT_TYPES = Object.keys(DOC_INFO);
