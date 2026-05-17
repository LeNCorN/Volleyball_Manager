import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@shared/api/client';
import { Button, Input, Modal, Alert, Table } from '@shared/ui';
import { LoadingSpinner} from '@shared/ui/LoadingSpinner';
import styles from './index.module.css';

// API функции
const fetchReferees = async () => {
    const response = await apiClient.get('/referees');
    return response.data;
};

const createReferee = async (data: { fullName: string; phone?: string; email?: string }) => {
    const response = await apiClient.post('/referees', data);
    return response.data;
};

const deleteReferee = async (id: string) => {
    // DELETE эндпоинт нужно добавить на бэкенде
    const response = await apiClient.delete(`/referees/${id}`);
    return response.data;
};

const AdminRefereesPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newReferee, setNewReferee] = useState({ fullName: '', phone: '', email: '' });
    const [error, setError] = useState<string | null>(null);

    const { data: referees, isLoading } = useQuery({
        queryKey: ['referees'],
        queryFn: fetchReferees,
    });

    const createMutation = useMutation({
        mutationFn: createReferee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['referees'] });
            setIsModalOpen(false);
            setNewReferee({ fullName: '', phone: '', email: '' });
            setError(null);
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Ошибка при создании судьи');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteReferee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['referees'] });
        },
    });

    const handleCreate = () => {
        if (!newReferee.fullName.trim()) {
            setError('ФИО обязательно');
            return;
        }
        createMutation.mutate(newReferee);
    };

    const columns = [
        { key: 'fullName', title: 'ФИО', width: '250px' },
        { key: 'phone', title: 'Телефон', width: '150px' },
        { key: 'email', title: 'Email', width: '200px' },
        {
            key: 'actions',
            title: 'Действия',
            width: '100px',
            render: (item: any) => (
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteMutation.mutate(item.id)}
                    loading={deleteMutation.isPending}
                >
                    🗑️
                </Button>
            )
        },
    ];

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
                <h1 className={styles.title}>Управление судьями</h1>
                <p className={styles.subtitle}>
                    Добавление, редактирование и удаление судей для назначения на матчи
                </p>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    + Добавить судью
                </Button>
            </div>

            <div className={styles.tableWrapper}>
                <Table columns={columns} data={referees || []} />
            </div>

            {/* Модальное окно добавления судьи */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setError(null);
                    setNewReferee({ fullName: '', phone: '', email: '' });
                }}
                title="Добавление судьи"
            >
                <div className={styles.modalContent}>
                    {error && <Alert type="error" message={error} />}

                    <Input
                        label="ФИО *"
                        placeholder="Иванов Иван Иванович"
                        value={newReferee.fullName}
                        onChange={(e) => setNewReferee({ ...newReferee, fullName: e.target.value })}
                        fullWidth
                    />

                    <Input
                        label="Телефон"
                        placeholder="+7 (999) 123-45-67"
                        value={newReferee.phone}
                        onChange={(e) => setNewReferee({ ...newReferee, phone: e.target.value })}
                        fullWidth
                    />

                    <Input
                        label="Email"
                        placeholder="referee@example.com"
                        value={newReferee.email}
                        onChange={(e) => setNewReferee({ ...newReferee, email: e.target.value })}
                        fullWidth
                    />

                    <div className={styles.modalActions}>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Отмена
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreate}
                            loading={createMutation.isPending}
                        >
                            Создать
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminRefereesPage;