import React from 'react';
import {
  ShieldCheck,
  Users,
  Sparkles,
  Crosshair,
  Car,
  Coffee,
  Waves,
  Building2,
  UserCheck,
  Wrench,
  Layers,
  LucideProps
} from 'lucide-react';

interface ServiceIconProps extends LucideProps {
  name: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'Users':
      return <Users {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Crosshair':
      return <Crosshair {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'Coffee':
      return <Coffee {...props} />;
    case 'Waves':
      return <Waves {...props} />;
    case 'Building2':
      return <Building2 {...props} />;
    case 'UserCheck':
      return <UserCheck {...props} />;
    case 'Wrench':
      return <Wrench {...props} />;
    case 'Layers':
    default:
      return <Layers {...props} />;
  }
};
