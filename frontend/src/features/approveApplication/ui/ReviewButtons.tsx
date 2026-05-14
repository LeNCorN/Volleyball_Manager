import React, { useState } from 'react';
import { Button, Modal, Input } from '@shared/ui';
import { useReviewApplication } from '../model/useReviewApplication';
import styles from './ReviewButtons.module.css';

interface ReviewButtonsProps {
    applicationId: string;
    onComplete?: () => void;
}

export const ReviewButtons: React.FC<ReviewButtonsProps> = ({ applicationId, onComplete }) => {
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const reviewMutation = useReviewApplication();

    const handleApprove = () => {
        reviewMutation.mutate(
            { id: applicationId, data: { status: 'approved' } },
            { onSuccess: () => onComplete?.() }
        );
    };

    const handleReject = () => {
        reviewMutation.mutate(
            { id: applicationId, data: { status: 'rejected', rejectionReason } },
            { onSuccess: () => {
                    setIsRejectModalOpen(false);
                    onComplete?.();
                }}
        );
    };

    return (
        <div className={styles.buttons}>
            <Button
                variant="success"
                size="sm"
                onClick={handleApprove}
                loading={reviewMutation.isPending}
            >
                ✅ Одобрить
            </Button>
            <Button
                variant="danger"
                size="sm"
                onClick={() => setIsRejectModalOpen(true)}
                loading={reviewMutation.isPending}
            >
                ❌ Отклонить
            </Button>

            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                title="Отклонение заявки"
            >
                <div className={styles.modalContent}>
                    <p>Укажите причину отклонения:</p>
                    <Input
                        placeholder="Причина отклонения"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        fullWidth
                    />
                    <div className={styles.modalButtons}>
                        <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
                            Отмена
                        </Button>
                        <Button variant="danger" onClick={handleReject}>
                            Отклонить
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};