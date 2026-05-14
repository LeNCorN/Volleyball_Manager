import React, { useState } from 'react';
import { useDocuments, documentApi } from '@entities/document';
import { DocumentUpload } from '@features/uploadDocument/ui/DocumentUpload';
import { Button, Modal, Alert, Badge } from '@shared/ui';
import { LoadingSpinner } from '@widgets/LoadingSpinner/LoadingSpinner';
import { DOCUMENT_CATEGORY_LABELS } from '@shared/lib/constants/documentCategories';
import styles from './index.module.css';

const AdminDocumentsPage: React.FC = () => {
    const { data: documents, isLoading, refetch } = useDocuments();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!selectedDoc) return;

        setIsDeleting(true);
        setError(null);

        try {
            await documentApi.delete(selectedDoc.id);
            setDeleteModalOpen(false);
            setSelectedDoc(null);
            refetch();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при удалении документа');
        } finally {
            setIsDeleting(false);
        }
    };

    const openDeleteModal = (doc: any) => {
        setSelectedDoc(doc);
        setDeleteModalOpen(true);
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
                <h1 className={styles.title}>Управление документами</h1>
                <p className={styles.subtitle}>
                    Загрузка и удаление PDF-документов (регламенты, правила)
                </p>
            </div>

            <DocumentUpload />

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Список документов</h2>

                {documents?.length === 0 ? (
                    <div className={styles.empty}>
                        <p>Нет загруженных документов</p>
                    </div>
                ) : (
                    <div className={styles.documentsList}>
                        <div className={styles.listHeader}>
                            <span>Название</span>
                            <span>Категория</span>
                            <span>Размер</span>
                            <span>Скачиваний</span>
                            <span>Дата</span>
                            <span></span>
                        </div>
                        {documents?.map((doc: any) => (
                            <div key={doc.id} className={styles.documentRow}>
                                <span className={styles.docTitle}>{doc.title}</span>
                                <span>
                  <Badge variant="info" size="sm">
                    {DOCUMENT_CATEGORY_LABELS[doc.category] || doc.category}
                  </Badge>
                </span>
                                <span>{doc.fileSize} KB</span>
                                <span>{doc.downloadCount}</span>
                                <span>{new Date(doc.createdAt).toLocaleDateString('ru-RU')}</span>
                                <span>
                  <button
                      className={styles.deleteBtn}
                      onClick={() => openDeleteModal(doc)}
                  >
                    🗑️
                  </button>
                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedDoc(null);
                    setError(null);
                }}
                title="Удаление документа"
            >
                <div className={styles.modalContent}>
                    <p>Вы уверены, что хотите удалить документ <strong>{selectedDoc?.title}</strong>?</p>
                    <p className={styles.warning}>Это действие необратимо.</p>

                    {error && <Alert type="error" message={error} />}

                    <div className={styles.modalActions}>
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Отмена
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            loading={isDeleting}
                        >
                            Удалить
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDocumentsPage;