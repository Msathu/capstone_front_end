export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

export const getUserId = () => {
    return localStorage.getItem('userId');
};


export const login = (accessToken, userId) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userId', userId);
};

export const removeUserData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
};

