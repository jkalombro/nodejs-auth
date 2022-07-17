export const success = (res, data) => {
    return res.status(200).json(data);
};

export const error500 = (res, message) => {
    console.log({ error: message });
    return res.status(500).json({ message: 'Something went wrong.' });
};

export const invalid = (res, message) => {
    return res.status(400).json({ message });
};

export const unauthorized = (res) => {
    return res.status(401).json({ message: 'Unauthorized access. Please Log-in.' });
};

export const notFound = (res, message) => {
    Promise.resolve;
    return res.status(404).json({ message });
};

export default { success, error500, invalid, unauthorized, notFound };
