import React from 'react';

const HOTLINES = [
  {
    category: 'Police',
    items: [
      { name: 'Manila Police District', numbers: ['(02) 8523-8378', '(02) 8524-5984'] },
      { name: 'Ermita Police Station', numbers: ['09985987902'] },
      { name: 'Remedios Police Community Precinct', numbers: ['09293784775'] },
    ],
  },
  {
    category: 'Fire',
    items: [
      { name: 'Bureau of Fire Protection', numbers: ['(02) 8426-0219', '(02) 8426-0246'] },
      { name: 'Intramuros Fire Station', numbers: ['09569586301'] },
    ],
  },
  {
    category: 'Social Welfare',
    items: [
      { name: 'DSWD', numbers: ['(02) 8856-3665', '(02) 8852-8081'] },
      { name: 'Manila Department of Social Welfare', numbers: ['(02) 8527-4916'] },
      { name: 'Philippine Red Cross', numbers: ['143', '(02) 8527-5981'] },
    ],
  },
  {
    category: 'Hospitals',
    items: [
      { name: 'Philippine General Hospital', numbers: ['(02) 8554-8400', '(02) 8523-7123'] },
      { name: 'Ospital ng Maynila', numbers: ['(02) 8516-6790', '(02) 8524-6061'] },
      { name: "Manila Doctor's Hospital", numbers: ['(02) 8523-8131'] },
    ],
  },
  {
    category: 'Disaster Response',
    items: [
      { name: 'NDRRMC', numbers: ['(02) 8911-1406', '(02) 8912-2665', '(02) 8911-5061'] },
      { name: 'MDRRMO MDEOC', numbers: ['09507003710', '09326622322', '(02) 8463-3295'] },
    ],
  },
];

const Hotlines = () => {
  return (
    <div className="section">
      <div className="form-header" style={{ padding: 0, marginBottom: 32 }}>
        <h2>Emergency Hotlines</h2>
        <p>Save these numbers for police, fire, medical, and disaster response assistance.</p>
      </div>

      <div className="hotline-national">
        <div className="hotline-national-label">National Emergency Hotline</div>
        <div className="hotline-national-number">911</div>
      </div>

      <div className="hotline-groups">
        {HOTLINES.map((group) => (
          <div className="hotline-group" key={group.category}>
            <h3 className="hotline-group-title">{group.category}</h3>
            {group.items.map((item) => (
              <div className="hotline-item" key={item.name}>
                <div className="hotline-name">{item.name}</div>
                <div className="hotline-numbers">
                  {item.numbers.map((n) => (
                    <a href={`tel:${n.replace(/[^\d+]/g, '')}`} className="hotline-number" key={n}>{n}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="hotline-footer-note">Barangay 697 Zone 76, District 5</div>
    </div>
  );
};

export default Hotlines;
