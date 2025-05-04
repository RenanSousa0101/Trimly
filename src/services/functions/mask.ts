export function removeMask(text: string | null | undefined): string {
    if (!text) {
      return '';
    }
    return text.replace(/\D/g, '');
}