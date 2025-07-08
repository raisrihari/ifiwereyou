// client/src/components/LeftMenu.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home, Flame, Star, Sparkles, MessageSquare, BookOpen,
    BrainCircuit, PenSquare, Lightbulb, HelpCircle, Zap
} from 'lucide-react';
import './LeftMenu.css';

const LeftMenu = () => {
    const mainNav = [
        { name: 'Home', path: '/' },
        { name: 'Trending', path: '/trending' },
        { name: 'Top', path: '/top' },
        { name: 'New', path: '/new' },
    ];

    const worlds = {
        core: [
            { name: 'I Need Advice', slug: 'I Need Advice' },
            { name: 'It\'s My Opinion', slug: 'It\'s My Opinion' },
        ],
        hypothetical: [
            { name: 'Hypothetical', slug: 'Hypothetical' },
            { name: 'Fiction', slug: 'Fiction' },
            { name: 'Imaginary', slug: 'Imaginary' },
            { name: 'Change My Mind', slug: 'Change My Mind' },
        ],
        engine: [
            { name: 'Dream Machine', slug: 'Dream Machine' },
            { name: 'Writer\'s Block', slug: 'Writer\'s Block' },
            { name: 'Why Do You Think?', slug: 'Why Do You Think?' },
        ]
    };

    const iconMap = {
        'Home': <Home size={18} />, 'Trending': <Flame size={18} />, 'Top': <Star size={18} />, 'New': <Sparkles size={18} />,
        'I Need Advice': <MessageSquare size={16} />, 'It\'s My Opinion': <BookOpen size={16} />,
        'Hypothetical': <BrainCircuit size={16} />, 'Fiction': <PenSquare size={16} />, 'Imaginary': <Lightbulb size={16} />,
        'Change My Mind': <HelpCircle size={16} />, 'Dream Machine': <Zap size={16} />, 'Writer\'s Block': <PenSquare size={16} />,
        'Why Do You Think?': <HelpCircle size={16} />
    };

    return (
        <aside className="left-menu-container">
            <nav className="menu-section">
                <ul>
                    {mainNav.map(item => (
                        <li key={item.name}><NavLink to={item.path} className="menu-item main-nav-item" end={item.path === '/'} >{iconMap[item.name]}<span>{item.name}</span></NavLink></li>
                    ))}
                </ul>
            </nav>
            <div className="menu-divider"></div>
            <nav className="menu-section">
                <h3 className="menu-section-title">ifiwereyou - the core</h3>
                <ul>
                    {worlds.core.map(item => (
                        <li key={item.name}><NavLink to={`/category/${encodeURIComponent(item.slug)}`} className="menu-item sub-nav-item">{iconMap[item.name]}<span>{item.name}</span></NavLink></li>
                    ))}
                </ul>
            </nav>
            <div className="menu-divider"></div>
            <nav className="menu-section">
                <h3 className="menu-section-title">Hypothetical</h3>
                <ul>
                    {worlds.hypothetical.map(item => (
                        <li key={item.name}><NavLink to={`/category/${encodeURIComponent(item.slug)}`} className="menu-item sub-nav-item">{iconMap[item.name]}<span>{item.name}</span></NavLink></li>
                    ))}
                </ul>
            </nav>
            <div className="menu-divider"></div>
            <nav className="menu-section">
                <h3 className="menu-section-title">The Engine Room</h3>
                <ul>
                    {worlds.engine.map(item => (
                        <li key={item.name}><NavLink to={`/category/${encodeURIComponent(item.slug)}`} className="menu-item sub-nav-item">{iconMap[item.name]}<span>{item.name}</span></NavLink></li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default LeftMenu;