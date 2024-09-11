// components/OTPVerificationTemplate.tsx
'use client'
import { Html, Head, Preview, Body, Container, Heading, Text } from '@react-email/components';
import React from 'react';

interface OTPVerificationTemplateProps {
  username: string;
  otp: string;
} 

const VerificationEmail: React.FC<OTPVerificationTemplateProps> = ({ username, otp }) => {
  return (
    <Html>
      <Head />
      <Preview>Your OTP Code</Preview>
      <Body style={{ backgroundColor: '#f6f6f6', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ padding: '20px', backgroundColor: '#ffffff', maxWidth: '600px', margin: '0 auto' }}>
          <Heading style={{ color: '#333333', textAlign: 'center' }}>OTP Verification</Heading>
          <Text>Hi {username},</Text>
          <Text>Please use the following One-Time Password (OTP) to verify your email address:</Text>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', backgroundColor: '#f1f1f1', padding: '10px', textAlign: 'center', letterSpacing: '4px' }}>{otp}</Text>
          <Text>This OTP is valid for the next 60 minutes.</Text>
          <Text>If you did not request this, please ignore this email.</Text>
          <Text>Best regards,<br />Your Company Name</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;
