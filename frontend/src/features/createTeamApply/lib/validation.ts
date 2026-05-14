export const validateTeamName = (name: string): string | undefined => {
    if (!name) return 'Название команды обязательно';
    if (name.length < 3) return 'Название должно содержать минимум 3 символа';
    if (name.length > 50) return 'Название не должно превышать 50 символов';
    return undefined;
};

export const validatePhone = (phone: string): string | undefined => {
    if (!phone) return 'Телефон обязателен';
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!phoneRegex.test(phone)) return 'Введите корректный номер телефона';
    return undefined;
};

export const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email обязателен';
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(email)) return 'Введите корректный email';
    return undefined;
};

export const validatePlayerFullName = (name: string): string | undefined => {
    if (!name) return 'ФИО обязательно';
    if (name.length < 3) return 'ФИО должно содержать минимум 3 символа';
    return undefined;
};

export const validateHeight = (height: number): string | undefined => {
    if (!height) return 'Рост обязателен';
    if (height < 100) return 'Рост должен быть не менее 100 см';
    if (height > 250) return 'Рост не должен превышать 250 см';
    return undefined;
};

export const validateBirthDate = (date: string): string | undefined => {
    if (!date) return 'Дата рождения обязательна';
    const birthDate = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 14) return 'Возраст должен быть не менее 14 лет';
    if (age > 70) return 'Возраст не должен превышать 70 лет';
    return undefined;
};