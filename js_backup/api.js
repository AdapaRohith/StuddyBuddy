
class StudyBuddyAPI {
    constructor(baseURL = 'http:
        this.baseURL = baseURL;
        this.user = null;
        this.token = null;
        
        
        this.checkAuthStatus();
    }

    

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include', 
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    
    async checkAuthStatus() {
        try {
            const data = await this.makeRequest('/user');
            this.user = data.user;
            this.onAuthChange(true);
            return true;
        } catch (error) {
            this.user = null;
            this.onAuthChange(false);
            return false;
        }
    }

    
    onAuthChange(isAuthenticated) {
        
        console.log('Auth state changed:', isAuthenticated);
        
        
        this.updateUIForAuth(isAuthenticated);
    }

    updateUIForAuth(isAuthenticated) {
        
        const loginForms = document.querySelectorAll('.login-form, .register-form');
        const authenticatedContent = document.querySelectorAll('.authenticated-content');
        
        loginForms.forEach(form => {
            form.style.display = isAuthenticated ? 'none' : 'block';
        });
        
        authenticatedContent.forEach(content => {
            content.style.display = isAuthenticated ? 'block' : 'none';
        });

        
        if (isAuthenticated && this.user) {
            this.updateUserInfo();
        }
    }

    updateUserInfo() {
        const userNameElements = document.querySelectorAll('.user-name');
        const userEmailElements = document.querySelectorAll('.user-email');
        
        userNameElements.forEach(el => {
            el.textContent = this.user.full_name || this.user.username;
        });
        
        userEmailElements.forEach(el => {
            el.textContent = this.user.email;
        });
    }

    

    async register(userData) {
        try {
            const data = await this.makeRequest('/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            
            this.showNotification('Registration successful! Please log in.', 'success');
            return data;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    async login(email, password) {
        try {
            const data = await this.makeRequest('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            this.user = data.user;
            this.onAuthChange(true);
            this.showNotification('Login successful!', 'success');
            return data;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    async logout() {
        try {
            await this.makeRequest('/logout', { method: 'POST' });
            this.user = null;
            this.onAuthChange(false);
            this.showNotification('Logged out successfully!', 'success');
        } catch (error) {
            this.showNotification('Logout failed', 'error');
            throw error;
        }
    }

    

    async getUserGroups() {
        try {
            const data = await this.makeRequest('/groups');
            return data.groups;
        } catch (error) {
            this.showNotification('Failed to load groups', 'error');
            throw error;
        }
    }

    async createGroup(groupData) {
        try {
            const data = await this.makeRequest('/groups', {
                method: 'POST',
                body: JSON.stringify(groupData)
            });
            
            this.showNotification('Group created successfully!', 'success');
            return data;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    async joinGroup(groupId, accessCode = null) {
        try {
            const body = accessCode ? { access_code: accessCode } : {};
            const data = await this.makeRequest(`/groups/${groupId}/join`, {
                method: 'POST',
                body: JSON.stringify(body)
            });
            
            this.showNotification('Successfully joined group!', 'success');
            return data;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    async getGroupMembers(groupId) {
        try {
            const data = await this.makeRequest(`/groups/${groupId}/members`);
            return data.members;
        } catch (error) {
            this.showNotification('Failed to load group members', 'error');
            throw error;
        }
    }

    

    async getGroupResources(groupId) {
        try {
            const data = await this.makeRequest(`/groups/${groupId}/resources`);
            return data.resources;
        } catch (error) {
            this.showNotification('Failed to load resources', 'error');
            throw error;
        }
    }

    async uploadResource(groupId, file, description = '') {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('description', description);

            const data = await this.makeRequest(`/groups/${groupId}/resources`, {
                method: 'POST',
                body: formData,
                headers: {} 
            });
            
            this.showNotification('Resource uploaded successfully!', 'success');
            return data;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    

    async getGroupMessages(groupId, limit = 50, offset = 0) {
        try {
            const data = await this.makeRequest(`/groups/${groupId}/messages?limit=${limit}&offset=${offset}`);
            return data.messages;
        } catch (error) {
            this.showNotification('Failed to load messages', 'error');
            throw error;
        }
    }

    async sendMessage(groupId, content, messageType = 'text') {
        try {
            const data = await this.makeRequest(`/groups/${groupId}/messages`, {
                method: 'POST',
                body: JSON.stringify({
                    content,
                    message_type: messageType
                })
            });
            
            return data;
        } catch (error) {
            this.showNotification('Failed to send message', 'error');
            throw error;
        }
    }

    

    async getUserTasks(status = null) {
        try {
            const endpoint = status ? `/tasks?status=${status}` : '/tasks';
            const data = await this.makeRequest(endpoint);
            return data.tasks;
        } catch (error) {
            this.showNotification('Failed to load tasks', 'error');
            throw error;
        }
    }

    async createTask(taskData) {
        try {
            const data = await this.makeRequest('/tasks', {
                method: 'POST',
                body: JSON.stringify(taskData)
            });
            
            this.showNotification('Task created successfully!', 'success');
            return data;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    async updateTaskStatus(taskId, status) {
        try {
            const data = await this.makeRequest(`/tasks/${taskId}`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            
            this.showNotification('Task updated successfully!', 'success');
            return data;
        } catch (error) {
            this.showNotification(error.message, 'error');
            throw error;
        }
    }

    

    async healthCheck() {
        try {
            const data = await this.makeRequest('/health');
            return data;
        } catch (error) {
            console.error('Health check failed:', error);
            return null;
        }
    }

    showNotification(message, type = 'info') {
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px 24px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    border-left: 4px solid #667eea;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    z-index: 10000;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }
                
                .notification-success {
                    border-left-color: #10b981;
                    color: #065f46;
                }
                
                .notification-error {
                    border-left-color: #ef4444;
                    color: #7f1d1d;
                }
                
                .notification-info {
                    border-left-color: #3b82f6;
                    color: #1e3a8a;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                    color: inherit;
                }
                
                .notification-close:hover {
                    opacity: 1;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        
        document.body.appendChild(notification);

        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}


const api = new StudyBuddyAPI();


window.StudyBuddyAPI = StudyBuddyAPI;
window.api = api;
