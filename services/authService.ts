
import { User } from '../App';

interface ResetToken {
  email: string;
  token: string;
  expires: number;
}

const TOKEN_KEY = 'riseup_reset_tokens';

/**
 * Hardcoded admin credentials for the prototype.
 */
const ADMIN_CREDENTIALS = {
  email: 'admin@riseupzim.com',
  password: 'admin123'
};

export const verifyAdmin = (email: string): boolean => {
  return email.toLowerCase() === ADMIN_CREDENTIALS.email;
};

export const requestPasswordReset = async (email: string): Promise<{ message: string; exists: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network lag
  const normalizedEmail = email.trim().toLowerCase();
  const users: User[] = JSON.parse(localStorage.getItem('registered_users') || '[]');
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (user) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minute expiry
    
    let tokens: ResetToken[] = JSON.parse(localStorage.getItem(TOKEN_KEY) || '[]');
    tokens = tokens.filter(t => t.email !== normalizedEmail);
    tokens.push({ email: normalizedEmail, token, expires });
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    
    console.info(`[AUTH] OTP: ${token} for ${normalizedEmail}`);
    return { message: "Security code sent. Please check your inbox.", exists: true };
  }
  
  // Return same message even if email doesn't exist for security
  return { message: "Security code sent. Please check your inbox.", exists: false };
};

export const validateResetToken = async (email: string, token: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const normalizedEmail = email.trim().toLowerCase();
  const tokens: ResetToken[] = JSON.parse(localStorage.getItem(TOKEN_KEY) || '[]');
  const record = tokens.find(t => t.email === normalizedEmail && t.token === token);
  
  if (!record || Date.now() > record.expires) return false;
  return true;
};

export const getActiveTokenForDemo = (email: string): string | null => {
  const tokens: ResetToken[] = JSON.parse(localStorage.getItem(TOKEN_KEY) || '[]');
  const record = tokens.find(t => t.email === email.trim().toLowerCase());
  return record ? record.token : null;
};

export const finalizePasswordReset = async (email: string, token: string, newPassword: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const isValid = await validateResetToken(email, token);
  if (!isValid) return false;

  const users: User[] = JSON.parse(localStorage.getItem('registered_users') || '[]');
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (userIndex === -1) return false;

  users[userIndex].password = newPassword;
  localStorage.setItem('registered_users', JSON.stringify(users));
  
  // Cleanup tokens
  let tokens: ResetToken[] = JSON.parse(localStorage.getItem(TOKEN_KEY) || '[]');
  tokens = tokens.filter(t => t.email !== email.toLowerCase());
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  
  return true;
};
