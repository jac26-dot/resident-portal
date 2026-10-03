import logoIcon from './brand-icon.png';
import logoHorizontal from './brand-logo.png';
import logoHorizontalLight from './brand-logo-light.png';

// Change the branding for this deployment here.
const brand = {
  productName: 'BaryoHub',
  appName: 'Barangay Management System',
  organizationName: 'Barangay Malate, Manila, District V, City of Manila',
  shortName: 'Barangay Malate',
  location: 'Malate, Manila, District V, City of Manila',
  contact: {
    address: '1858 L. M. Guerrero St., Manila, Philippines, 1004',
    email: 'pb.brgy697@gmail.com',
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
