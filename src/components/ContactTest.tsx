'use client';

import React from 'react';
import ContactSection from './ContactSection';
import { LanguageProvider } from '@/contexts/LanguageContext';

const ContactTest: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <LanguageProvider>
        <ContactSection />
      </LanguageProvider>
    </div>
  );
};

export default ContactTest;