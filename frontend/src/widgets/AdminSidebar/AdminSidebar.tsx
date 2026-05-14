import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/lib/constants/routes';
import { useAuth } from '@app/providers/AuthProvider';
import styles from './AdminSidebar.module.css';

const menuItems = [
    { path: ROUTES.ADMIN_DASHBOARD, icon: '📊', label: 'Dashboard' },
    { path: ROUTES.ADMIN_APPLICATIONS, icon: '📋', label: 'Заявки' },
    { path: ROUTES.ADMIN_WAITING_LIST, icon: '⏳', label: 'Лист ожидания' },
    { path: ROUTES.ADMIN_TOURNAMENT_SETTINGS, icon: '⚙️', label: 'Настройки' },
    { path: ROUTES.ADMIN_SCHEDULE_GENERATOR, icon: '🎲', label: 'Расписание' },
    { path: ROUTES.ADMIN_PLAYERS, icon: '⭐', label: 'Игроки' },
    { path: ROUTES.ADMIN_DOCUMENTS, icon: '📄', label: 'Документы' },
    { path: ROUTES.ADMIN_SEASON, icon: '📅', label: 'Сезоны' },
];

export const AdminSidebar: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate(ROUTES.ADMIN_LOGIN);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span>🏐</span>
                <span>Админ-панель</span>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `${styles.navItem} ${isActive ? styles.active : ''}`
                        }
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <button onClick={handleLogout} className={styles.logoutButton}>
                🚪 Выход
            </button>
        </aside>
    );
};