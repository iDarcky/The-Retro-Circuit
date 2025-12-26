// Format enum values to human-readable strings
export const formatTech = (val?: string | null) => {
    if (!val || val === 'unknown') return 'Unknown';
    switch (val) {
        case 'membrane': return 'Rubber Membrane';
        case 'microswitch': return 'Microswitch';
        case 'mechanical': return 'Mechanical';
        case 'hall': return 'Hall Effect';
        case 'potentiometer': return 'ALPS / Potentiometer';
        case 'spring': return 'Spring-loaded';
        case 'optical': return 'Optical';
        default: return val.charAt(0).toUpperCase() + val.slice(1);
    }
};

export const formatLayout = (val?: string | null) => {
    if (!val || val === 'unknown') return 'Unknown';
    return val.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export const formatShape = (val?: string | null) => {
    if (!val || val === 'unknown') return 'Unknown';
    return val.charAt(0).toUpperCase() + val.slice(1);
};
