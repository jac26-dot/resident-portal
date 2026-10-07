import logoIcon from './brand-icon.png';
import logoHorizontal from './brand-logo.png';
import logoHorizontalLight from './brand-logo-light.png';

// Change the branding for this deployment here.
const brand = {
  productName: 'BaryoHub',
  appName: 'Barangay Management System',
  organizationName: 'Barangay Sample, Sample City, Philippines',
  shortName: 'Barangay Sample',
  location: 'Sample City, Philippines',
  contact: {
    address: '123 Sample Street, Sample City, Philippines 0000',
    email: 'info@barangay-sample.example',
    hours: 'Monday-Sunday, 24/7',
  },
  logoIcon,
  logoHorizontal,
  logoHorizontalLight,
};

if (typeof document !== 'undefined') {
  document.title = `${brand.shortName} | Resident Portal`;
}

export default brand;
