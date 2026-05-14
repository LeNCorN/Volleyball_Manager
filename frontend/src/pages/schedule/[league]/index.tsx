import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { ScheduleTable } from '@widgets/ScheduleTable/ScheduleTable';
import styles from './index.module.css';

const fetchSchedule = async (division: string) => {
    const response = await apiClient.get('/schedule', { params: { division } });
    return response.data;
};

const ScheduleLeaguePage: React.FC = () => {
    const { league } = useParams<{ league: string }>();
    const division = league || 'light';

    const { data: matches, isLoading } = useQuery({
        queryKey: ['schedule', division],
        queryFn: () => fetchSchedule(division),
    });

    return (
        <div className={styles.container}>
            <ScheduleTable matches={matches || []} loading={isLoading} />
        </div>
    );
};

export default ScheduleLeaguePage;