
import React, { useState, useEffect } from 'react';
import { retroAuth, fetchUserCollection } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import Button from './Button';
import { useNavigate, Link } from 'react-router-dom';
import AvatarSelector from './AvatarSelector';
import { RETRO_AVATARS } from '../utils/avatars';
import { UserCollectionItem } from '../types';
import SEOHead from './SEOHead';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'RECOVERY' | 'UPDATE_PASSWORD' | 'PROFILE';

const AuthSection: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    
    // Auth State
    const [email, setEmail] = useState('');
