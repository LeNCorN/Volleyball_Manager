import React from 'react';
import { Link } from 'react-router-dom';
import { ApplyForm } from '@features/createTeamApply/ui/ApplyForm';
import { ROUTES } from '@shared/lib/constants/routes';
import { Button } from '@shared/ui';
import styles from './index.module.css';

const ApplyPage: React.FC = () => {
    return (
        <div className={styles.container}>
            {/* Кнопка "На главную" */}
            <div className={styles.homeButton}>
                <Link to={ROUTES.HOME}>
                    <Button variant="outline" size="sm">
                        ← На главную
                    </Button>
                </Link>
            </div>

            <ApplyForm />
        </div>
    );
};

export default ApplyPage;