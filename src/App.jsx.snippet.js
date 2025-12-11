const handleUpdateBrandProfile = (id, field, value) => {
    setBrandingProfiles(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
};
