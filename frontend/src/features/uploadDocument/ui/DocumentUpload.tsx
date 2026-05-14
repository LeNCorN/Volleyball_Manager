import React, { useState } from 'react';
import { Button, Input, Select, Alert } from '@shared/ui';
import { DOCUMENT_CATEGORIES, DOCUMENT_CATEGORY_LABELS } from '@shared/lib/constants/documentCategories';
import { useUploadDocument } from '../model/useUploadDocument';
import styles from './DocumentUpload.module.css';

export const DocumentUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('regulations');
    const [error, setError] = useState<string | null>(null);

    const uploadMutation = useUploadDocument();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setError('Допустимы только PDF файлы');
                setFile(null);
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('Максимальный размер файла 10 MB');
                setFile(null);
                return;
            }
            setError(null);
            setFile(selectedFile);
        }
    };

    const handleSubmit = () => {
        if (!file) {
            setError('Выберите файл');
            return;
        }
        if (!title) {
            setError('Введите название документа');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);

        uploadMutation.mutate(formData, {
            onSuccess: () => {
                setFile(null);
                setTitle('');
                setDescription('');
                setCategory('regulations');
            },
        });
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Загрузить документ</h3>

            {error && <Alert type="error" message={error} />}
            {uploadMutation.isError && (
                <Alert type="error" message="Ошибка при загрузке документа" />
            )}
            {uploadMutation.isSuccess && (
                <Alert type="success" message="Документ успешно загружен" />
            )}

            <div className={styles.form}>
                <Input
                    label="Название документа"
                    placeholder="Введите название"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                />

                <Input
                    label="Описание (опционально)"
                    placeholder="Введите описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                />

                <Select
                    label="Категория"
                    options={DOCUMENT_CATEGORIES.map(c => ({ value: c.value, label: DOCUMENT_CATEGORY_LABELS[c.value] }))}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    fullWidth
                />

                <div className={styles.fileInput}>
                    <label className={styles.fileLabel}>
                        📄 Выберите PDF файл
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className={styles.fileInputHidden}
                        />
                    </label>
                    {file && <span className={styles.fileName}>{file.name}</span>}
                </div>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    loading={uploadMutation.isPending}
                    fullWidth
                >
                    Загрузить документ
                </Button>
            </div>
        </div>
    );
};