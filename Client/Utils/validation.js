export const isValidArray = (data) => Array.isArray(data) && data.length > 0;
export const isValidObject = (data) => data && typeof data === 'object' && !Array.isArray(data);

export const validateAPIResponse = (data, expectedType = 'array') => {
    if (!data) return false;
    
    switch (expectedType) {
        case 'array':
            return isValidArray(data);
        case 'object':
            return isValidObject(data);
        default:
            return false;
    }
}; 