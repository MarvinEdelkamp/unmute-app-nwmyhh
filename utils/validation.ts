
// Input validation utilities

export const validation = {
  email: (email: string): { valid: boolean; error?: string } => {
    if (!email || !email.trim()) {
      return { valid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { valid: false, error: 'Please enter a valid email address' };
    }

    return { valid: true };
  },

  name: (name: string): { valid: boolean; error?: string } => {
    if (!name || !name.trim()) {
      return { valid: false, error: 'Name is required' };
    }

    if (name.trim().length < 2) {
      return { valid: false, error: 'Name must be at least 2 characters' };
    }

    if (name.trim().length > 50) {
      return { valid: false, error: 'Name must be less than 50 characters' };
    }

    return { valid: true };
  },

  interests: (interests: string[]): { valid: boolean; error?: string } => {
    if (!interests || interests.length === 0) {
      return { valid: false, error: 'Please select at least one interest' };
    }

    if (interests.length < 3) {
      return { valid: false, error: 'Please select at least 3 interests' };
    }

    // No upper limit - users can select as many as they want

    return { valid: true };
  },

  customInterest: (interest: string): { valid: boolean; error?: string } => {
    if (!interest || !interest.trim()) {
      return { valid: false, error: 'Interest cannot be empty' };
    }

    if (interest.trim().length < 2) {
      return { valid: false, error: 'Interest must be at least 2 characters' };
    }

    if (interest.trim().length > 50) {
      return { valid: false, error: 'Interest must be less than 50 characters' };
    }

    return { valid: true };
  },
};

export const sanitize = {
  text: (text: string): string => {
    return text.trim().replace(/\s+/g, ' ');
  },

  email: (email: string): string => {
    return email.trim().toLowerCase();
  },
};
