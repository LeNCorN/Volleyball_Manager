import React from 'react';
import { Card, Button } from '@shared/ui';
import { DocumentCategoryBadge } from './DocumentCategoryBadge';
import { formatFileSize } from '../lib/formatFileSize';
import styles from './DocumentCard.module.css';

interface DocumentCardProps {
    id: string;
    title: string;
    description?: string;
    category: string;
    fileSize: number;
    downloadCount: number;
    createdAt: string;
    onDownload: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
                                                              title,
                                                              description,
                                                              category,
                                                              fileSize,
                                                              downloadCount,
                                                              createdAt,
                                                              onDownload,
                                                          }) => {
    return (
        <Card className={styles.card}>
            <div className={styles.icon}>📄</div>
            <div className={styles.content}>
                <h4 className={styles.title}>{title}</h4>
                {description && <p className={styles.description}>{description}</p>}
                <div className={styles.meta}>
                    <DocumentCategoryBadge category={category} />
                    <span className={styles.metaItem}>{formatFileSize(fileSize)}</span>
                    <span className={styles.metaItem}>📥 {downloadCount}</span>
                    <span className={styles.metaItem}>
            {new Date(createdAt).toLocaleDateString('ru-RU')}
          </span>
                </div>
            </div>
            <Button variant="outline" size="sm" onClick={onDownload}>
                Скачать
            </Button>
        </Card>
    );
};