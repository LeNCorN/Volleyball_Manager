import React, { useState } from 'react';
import { useApplications, useReviewApplication } from '@entities/application';
import { Button, Modal, Input, Badge } from '@shared/ui';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import styles from './index.module.css';

const statusColors: Record<string, string> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
};

const statusLabels: Record<string, string> = {
    pending: 'На рассмотрении',
    approved: 'Одобрена',
    rejected: 'Отклонена',
};

const ApplicationsPage: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState<string>('pending');
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const { data: applications, isLoading, refetch } = useApplications(selectedStatus);
    const reviewMutation = useReviewApplication();

    const handleReview = (status: 'approved' | 'rejected') => {
        if (!selectedApp) return;

        reviewMutation.mutate(
            { id: selectedApp.id, status, rejectionReason: status === 'rejected' ? rejectionReason : undefined },
            {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setSelectedApp(null);
                    setRejectionReason('');
                    refetch();
                },
            }
        );
    };

    const openModal = (app: any) => {
        setSelectedApp(app);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Управление заявками</h1>
                <p className={styles.subtitle}>Просмотр и обработка заявок на участие</p>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${selectedStatus === 'pending' ? styles.active : ''}`}
                    onClick={() => setSelectedStatus('pending')}
                >
                    На рассмотрении
                    {applications?.filter((a: any) => a.status === 'pending').length > 0 && (
                        <span className={styles.badge}>
              {applications?.filter((a: any) => a.status === 'pending').length}
            </span>
                    )}
                </button>
                <button
                    className={`${styles.tab} ${selectedStatus === 'approved' ? styles.active : ''}`}
                    onClick={() => setSelectedStatus('approved')}
                >
                    Одобренные
                </button>
                <button
                    className={`${styles.tab} ${selectedStatus === 'rejected' ? styles.active : ''}`}
                    onClick={() => setSelectedStatus('rejected')}
                >
                    Отклонённые
                </button>
            </div>

            <div className={styles.applicationsList}>
                {applications?.length === 0 ? (
                    <div className={styles.empty}>
                        <p>Нет заявок в этой категории</p>
                    </div>
                ) : (
                    applications?.map((app: any) => (
                        <div key={app.id} className={styles.applicationCard}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.teamName}>{app.teamName}</h3>
                                <Badge variant={statusColors[app.status] as any}>
                                    {statusLabels[app.status]}
                                </Badge>
                            </div>

                            <div className={styles.cardInfo}>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Лига:</span>
                                    <span>{app.division === 'hard' ? 'Хард-лига' : 'Лайт-лига'}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Капитан:</span>
                                    <span>{app.captainName}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Телефон:</span>
                                    <span>{app.captainPhone}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Email:</span>
                                    <span>{app.captainEmail}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Игроков:</span>
                                    <span>{app.players?.length || 0}</span>
                                </div>
                                {app.rejectionReason && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Причина отклонения:</span>
                                        <span className={styles.rejectionReason}>{app.rejectionReason}</span>
                                    </div>
                                )}
                            </div>

                            {app.status === 'pending' && (
                                <div className={styles.cardActions}>
                                    <Button variant="success" size="sm" onClick={() => openModal(app)}>
                                        ✅ Одобрить
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => openModal(app)}>
                                        ❌ Отклонить
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedApp(null);
                    setRejectionReason('');
                }}
                title="Рассмотрение заявки"
            >
                <div className={styles.modalContent}>
                    <p><strong>Команда:</strong> {selectedApp?.teamName}</p>
                    <p><strong>Лига:</strong> {selectedApp?.division === 'hard' ? 'Хард-лига' : 'Лайт-лига'}</p>

                    <div className={styles.modalActions}>
                        <Button variant="success" onClick={() => handleReview('approved')}>
                            ✅ Одобрить
                        </Button>
                        <Button variant="danger" onClick={() => handleReview('rejected')}>
                            ❌ Отклонить
                        </Button>
                    </div>

                    <div className={styles.rejectionSection}>
                        <label className={styles.rejectionLabel}>Причина отклонения (если нужно):</label>
                        <Input
                            placeholder="Введите причину отклонения"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            fullWidth
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ApplicationsPage;