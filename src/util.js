export const camelCaseToUnderscore = (value) => value.replace(/([A-Z])/g, (p1) => '_' + p1).toLowerCase();

export const camelCaseToUpperUnderscore = (value) => value.replace(/([A-Z])/g, (p1) => '_' + p1).toUpperCase();

export const underscoreToCamelCase = (value) => value.replace(/_([a-z])/g, (p1) => p1.toUpperCase());

export const upperUnderscoreToCamelCase = (value) => value.toLowerCase().replace(/_([a-z])/g, (p1) => p1.toUpperCase());
