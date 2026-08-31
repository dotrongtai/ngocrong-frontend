
window.API_BASE_URL = window.API_BASE_URL
|| "https://api.nrohoamai.online/api";
async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const config = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (data) {
      config.body = JSON.stringify(data);
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();
    result.httpStatus = response.status;
    return result;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      httpStatus: 0,
      message: 'Lỗi kết nối: ' + error.message
    };
  }
}
async function registerUser(username, password, confirmPassword) {
  return await apiCall('/auth/register', 'POST', {
    username,
    password,
    confirmPassword
  });
}
async function loginUser(username, password) {
  return await apiCall('/auth/login', 'POST', {
    username,
    password
  });
}
async function getProfile() {
  return await apiCall('/auth/profile', 'GET');
}
async function getDailyEvent() {
  return await apiCall('/event/daily7', 'GET');
}

async function claimDailyEvent() {
  return await apiCall('/event/daily7/claim', 'POST');
}

function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

function saveLogin(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function clearLogin() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function getStoredUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}