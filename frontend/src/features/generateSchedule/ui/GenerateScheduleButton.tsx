// frontend/src/features/generateSchedule/ui/GenerateScheduleButton.tsx

import React, { useState } from 'react';
import { Button, Modal, Alert } from '@shared/ui';
import { useGenerateSchedule, useClearSchedule } from '../model/useGenerateSchedule';
import styles from './GenerateScheduleButton.module.css';

export const GenerateScheduleButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [overwrite, setOverwrite] = useState(false);
    const generateMutation = useGenerateSchedule();
    const clearMutation = useClearSchedule();

    const handleGenerate = () => {
        // Передаём объект с параметром overwrite, а не null
        generateMutation.mutate({ overwrite });
        setIsModalOpen(false);
    };

    const handleClear = () => {
        if (window.confirm('Вы уверены, что хотите очистить всё расписание?')) {
            clearMutation.mutate();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttons}>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    🎲 Сгенерировать расписание
                </Button>
                <Button variant="outline" onClick={handleClear}>
                    🗑️ Очистить расписание
                </Button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Генерация расписания"
            >
                <div className={styles.modalContent}>
                    <p>Будет сгенерировано расписание на основе текущих групп и настроек турнира.</p>

                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            checked={overwrite}
                            onChange={(e) => setOverwrite(e.target.checked)}
                        />
                        Перезаписать существующее расписание
                    </label>

                    {generateMutation.isError && (
                        <Alert type="error" message={generateMutation.error?.message || 'Ошибка при генерации расписания'} />
                    )}

                    <div className={styles.modalButtons}>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Отмена
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleGenerate}
                            loading={generateMutation.isPending}
                        >
                            Сгенерировать
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};