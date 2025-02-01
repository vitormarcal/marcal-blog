
export const formatDate = (dateString: string): string | undefined => {
    if (!dateString) return undefined
    return new Date(dateString ).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
