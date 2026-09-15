export const formatRupiah = (value) => {
    if (value === null || value === undefined) return 'Rp 0';
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
};

export const parseNumber = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
};