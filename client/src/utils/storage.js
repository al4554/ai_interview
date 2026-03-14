const AUTH_KEY = "interviewiq_auth";
const THEME_KEY = "interviewiq_theme";

export const authStorage = {
  get: () => {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  set: (value) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(value));
  },
  clear: () => {
    localStorage.removeItem(AUTH_KEY);
  }
};

export const themeStorage = {
  get: () => localStorage.getItem(THEME_KEY),
  set: (value) => localStorage.setItem(THEME_KEY, value)
};
