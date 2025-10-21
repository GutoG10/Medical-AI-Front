export function getHeaderToken(): string {
  return `Bearer ${localStorage.getItem('authToken')}`;
}
