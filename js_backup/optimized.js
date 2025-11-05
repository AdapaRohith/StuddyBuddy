


const APP = {
    cache: new Map(),
    observers: new Map(),
    timers: new Map()
};


document.addEventListener('DOMContentLoaded', () => {
    performance.mark('app-start');
    
    
    requestAnimationFrame(() => {
        initNavigation();
        initMobileNav();
        initNotifications();
        
        
        requestAnimationFrame(() => {
            initConditionalFeatures();
            performance.mark('app-end');
            performance.measure('app-init', 'app-start', 'app-end');
        });
    });
});


function initConditionalFeatures() {
    if (document.getElementById('addTaskBtn')) initTaskManager();
    if (document.getElementById('createScheduleBtn')) initScheduleManager();
    if (document.querySelector('.group-card')) initGroupInteractions();
    if (document.getElementById('loginBtn')) initAuth();
}




function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
        
        
        let clicking = false;
        link.addEventListener('click', (e) => {
            if (clicking) return;
            clicking = true;
            
            e.preventDefault();
            const href = link.getAttribute('href');
            
            showNotification(`Navigating to ${link.querySelector('span')?.textContent || 'page'}...`, 'info');
            setTimeout(() => window.location.href = href, 300);
            
            setTimeout(() => clicking = false, 1000);
        });
    });
}




function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const overlay = document.getElementById('mobileNavOverlay');
    const close = document.getElementById('mobileNavClose');
    
    if (!toggle || !overlay) return;
    
    toggle.addEventListener('click', () => openMobileNav());
    if (close) close.addEventListener('click', () => closeMobileNav());
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeMobileNav();
    });
    
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeMobileNav();
        }
    });
}

function openMobileNav() {
    const overlay = document.getElementById('mobileNavOverlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileNav() {
    const overlay = document.getElementById('mobileNavOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}




let notificationCount = 0;

function initNotifications() {
    
    if (!document.getElementById('notificationContainer')) {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container || notificationCount >= 3) return;
    
    notificationCount++;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 20px;
        margin-bottom: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        pointer-events: auto;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.innerHTML = `
        <i class="fa-solid ${getNotificationIcon(type)}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    
    container.appendChild(notification);
    
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    
    setTimeout(() => hideNotification(notification), 3000);
    
    
    notification.addEventListener('click', () => hideNotification(notification));
}

function hideNotification(notification) {
    if (!notification.parentNode) return;
    
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
            notificationCount = Math.max(0, notificationCount - 1);
        }
    }, 300);
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #27ae60, #2ecc71)',
        error: 'linear-gradient(135deg, #e74c3c, #c0392b)',
        warning: 'linear-gradient(135deg, #f39c12, #e67e22)',
        info: 'linear-gradient(135deg, #667eea, #764ba2)'
    };
    return colors[type] || colors.info;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}




function initTaskManager() {
    const modal = document.getElementById('taskModal');
    const openBtn = document.getElementById('addTaskBtn');
    const closeBtn = document.getElementById('closeTaskModal');
    const form = document.getElementById('taskForm');
    
    if (!modal || !openBtn || !form) return;
    
    
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        
        setTimeout(() => {
            const firstInput = document.getElementById('taskTitle');
            if (firstInput) firstInput.focus();
        }, 100);
    });
    
    
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        form.reset();
        resetCharCounters();
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle')?.value.trim();
        if (!title) {
            showNotification('Please enter a task title', 'error');
            return;
        }
        
        addTaskToList(title);
        closeModal();
        showNotification('Task added successfully!', 'success');
    });
    
    
    initCharCounters();
    
    
    initTaskListInteractions();
}

function initCharCounters() {
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDescription');
    const titleCounter = document.getElementById('titleCounter');
    const descCounter = document.getElementById('descCounter');
    
    if (titleInput && titleCounter) {
        titleInput.addEventListener('input', () => {
            updateCharCounter(titleInput, titleCounter, 100);
        });
    }
    
    if (descInput && descCounter) {
        descInput.addEventListener('input', () => {
            updateCharCounter(descInput, descCounter, 300);
        });
    }
}

function updateCharCounter(input, counter, maxLength) {
    const length = input.value.length;
    counter.textContent = `${length}/${maxLength}`;
    
    counter.classList.remove('warning', 'danger');
    if (length >= maxLength * 0.8) counter.classList.add('warning');
    if (length >= maxLength * 0.95) counter.classList.add('danger');
}

function resetCharCounters() {
    const titleCounter = document.getElementById('titleCounter');
    const descCounter = document.getElementById('descCounter');
    
    if (titleCounter) {
        titleCounter.textContent = '0/100';
        titleCounter.classList.remove('warning', 'danger');
    }
    if (descCounter) {
        descCounter.textContent = '0/300';
        descCounter.classList.remove('warning', 'danger');
    }
}

function addTaskToList(title) {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;
    
    const taskId = 'task_' + Date.now();
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.style.cssText = 'opacity: 0; transform: translateY(-10px); transition: all 0.3s ease;';
    
    taskItem.innerHTML = `
        <input type="checkbox" id="${taskId}">
        <label for="${taskId}">${escapeHtml(title)}</label>
        <button class="close-btn" type="button">&times;</button>
    `;
    
    
    if (taskList.firstChild) {
        taskList.insertBefore(taskItem, taskList.firstChild);
    } else {
        taskList.appendChild(taskItem);
    }
    
    
    requestAnimationFrame(() => {
        taskItem.style.cssText = 'opacity: 1; transform: translateY(0); transition: all 0.3s ease;';
    });
}

function initTaskListInteractions() {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;
    
    
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn')) {
            const taskItem = e.target.closest('.task-item');
            if (taskItem) {
                taskItem.style.cssText = 'opacity: 0; transform: translateX(100%); transition: all 0.3s ease;';
                setTimeout(() => taskItem.remove(), 300);
                showNotification('Task removed', 'info');
            }
        }
    });
    
    taskList.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const taskItem = e.target.closest('.task-item');
            const label = taskItem.querySelector('label');
            
            if (e.target.checked) {
                taskItem.style.opacity = '0.6';
                label.style.textDecoration = 'line-through';
                showNotification('Task completed!', 'success');
            } else {
                taskItem.style.opacity = '1';
                label.style.textDecoration = 'none';
            }
        }
    });
}




function initScheduleManager() {
    const modal = document.getElementById('scheduleModal');
    const openBtn = document.getElementById('createScheduleBtn');
    const closeBtn = document.getElementById('closeScheduleModal');
    const form = document.getElementById('scheduleForm');
    
    if (!modal || !openBtn) return;
    
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (form) form.reset();
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            closeModal();
            showNotification('Schedule saved successfully!', 'success');
        });
    }
}




function initGroupInteractions() {
    
    if (!localStorage.getItem('studybuddy_members')) {
        localStorage.setItem('studybuddy_members', '{}');
    }
    
    
    document.addEventListener('click', (e) => {
        const groupCard = e.target.closest('.group-card');
        const joinBtn = e.target.closest('.btn-join');
        
        if (joinBtn && groupCard) {
            e.stopPropagation();
            toggleGroupMembership(groupCard);
        } else if (groupCard && !e.target.closest('button')) {
            openGroupModal(groupCard);
        }
    });
}

function toggleGroupMembership(groupCard) {
    const groupId = groupCard.dataset.groupId || 'group_' + Date.now();
    const joinBtn = groupCard.querySelector('.btn-join');
    const memberships = JSON.parse(localStorage.getItem('studybuddy_members') || '{}');
    
    if (memberships[groupId]) {
        delete memberships[groupId];
        joinBtn.classList.remove('active');
        joinBtn.textContent = 'Join';
        showNotification('You left the group', 'info');
    } else {
        memberships[groupId] = true;
        joinBtn.classList.add('active');
        joinBtn.textContent = 'Member';
        showNotification('You joined the group!', 'success');
    }
    
    localStorage.setItem('studybuddy_members', JSON.stringify(memberships));
}

function openGroupModal(groupCard) {
    const groupName = groupCard.querySelector('.group-info h3')?.textContent || 'Group';
    const description = groupCard.querySelector('.group-description')?.textContent || 'No description';
    
    
    const existingModal = document.getElementById('groupModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'groupModal';
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${escapeHtml(groupName)}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>${escapeHtml(description)}</p>
                <div class="group-modal-actions">
                    <button class="btn btn-primary">View Details</button>
                    <button class="btn btn-secondary">Share Group</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}




function initAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            showAuthModal('login');
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            showAuthModal('signup');
        });
    }
}

function showAuthModal(type) {
    
    const existingModal = document.getElementById('authModal');
    if (existingModal) existingModal.remove();
    
    const isLogin = type === 'login';
    const modal = document.createElement('div');
    modal.id = 'authModal';
    modal.className = 'modal-overlay active';
    
    modal.innerHTML = `
        <div class="modal-content auth-modal">
            <div class="modal-header">
                <h3>${isLogin ? 'Welcome Back' : 'Join StudyBuddy'}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="authForm">
                    ${!isLogin ? '<div class="form-group"><input type="text" placeholder="Full Name" required></div>' : ''}
                    <div class="form-group">
                        <input type="email" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">${isLogin ? 'Sign In' : 'Create Account'}</button>
                </form>
                <div class="auth-switch">
                    <p>${isLogin ? "Don't have an account?" : 'Already have an account?'} 
                    <a href="#" id="switchAuth">${isLogin ? 'Sign up' : 'Sign in'}</a></p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    
    modal.querySelector('#switchAuth').addEventListener('click', (e) => {
        e.preventDefault();
        modal.remove();
        showAuthModal(isLogin ? 'signup' : 'login');
    });
    
    
    modal.querySelector('#authForm').addEventListener('submit', (e) => {
        e.preventDefault();
        modal.remove();
        showNotification(`${isLogin ? 'Signed in' : 'Account created'} successfully!`, 'success');
    });
}




function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


window.addEventListener('beforeunload', () => {
    
    APP.timers.forEach(timer => clearTimeout(timer));
    
    
    APP.observers.forEach(observer => observer.disconnect());
    
    
    APP.cache.clear();
});


const notificationCSS = `
    @keyframes notificationSlide {
        from { transform: translateX(400px); }
        to { transform: translateX(0); }
    }
    
    .notification {
        animation: notificationSlide 0.3s ease;
    }
    
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-content {
        background: linear-gradient(135deg, #0f0f23, #1a1a3e);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        overflow: hidden;
    }
    
    .modal-header {
        background: linear-gradient(135deg, #667eea, #764ba2);
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
    }
    
    .modal-body {
        padding: 20px;
        color: white;
    }
    
    .form-group {
        margin-bottom: 15px;
    }
    
    .form-group input {
        width: 100%;
        padding: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .close-modal {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
    }
`;


const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);
