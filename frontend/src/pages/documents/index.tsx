import React from 'react';
import { Link } from 'react-router-dom';
import { useDocuments, DocumentCard } from '@entities/document';
import { documentApi } from '@entities/document';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import { ROUTES } from '@shared/lib/constants/routes';
import { Button } from '@shared/ui';
import styles from './index.module.css';

const DocumentsPage: React.FC = () => {
    const { data: documents, isLoading } = useDocuments();

    const handleDownload = async (id: string, title: string) => {
        try {
            const response = await documentApi.download(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Ошибка при скачивании:', error);
        }
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
            {/* Кнопка "На главную" */}
            <div className={styles.homeButton}>
                <Link to={ROUTES.HOME}>
                    <Button variant="outline" size="sm">
                        ← На главную
                    </Button>
                </Link>
            </div>

            {/* Заголовок как на главной */}
            <div className={styles.header}>
                <h1 className={styles.title}>Документы</h1>
                <p className={styles.subtitle}>
                    Регламенты, правила и другие официальные документы
                </p>
            </div>

            <div className={styles.documentsGrid}>
                {documents?.map((doc: any) => (
                    <DocumentCard
                        key={doc.id}
                        id={doc.id}
                        title={doc.title}
                        description={doc.description}
                        category={doc.category}
                        fileSize={doc.fileSize}
                        downloadCount={doc.downloadCount}
                        createdAt={doc.createdAt}
                        onDownload={() => handleDownload(doc.id, doc.title)}
                    />
                ))}
            </div>

            {!documents?.length && (
                <div className={styles.empty}>
                    <p>Документы отсутствуют</p>
                </div>
            )}
        </div>
    );
};

export default DocumentsPage;