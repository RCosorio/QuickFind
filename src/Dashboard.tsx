import React, { useState, useEffect, useRef } from 'react';
import { FaStore, FaUtensils, FaHome, FaSearch, FaUser, FaSignOutAlt, FaCog, FaCamera, FaKey, FaAngleDown, FaArrowLeft, FaTrash, FaComment } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useNavigate, Link } from 'react-router-dom';
import { Business, BusinessType } from '../types/auth';
import BusinessCard from '../components/dashboard/BusinessCard';
import BusinessDetails from '../components/dashboard/BusinessDetails';
import { mockBusinesses } from '../data/mockData';

// ... existing code ... 